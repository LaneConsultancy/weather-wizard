/**
 * Represents a single phone call record from the Twilio API.
 *
 * Twilio returns duration as a string (seconds). We parse it to number
 * in call-logs.ts but the raw API type uses string.
 */
export interface TwilioCall {
  /** Twilio's unique identifier for this call (e.g., "CAxxxxxxxx") */
  sid: string;

  /** Caller's phone number in E.164 format (e.g., "+447700900123") */
  from: string;

  /** Destination number in E.164 format (always "+448003162922" for our use case) */
  to: string;

  /** Call direction as reported by Twilio */
  direction: 'inbound' | 'outbound-api' | 'outbound-dial';

  /** Call duration in seconds (parsed from Twilio's string response) */
  duration: number;

  /** When the call started ringing */
  startTime: Date;

  /** When the call ended */
  endTime: Date;

  /** Twilio call status */
  status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'busy' | 'failed' | 'no-answer' | 'canceled';
}

/**
 * Filter parameters for fetching Twilio call logs.
 */
export interface TwilioCallFilter {
  /** Start of date range (inclusive). Calls with startTime >= this value. */
  startDate: Date;

  /** End of date range (inclusive). Calls with startTime <= this value. */
  endDate: Date;

  /** Filter by destination number. Defaults to "+448003162922" in call-logs.ts. */
  to?: string;

  /**
   * Minimum call duration in seconds. Calls shorter than this are excluded.
   * Default: 60 seconds (filters out accidental dials, voicemail hangups, etc.)
   *
   * Rationale: A call under 60 seconds is unlikely to be a genuine enquiry.
   * Google Ads also uses a 60-second default for phone call conversions.
   */
  minDuration?: number;
}
