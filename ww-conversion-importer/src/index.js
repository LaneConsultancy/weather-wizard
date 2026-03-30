
// ww-conversion-importer — Cloudflare Worker
// Handles phone click storage (fetch) and offline conversion import (cron).

const PHONE_CLICK_TTL_SECONDS = 90 * 24 * 60 * 60; // 90 days
const DEDUP_TTL_SECONDS = 90 * 24 * 60 * 60;       // 90 days
const LOOKBACK_DAYS = 14;
const TALLY_FORMS = [
  { id: 'VL5e5l', gclidQuestionId: 'zK7AqE' },
  { id: 'npqGpV', gclidQuestionId: 'XeJqdg' },
];
const TWILIO_TO_NUMBER = '+448003162922';
const CALL_MIN_DURATION_SECONDS = 10;
// Maximum window before a call start where a phone click can be attributed
const CLICK_ATTRIBUTION_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function isValidGclid(value) {
  if (typeof value !== 'string') return false;
  const t = value.trim();
  if (t.length < 20 || t.length > 512) return false;
  return /^[A-Za-z0-9\-_]+$/.test(t);
}

function isValidMsclkid(value) {
  if (typeof value !== 'string') return false;
  const t = value.trim();
  if (t.length < 20 || t.length > 512) return false;
  return /^[A-Za-z0-9]+$/.test(t);
}

function parseClientTimestamp(value) {
  if (typeof value === 'string') {
    const ms = Date.parse(value);
    if (!isNaN(ms)) return new Date(ms).toISOString();
  }
  return new Date().toISOString();
}

