/**
 * Offline Conversion Upload Pipeline
 *
 * This is the main script that orchestrates the entire pipeline:
 * 1. Fetch inbound calls from Twilio for the target date
 * 2. Fetch phone call leads from WhatConverts for the same date
 * 3. Reconcile to find unmatched calls (the "gap")
 * 4. Upload unmatched calls as offline conversions to Google Ads and Bing Ads
 *
 * Usage:
 *   npm run upload-offline-conversions                    # Process yesterday's calls
 *   npm run upload-offline-conversions -- --date 2026-02-08  # Process a specific date
 *   npm run reconcile-calls                               # Dry run (no uploads)
 *   npm run upload-offline-conversions -- --dry-run       # Same as above
 *
 * CLI Arguments:
 *   --date YYYY-MM-DD   Process calls for a specific date (default: yesterday)
 *   --dry-run            Fetch and reconcile only, do not upload to ad platforms
 *   --days N             Process N days ending at --date (default: 1)
 *   --verbose            Show detailed output including all call records
 *
 * Exit codes:
 *   0 = success (or dry run)
 *   1 = fatal error (API connection failure, missing credentials)
 *   2 = partial failure (some uploads failed, but pipeline completed)
 */

import { fetchInboundCalls } from '../lib/twilio/call-logs';
import { fetchPhoneLeads } from '../lib/whatconverts/leads';
import { reconcileCalls } from '../lib/conversions/reconcile';
import { uploadCallConversionsToGoogle } from '../lib/conversions/google-ads-upload';
import { uploadCallConversionsToBing } from '../lib/conversions/bing-upload';
import type { ReconciliationResult, UploadResult } from '../lib/conversions/types';

// --- CLI argument parsing ---

function parseArgs(): { date: Date; days: number; dryRun: boolean; verbose: boolean } {
  const args = process.argv.slice(2);
  let date: Date | null = null;
  let days = 1;
  let dryRun = false;
  let verbose = false;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--date':
        const dateStr = args[++i];
        date = new Date(dateStr + 'T00:00:00Z');
        if (isNaN(date.getTime())) {
          console.error(`Invalid date: ${dateStr}. Use YYYY-MM-DD format.`);
          process.exit(1);
        }
        break;
      case '--days':
        days = parseInt(args[++i], 10);
        if (isNaN(days) || days < 1 || days > 90) {
          console.error('--days must be between 1 and 90');
          process.exit(1);
        }
        break;
      case '--dry-run':
        dryRun = true;
        break;
      case '--verbose':
        verbose = true;
        break;
      default:
        console.error(`Unknown argument: ${args[i]}`);
        process.exit(1);
    }
  }

  // Default to yesterday
  if (!date) {
    date = new Date();
    date.setDate(date.getDate() - 1);
  }

  return { date, days, dryRun, verbose };
}

// --- Logging helpers ---

