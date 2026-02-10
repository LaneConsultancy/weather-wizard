/**
 * Upload Offline Conversions to Microsoft Advertising (Bing Ads)
 *
 * Uses the Bing Ads API ApplyOfflineConversions operation.
 *
 * Microsoft Advertising offline conversion import:
 * https://learn.microsoft.com/en-us/advertising/campaign-management-service/applyofflineconversions
 *
 * Unlike Google Ads, Bing offline conversions typically require a MSCLKID
 * (Microsoft Click ID). Caller-ID-only matching is NOT supported by Bing
 * in the same way as Google.
 *
 * Options for Bing:
 * 1. If MSCLKID capture is implemented (Phase 6), use that for matching
 * 2. If MSCLKID is not available, this upload will be a no-op with a log
 *    message explaining that Bing requires MSCLKID
 *
 * This file provides the structure for Bing uploads. Full implementation
 * depends on Phase 6 (GCLID/MSCLKID capture middleware) being deployed.
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import type { UnmatchedCall, UploadResult } from './types';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

/** Default conversion value in GBP */
const DEFAULT_CONVERSION_VALUE = 75;
const CURRENCY_CODE = 'GBP';

/**
 * Check if Bing Ads credentials are configured.
 */
function hasBingAdsCredentials(): boolean {
  return !!(
    process.env.BING_ADS_CLIENT_ID &&
    process.env.BING_ADS_CLIENT_SECRET &&
    process.env.BING_ADS_DEVELOPER_TOKEN &&
    process.env.BING_ADS_REFRESH_TOKEN
  );
}

/**
 * Upload unmatched calls as offline conversions to Bing Ads.
 *
 * NOTE: Bing Ads requires MSCLKID for offline conversion matching.
 * Without Phase 6 (MSCLKID capture), this function will log a warning
 * and return an empty result. Once Phase 6 is deployed and MSCLKID
 * is available on unmatched calls, this function should be updated
 * to use the ApplyOfflineConversions API.
 *
 * @param unmatchedCalls - Calls not tracked by WhatConverts
 * @param conversionValue - Value per conversion in GBP (default: 75)
 * @returns UploadResult
 */
export async function uploadCallConversionsToBing(
  unmatchedCalls: UnmatchedCall[],
  conversionValue: number = DEFAULT_CONVERSION_VALUE
): Promise<UploadResult> {
  if (!hasBingAdsCredentials()) {
    console.log(
      '  [Bing Ads] Skipping -- credentials not configured.\n' +
      '  Set BING_ADS_CLIENT_ID, BING_ADS_CLIENT_SECRET, ' +
      'BING_ADS_DEVELOPER_TOKEN, and BING_ADS_REFRESH_TOKEN in .env'
    );
    return {
      platform: 'bing_ads',
      totalAttempted: 0,
      successCount: 0,
      failureCount: 0,
      errors: [],
    };
  }

  if (unmatchedCalls.length === 0) {
    return {
      platform: 'bing_ads',
      totalAttempted: 0,
      successCount: 0,
      failureCount: 0,
      errors: [],
    };
  }

  // Bing Ads offline conversions require MSCLKID.
  // Without MSCLKID capture (Phase 6), we cannot match calls to Bing ad clicks.
  //
  // TODO: Once Phase 6 is deployed, update UnmatchedCall type to include
  //       an optional msclkid field (captured from the visitor's session).
  //       Then implement the ApplyOfflineConversions API call here.
  //
  // Implementation sketch for when MSCLKID is available:
  //
  // 1. Install Bing Ads SDK: npm install bingads-sdk (or use REST API directly)
  //
  // 2. Build offline conversion objects:
  //    const conversions = unmatchedCalls
  //      .filter(call => call.msclkid) // Only calls with captured MSCLKID
  //      .map(call => ({
  //        conversionCurrencyCode: CURRENCY_CODE,
  //        conversionName: 'Offline Phone Call (Twilio)',
  //        conversionTime: call.twilioCall.startTime.toISOString(),
  //        conversionValue: conversionValue,
  //        microsoftClickId: call.msclkid,
  //      }));
  //
  // 3. Call ApplyOfflineConversions:
  //    const response = await campaignManagement.applyOfflineConversions({
  //      offlineConversions: conversions,
  //    });
  //
  // 4. Parse response for partial failures and return UploadResult

  console.log(
    `  [Bing Ads] ${unmatchedCalls.length} calls available for upload, ` +
    `but MSCLKID matching is not yet implemented.\n` +
    `  Bing Ads offline conversions require Phase 6 (MSCLKID capture middleware).\n` +
    `  This will be enabled automatically once Phase 6 is deployed.`
  );

  return {
    platform: 'bing_ads',
    totalAttempted: unmatchedCalls.length,
    successCount: 0,
    failureCount: 0,
    errors: [{
      callSid: 'N/A',
      callerNumber: 'N/A',
      errorMessage: 'MSCLKID capture not yet implemented (requires Phase 6)',
    }],
  };
}
