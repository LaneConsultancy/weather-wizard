/**
 * Import Tally Form Submissions as Offline Click Conversions into Google Ads
 *
 * Fetches completed submissions from Tally forms that captured a Google Click
 * ID (gclid) via a hidden field, then uploads each new submission as a click
 * conversion to Google Ads so that form-fill leads are attributed back to the
 * ad click that drove them.
 *
 * Tally API notes (discovered from live testing):
 * - Endpoint:   GET /forms/{id}/submissions?limit=100
 * - Pagination: response body has `hasMore: boolean` (not pageCount)
 * - Submissions: each has a `responses[]` array; hidden-field answers are
 *   objects like `{ gclid: "...", msclkid: "..." }` rather than plain strings
 * - Filtering:  `status=completed` param is NOT supported — filter isCompleted client-side
 *
 * Google Ads upload notes:
 * - Uses the `google-ads-api` npm package (gRPC), not the REST API directly
 * - Requires a conversion action of type UPLOAD_CLICKS (type 7)
 * - The action "Tally Form Submission (Offline Click)" was created for this purpose:
 *   customers/6652965980/conversionActions/7532675250
 * - New conversion actions take a few minutes to be available for upload
 *
 * Duplicate prevention: Successfully imported submission IDs are persisted to
 * data/imported-conversions.json. Safe to re-run at any time — already-imported
 * submissions are skipped without re-uploading.
 *
 * Usage:
 *   npm run import-conversions             # Last 7 days (default)
 *   npm run import-conversions -- --days 30
 *   npm run import-conversions -- --dry-run
 *
 * CLI arguments:
 *   --days N     Fetch submissions from the last N days (default: 7)
 *   --dry-run    Show what would be uploaded without sending to Google Ads
 */

import 'dotenv/config';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { GoogleAdsApi } from 'google-ads-api';

// Load .env.local — takes precedence for this project
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/**
 * Tally forms to process.
 * gclidQuestionId is the question ID whose answer object holds the gclid key.
 */
const TALLY_FORMS: Array<{ formId: string; gclidQuestionId: string; label: string }> = [
  { formId: 'VL5e5l', gclidQuestionId: 'zK7AqE', label: 'Landing page form' },
  { formId: 'npqGpV', gclidQuestionId: 'XeJqdg', label: 'Original quote form' },
];

const TALLY_API_BASE = 'https://api.tally.so';

/**
 * Google Ads offline CLICK conversion action resource name.
 * Must be type UPLOAD_CLICKS (7), not UPLOAD_CALLS (6) or WEBPAGE (8).
 *
 * Using "Weather Wizard's phone call lead" (7479655654) which is pre-existing
 * and already type UPLOAD_CLICKS. The newer "Tally Form Submission" action
 * (7532675250) can be used once Google propagates it (typically ~10-20 min).
 */
const CONVERSION_ACTION =
  process.env.GOOGLE_ADS_TALLY_CLICK_CONVERSION_ACTION ??
  'customers/6652965980/conversionActions/7479655654';

/** Estimated lead value in GBP */
const CONVERSION_VALUE = 50;
const CURRENCY_CODE = 'GBP';

/** Path to the deduplication store (relative to cwd = weather-wizard-site/) */
const IMPORTED_CONVERSIONS_FILE = path.resolve(process.cwd(), 'data/imported-conversions.json');

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TallyResponse {
  id: string;
  questionId: string;
  /** Hidden-field answers are objects like { gclid: "...", msclkid: "..." } */
  answer: unknown;
}

interface TallySubmission {
  id: string;
  formId: string;
  isCompleted: boolean;
  submittedAt: string;
  responses: TallyResponse[];
}

interface TallySubmissionsPage {
  hasMore: boolean;
  submissions: TallySubmission[];
}

interface PendingConversion {
  submissionId: string;
  formId: string;
  formLabel: string;
  gclid: string;
  submittedAt: string;
}

