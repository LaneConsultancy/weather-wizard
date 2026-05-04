/**
 * WhatConverts 30-day report — all leads (phone + form), grouped by source/medium.
 * One-off ad hoc script to compare against ad-report.ts.
 */

import { whatConvertsRequest, ACCOUNT_ID } from '../lib/whatconverts/client';

interface Lead {
  lead_id?: number;
  lead_type?: string;
  date_created?: string;
  caller_country?: string;
  caller_number?: string;
  destination_number?: string;
  duration?: string | number;
  source?: string;
  medium?: string;
  campaign?: string;
  landing_url?: string;
  gclid?: string;
  msclkid?: string;
  lead_status?: string;
  lead_quality?: string;
  quotable?: string;
  sales_value?: number | string | null;
  quote_value?: number | string | null;
  contact_name?: string;
  contact_company?: string;
  contact_email_address?: string;
  contact_phone_number?: string;
  notes?: string;
}

interface LeadsResponse {
  total_leads?: number;
  total_pages?: number;
  page_number?: number;
  leads_per_page?: number;
  leads?: Lead[];
}

async function fetchAllLeads(startDate: string, endDate: string): Promise<Lead[]> {
  const all: Lead[] = [];
  let page = 1;
  while (true) {
    const res = await whatConvertsRequest<LeadsResponse>('/leads', {
      account_id: ACCOUNT_ID,
      start_date: startDate,
      end_date: endDate,
      leads_per_page: '250',
      page_number: String(page),
    });
    const batch = res.leads ?? [];
    all.push(...batch);
    if (!res.total_pages || page >= res.total_pages || batch.length === 0) break;
    page++;
  }
  return all;
}

function bucket<T>(items: T[], keyFn: (t: T) => string): Map<string, T[]> {
  const m = new Map<string, T[]>();
  for (const it of items) {
    const k = keyFn(it) || '(none)';
    if (!m.has(k)) m.set(k, []);
    m.get(k)!.push(it);
  }
  return m;
}

async function main() {
  const start = process.argv[2] ?? '2026-04-01';
  const end = process.argv[3] ?? '2026-05-01';

  console.log(`\n=== WhatConverts 30-day Report: ${start} → ${end} ===\n`);
  console.log(`Account: ${ACCOUNT_ID}\n`);

  const leads = await fetchAllLeads(start, end);
  console.log(`TOTAL LEADS: ${leads.length}\n`);

  // By lead_type
  const byType = bucket(leads, (l) => l.lead_type ?? 'unknown');
  console.log('BY LEAD TYPE');
  for (const [k, v] of byType) console.log(`  ${k}: ${v.length}`);
  console.log('');

  // By source
  const bySource = bucket(leads, (l) => l.source ?? '(direct)');
  console.log('BY SOURCE');
  for (const [k, v] of [...bySource.entries()].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${k}: ${v.length}`);
  }
  console.log('');

  // By medium
  const byMedium = bucket(leads, (l) => l.medium ?? '(direct)');
  console.log('BY MEDIUM');
  for (const [k, v] of [...byMedium.entries()].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${k}: ${v.length}`);
  }
  console.log('');

  // Phone calls — duration breakdown
  const calls = leads.filter((l) => l.lead_type === 'phone_call');
  const callsOver10s = calls.filter((l) => Number(l.duration ?? 0) >= 10);
  const callsUnder10s = calls.filter((l) => Number(l.duration ?? 0) < 10);
  console.log('PHONE CALLS');
  console.log(`  Total: ${calls.length}`);
  console.log(`  ≥ 10s (qualifying): ${callsOver10s.length}`);
  console.log(`  < 10s (likely missed/wrong number): ${callsUnder10s.length}`);
  const uniqCallers = new Set(calls.map((c) => c.caller_number).filter(Boolean));
  console.log(`  Unique caller numbers: ${uniqCallers.size}`);
  console.log('');

  // Lead quality (if present)
  const byQuality = bucket(leads, (l) => l.lead_quality ?? '(unset)');
  console.log('BY LEAD QUALITY');
  for (const [k, v] of [...byQuality.entries()].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${k}: ${v.length}`);
  }
  console.log('');

  // Quotable
  const byQuotable = bucket(leads, (l) => l.quotable ?? '(unset)');
  console.log('QUOTABLE');
  for (const [k, v] of [...byQuotable.entries()].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${k}: ${v.length}`);
  }
  console.log('');

  // Sales / quote value totals
  const totalQuote = leads.reduce((s, l) => s + (Number(l.quote_value) || 0), 0);
  const totalSales = leads.reduce((s, l) => s + (Number(l.sales_value) || 0), 0);
  console.log('VALUE');
  console.log(`  Total quote value: £${totalQuote.toFixed(2)}`);
  console.log(`  Total sales value: £${totalSales.toFixed(2)}`);
  console.log('');

  // Sample print of up to 20 most recent leads
  console.log('SAMPLE — most recent up to 20 leads');
  for (const l of leads.slice(0, 20)) {
    const dur = l.lead_type === 'phone_call' ? ` ${l.duration}s` : '';
    console.log(
      `  ${l.date_created} | ${l.lead_type}${dur} | ${l.source}/${l.medium} | ${l.caller_number ?? l.contact_phone_number ?? '-'} | ${l.lead_quality ?? '-'} | ${l.quotable ?? '-'}`
    );
  }
}

main().catch((e) => {
  console.error('FATAL:', e instanceof Error ? e.message : e);
  process.exit(1);
});
