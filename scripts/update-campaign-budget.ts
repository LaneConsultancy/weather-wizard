/**
 * Update Campaign Budget
 *
 * Updates the budget for the "Top 5 Towns" (now Top 10 Towns) campaign
 * from £90/day to £100/day.
 *
 * Run with: npm run update-budget
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { getCustomer } from '../lib/google-ads/client';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Budget configuration
const BUDGET_ID = '15333042670'; // Top 5 Towns Budget ID
const NEW_BUDGET_MICROS = 100000000; // £100/day in micros

async function main() {
  console.log('🚀 Updating Campaign Budget');
  console.log('='.repeat(60));
  console.log(`\nTarget Budget ID: ${BUDGET_ID}`);
  console.log(`New Budget: £${NEW_BUDGET_MICROS / 1000000}/day`);
  console.log();

  try {
    const customer = getCustomer();

    // First, get current budget info
    const budgets = await customer.query(`
      SELECT
        campaign_budget.id,
        campaign_budget.name,
        campaign_budget.amount_micros,
        campaign_budget.resource_name
      FROM campaign_budget
      WHERE campaign_budget.id = ${BUDGET_ID}
    `);

    if (budgets.length === 0) {
      console.error('❌ Budget not found!');
      process.exit(1);
    }

    const budget = budgets[0] as any;
    const currentAmount = budget.campaign_budget.amount_micros / 1000000;
    const resourceName = budget.campaign_budget.resource_name;

    console.log(`📊 Current Budget: £${currentAmount}/day`);
    console.log(`   Resource Name: ${resourceName}`);
    console.log();

    // Update the budget
    await customer.mutateResources([
      {
        entity: 'campaign_budget',
        operation: 'update',
        resource: {
          resource_name: resourceName,
          amount_micros: NEW_BUDGET_MICROS,
        },
      },
    ]);

    console.log(`✅ Budget updated successfully!`);
    console.log(`   Old: £${currentAmount}/day → New: £${NEW_BUDGET_MICROS / 1000000}/day`);
    console.log();

  } catch (error: any) {
    console.error('❌ Error updating budget:');
    console.error(error.message);
    if (error.errors) {
      error.errors.forEach((err: any) => {
        console.error(`   ${err.message}`);
      });
    }
    process.exit(1);
  }
}

main();
