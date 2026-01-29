/**
 * Google Ads API Test Script
 *
 * This script verifies that the Google Ads API connection is working correctly
 * by listing accessible customers, campaigns, and showing an account overview.
 *
 * Run with: npm run test-google-ads
 */

import { getClient, getCustomer, accountConfig } from '../lib/google-ads/client';
import { listCampaigns } from '../lib/google-ads/campaigns';
import { getAccountOverview, DateRanges } from '../lib/google-ads/reporting';

// Formatting helpers
function formatCurrency(micros: string): string {
  return `£${(parseInt(micros) / 1_000_000).toFixed(2)}`;
}

function formatNumber(num: string | number): string {
  return parseInt(num.toString()).toLocaleString();
}

async function testGoogleAdsConnection() {
  console.log('🧪 Testing Google Ads API Connection\n');
  console.log('=' .repeat(60));

  try {
    // Test 1: List accessible customers
    console.log('\n📋 Step 1: Listing Accessible Customers');
    console.log('-'.repeat(60));

    const client = getClient();
    const customersResponse = await client.listAccessibleCustomers(accountConfig.refreshToken);
    const customers = customersResponse.resource_names || [];

    console.log(`✅ Found ${customers.length} accessible customer(s):`);
    customers.forEach((resourceName: string, index: number) => {
      // Extract customer ID from resource name (format: customers/1234567890)
      const customerId = resourceName.split('/')[1];
      const isActive = customerId === accountConfig.customerId;
      console.log(`   ${index + 1}. ${customerId}${isActive ? ' (Active Account ⭐)' : ''}`);
    });

    // Test 2: List campaigns
    console.log('\n📋 Step 2: Listing Campaigns');
    console.log('-'.repeat(60));

    const campaigns = await listCampaigns();

    if (campaigns.length === 0) {
      console.log('ℹ️  No campaigns found in this account.');
    } else {
      console.log(`✅ Found ${campaigns.length} campaign(s):\n`);

      campaigns.forEach((campaign, index) => {
        console.log(`   ${index + 1}. ${campaign.name}`);
        console.log(`      ID: ${campaign.id}`);
        console.log(`      Status: ${campaign.status}`);
        console.log(`      Type: ${campaign.advertisingChannelType}`);
        console.log(`      Budget: ${formatCurrency(campaign.budget.amountMicros)}/day`);

        if (campaign.metrics) {
          console.log(`      Impressions: ${formatNumber(campaign.metrics.impressions)}`);
          console.log(`      Clicks: ${formatNumber(campaign.metrics.clicks)}`);
          console.log(`      Cost: ${formatCurrency(campaign.metrics.cost)}`);
          console.log(`      Conversions: ${campaign.metrics.conversions}`);
        }
        console.log('');
      });
    }

    // Test 3: Get account overview for last 30 days
    console.log('📊 Step 3: Account Overview (Last 30 Days)');
    console.log('-'.repeat(60));

    const dateRange = DateRanges.last30Days();
    console.log(`Period: ${dateRange.startDate} to ${dateRange.endDate}\n`);

    const overview = await getAccountOverview(dateRange);

    console.log('📈 Account Performance:');
    console.log(`   Total Impressions: ${formatNumber(overview.totalImpressions)}`);
    console.log(`   Total Clicks: ${formatNumber(overview.totalClicks)}`);
    console.log(`   Total Cost: £${overview.totalCost}`);
    console.log(`   Total Conversions: ${overview.totalConversions}`);
    console.log(`   Average CTR: ${overview.averageCtr}%`);
    console.log(`   Average CPC: £${overview.averageCpc.toFixed(2)}`);
    if (overview.averageCostPerConversion > 0) {
      console.log(`   Cost per Conversion: £${overview.averageCostPerConversion.toFixed(2)}`);
    }
    console.log(`   Active Campaigns: ${overview.activeCampaigns}`);

    if (overview.campaigns.length > 0) {
      console.log('\n📊 Campaign Breakdown:');
      overview.campaigns
        .sort((a, b) => parseInt(b.impressions) - parseInt(a.impressions))
        .forEach((campaign, index) => {
          console.log(`\n   ${index + 1}. ${campaign.campaignName}`);
          console.log(`      Impressions: ${formatNumber(campaign.impressions)}`);
          console.log(`      Clicks: ${formatNumber(campaign.clicks)}`);
          console.log(`      Cost: £${campaign.cost}`);
          console.log(`      Conversions: ${campaign.conversions}`);
          console.log(`      CTR: ${campaign.ctr}%`);
          console.log(`      CPC: £${campaign.averageCpc.toFixed(2)}`);
        });
    }

    // Success summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests passed successfully!');
    console.log('='.repeat(60));
    console.log('\n📌 Account Details:');
    console.log(`   Customer ID: ${accountConfig.customerId}`);
    console.log(`   Login Customer ID: ${accountConfig.loginCustomerId}`);
    console.log('\n✨ Google Ads API is configured correctly and ready to use.\n');

  } catch (error: any) {
    console.error('\n' + '='.repeat(60));
    console.error('❌ Error occurred during testing:');
    console.error('='.repeat(60));

    if (error.errors && Array.isArray(error.errors)) {
      // Google Ads API specific errors
      error.errors.forEach((err: any) => {
        console.error(`\n🔴 ${err.error_code?.authorization_error || err.error_code?.request_error || 'Unknown Error'}`);
        console.error(`   Message: ${err.message}`);
        if (err.location) {
          console.error(`   Location: ${err.location.field_path_elements?.map((e: any) => e.field_name).join('.') || 'N/A'}`);
        }
      });
    } else {
      console.error(`\n${error.message}`);
      if (error.stack) {
        console.error(`\nStack trace:\n${error.stack}`);
      }
    }

    console.error('\n💡 Common issues:');
    console.error('   - Check that all environment variables are set correctly in .env');
    console.error('   - Verify the refresh token has not expired');
    console.error('   - Ensure the developer token is approved (if required)');
    console.error('   - Check that the customer ID has access to the account');
    console.error('   - Verify the MCC (login customer ID) manages the target account\n');

    process.exit(1);
  }
}

// Run the test
testGoogleAdsConnection();
