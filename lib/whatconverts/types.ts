/**
 * A phone call lead as returned by the WhatConverts API.
 *
 * WhatConverts API docs: https://www.whatconverts.com/api
 * Endpoint: GET /v1/leads
 */
export interface WhatConvertsLead {
  /** WhatConverts internal lead ID */
  id: string;

  /** Lead type -- we only care about "phone_call" */
  leadType: 'phone_call' | 'form_fill' | 'chat' | 'transaction' | 'custom';

  /**
   * The tracking number that was displayed to the visitor (DNI pool number).
   * This is the WhatConverts-managed number, NOT the real business number.
   */
  trackingPhoneNumber: string;

  /**
   * The caller's actual phone number.
   * May be in various formats depending on carrier -- normalise before matching.
   */
  callerNumber: string;

  /** Call duration in seconds */
  duration: number;

  /** When the lead was created (ISO 8601 string from API, parsed to Date) */
  createdAt: Date;

  /** Traffic source (e.g., "Google Ads", "Organic", "Direct") */
  source: string;

  /** Traffic medium (e.g., "cpc", "organic", "referral") */
  medium: string;

  /** Campaign name if available */
  campaign: string | null;

  /** Landing page URL */
  landingPage: string | null;

  /** Google Click ID if captured by WhatConverts */
  gclid: string | null;
}

/**
 * Filter parameters for fetching WhatConverts leads.
 */
export interface WhatConvertsFilter {
  /** Start of date range (inclusive) */
  startDate: Date;

  /** End of date range (inclusive) */
  endDate: Date;

  /** Filter by lead type. Default: "phone_call" */
  leadType?: string;
}
