/**
 * Import Phone-Click Events as Offline Click Conversions into Google Ads
 *
 * Matches phone click events (captured by /api/phone-click when a visitor
 * taps a tel: link) against Twilio inbound call logs. When a call arrives
 * within 5 minutes of a gclid-bearing click, we treat it as a conversion
 * and upload it to Google Ads.
 *
 * Matching logic:
 *   For each Twilio inbound call, find all phone-click records where:
 *     - The click has a gclid
 *     - The click timestamp is between (callStartTime - 5 min) and callStartTime
 *   If multiple clicks match, use the one closest to the call start.
 *   Each click record is consumed (cannot match more than one call).
 *
 * Deduplication:
 *   Successfully uploaded call SIDs are written to
 *   data/imported-call-conversions.json. Safe to re-run — already-imported
 *   SIDs are skipped.
 *
 * Usage:
 *   npm run import-call-conversions             # Last 7 days (default)
 *   npm run import-call-conversions -- --days 30
 *   npm run import-call-conversions -- --dry-run
 *
 * CLI arguments:
 *   --days N     Match calls from the last N days (default: 7)
 *   --dry-run    Show matches without uploading to Google Ads
 */

import 'dotenv/config';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { GoogleAdsApi } from 'google-ads-api';
import { fetchInboundCalls } from '../lib/twilio/call-logs';

// Load .env.local — takes precedence for this project
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/**
 * Google Ads offline CLICK conversion action resource name.
 * Must be type UPLOAD_CLICKS (7).
 * Shared with the Tally form submission pipeline.
 */
const CONVERSION_ACTION =
  process.env.GOOGLE_ADS_TALLY_CLICK_CONVERSION_ACTION ??
  'customers/6652965980/conversionActions/7479655654';

/** Estimated value of a phone-call lead in GBP */
const CONVERSION_VALUE = 75;
const CURRENCY_CODE = 'GBP';

/**
 * Maximum seconds before a call start that a phone-click event may have
 * occurred and still be considered the originating click.
 * 5 minutes covers typical ad → dial latency while excluding unrelated
 * earlier clicks from the same browsing session.
 */
const MATCH_WINDOW_SECONDS = 5 * 60;

/** Minimum call duration in seconds (mirrors Twilio call-logs default). */
const MIN_CALL_DURATION_SECONDS = 60;

const PHONE_CLICKS_FILE = path.resolve(process.cwd(), 'data/phone-clicks.json');
const IMPORTED_CALL_CONVERSIONS_FILE = path.resolve(
  process.cwd(),
  'data/imported-call-conversions.json'
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PhoneClickRecord {
  id: string;
  gclid?: string;
  msclkid?: string;
  /** ISO timestamp from the browser at click time */
  timestamp: string;
  /** ISO timestamp written server-side */
  createdAt: string;
  page: string;
}

interface PendingCallConversion {
  /** Twilio Call SID — used as a stable dedup key */
  callSid: string;
  /** gclid from the matched phone-click record */
  gclid: string;
  /** Timestamp to report to Google Ads (use the click time per Google's guidance) */
  conversionDateTime: Date;
  /** The matched phone-click record ID (for logging) */
  clickId: string;
  /** Seconds between the click and the call */
  lagSeconds: number;
}

interface ImportedCallRecord {
  callSid: string;
  clickId: string;
  gclid: string;
  importedAt: string;
}

interface UploadResult {
  successCount: number;
  failures: Array<{ index: number; gclid: string; message: string }>;
}

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs(): { days: number; dryRun: boolean } {
  const args = process.argv.slice(2);
  let days = 7;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--days': {
        const n = parseInt(args[++i], 10);
        if (isNaN(n) || n < 1 || n > 365) {
          console.error('--days must be a number between 1 and 365');
          process.exit(1);
        }
        days = n;
        break;
      }
      case '--dry-run':
        dryRun = true;
        break;
      default:
        console.error(`Unknown argument: ${args[i]}`);
        process.exit(1);
    }
  }

  return { days, dryRun };
}

// ---------------------------------------------------------------------------
// Phone-click record loading
// ---------------------------------------------------------------------------