function sanitisePage(value) {
  if (typeof value !== 'string' || value.trim() === '') return '/';
  return value.trim().slice(0, 512);
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
  const path = url.pathname;

  if (request.method === 'OPTIONS' && path === '/phone-click') {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (request.method === 'POST' && path === '/phone-click') {
    return handlePhoneClick(request, env);
  }

  if (request.method === 'GET' && path === '/status') {
    return handleStatus(env);
  }

  return new Response('Not Found', { status: 404 });
}

async function handlePhoneClick(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }

  const gclid = isValidGclid(body.gclid) ? body.gclid.trim() : undefined;
  const msclkid = isValidMsclkid(body.msclkid) ? body.msclkid.trim() : undefined;

  if (!gclid && !msclkid) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
  }

  // Validate gclid prefix if present (starts with Cj or EAI)
  if (gclid && !gclid.startsWith('Cj') && !gclid.startsWith('EAI')) {
    console.log('[phone-click] Skipping gclid with unexpected prefix:', gclid.slice(0, 6));
  }

  const record = {
    id: crypto.randomUUID(),
    ...(gclid ? { gclid } : {}),
    ...(msclkid ? { msclkid } : {}),
    timestamp: parseClientTimestamp(body.timestamp),
    createdAt: new Date().toISOString(),
    page: sanitisePage(body.page),
  };

  const key = `click_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  try {
    await env.PHONE_CLICKS.put(key, JSON.stringify(record), {
      expirationTtl: PHONE_CLICK_TTL_SECONDS,
    });
    console.log('[phone-click] Stored click:', key, record.gclid || record.msclkid);
  } catch (err) {
    console.error('[phone-click] Failed to store click:', err);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
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
  console.log('[cron] Starting conversion import run at', new Date().toISOString());

  const conversions = [];
  const errors = [];

  // Step 1: Tally form submissions
  try {
    const tallyConversions = await importTallyConversions(env);
    conversions.push(...tallyConversions);
    console.log(`[cron] Tally: ${tallyConversions.length} new conversions`);
  } catch (err) {
    console.error('[cron] Tally import failed:', err);
    errors.push({ source: 'tally', error: String(err) });
  }

  // Step 2: Phone call conversions
  try {
    const callConversions = await importCallConversions(env);
    conversions.push(...callConversions);
    console.log(`[cron] Calls: ${callConversions.length} new conversions`);
  } catch (err) {
    console.error('[cron] Call import failed:', err);
    errors.push({ source: 'calls', error: String(err) });
  }

  // Step 3: Upload to Google Ads
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

  // Step 4: Record last run summary
  const summary = {
    runAt: new Date().toISOString(),
    tallyConversions: conversions.filter(c => c._source === 'tally').length,
    callConversions: conversions.filter(c => c._source === 'call').length,
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
      // Only process completed submissions
      if (!sub.isCompleted) continue;

      // Only process recent submissions
      const submittedAt = new Date(sub.submittedAt || sub.createdAt);
      if (submittedAt < cutoff) {
        // Submissions are sorted newest-first; once we pass cutoff we can stop
        hasMore = false;
        break;
      }

      // Dedup check
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
        _source: 'tally',
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
// Call Import
// ---------------------------------------------------------------------------

async function importCallConversions(env) {
  // Read all phone clicks from KV
  const clicks = await readAllPhoneClicks(env);
  console.log(`[calls] Found ${clicks.length} phone clicks in KV`);

  const cutoff = lookbackDate();
  const recentClicks = clicks.filter(c => {
    if (!c.gclid) return false;
    const ts = new Date(c.timestamp);
    return ts >= cutoff;
  });
  console.log(`[calls] ${recentClicks.length} clicks within lookback window with gclid`);

  if (recentClicks.length === 0) return [];

  // Fetch Twilio inbound calls
  const calls = await fetchTwilioCalls(env, cutoff);
  console.log(`[calls] Found ${calls.length} qualifying Twilio calls`);

  const conversions = [];
  const usedClickIds = new Set();

  for (const call of calls) {
    const callStart = new Date(call.start_time);

    // Find phone clicks in the 5-minute window before the call
    const windowStart = new Date(callStart.getTime() - CLICK_ATTRIBUTION_WINDOW_MS);
    const candidateClicks = recentClicks.filter(c => {
      if (usedClickIds.has(c.id)) return false;
      const ts = new Date(c.timestamp);
      return ts >= windowStart && ts <= callStart;
    });

    if (candidateClicks.length === 0) continue;

    // Use the click closest to the call start time
    candidateClicks.sort((a, b) => {
      const diffA = Math.abs(callStart - new Date(a.timestamp));
      const diffB = Math.abs(callStart - new Date(b.timestamp));
      return diffA - diffB;
    });
    const matchedClick = candidateClicks[0];

    // Dedup check
    const dedupKey = `call_${matchedClick.id}`;
    const existing = await env.DEDUP.get(dedupKey);
    if (existing) continue;

    usedClickIds.add(matchedClick.id);

    conversions.push({
      _source: 'call',
      _dedupKey: dedupKey,
      gclid: matchedClick.gclid,
      conversionDateTime: formatConversionDateTime(callStart),
      conversionValue: 75,
    });
  }

  return conversions;
}

async function readAllPhoneClicks(env) {
  const records = [];
  let cursor = undefined;

  do {
    const listResult = await env.PHONE_CLICKS.list({ cursor, limit: 1000 });
    const keys = listResult.keys || [];

    // Fetch all values in parallel (batched to avoid overwhelming the runtime)
    const BATCH_SIZE = 50;
    for (let i = 0; i < keys.length; i += BATCH_SIZE) {
      const batch = keys.slice(i, i + BATCH_SIZE);
      const values = await Promise.all(
        batch.map(k => env.PHONE_CLICKS.get(k.name))
      );
      for (let j = 0; j < batch.length; j++) {
        if (values[j]) {
          try {
            records.push(JSON.parse(values[j]));
          } catch {}
        }
      }
    }

    cursor = listResult.cursor;
    if (listResult.list_complete) break;
  } while (cursor);

  return records;
}

async function fetchTwilioCalls(env, cutoff) {
  const calls = [];
  const dateStr = cutoff.toISOString().split('T')[0]; // YYYY-MM-DD
  const auth = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);

  let pageUrl = `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Calls.json` +
    `?To=${encodeURIComponent(TWILIO_TO_NUMBER)}` +
    `&StartTime>=${dateStr}` +
    `&Status=completed` +
    `&PageSize=1000`;

  while (pageUrl) {
    const resp = await fetch(pageUrl, {
      headers: { Authorization: `Basic ${auth}` },
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Twilio API ${resp.status}: ${text.slice(0, 200)}`);
    }

    const data = await resp.json();
    const pageCalls = data.calls ?? [];

    for (const call of pageCalls) {
      if (call.direction !== 'inbound') continue;
      if (parseInt(call.duration, 10) < CALL_MIN_DURATION_SECONDS) continue;
      calls.push(call);
    }

    // Handle pagination
    if (data.next_page_uri) {
      pageUrl = `https://api.twilio.com${data.next_page_uri}`;
    } else {
      pageUrl = null;
    }
  }

  return calls;
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

  // partialFailure errors are indexed against the conversions array
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
      // If we couldn't parse indices, log and conservatively mark all as failed
      console.error('[google-ads] partialFailureError details:', JSON.stringify(details).slice(0, 1000));
    }
  }

  // Record dedup keys for successful conversions
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
  async fetch(request, env, ctx) {
    return handleFetch(request, env);
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleScheduled(env));
  },
};
