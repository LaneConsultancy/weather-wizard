// ww-conversion-importer — Cloudflare Worker
// Periodically imports completed Tally form submissions and uploads them
// to Google Ads as offline click conversions (gclid-based).

const DEDUP_TTL_SECONDS = 90 * 24 * 60 * 60;       // 90 days
const LOOKBACK_DAYS = 14;
const TALLY_FORMS = [
  { id: 'VL5e5l', gclidQuestionId: 'zK7AqE' },
  { id: 'npqGpV', gclidQuestionId: 'XeJqdg' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isValidGclid(value) {
  if (typeof value !== 'string') return false;
  const t = value.trim();
  if (t.length < 20 || t.length > 512) return false;
  return /^[A-Za-z0-9\-_]+$/.test(t);
}

/** Format a Date as "yyyy-mm-dd hh:mm:ss+00:00" for Google Ads */
function formatConversionDateTime(date) {
  const pad = (n) => String(n).padStart(2, '0');
  const d = date instanceof Date ? date : new Date(date);
  return (
    d.getUTCFullYear() + '-' +
    pad(d.getUTCMonth() + 1) + '-' +
    pad(d.getUTCDate()) + ' ' +
    pad(d.getUTCHours()) + ':' +
    pad(d.getUTCMinutes()) + ':' +
    pad(d.getUTCSeconds()) +
    '+00:00'
  );
}

function lookbackDate() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - LOOKBACK_DAYS);
  return d;
}

// ---------------------------------------------------------------------------
// Fetch Handler
// ---------------------------------------------------------------------------

async function handleFetch(request, env) {
  const url = new URL(request.url);
  if (request.method === 'GET' && url.pathname === '/status') {
    return handleStatus(env);
  }
  return new Response('Not Found', { status: 404 });
}

async function handleStatus(env) {
  let lastRun = null;
  try {
    const raw = await env.DEDUP.get('_last_run');
    if (raw) lastRun = JSON.parse(raw);
  } catch {}
  return new Response(JSON.stringify({ ok: true, lastRun }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// ---------------------------------------------------------------------------
// Scheduled Handler
// ---------------------------------------------------------------------------

async function handleScheduled(env) {
  console.log('[cron] Starting Tally conversion import at', new Date().toISOString());

  const conversions = [];
  const errors = [];

  try {
    const tallyConversions = await importTallyConversions(env);
    conversions.push(...tallyConversions);
    console.log(`[cron] Tally: ${tallyConversions.length} new conversions`);
  } catch (err) {
    console.error('[cron] Tally import failed:', err);
    errors.push({ source: 'tally', error: String(err) });
  }

  let uploadResult = { uploaded: 0, failed: 0 };
  if (conversions.length > 0) {
    try {
      uploadResult = await uploadToGoogleAds(conversions, env);
      console.log(`[cron] Google Ads upload: ${uploadResult.uploaded} succeeded, ${uploadResult.failed} failed`);
    } catch (err) {
      console.error('[cron] Google Ads upload failed:', err);
      errors.push({ source: 'google_ads', error: String(err) });
    }
  } else {
    console.log('[cron] No new conversions to upload');
  }

  const summary = {
    runAt: new Date().toISOString(),
    tallyConversions: conversions.length,
    uploaded: uploadResult.uploaded,
    failed: uploadResult.failed,
    errors,
  };
  await env.DEDUP.put('_last_run', JSON.stringify(summary), {
    expirationTtl: 30 * 24 * 60 * 60,
  });

  console.log('[cron] Run complete:', JSON.stringify(summary));
  return summary;
}

// ---------------------------------------------------------------------------
// Tally Import
// ---------------------------------------------------------------------------

async function importTallyConversions(env) {
  const cutoff = lookbackDate();
  const conversions = [];

  for (const form of TALLY_FORMS) {
    try {
      const formConversions = await importTallyForm(form.id, form.gclidQuestionId, cutoff, env);
      conversions.push(...formConversions);
    } catch (err) {
      console.error(`[tally] Form ${form.id} failed:`, err);
    }
  }

  return conversions;
}

async function importTallyForm(formId, gclidQuestionId, cutoff, env) {
  const conversions = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `https://api.tally.so/forms/${formId}/submissions?page=${page}&limit=100`;
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${env.TALLY_API_KEY}` },
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Tally API ${resp.status}: ${text.slice(0, 200)}`);
    }

    const data = await resp.json();
    hasMore = data.hasMore ?? false;
    page += 1;

    const submissions = data.submissions ?? [];

    for (const sub of submissions) {
      if (!sub.isCompleted) continue;

      const submittedAt = new Date(sub.submittedAt || sub.createdAt);
      if (submittedAt < cutoff) {
        // Submissions are sorted newest-first; once we pass cutoff we can stop
        hasMore = false;
        break;
      }

      const dedupKey = `tally_${sub.id}`;
      const existing = await env.DEDUP.get(dedupKey);
      if (existing) continue;

      // Extract gclid from the responses (Tally API returns responses[], not fields[])
      let gclid = null;
      if (sub.responses && Array.isArray(sub.responses)) {
        for (const response of sub.responses) {
          if (response.questionId === gclidQuestionId) {
            const answer = response.answer;
            if (typeof answer === 'string') {
              gclid = answer;
            } else if (answer && typeof answer === 'object') {
              gclid = answer.gclid || null;
            }
            break;
          }
        }
      }

      if (!gclid || typeof gclid !== 'string') continue;
      gclid = gclid.trim();
      if (!gclid || gclid.startsWith('test_')) continue;
      if (!isValidGclid(gclid)) continue;

      conversions.push({
        _dedupKey: dedupKey,
        gclid,
        conversionDateTime: formatConversionDateTime(submittedAt),
        conversionValue: 50,
      });
    }
  }

  return conversions;
}

