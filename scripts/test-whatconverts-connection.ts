/**
 * Test WhatConverts API Connection
 *
 * Verifies that:
 * 1. WhatConverts credentials are set in .env
 * 2. The API is reachable
 * 3. We can fetch phone call leads
 * 4. Raw field names are printed for mapping verification
 *
 * Usage: npm run test-whatconverts
 */

import { whatConvertsRequest, ACCOUNT_ID } from '../lib/whatconverts/client';

async function main() {
  console.log('Testing WhatConverts API Connection\n');
  console.log('='.repeat(60));

  try {
    // Test 1: Fetch recent phone call leads
    console.log(`\nStep 1: Fetching recent phone call leads (Account: ${ACCOUNT_ID})...`);

    // Fetch leads from the last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const response = await whatConvertsRequest<any>('/leads', {
      account_id: ACCOUNT_ID,
      lead_type: 'phone_call',
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      leads_per_page: '5',
      page_number: '1',
    });

    console.log(`  Total phone call leads (7 days): ${response.total_leads ?? 'unknown'}`);
    console.log(`  Leads per page: ${response.leads_per_page ?? 'unknown'}`);
    console.log(`  Total pages: ${response.total_pages ?? 'unknown'}`);

    // Test 2: Print raw field names from first lead (for mapping verification)
    if (response.leads && response.leads.length > 0) {
      console.log(`\nStep 2: Raw API response fields (first lead):`);
      console.log('  ' + '-'.repeat(56));

      const firstLead = response.leads[0];
      for (const [key, value] of Object.entries(firstLead)) {
        const displayValue = typeof value === 'object'
          ? JSON.stringify(value)
          : String(value);
        console.log(`  ${key}: ${displayValue.substring(0, 80)}`);
      }

      console.log('\n  ' + '-'.repeat(56));
      console.log('  IMPORTANT: Verify these field names match the mapping in');
      console.log('  lib/whatconverts/leads.ts. If they differ, update the mapping.');

      // Test 3: Print all leads
      console.log(`\nStep 3: Recent phone call leads (up to 5):`);
      for (const lead of response.leads) {
        console.log(`\n    Lead #${lead.lead_id || lead.id || 'unknown'}`);
        console.log(`      Caller:   ${lead.caller_number || lead.callerNumber || 'N/A'}`);
        console.log(`      Tracking: ${lead.phone_number || lead.phoneNumber || 'N/A'}`);
        console.log(`      Duration: ${lead.duration || 'N/A'}s`);
        console.log(`      Created:  ${lead.date_created || lead.createdAt || 'N/A'}`);
        console.log(`      Source:   ${lead.source || 'N/A'}`);
        console.log(`      Medium:   ${lead.medium || 'N/A'}`);
      }
    } else {
      console.log('\n  No phone call leads found in the last 7 days.');
      console.log('  This may be normal if there have been no calls recently.');
    }

    console.log('\n' + '='.repeat(60));
    console.log('WhatConverts API connection is working correctly.');
    console.log('='.repeat(60) + '\n');

  } catch (error: any) {
    console.error('\n' + '='.repeat(60));
    console.error('WhatConverts API connection FAILED');
    console.error('='.repeat(60));
    console.error(`\nError: ${error.message}`);
    console.error('\nCheck:');
    console.error('  - WHATCONVERTS_API_TOKEN is correct');
    console.error('  - WHATCONVERTS_API_SECRET is correct');
    console.error(`  - WHATCONVERTS_ACCOUNT_ID (${ACCOUNT_ID}) is correct`);
    console.error('  - Your WhatConverts plan includes API access');
    process.exit(1);
  }
}

main();
