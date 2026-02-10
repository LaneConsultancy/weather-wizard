import type { TwilioCall } from '../twilio/types';
import type { WhatConvertsLead } from '../whatconverts/types';

/**
 * The full result of reconciling Twilio calls against WhatConverts leads.
 */
export interface ReconciliationResult {
  /** The date range that was reconciled */
  dateRange: {
    start: Date;
    end: Date;
  };

  /** Total number of qualifying inbound Twilio calls in the date range */
  totalTwilioCalls: number;

  /** Total number of WhatConverts phone call leads in the date range */
  totalWhatConvertsLeads: number;

  /** Calls that were found in both Twilio and WhatConverts */
  matched: MatchedCall[];

  /** Calls that were in Twilio but NOT in WhatConverts (the "gap" calls) */
  unmatched: UnmatchedCall[];

  /**
   * Percentage of Twilio calls that matched a WhatConverts lead.
   * Formula: (matched.length / totalTwilioCalls) * 100
   * A low match rate (< 60%) suggests WhatConverts is working correctly
   * and the unmatched calls are genuinely from consent-denied visitors.
   * A very high match rate (> 95%) suggests almost all calls are tracked
   * and there may be few offline conversions to upload.
   */
  matchRate: number;
}

/**
 * A Twilio call that was successfully matched to a WhatConverts lead.
 */
export interface MatchedCall {
  /** The Twilio call record */
  twilioCall: TwilioCall;

  /** The matching WhatConverts lead */
  whatConvertsLead: WhatConvertsLead;

  /**
   * How confident we are in the match:
   * - "exact": same caller number AND startTime within +/- 30 seconds
   * - "fuzzy": same caller number AND startTime within +/- 5 minutes
   *
   * Fuzzy matches can occur because Twilio records the time the call
   * started ringing, while WhatConverts may record the time the call
   * was connected or the lead was created (slight delay).
   */
  matchConfidence: 'exact' | 'fuzzy';

  /** Time difference in seconds between the two records */
  timeDeltaSeconds: number;
}

/**
 * A Twilio call that was NOT found in WhatConverts.
 * These are the calls that need to be uploaded as offline conversions.
 */
export interface UnmatchedCall {
  /** The Twilio call record */
  twilioCall: TwilioCall;

  /** Why this call is unmatched */
  reason: 'no_whatconverts_match';
}

/**
 * Result of uploading offline conversions to an ad platform.
 */
export interface UploadResult {
  /** Which platform was uploaded to */
  platform: 'google_ads' | 'bing_ads';

  /** Total number of conversions attempted */
  totalAttempted: number;

  /** Number of conversions successfully uploaded */
  successCount: number;

  /** Number of conversions that failed to upload */
  failureCount: number;

  /** Error details for any failed uploads */
  errors: UploadError[];
}

/**
 * Details about a single failed upload.
 */
export interface UploadError {
  /** The Twilio call SID that failed */
  callSid: string;

  /** The caller's phone number */
  callerNumber: string;

  /** Error message from the API */
  errorMessage: string;

  /** Error code from the API (if available) */
  errorCode?: string;
}