function logSection(title: string): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  ${title}`);
  console.log('='.repeat(60));
}

function logReconciliationSummary(result: ReconciliationResult): void {
  logSection('Reconciliation Summary');
  console.log(`  Date range: ${result.dateRange.start.toISOString().split('T')[0]} to ${result.dateRange.end.toISOString().split('T')[0]}`);
  console.log(`  Twilio inbound calls (>= 60s): ${result.totalTwilioCalls}`);
  console.log(`  WhatConverts phone leads:      ${result.totalWhatConvertsLeads}`);
  console.log(`  Matched:                        ${result.matched.length}`);
  console.log(`  Unmatched (gap calls):          ${result.unmatched.length}`);
  console.log(`  Match rate:                     ${result.matchRate.toFixed(1)}%`);

  if (result.matched.length > 0) {
    const exactCount = result.matched.filter(m => m.matchConfidence === 'exact').length;
    const fuzzyCount = result.matched.filter(m => m.matchConfidence === 'fuzzy').length;
    console.log(`    Exact matches (< 30s):        ${exactCount}`);
    console.log(`    Fuzzy matches (< 5min):       ${fuzzyCount}`);
  }
}

function logUploadResult(result: UploadResult): void {
  const platformName = result.platform === 'google_ads' ? 'Google Ads' : 'Bing Ads';
  console.log(`\n  [${platformName}]`);
  console.log(`    Attempted: ${result.totalAttempted}`);
  console.log(`    Succeeded: ${result.successCount}`);
  console.log(`    Failed:    ${result.failureCount}`);

  if (result.errors.length > 0 && result.errors.length <= 10) {
    console.log(`    Errors:`);
    for (const error of result.errors) {
      console.log(`      - ${error.callerNumber}: ${error.errorMessage}`);
    }
  } else if (result.errors.length > 10) {
    console.log(`    First 10 errors (${result.errors.length} total):`);
    for (const error of result.errors.slice(0, 10)) {
      console.log(`      - ${error.callerNumber}: ${error.errorMessage}`);
    }
  }
}

// --- Main pipeline ---

async function main(): Promise<void> {
  const { date, days, dryRun, verbose } = parseArgs();

  console.log('Offline Conversion Upload Pipeline');
  console.log(`Mode: ${dryRun ? 'DRY RUN (no uploads)' : 'LIVE (will upload to ad platforms)'}`);

  // Calculate date range
  const endDate = new Date(date);
  endDate.setUTCHours(23, 59, 59, 999);

  const startDate = new Date(date);
  startDate.setDate(startDate.getDate() - (days - 1));
  startDate.setUTCHours(0, 0, 0, 0);

  console.log(`Date range: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]} (${days} day${days > 1 ? 's' : ''})`);

  // Step 1: Fetch Twilio calls
  logSection('Step 1: Fetching Twilio call logs');
  let twilioCalls;
  try {
    twilioCalls = await fetchInboundCalls({
      startDate,
      endDate,
      minDuration: 60,
    });
    console.log(`  Found ${twilioCalls.length} qualifying inbound calls`);

    if (verbose && twilioCalls.length > 0) {
      for (const call of twilioCalls) {
        console.log(
          `    ${call.startTime.toISOString()} | ${call.from} | ${call.duration}s | ${call.sid}`
        );
      }
    }
  } catch (error: any) {
    console.error(`  FATAL: Failed to fetch Twilio calls: ${error.message}`);
    process.exit(1);
  }

  // Step 2: Fetch WhatConverts leads
  logSection('Step 2: Fetching WhatConverts phone leads');
  let whatConvertsLeads;
  try {
    whatConvertsLeads = await fetchPhoneLeads({
      startDate,
      endDate,
    });
    console.log(`  Found ${whatConvertsLeads.length} phone call leads`);

    if (verbose && whatConvertsLeads.length > 0) {
      for (const lead of whatConvertsLeads) {
        console.log(
          `    ${lead.createdAt.toISOString()} | ${lead.callerNumber} | ${lead.duration}s | ${lead.source}`
        );
      }
    }
  } catch (error: any) {
    console.error(`  FATAL: Failed to fetch WhatConverts leads: ${error.message}`);
    process.exit(1);
  }

  // Step 3: Reconcile
  logSection('Step 3: Reconciling calls');
  const reconciliation = reconcileCalls(twilioCalls, whatConvertsLeads);
  logReconciliationSummary(reconciliation);

  // Early exit if no unmatched calls
  if (reconciliation.unmatched.length === 0) {
    console.log('\n  No unmatched calls to upload. All calls were tracked by WhatConverts.');
    console.log('  Pipeline complete.');
    process.exit(0);
  }

  // Dry run: log what would be uploaded and exit
  if (dryRun) {
    logSection('Dry Run: Would upload these calls');
    for (const unmatched of reconciliation.unmatched) {
      console.log(
        `  ${unmatched.twilioCall.startTime.toISOString()} | ` +
        `${unmatched.twilioCall.from} | ` +
        `${unmatched.twilioCall.duration}s | ` +
        `Value: 75 GBP`
      );
    }
    console.log(`\n  Total: ${reconciliation.unmatched.length} calls (75 GBP each)`);
    console.log(`  Total value: ${reconciliation.unmatched.length * 75} GBP`);
    console.log('\n  Run without --dry-run to upload these conversions.');
    process.exit(0);
  }

  // Step 4: Upload to ad platforms
  logSection('Step 4: Uploading offline conversions');
  let hasFailures = false;

  // Google Ads
  console.log('\n  Uploading to Google Ads...');
  try {
    const googleResult = await uploadCallConversionsToGoogle(reconciliation.unmatched);
    logUploadResult(googleResult);
    if (googleResult.failureCount > 0) hasFailures = true;
  } catch (error: any) {
    console.error(`  Google Ads upload failed entirely: ${error.message}`);
    hasFailures = true;
  }

  // Bing Ads
  console.log('\n  Uploading to Bing Ads...');
  try {
    const bingResult = await uploadCallConversionsToBing(reconciliation.unmatched);
    logUploadResult(bingResult);
    if (bingResult.failureCount > 0) hasFailures = true;
  } catch (error: any) {
    console.error(`  Bing Ads upload failed entirely: ${error.message}`);
    hasFailures = true;
  }

  // Final summary
  logSection('Pipeline Complete');
  console.log(`  Date: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);
  console.log(`  Twilio calls: ${reconciliation.totalTwilioCalls}`);
  console.log(`  Gap calls uploaded: ${reconciliation.unmatched.length}`);
  console.log(`  Match rate: ${reconciliation.matchRate.toFixed(1)}%`);

  if (hasFailures) {
    console.log('\n  WARNING: Some uploads failed. Check errors above.');
    process.exit(2);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error('\nFATAL: Unhandled error in pipeline:', error);
  process.exit(1);
});
