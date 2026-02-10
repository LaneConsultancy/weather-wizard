/**
 * Fetch phone call leads from WhatConverts
 *
 * Uses the /leads endpoint with filters for date range and lead type.
 * Handles pagination (WhatConverts returns max 250 leads per page).
 *
 * API reference: https://www.whatconverts.com/api#leads
 */

import { whatConvertsRequest, ACCOUNT_ID } from './client';
import { normaliseToE164 } from '../conversions/phone-utils';
import type { WhatConvertsLead, WhatConvertsFilter } from './types';

/** WhatConverts API response shape for the /leads endpoint */
interface WhatConvertsLeadsResponse {
  leads: Array<{
    lead_id: number;
    lead_type: string;
    phone_number: string;       // Tracking number
    caller_number: string;      // Caller's real number
    duration: number;           // Seconds
    date_created: string;       // ISO 8601
    source: string;
    medium: string;
    campaign: string | null;
    landing_page: string | null;
    additional_fields?: Record<string, string>;
  }>;
  total_leads: number;
  leads_per_page: number;
  current_page: number;
  total_pages: number;
}

/**
 * Format a Date to YYYY-MM-DD string (WhatConverts expects this format).
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Fetch all phone call leads for the given date range.
 *
 * Automatically handles pagination. WhatConverts returns max 250 leads per page.
 *
 * @param filter - Date range and optional lead type filter
 * @returns Array of WhatConvertsLead objects
 *
 * @example
 * ```typescript
 * const leads = await fetchPhoneLeads({
 *   startDate: new Date('2026-02-09'),
 *   endDate: new Date('2026-02-09'),
 * });
 * console.log(`WhatConverts tracked ${leads.length} phone calls`);
 * ```
 */
export async function fetchPhoneLeads(filter: WhatConvertsFilter): Promise<WhatConvertsLead[]> {
  const leadType = filter.leadType ?? 'phone_call';
  const allLeads: WhatConvertsLead[] = [];
  let currentPage = 1;
  let totalPages = 1;

  do {
    const response = await whatConvertsRequest<WhatConvertsLeadsResponse>('/leads', {
      account_id: ACCOUNT_ID,
      lead_type: leadType,
      start_date: formatDate(filter.startDate),
      end_date: formatDate(filter.endDate),
      leads_per_page: '250',
      page_number: currentPage.toString(),
    });

    totalPages = response.total_pages;

    for (const raw of response.leads) {
      // Skip non-phone-call leads (defensive -- should be filtered by API)
      if (raw.lead_type !== 'phone_call') continue;

      allLeads.push({
        id: raw.lead_id.toString(),
        leadType: 'phone_call',
        trackingPhoneNumber: raw.phone_number,
        callerNumber: normaliseToE164(raw.caller_number),
        duration: raw.duration,
        createdAt: new Date(raw.date_created),
        source: raw.source,
        medium: raw.medium,
        campaign: raw.campaign || null,
        landingPage: raw.landing_page || null,
        gclid: raw.additional_fields?.gclid || null,
      });
    }

    currentPage++;
  } while (currentPage <= totalPages);

  return allLeads;
}
