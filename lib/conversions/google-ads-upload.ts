/**
 * Upload Offline Call Conversions to Google Ads
 *
 * Uses the google-ads-api npm package (gRPC transport) because the
 * REST API does not support uploadCallConversions (returns 501).
 *
 * Matching strategy: Caller ID based.
 * Google matches the uploaded caller phone number against its own
 * records of which phone numbers have interacted with ads via
 * call extensions or call assets. This does NOT require a GCLID.
 *
 * Idempotency: Google Ads deduplicates by (callerId + callStartDateTime).
 * It is safe to re-run the same date without creating duplicate conversions.
 *
 * Batch limit: Max 2,000 conversions per uploadCallConversions request.
 * For a local roofing company, daily volume is well under this limit.
 */

import { GoogleAdsApi } from 'google-ads-api';
import * as dotenv from 'dotenv';
import * as path from 'path';
import type { UnmatchedCall, UploadResult, UploadError } from './types';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

/** Default conversion value in GBP for each phone call */
const DEFAULT_CONVERSION_VALUE = 75;
const CURRENCY_CODE = 'GBP';

/**
 * Format a Date to the Google Ads call conversion datetime format.
 * Required format: "yyyy-mm-dd hh:mm:ss+00:00" (UTC timezone)
 */
function formatCallDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ` +
    `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}+00:00`
  );
}

/**
 * Upload unmatched Twilio calls as offline call conversions to Google Ads.
 *
 * Uses the google-ads-api npm package's gRPC-based uploadCallConversions,
 * since the REST API returns 501 for this endpoint.
 */
export async function uploadCallConversionsToGoogle(
  unmatchedCalls: UnmatchedCall[],
  conversionActionResourceName?: string,
  conversionValue: number = DEFAULT_CONVERSION_VALUE
): Promise<UploadResult> {
  const resourceName = conversionActionResourceName
    ?? process.env.GOOGLE_ADS_OFFLINE_CALL_CONVERSION_ACTION;

  if (!resourceName) {
    throw new Error(
      'Missing conversion action resource name. Either pass it as a parameter ' +
      'or set GOOGLE_ADS_OFFLINE_CALL_CONVERSION_ACTION in .env.local. ' +
      'Run create-offline-conversion-action.ts first to create the conversion action.'
    );
  }

  if (unmatchedCalls.length === 0) {
    return {
      platform: 'google_ads',
      totalAttempted: 0,
      successCount: 0,
      failureCount: 0,
      errors: [],
    };
  }

  const client = new GoogleAdsApi({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID || '',
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
  });

  const customer = client.Customer({
    customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID || '',
    login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || '',
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN || '',
  });

  const conversions = unmatchedCalls.map((unmatched) => {
    const callTime = formatCallDateTime(unmatched.twilioCall.startTime);
    return {
      caller_id: unmatched.twilioCall.from,
      call_start_date_time: callTime,
      conversion_date_time: callTime,
      conversion_action: resourceName,
      conversion_value: conversionValue,
      currency_code: CURRENCY_CODE,
    };
  });

  const errors: UploadError[] = [];
  let successCount = 0;

  try {
    const response = await customer.conversionUploads.uploadCallConversions({
      customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID || '',
      conversions,
      partial_failure: true,
    } as any);

    const results: Array<{ received_call_start_date_time?: string }> =
      (response as any).results ?? [];
    const partialFailureError = (response as any).partial_failure_error;

    if (partialFailureError && partialFailureError.code) {
      // Extract error message
      const topMessage: string =
        partialFailureError.message ?? 'Rejected by Google Ads (partial failure)';

      for (let i = 0; i < unmatchedCalls.length; i++) {
        const result = results[i];
        // A successful result has a populated received_call_start_date_time
        if (result && result.received_call_start_date_time) {
          successCount++;
        } else {
          errors.push({
            callSid: unmatchedCalls[i].twilioCall.sid,
            callerNumber: unmatchedCalls[i].twilioCall.from,
            errorMessage: topMessage,
          });
        }
      }
    } else {
      // No partial failure — all succeeded
      successCount = unmatchedCalls.length;
    }
  } catch (error: any) {
    console.error('Google Ads upload failed:', error.message);
    for (const unmatched of unmatchedCalls) {
      errors.push({
        callSid: unmatched.twilioCall.sid,
        callerNumber: unmatched.twilioCall.from,
        errorMessage: error.message || 'Upload request failed',
      });
    }
  }

  return {
    platform: 'google_ads',
    totalAttempted: unmatchedCalls.length,
    successCount,
    failureCount: errors.length,
    errors,
  };
}
