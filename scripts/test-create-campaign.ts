/**
 * Test campaign creation after EU political ads declaration
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { GoogleAdsApi, enums } from 'google-ads-api';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function main() {
  console.log('Testing campaign creation...\n');

  const client = new GoogleAdsApi({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  });

  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID!;

  const customer = client.Customer({
    customer_id: customerId,
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
    login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
  });

  try {
    const timestamp = Date.now();

    // Use existing budget
    const budgetResourceName = `customers/${customerId}/campaignBudgets/15323155910`;
    console.log(`Using existing budget: ${budgetResourceName}`);

    // Create campaign
    console.log('\nCreating campaign...');

    const campaignResponse = await customer.mutateResources([
      {
        entity: 'campaign',
        operation: 'create',
        resource: {
          name: `Weather Wizard Test ${timestamp}`,
          status: enums.CampaignStatus.PAUSED,
          advertising_channel_type: enums.AdvertisingChannelType.SEARCH,
          campaign_budget: budgetResourceName,
          manual_cpc: {
            enhanced_cpc_enabled: false,
          },
          network_settings: {
            target_google_search: true,
            target_search_network: false,
            target_content_network: false,
            target_partner_search_network: false,
          },
          // EU Political Advertising declaration - try snake_case
          contains_eu_political_advertising: 2, // 2 = DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING
        },
      },
    ]);

    const campaignResult = (campaignResponse as any).mutate_operation_responses?.[0]?.campaign_result;
    const campaignResourceName = campaignResult?.resource_name;
    console.log(`✅ Campaign created: ${campaignResourceName}`);

    if (campaignResourceName) {
      // Create ad group
      console.log('\nCreating ad group...');

      const adGroupResponse = await customer.mutateResources([
        {
          entity: 'ad_group',
          operation: 'create',
          resource: {
            name: `Test Ad Group ${timestamp}`,
            campaign: campaignResourceName,
            status: enums.AdGroupStatus.PAUSED,
            type: enums.AdGroupType.SEARCH_STANDARD,
            cpc_bid_micros: 2000000,
          },
        },
      ]);

      const adGroupResult = (adGroupResponse as any).mutate_operation_responses?.[0]?.ad_group_result;
      console.log(`✅ Ad group created: ${adGroupResult?.resource_name}`);
    }

    console.log('\n✅ SUCCESS! Campaign creation works via API.');
    console.log('   The account-level EU declaration fixed the issue.');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);

    if (error.errors) {
      console.error('\nAPI Errors:');
      for (let i = 0; i < error.errors.length; i++) {
        const e = error.errors[i];
        console.error(`   ${i + 1}. ${e.message}`);
        if (e.error_code) {
          console.error(`      Code: ${JSON.stringify(e.error_code)}`);
        }
        if (e.location) {
          console.error(`      Location: ${JSON.stringify(e.location)}`);
        }
      }
    }
    console.error('\nFull error:', JSON.stringify(error, null, 2));
  }
}

main();
