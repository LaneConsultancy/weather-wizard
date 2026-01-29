/**
 * List existing campaign budgets
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { GoogleAdsApi } from 'google-ads-api';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function main() {
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
    const budgets = await customer.query(`
      SELECT
        campaign_budget.id,
        campaign_budget.name,
        campaign_budget.amount_micros,
        campaign_budget.status
      FROM campaign_budget
    `);

    console.log('Existing budgets:');
    if (budgets.length === 0) {
      console.log('  No budgets found');
    } else {
      budgets.forEach((b: any) => {
        console.log(`  - ${b.campaign_budget.name} (ID: ${b.campaign_budget.id}, Amount: £${b.campaign_budget.amount_micros / 1000000}/day)`);
      });
    }
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

main();
