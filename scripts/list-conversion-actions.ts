/**
 * List all conversion actions in the Google Ads account.
 * Useful for verifying conversion setup.
 */
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import { GoogleAdsApi } from 'google-ads-api';

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
});

const customer = client.Customer({
  customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID!,
  login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID!,
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
});

async function main() {
  const rows: any = await customer.query(`
    SELECT
      conversion_action.id,
      conversion_action.name,
      conversion_action.resource_name,
      conversion_action.type,
      conversion_action.status,
      conversion_action.category,
      conversion_action.primary_for_goal,
      conversion_action.include_in_conversions_metric,
      conversion_action.counting_type,
      conversion_action.attribution_model_settings.attribution_model,
      conversion_action.value_settings.default_value,
      conversion_action.value_settings.always_use_default_value,
      conversion_action.click_through_lookback_window_days,
      conversion_action.view_through_lookback_window_days,
      conversion_action.app_id
    FROM conversion_action
    ORDER BY conversion_action.name
  `);

  console.log(`Found ${rows.length} conversion actions\n`);
  for (const r of rows) {
    const ca = r.conversion_action;
    console.log(`Name: ${ca.name}`);
    console.log(`  ID: ${ca.id}`);
    console.log(`  Resource: ${ca.resource_name}`);
    console.log(`  Type: ${ca.type} (numeric)`);
    console.log(`  Status: ${ca.status}`);
    console.log(`  Category: ${ca.category}`);
    console.log(`  Primary for goal: ${ca.primary_for_goal}`);
    console.log(`  Include in conversions: ${ca.include_in_conversions_metric}`);
    console.log(`  Counting: ${ca.counting_type}`);
    console.log(`  Default value: ${ca.value_settings?.default_value} (always: ${ca.value_settings?.always_use_default_value})`);
    console.log(`  Click lookback: ${ca.click_through_lookback_window_days}d`);
    console.log('');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
