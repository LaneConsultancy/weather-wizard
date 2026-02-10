/**
 * Fetch inbound call records from Twilio
 *
 * Retrieves all inbound calls to the Weather Wizard business number
 * for a given date range, with optional duration filtering.
 *
 * Twilio pagination: The SDK handles pagination automatically when using
 * `.list()` with a `limit` parameter. For large date ranges, consider
 * using `.each()` for streaming, but `.list()` is fine for daily runs
 * (typical volume: < 50 calls/day).
 */

import { twilioClient, BUSINESS_PHONE_NUMBER } from './client';
import { normaliseToE164 } from '../conversions/phone-utils';
import type { TwilioCall, TwilioCallFilter } from './types';

/** Default minimum call duration in seconds */
const DEFAULT_MIN_DURATION = 60;

/**
 * Fetch all inbound calls matching the given filter criteria.
 *
 * @param filter - Date range and optional filtering parameters
 * @returns Array of TwilioCall objects, sorted by startTime ascending
 *
 * @example
 * ```typescript
 * const yesterday = new Date();
 * yesterday.setDate(yesterday.getDate() - 1);
 * const today = new Date();
 *
 * const calls = await fetchInboundCalls({
 *   startDate: yesterday,
 *   endDate: today,
 *   minDuration: 60,
 * });
 * console.log(`Found ${calls.length} qualifying inbound calls`);
 * ```
 */
export async function fetchInboundCalls(filter: TwilioCallFilter): Promise<TwilioCall[]> {
  const minDuration = filter.minDuration ?? DEFAULT_MIN_DURATION;
  const toNumber = filter.to ?? BUSINESS_PHONE_NUMBER;

  // Twilio's date filters use startTime (when the call started ringing)
  // startTimeAfter and startTimeBefore are inclusive
  const rawCalls = await twilioClient.calls.list({
    to: toNumber,
    startTimeAfter: filter.startDate,
    startTimeBefore: filter.endDate,
    // Twilio default limit is 50. Set higher for daily runs.
    // For a roofing company, 1000/day is extremely unlikely.
    limit: 1000,
  });

  const calls: TwilioCall[] = [];

  for (const raw of rawCalls) {
    // Only include inbound calls that were actually answered
    if (raw.direction !== 'inbound') continue;
    if (raw.status !== 'completed') continue;

    const duration = parseInt(raw.duration, 10);
    if (isNaN(duration) || duration < minDuration) continue;

    calls.push({
      sid: raw.sid,
      from: normaliseToE164(raw.from),
      to: normaliseToE164(raw.to),
      direction: 'inbound',
      duration,
      startTime: new Date(raw.startTime),
      endTime: new Date(raw.endTime),
      status: raw.status as TwilioCall['status'],
    });
  }

  // Sort ascending by start time for deterministic processing
  calls.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  return calls;
}