// ---------------------------------------------------------------------------
// Google Ads Upload
// ---------------------------------------------------------------------------

async function getGoogleAdsAccessToken(env) {
  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GOOGLE_ADS_CLIENT_ID,
      client_secret: env.GOOGLE_ADS_CLIENT_SECRET,
      refresh_token: env.GOOGLE_ADS_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`OAuth token request failed ${resp.status}: ${text.slice(0, 200)}`);
  }

  const data = await resp.json();
  return data.access_token;
}

async function uploadToGoogleAds(conversions, env) {
  const accessToken = await getGoogleAdsAccessToken(env);

  const payload = {
    conversions: conversions.map(c => ({
      gclid: c.gclid,
      conversionAction: env.GOOGLE_ADS_CONVERSION_ACTION,
      conversionDateTime: c.conversionDateTime,
      conversionValue: c.conversionValue,
      currencyCode: 'GBP',
    })),
    partialFailure: true,
  };

  const resp = await fetch(
    `https://googleads.googleapis.com/v22/customers/${env.GOOGLE_ADS_CUSTOMER_ID}:uploadClickConversions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'developer-token': env.GOOGLE_ADS_DEVELOPER_TOKEN,
        'login-customer-id': env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Google Ads API ${resp.status}: ${text.slice(0, 500)}`);
  }

  const result = await resp.json();

  let uploaded = 0;
  let failed = 0;

  const failedIndices = new Set();
  if (result.partialFailureError) {
    const details = result.partialFailureError.details ?? [];
    for (const detail of details) {
      const errors = detail.errors ?? [];
      for (const err of errors) {
        const loc = err.location?.fieldPathElements ?? [];
        for (const el of loc) {
          if (el.fieldName === 'conversions' && typeof el.index === 'number') {
            failedIndices.add(el.index);
          }
        }
      }
    }
    if (failedIndices.size === 0 && details.length > 0) {
      console.error('[google-ads] partialFailureError details:', JSON.stringify(details).slice(0, 1000));
    }
  }

  for (let i = 0; i < conversions.length; i++) {
    if (failedIndices.has(i)) {
      console.warn(`[google-ads] Conversion ${i} failed (gclid: ${conversions[i].gclid?.slice(0, 20)}...)`);
      failed++;
    } else {
      await env.DEDUP.put(conversions[i]._dedupKey, '1', {
        expirationTtl: DEDUP_TTL_SECONDS,
      });
      uploaded++;
    }
  }

  return { uploaded, failed };
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export default {
  async fetch(request, env) {
    return handleFetch(request, env);
  },

  async scheduled(_event, env, ctx) {
    ctx.waitUntil(handleScheduled(env));
  },
};
