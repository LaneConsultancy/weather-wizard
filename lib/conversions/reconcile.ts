/**
 * Call Reconciliation Engine
 *
 * Matches Twilio inbound calls against WhatConverts phone call leads
 * to identify calls that were NOT tracked by WhatConverts (the "gap").
 *
 * Matching strategy:
 * 1. Normalise all phone numbers to E.164 (done upstream by each data source)
 * 2. Group WhatConverts leads by normalised caller number
 * 3. For each Twilio call, look for a WhatConverts lead with:
 *    - Same normalised caller number
 *    - Start time within +/- 5 minutes
 * 4. If matched: record as matched (with confidence level)
 * 5. If not matched: record as unmatched (candidate for offline conversion upload)
 *
 * Why +/- 5 minutes?
 *   Twilio records startTime as when the call enters the system (first ring).
 *   WhatConverts records lead creation time, which may be after the call
 *   connects or even after it ends. A 5-minute window accounts for this
 *   discrepancy while being tight enough to avoid false matches.
 *   (A single caller is unlikely to make two calls to the same number
 *   within 5 minutes.)
 */

import { phoneNumbersMatch } from './phone-utils';
import type { TwilioCall } from '../twilio/types';
import type { WhatConvertsLead } from '../whatconverts/types';
import type { ReconciliationResult, MatchedCall, UnmatchedCall } from './types';

/** Maximum time delta (in milliseconds) for a match */
const FUZZY_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

/** Time delta (in milliseconds) for an "exact" match */
const EXACT_WINDOW_MS = 30 * 1000; // 30 seconds

/**
 * Reconcile Twilio calls against WhatConverts leads.
 *
 * @param twilioCalls - All qualifying inbound Twilio calls for the date range
 * @param whatConvertsLeads - All WhatConverts phone call leads for the same date range
 * @returns ReconciliationResult with matched, unmatched, and summary statistics
 *
 * @example
 * ```typescript
 * const result = reconcileCalls(twilioCalls, whatConvertsLeads);
 * console.log(`Match rate: ${result.matchRate.toFixed(1)}%`);
 * console.log(`Unmatched calls to upload: ${result.unmatched.length}`);
 * ```
 */
export function reconcileCalls(
  twilioCalls: TwilioCall[],
  whatConvertsLeads: WhatConvertsLead[]
): ReconciliationResult {
  // Step 1: Index WhatConverts leads by caller number for O(1) lookup
  const leadsByCallerNumber = new Map<string, WhatConvertsLead[]>();

  for (const lead of whatConvertsLeads) {
    const key = lead.callerNumber;
    if (!leadsByCallerNumber.has(key)) {
      leadsByCallerNumber.set(key, []);
    }
    leadsByCallerNumber.get(key)!.push(lead);
  }

  const matched: MatchedCall[] = [];
  const unmatched: UnmatchedCall[] = [];

  // Track which WhatConverts leads have been matched to prevent double-matching.
  // A single WhatConverts lead should only match one Twilio call.
  const usedLeadIds = new Set<string>();

  // Step 2: For each Twilio call, attempt to find a matching WhatConverts lead
  for (const twilioCall of twilioCalls) {
    const candidateLeads = leadsByCallerNumber.get(twilioCall.from) ?? [];

    let bestMatch: { lead: WhatConvertsLead; timeDelta: number } | null = null;

    for (const lead of candidateLeads) {
      // Skip leads that have already been matched to another Twilio call
      if (usedLeadIds.has(lead.id)) continue;

      const timeDelta = Math.abs(
        twilioCall.startTime.getTime() - lead.createdAt.getTime()
      );

      // Must be within the fuzzy window
      if (timeDelta > FUZZY_WINDOW_MS) continue;

      // Pick the closest match (smallest time delta)
      if (!bestMatch || timeDelta < bestMatch.timeDelta) {
        bestMatch = { lead, timeDelta };
      }
    }

    if (bestMatch) {
      usedLeadIds.add(bestMatch.lead.id);

      matched.push({
        twilioCall,
        whatConvertsLead: bestMatch.lead,
        matchConfidence: bestMatch.timeDelta <= EXACT_WINDOW_MS ? 'exact' : 'fuzzy',
        timeDeltaSeconds: Math.round(bestMatch.timeDelta / 1000),
      });
    } else {
      unmatched.push({
        twilioCall,
        reason: 'no_whatconverts_match',
      });
    }
  }

  const totalTwilioCalls = twilioCalls.length;
  const matchRate = totalTwilioCalls > 0
    ? (matched.length / totalTwilioCalls) * 100
    : 0;

  return {
    dateRange: {
      start: twilioCalls.length > 0 ? twilioCalls[0].startTime : new Date(),
      end: twilioCalls.length > 0 ? twilioCalls[twilioCalls.length - 1].startTime : new Date(),
    },
    totalTwilioCalls,
    totalWhatConvertsLeads: whatConvertsLeads.length,
    matched,
    unmatched,
    matchRate,
  };
}
