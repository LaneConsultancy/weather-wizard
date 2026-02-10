/**
 * Upload Offline Call Conversions to Google Ads
 *
 * Uses the Google Ads API v19 uploadCallConversions method.
 * This uploads phone calls that were not tracked by WhatConverts
 * (because the visitor rejected cookies) as offline conversions.
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
 *
 * References:
 * - https://developers.google.com/google-ads/api/docs/conversions/upload-calls
 * - Existing pattern: lib/google-ads/client.ts, scripts/create-conversion-action.ts
 */

import { GoogleAdsApi } from 'google-ads-api';
import * as dotenv from 'dotenv';
import * as path from 'path';
import type { UnmatchedCall, UploadResult, UploadError } from './types';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

/**
 * Get a fresh OAuth2 access token using the refresh token.
 * The google-ads-api package handles this internally for its own calls,
 * but we need a raw access token for direct REST API calls.
 */
async function getAccessToken(): Promise<string> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to get access token: ${response.status} ${body}`);
  }

  const data = await response.json();
  return data.access_token;
}

/** Default conversion value in GBP for each phone call */
const DEFAULT_CONVERSION_VALUE = 75;
const CURRENCY_CODE = 'GBP';

/** Max conversions per API request (Google Ads limit) */
const BATCH_SIZE = 2000;

/**
 * Format a Date to the Google Ads call conversion datetime format.
 * Required format: "yyyy-mm-dd hh:mm:ss+00:00" (UTC timezone)
 *
 * @param date - The date to format
 * @returns Formatted datetime string
 */
function formatCallDateTime(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}+00:00`;
}

/**
 * Upload unmatched Twilio calls as offline call conversions to Google Ads.
 *
 * @param unmatchedCalls - Calls that were not tracked by WhatConverts
 * @param conversionActionResourceName - Resource name of the offline call conversion action
 *   (e.g., "customers/6652965980/conversionActions/XXXXXXXXXX")
 *   Set this after running create-offline-conversion-action.ts
 * @param conversionValue - Value per conversion in GBP (default: 75)
 * @returns UploadResult with success/failure counts
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
      'or set GOOGLE_ADS_OFFLINE_CALL_CONVERSION_ACTION in .env. ' +
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

  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID!;
  const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID;
  const errors: UploadError[] = [];
  let successCount = 0;

  let accessToken: string;
  try {
    accessToken = await getAccessToken();
  } catch (error: any) {
    throw new Error(`Failed to authenticate with Google Ads API: ${error.message}`);
  }

  // Process in batches of BATCH_SIZE
  for (let i = 0; i < unmatchedCalls.length; i += BATCH_SIZE) {
    const batch = unmatchedCalls.slice(i, i + BATCH_SIZE);

    const conversions = batch.map((unmatched) => ({
      callerId: unmatched.twilioCall.from,
      callStartDateTime: formatCallDateTime(unmatched.twilioCall.startTime),
      conversionAction: resourceName,
      conversionValue: conversionValue,
      currencyCode: CURRENCY_CODE,
    }));

    try {
      // Use the Google Ads REST API directly for uploadCallConversions
      const endpoint = `https://googleads.googleapis.com/v19/customers/${customerId}:uploadCallConversions`;

      const headers: Record<string, string> = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
      };

      if (loginCustomerId) {
        headers['login-customer-id'] = loginCustomerId;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          conversions,
          partialFailure: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          `Google Ads API error: ${response.status} ${JSON.stringify(data)}`
        );
      }

      // Count successes and failures from the response
      if (data.partialFailureError) {
        const failedIndices = new Set<number>();

        for (const detail of data.partialFailureError.details || []) {
          const detailStr = JSON.stringify(detail);
          const match = detailStr.match(/operations\[(\d+)\]/);
          if (match) {
            failedIndices.add(parseInt(match[1], 10));
          }
        }

        for (let j = 0; j < batch.length; j++) {
          if (failedIndices.has(j)) {
            errors.push({
              callSid: batch[j].twilioCall.sid,
              callerNumber: batch[j].twilioCall.from,
              errorMessage: `Partial failure in batch (index ${j})`,
            });
          } else {
            successCount++;
          }
        }
      } else {
        // All conversions in this batch succeeded
        successCount += batch.length;
      }
    } catch (error: any) {
      // Entire batch failed -- record each call as an error
      console.error(`Google Ads upload batch failed:`, error.message);

      for (const unmatched of batch) {
        errors.push({
          callSid: unmatched.twilioCall.sid,
          callerNumber: unmatched.twilioCall.from,
          errorMessage: error.message,
        });
      }
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