function loadPhoneClicks(): PhoneClickRecord[] {
  try {
    const raw = fs.readFileSync(PHONE_CLICKS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn('  WARNING: phone-clicks.json is not an array — treating as empty');
      return [];
    }
    return parsed as PhoneClickRecord[];
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      // File doesn't exist yet — no clicks have been captured
      return [];
    }
    console.warn('  WARNING: Could not read phone-clicks.json:', err.message);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Deduplication store
// ---------------------------------------------------------------------------

function loadImportedCallSids(): Set<string> {
  try {
    const raw = fs.readFileSync(IMPORTED_CALL_CONVERSIONS_FILE, 'utf-8');
    const records: ImportedCallRecord[] = JSON.parse(raw);
    return new Set(records.map((r) => r.callSid));
  } catch {
    return new Set();
  }
}

function saveImportedCallConversion(record: ImportedCallRecord): void {
  let records: ImportedCallRecord[] = [];

  try {
    const raw = fs.readFileSync(IMPORTED_CALL_CONVERSIONS_FILE, 'utf-8');
    records = JSON.parse(raw);
  } catch {
    // File missing or corrupt — start fresh
  }

  records.push(record);

  fs.mkdirSync(path.dirname(IMPORTED_CALL_CONVERSIONS_FILE), { recursive: true });
  fs.writeFileSync(
    IMPORTED_CALL_CONVERSIONS_FILE,
    JSON.stringify(records, null, 2),
    'utf-8'
  );
}

// ---------------------------------------------------------------------------
// Matching logic
// ---------------------------------------------------------------------------

/**
 * Match phone-click records to Twilio calls.
 *
 * Rules:
 *   - Click must have a gclid.
 *   - Click timestamp must be within MATCH_WINDOW_SECONDS before the call start.
 *   - If multiple clicks qualify for a call, use the closest one.
 *   - Each click can only be used once (consumed on match).
 *   - Already-imported call SIDs are skipped.
 *
 * @param calls     Twilio inbound calls, sorted ascending by startTime.
 * @param clicks    All phone-click records from phone-clicks.json.
 * @param alreadyImported Set of call SIDs already uploaded to Google Ads.
 * @param sinceDate Only consider calls on or after this date.
 */
function matchClicksToCalls(
  calls: Array<{ sid: string; startTime: Date; duration: number }>,
  clicks: PhoneClickRecord[],
  alreadyImported: Set<string>,
  sinceDate: Date
): PendingCallConversion[] {
  // Build a mutable set of available click IDs so each click is consumed once
  const availableClickIds = new Set(clicks.map((c) => c.id));

  const pending: PendingCallConversion[] = [];

  for (const call of calls) {
    if (call.startTime < sinceDate) continue;
    if (alreadyImported.has(call.sid)) continue;

    const callStartMs = call.startTime.getTime();
    const windowStartMs = callStartMs - MATCH_WINDOW_SECONDS * 1000;

    // Find all qualifying clicks for this call
    const candidates = clicks.filter((click) => {
      if (!click.gclid) return false;
      if (!availableClickIds.has(click.id)) return false; // already consumed

      const clickMs = new Date(click.timestamp).getTime();
      return clickMs >= windowStartMs && clickMs <= callStartMs;
    });

    if (candidates.length === 0) continue;

    // Choose the click closest to the call start time
    candidates.sort((a, b) => {
      const aLag = callStartMs - new Date(a.timestamp).getTime();
      const bLag = callStartMs - new Date(b.timestamp).getTime();
      return aLag - bLag; // ascending: smallest lag first
    });

    const best = candidates[0];
    const lagSeconds = Math.round(
      (callStartMs - new Date(best.timestamp).getTime()) / 1000
    );

    // Mark click as consumed so it can't match a second call
    availableClickIds.delete(best.id);

    pending.push({
      callSid: call.sid,
      gclid: best.gclid!,
      // Google recommends using the time of the originating click for the
      // conversion date_time when the actual conversion time is uncertain.
      conversionDateTime: new Date(best.timestamp),
      clickId: best.id,
      lagSeconds,
    });
  }

  return pending;
}

// ---------------------------------------------------------------------------
// Google Ads upload helpers (mirrors import-tally-conversions.ts)
// ---------------------------------------------------------------------------

/**
 * Format a Date to the Google Ads conversion datetime format.
 * Required: "yyyy-mm-dd hh:mm:ss+00:00"
 */
function formatConversionDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ` +
    `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}+00:00`
  );
}

interface ClickConversionPayload {
  gclid: string;
  conversionAction: string;
  conversionDateTime: string;
  conversionValue: number;
  currencyCode: string;
}

async function uploadClickConversions(
  conversions: ClickConversionPayload[]
): Promise<UploadResult> {
  const client = new GoogleAdsApi({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  });

  const customer = client.Customer({
    customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID!,
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
    login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
  });

  const response = await customer.conversionUploads.uploadClickConversions({
    customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID!,
    conversions: conversions.map((c) => ({
      gclid: c.gclid,
      conversion_action: c.conversionAction,
      conversion_date_time: c.conversionDateTime,
      conversion_value: c.conversionValue,
      currency_code: c.currencyCode,
    })),
    partial_failure: true,
  } as any);

  const results: Array<{ gclid?: string }> = (response as any).results ?? [];
  const partialFailureError = (response as any).partial_failure_error;
  const failures: UploadResult['failures'] = [];

  if (partialFailureError && partialFailureError.code) {
    const topLevelMessage: string =
      partialFailureError.message ?? 'Rejected by Google Ads (partial failure)';

    for (let i = 0; i < conversions.length; i++) {
      const result = results[i];
      if (!result || !result.gclid) {
        failures.push({ index: i, gclid: conversions[i].gclid, message: topLevelMessage });
      }
    }
  }

  return {
    successCount: conversions.length - failures.length,
    failures,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const { days, dryRun } = parseArgs();

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);
  sinceDate.setUTCHours(0, 0, 0, 0);

  console.log('='.repeat(60));
  console.log('  Import Phone-Call Conversions -> Google Ads');
  console.log('='.repeat(60));
  console.log(`  Mode:          ${dryRun ? 'DRY RUN (no uploads)' : 'LIVE'}`);
  console.log(
    `  Period:        last ${days} day${days !== 1 ? 's' : ''} (since ${sinceDate.toISOString().split('T')[0]})`
  );
  console.log(`  Conversion:    ${CONVERSION_ACTION}`);
  console.log(`  Value:         £${CONVERSION_VALUE} per call`);
  console.log(`  Match window:  ${MATCH_WINDOW_SECONDS / 60} minutes before call`);
  console.log(`  Min duration:  ${MIN_CALL_DURATION_SECONDS}s`);

  // -------------------------------------------------------------------------
  // Step 1: Load phone-click records
  // -------------------------------------------------------------------------
  console.log('\n' + '='.repeat(60));
  console.log('  Step 1: Loading phone-click records');
  console.log('='.repeat(60));

  const allClicks = loadPhoneClicks();
  const clicksWithGclid = allClicks.filter((c) => !!c.gclid);
  const clicksInWindow = clicksWithGclid.filter(
    (c) => new Date(c.timestamp) >= sinceDate
  );

  console.log(`  Total phone-click records:  ${allClicks.length}`);
  console.log(`  With gclid:                 ${clicksWithGclid.length}`);
  console.log(`  Within date window:         ${clicksInWindow.length}`);

  if (clicksInWindow.length === 0) {
    console.log('\n  No gclid-bearing phone clicks in window. Nothing to match.');
    process.exit(0);
  }

  // -------------------------------------------------------------------------
  // Step 2: Fetch Twilio inbound calls
  // -------------------------------------------------------------------------
  console.log('\n' + '='.repeat(60));
  console.log('  Step 2: Fetching Twilio inbound calls');
  console.log('='.repeat(60));

  // We fetch a slightly wider window (extra day) to ensure calls that arrive
  // just after midnight on the start date are included.
  const twilioStartDate = new Date(sinceDate);
  twilioStartDate.setDate(twilioStartDate.getDate() - 1);

  let calls: Awaited<ReturnType<typeof fetchInboundCalls>>;
  process.stdout.write('  Fetching from Twilio... ');
  try {
    calls = await fetchInboundCalls({
      startDate: twilioStartDate,
      endDate: new Date(),
      minDuration: MIN_CALL_DURATION_SECONDS,
    });
    console.log(`${calls.length} qualifying inbound call(s)`);
  } catch (error: any) {
    console.error(`\n  FATAL: Twilio fetch failed: ${error.message}`);
    process.exit(1);
  }

  if (calls.length === 0) {
    console.log('\n  No inbound calls in the date window. Nothing to match.');
    process.exit(0);
  }

  // -------------------------------------------------------------------------
  // Step 3: Match clicks to calls
  // -------------------------------------------------------------------------
  console.log('\n' + '='.repeat(60));
  console.log('  Step 3: Matching clicks to calls');
  console.log('='.repeat(60));

  const alreadyImported = loadImportedCallSids();
  console.log(`  Previously imported call SIDs: ${alreadyImported.size}`);

  // Use the full click history (not just the window) so that edge-case clicks
  // that landed just outside the sinceDate but within the match window for a
  // qualifying call are still considered.
  const pending = matchClicksToCalls(calls, allClicks, alreadyImported, sinceDate);

  console.log(`\n  Matched (pending upload): ${pending.length}`);

  if (pending.length === 0) {
    console.log('\n  No matches found. Exiting.');
    process.exit(0);
  }

  // -------------------------------------------------------------------------
  // Step 4: List pending conversions
  // -------------------------------------------------------------------------
  console.log('\n' + '='.repeat(60));
  console.log('  Step 4: Pending conversions');
  console.log('='.repeat(60));

  for (const conv of pending) {
    const dateStr = conv.conversionDateTime
      .toISOString()
      .replace('T', ' ')
      .slice(0, 19);
    console.log(
      `  ${dateStr} UTC` +
        `  gclid: ${conv.gclid.slice(0, 24)}...` +
        `  lag: ${conv.lagSeconds}s` +
        `  sid: ${conv.callSid}`
    );
  }

  if (dryRun) {
    console.log('\n  DRY RUN: No conversions uploaded.');
    console.log('  Run without --dry-run to upload these conversions.');
    process.exit(0);
  }

  // -------------------------------------------------------------------------
  // Step 5: Upload to Google Ads
  // -------------------------------------------------------------------------
  console.log('\n' + '='.repeat(60));
  console.log('  Step 5: Uploading to Google Ads');
  console.log('='.repeat(60));

  const conversions: ClickConversionPayload[] = pending.map((conv) => ({
    gclid: conv.gclid,
    conversionAction: CONVERSION_ACTION,
    conversionDateTime: formatConversionDateTime(conv.conversionDateTime),
    conversionValue: CONVERSION_VALUE,
    currencyCode: CURRENCY_CODE,
  }));

  let uploadResult: UploadResult;
  try {
    process.stdout.write(`  Uploading ${conversions.length} conversion(s)... `);
    uploadResult = await uploadClickConversions(conversions);
    console.log('Done.');
  } catch (error: any) {
    console.error(`\n  FATAL: Upload request failed entirely: ${error.message}`);
    if ((error as any).errors) {
      for (const e of (error as any).errors) {
        console.error(`    - ${e.message}`);
      }
    }
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // Step 6: Persist successful imports to the deduplication store
  // -------------------------------------------------------------------------
  const failedIndices = new Set(uploadResult.failures.map((f) => f.index));

  for (let i = 0; i < pending.length; i++) {
    if (!failedIndices.has(i)) {
      saveImportedCallConversion({
        callSid: pending[i].callSid,
        clickId: pending[i].clickId,
        gclid: pending[i].gclid,
        importedAt: new Date().toISOString(),
      });
    }
  }

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  console.log('\n' + '='.repeat(60));
  console.log('  Results');
  console.log('='.repeat(60));
  console.log(`  Attempted:  ${pending.length}`);
  console.log(`  Succeeded:  ${uploadResult.successCount}`);
  console.log(`  Failed:     ${uploadResult.failures.length}`);

  if (uploadResult.failures.length > 0) {
    console.log('\n  Failures (NOT saved — will retry on next run):');
    for (const failure of uploadResult.failures) {
      console.log(`    [${failure.index}] gclid: ${failure.gclid}  —  ${failure.message}`);
    }
  }

  console.log('\n  Done.');
  process.exit(uploadResult.failures.length > 0 ? 2 : 0);
}

main().catch((error) => {
  console.error('\nFATAL: Unhandled error:', error);
  process.exit(1);
});