interface ImportedRecord {
  submissionId: string;
  formId: string;
  importedAt: string;
  gclid: string;
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
// Deduplication store
// ---------------------------------------------------------------------------

function loadImportedConversions(): Set<string> {
  try {
    const raw = fs.readFileSync(IMPORTED_CONVERSIONS_FILE, 'utf-8');
    const records: ImportedRecord[] = JSON.parse(raw);
    return new Set(records.map((r) => r.submissionId));
  } catch {
    return new Set();
  }
}

function saveImportedConversion(record: ImportedRecord): void {
  let records: ImportedRecord[] = [];

  try {
    const raw = fs.readFileSync(IMPORTED_CONVERSIONS_FILE, 'utf-8');
    records = JSON.parse(raw);
  } catch {
    // File missing or corrupt — start fresh
  }

  records.push(record);

  fs.mkdirSync(path.dirname(IMPORTED_CONVERSIONS_FILE), { recursive: true });
  fs.writeFileSync(IMPORTED_CONVERSIONS_FILE, JSON.stringify(records, null, 2));
}

// ---------------------------------------------------------------------------
// Tally API
// ---------------------------------------------------------------------------

/**
 * Fetch all completed submissions for a form submitted on or after sinceDate.
 *
 * The Tally submissions API:
 * - Returns newest-first
 * - Paginates with `page` (1-based) and signals more pages with `hasMore: true`
 * - Hidden-field question answers are objects, not plain strings
 */
async function fetchTallySubmissions(
  formId: string,
  sinceDate: Date,
  apiKey: string
): Promise<TallySubmission[]> {
  const collected: TallySubmission[] = [];
  let page = 1;

  while (true) {
    const url = `${TALLY_API_BASE}/forms/${formId}/submissions?page=${page}&limit=100`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Tally API error for form ${formId} (page ${page}): ${response.status} ${body}`
      );
    }

    const data: TallySubmissionsPage = await response.json();
    const submissions: TallySubmission[] = data.submissions ?? [];
    let hitCutoff = false;

    for (const sub of submissions) {
      // Tally returns newest first — stop as soon as we reach our cutoff date
      if (new Date(sub.submittedAt) < sinceDate) {
        hitCutoff = true;
        break;
      }

      // Extra safety guard: only include genuinely completed submissions
      if (sub.isCompleted) {
        collected.push(sub);
      }
    }

    if (hitCutoff || !data.hasMore) {
      break;
    }

    page++;
  }

  return collected;
}

/**
 * Extract the gclid from a submission's hidden-field response.
 *
 * The answer for a hidden-fields question is an object keyed by field name,
 * e.g. `{ gclid: "Cj0KCQ...", msclkid: null }`. We look for the response
 * matching gclidQuestionId and read `.gclid` from its answer.
 */
function extractGclid(submission: TallySubmission, gclidQuestionId: string): string | null {
  const response = submission.responses.find((r) => r.questionId === gclidQuestionId);
  if (!response) return null;

  const answer = response.answer;
  if (!answer || typeof answer !== 'object') return null;

  const gclid = (answer as Record<string, unknown>).gclid;
  if (!gclid || typeof gclid !== 'string' || gclid.trim() === '') return null;

  // Reject obvious test/placeholder values from dev form submissions
  if (gclid.toLowerCase().startsWith('test_') || gclid === 'test') return null;

  return gclid.trim();
}

// ---------------------------------------------------------------------------
// Google Ads upload (via google-ads-api npm package)
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
  /** Original submission ID — used purely for local dedup bookkeeping */
  submissionId: string;
}

interface UploadResult {
  successCount: number;
  failures: Array<{ index: number; gclid: string; message: string }>;
}

/**
 * Upload a batch of gclid-based click conversions to Google Ads using the
 * google-ads-api npm package (gRPC transport).
 *
 * Requires a conversion action of type UPLOAD_CLICKS (type 7).
 * Uses partial_failure so individual bad gclids don't abort the whole batch.
 *
 * The response has a `results` array parallel to `conversions` — each entry
 * for a successful conversion has a populated `resource_name`; failed entries
 * are empty objects. `partial_failure_error` is present (with a non-zero
 * `code`) when at least one conversion was rejected.
 */
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
  });

  // The response `results` array is parallel to `conversions`.
  // A successful entry has a non-empty `gclid` field echoed back.
  // A failed entry has empty/missing `gclid`. `partial_failure_error` is
  // present (with non-zero `code`) when at least one conversion was rejected.
  const results: Array<{ gclid?: string }> = (response as any).results ?? [];
  const partialFailureError = (response as any).partial_failure_error;
  const failures: UploadResult['failures'] = [];

  if (partialFailureError && partialFailureError.code) {
    const topLevelMessage: string =
      partialFailureError.message ?? 'Rejected by Google Ads (partial failure)';

    for (let i = 0; i < conversions.length; i++) {
      const result = results[i];
      // A successful result echoes back the gclid that was uploaded
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

  const tallyApiKey = process.env.TALLY_API_KEY;
  if (!tallyApiKey) {
    console.error('FATAL: TALLY_API_KEY is not set in .env.local');
    process.exit(1);
  }

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);
  sinceDate.setUTCHours(0, 0, 0, 0);

  console.log('='.repeat(60));
  console.log('  Import Tally Conversions -> Google Ads');
  console.log('='.repeat(60));
  console.log(`  Mode:       ${dryRun ? 'DRY RUN (no uploads)' : 'LIVE'}`);
  console.log(
    `  Period:     last ${days} day${days !== 1 ? 's' : ''} (since ${sinceDate.toISOString().split('T')[0]})`
  );
  console.log(`  Forms:      ${TALLY_FORMS.map((f) => `${f.formId} (${f.label})`).join(', ')}`);
  console.log(`  Conversion: ${CONVERSION_ACTION}`);
  console.log(`  Value:      £${CONVERSION_VALUE} per lead`);

  // Load already-imported submission IDs for deduplication
  const alreadyImported = loadImportedConversions();
  console.log(`\n  Previously imported: ${alreadyImported.size} submission(s)`);

  // -------------------------------------------------------------------------
  // Step 1: Fetch submissions from all Tally forms
  // -------------------------------------------------------------------------
  console.log('\n' + '='.repeat(60));
  console.log('  Step 1: Fetching Tally form submissions');
  console.log('='.repeat(60));

  const pending: PendingConversion[] = [];
  let totalFetched = 0;
  let noGclidCount = 0;
  let alreadyImportedCount = 0;
  let testGclidCount = 0;

  for (const form of TALLY_FORMS) {
    process.stdout.write(`  ${form.label} (${form.formId})... `);

    let submissions: TallySubmission[];
    try {
      submissions = await fetchTallySubmissions(form.formId, sinceDate, tallyApiKey);
    } catch (error: any) {
      console.error(`\n  ERROR: ${error.message}`);
      continue;
    }

    console.log(`${submissions.length} completed submission(s)`);
    totalFetched += submissions.length;

    for (const sub of submissions) {
      if (alreadyImported.has(sub.id)) {
        alreadyImportedCount++;
        continue;
      }

      const gclid = extractGclid(sub, form.gclidQuestionId);

      if (!gclid) {
        // Check whether it was a test value vs genuinely no gclid
        const rawResponse = sub.responses.find((r) => r.questionId === form.gclidQuestionId);
        const rawAnswer = rawResponse?.answer as Record<string, unknown> | undefined;
        const rawGclid = rawAnswer?.gclid;
        if (rawGclid && typeof rawGclid === 'string' && rawGclid.toLowerCase().startsWith('test_')) {
          testGclidCount++;
        } else {
          noGclidCount++;
        }
        continue;
      }

      pending.push({
        submissionId: sub.id,
        formId: form.formId,
        formLabel: form.label,
        gclid,
        submittedAt: sub.submittedAt,
      });
    }
  }

  console.log(`\n  Total completed fetched:  ${totalFetched}`);
  console.log(`  Already imported:         ${alreadyImportedCount}`);
  console.log(`  No gclid (organic/Bing):  ${noGclidCount}`);
  if (testGclidCount > 0) {
    console.log(`  Test gclids (skipped):    ${testGclidCount}`);
  }
  console.log(`  Pending upload:           ${pending.length}`);

  if (pending.length === 0) {
    console.log('\n  Nothing to upload. Exiting.');
    process.exit(0);
  }

  // -------------------------------------------------------------------------
  // Step 2: List pending conversions
  // -------------------------------------------------------------------------
  console.log('\n' + '='.repeat(60));
  console.log('  Step 2: Pending conversions');
  console.log('='.repeat(60));

  for (const conv of pending) {
    const dateStr = new Date(conv.submittedAt).toISOString().replace('T', ' ').slice(0, 19);
    console.log(
      `  [${conv.formLabel}] ${dateStr} UTC` +
        `  gclid: ${conv.gclid.slice(0, 24)}...` +
        `  id: ${conv.submissionId}`
    );
  }

  if (dryRun) {
    console.log('\n  DRY RUN: No conversions uploaded.');
    console.log('  Run without --dry-run to upload these conversions.');
    process.exit(0);
  }

  // -------------------------------------------------------------------------
  // Step 3: Upload to Google Ads
  // -------------------------------------------------------------------------
  console.log('\n' + '='.repeat(60));
  console.log('  Step 3: Uploading to Google Ads');
  console.log('='.repeat(60));

  const conversions: ClickConversionPayload[] = pending.map((conv) => ({
    gclid: conv.gclid,
    conversionAction: CONVERSION_ACTION,
    conversionDateTime: formatConversionDateTime(new Date(conv.submittedAt)),
    conversionValue: CONVERSION_VALUE,
    currencyCode: CURRENCY_CODE,
    submissionId: conv.submissionId,
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
  // Step 4: Persist successful imports to the deduplication store
  // -------------------------------------------------------------------------
  const failedIndices = new Set(uploadResult.failures.map((f) => f.index));

  for (let i = 0; i < pending.length; i++) {
    if (!failedIndices.has(i)) {
      saveImportedConversion({
        submissionId: pending[i].submissionId,
        formId: pending[i].formId,
        importedAt: new Date().toISOString(),
        gclid: pending[i].gclid,
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
