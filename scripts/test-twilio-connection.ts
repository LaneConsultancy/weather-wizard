/**
 * Test Twilio API Connection
 *
 * Verifies that:
 * 1. Twilio credentials are set in .env
 * 2. The API is reachable
 * 3. We can fetch call records
 * 4. The business phone number has recent calls
 *
 * Usage: npm run test-twilio
 */

import { twilioClient, BUSINESS_PHONE_NUMBER } from '../lib/twilio/client';

async function main() {
  console.log('Testing Twilio API Connection\n');
  console.log('='.repeat(60));

  try {
    // Test 1: Verify credentials by fetching account info
    console.log('\nStep 1: Verifying credentials...');
    const account = await twilioClient.api.accounts(process.env.TWILIO_ACCOUNT_SID!).fetch();
    console.log(`  Account SID:    ${account.sid}`);
    console.log(`  Account Name:   ${account.friendlyName}`);
    console.log(`  Account Status: ${account.status}`);

    // Test 2: Fetch last 5 calls to the business number
    console.log(`\nStep 2: Fetching recent calls to ${BUSINESS_PHONE_NUMBER}...`);
    const recentCalls = await twilioClient.calls.list({
      to: BUSINESS_PHONE_NUMBER,
      limit: 5,
    });

    if (recentCalls.length === 0) {
      console.log('  No calls found to this number.');
      console.log('  This could mean:');
      console.log('    - The number has not received calls recently');
      console.log('    - The number is not active on this Twilio account');
      console.log('    - The TWILIO_ACCOUNT_SID is for a different account');
    } else {
      console.log(`  Found ${recentCalls.length} recent call(s):\n`);
      for (const call of recentCalls) {
        console.log(`    ${call.startTime} | ${call.from} -> ${call.to}`);
        console.log(`      Direction: ${call.direction} | Duration: ${call.duration}s | Status: ${call.status}`);
        console.log(`      SID: ${call.sid}\n`);
      }
    }

    // Test 3: Count calls in the last 7 days
    console.log('Step 3: Call volume (last 7 days)...');
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weekCalls = await twilioClient.calls.list({
      to: BUSINESS_PHONE_NUMBER,
      startTimeAfter: sevenDaysAgo,
      limit: 1000,
    });

    const inboundCount = weekCalls.filter(c => c.direction === 'inbound').length;
    const completedCount = weekCalls.filter(c => c.status === 'completed').length;
    const avgDuration = weekCalls.length > 0
      ? Math.round(weekCalls.reduce((sum, c) => sum + parseInt(c.duration), 0) / weekCalls.length)
      : 0;

    console.log(`  Total calls (7 days): ${weekCalls.length}`);
    console.log(`  Inbound calls:        ${inboundCount}`);
    console.log(`  Completed calls:      ${completedCount}`);
    console.log(`  Average duration:     ${avgDuration}s`);

    console.log('\n' + '='.repeat(60));
    console.log('Twilio API connection is working correctly.');
    console.log('='.repeat(60) + '\n');

  } catch (error: any) {
    console.error('\n' + '='.repeat(60));
    console.error('Twilio API connection FAILED');
    console.error('='.repeat(60));
    console.error(`\nError: ${error.message}`);

    if (error.code === 20003) {
      console.error('\nAuthentication failed. Check:');
      console.error('  - TWILIO_ACCOUNT_SID is correct');
      console.error('  - TWILIO_AUTH_TOKEN is correct (not expired)');
    }

    process.exit(1);
  }
}

main();
