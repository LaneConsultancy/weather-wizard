/**
 * Create a Google Ads Offline Call Conversion Action
 *
 * This is a ONE-TIME setup script. Run it once, then save the output
 * resource name to your .env file.
 *
 * Usage: npm run create-offline-conversion-action
 *
 * What it creates:
 * - Conversion action named "Offline Phone Call (Twilio)"
 * - Type: UPLOAD_CALLS (for offline call conversion import)
 * - Category: PHONE_CALL_LEAD
 * - Default value: 75 GBP
 * - Counting: ONE_PER_CLICK (one conversion per unique caller per day)
 * - Attribution: Google Ads Last Click
 * - Click-through window: 30 days
 *
 * After running:
 * 1. Copy the resource name from the output
 * 2. Add to .env: GOOGLE_ADS_OFFLINE_CALL_CONVERSION_ACTION=customers/6652965980/conversionActions/XXXXXXXXXX
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { GoogleAdsApi, enums } from 'google-ads-api';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function main() {
  console.log('Creating Google Ads Offline Call Conversion Action...\n');

  const client = new GoogleAdsApi({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  });

  const customer = client.Customer({
    customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID!,
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
    login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
  });

  try {
    const response = await customer.conversionActions.create([
      {
        name: 'Offline Phone Call (Twilio)',
        category: enums.ConversionActionCategory.PHONE_CALL_LEAD,
        type: enums.ConversionActionType.UPLOAD_CALLS,
        status: enums.ConversionActionStatus.ENABLED,
        counting_type: enums.ConversionActionCountingType.ONE_PER_CLICK,
        attribution_model_settings: {
          attribution_model: enums.AttributionModel.GOOGLE_ADS_LAST_CLICK,
        },
        value_settings: {
          default_value: 75,
          default_currency_code: 'GBP',
          always_use_default_value: true,
        },
        // 30-day click-through window
        click_through_lookback_window_days: 30,
        // 1-day view-through window
        view_through_lookback_window_days: 1,
      },
    ]);

    const resourceName = response.results[0].resource_name;

    console.log('Conversion action created successfully!\n');
    console.log(`  Name:          Offline Phone Call (Twilio)`);
    console.log(`  Type:          UPLOAD_CALLS`);
    console.log(`  Value:         75 GBP`);
    console.log(`  Resource Name: ${resourceName}`);
    console.log(`\nNext steps:`);
    console.log(`  1. Add this to your .env file:`);
    console.log(`     GOOGLE_ADS_OFFLINE_CALL_CONVERSION_ACTION=${resourceName}`);
    console.log(`  2. Run: npm run upload-offline-conversions -- --dry-run`);

  } catch (error: any) {
    console.error('Error creating conversion action:', error.message);

    if (error.errors) {
      for (const e of error.errors) {
        console.error(`  - ${e.message}`);
        if (e.error_code) {
          console.error(`    Code: ${JSON.stringify(e.error_code)}`);
        }
      }
    }

    // Check for common issues
    if (error.message?.includes('DUPLICATE_NAME')) {
      console.error(
        '\nA conversion action with this name already exists.\n' +
        'To find the existing resource name, run:\n' +
        '  npx tsx -e "' +
        "import {getCustomer} from './lib/google-ads/client';" +
        "getCustomer().query(`SELECT conversion_action.resource_name, conversion_action.name " +
        "FROM conversion_action WHERE conversion_action.name = 'Offline Phone Call (Twilio)'`)" +
        '.then(r => console.log(r))"'
      );
    }

    process.exit(1);
  }
}

main();
