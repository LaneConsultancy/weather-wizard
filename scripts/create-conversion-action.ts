/**
 * Create a Google Ads conversion action for form submissions
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { GoogleAdsApi, enums } from 'google-ads-api';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function main() {
  console.log('Creating Google Ads conversion action...\n');

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
    // Create the conversion action
    const response = await customer.conversionActions.create([
      {
        name: 'Form Submission - Quote Request',
        category: enums.ConversionActionCategory.SUBMIT_LEAD_FORM,
        type: enums.ConversionActionType.WEBPAGE,
        status: enums.ConversionActionStatus.ENABLED,
        counting_type: enums.ConversionActionCountingType.ONE_PER_CLICK,
        // Attribution settings
        attribution_model_settings: {
          attribution_model: enums.AttributionModel.GOOGLE_ADS_LAST_CLICK,
        },
        // Value settings (optional - can be set per conversion)
        value_settings: {
          default_value: 50, // Default lead value in GBP
          default_currency_code: 'GBP',
          always_use_default_value: false,
        },
        // View-through conversion window (1 day)
        view_through_lookback_window_days: 1,
        // Click-through conversion window (30 days)
        click_through_lookback_window_days: 30,
      },
    ]);

    const resourceName = response.results[0].resource_name;
    console.log('✅ Conversion action created!');
    console.log(`   Resource name: ${resourceName}`);

    // Now fetch the conversion action to get the tag snippets
    const conversionActions = await customer.query(`
      SELECT
        conversion_action.id,
        conversion_action.name,
        conversion_action.status,
        conversion_action.tag_snippets
      FROM conversion_action
      WHERE conversion_action.resource_name = '${resourceName}'
    `);

    if (conversionActions.length > 0) {
      const action = conversionActions[0].conversion_action;
      console.log(`\n   Conversion ID: ${action?.id}`);

      // The tag_snippets contain the conversion label
      if (action?.tag_snippets && action.tag_snippets.length > 0) {
        for (const snippet of action.tag_snippets) {
          if (snippet.type === enums.TrackingCodeType.WEBPAGE) {
            console.log(`\n   Event Snippet:`);
            console.log(snippet.event_snippet);
          }
        }
      }

      console.log('\n📋 Next steps:');
      console.log('   1. Find the conversion label in the event snippet above (format: AW-XXXXXXXXXX/XXXXXXXXXXXX)');
      console.log('   2. Add it to your .env file as NEXT_PUBLIC_GOOGLE_ADS_FORM_CONVERSION_LABEL');
      console.log('   3. Or copy just the label part after the "/" for use in the code');
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);

    if (error.errors) {
      console.error('\nAPI Errors:');
      for (const e of error.errors) {
        console.error(`   - ${e.message}`);
        if (e.error_code) {
          console.error(`     Code: ${JSON.stringify(e.error_code)}`);
        }
      }
    }
  }
}

main();
