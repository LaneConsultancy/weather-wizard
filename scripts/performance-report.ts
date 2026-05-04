/**
 * Performance Report - Account, Campaign, Ad Group, and Keyword Level
 *
 * Run with: npx tsx scripts/performance-report.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { getCustomer } from '../lib/google-ads/client';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

function formatCurrency(micros: number): string {
  return `£${(micros / 1000000).toFixed(2)}`;
}

function formatCostPerConversion(cost: number, conversions: number): string {
  if (conversions === 0) return 'N/A (no conversions)';
  return formatCurrency(cost / conversions);
}

async function main() {
  console.log('📊 Google Ads Performance Report');
  console.log('='.repeat(80));
  console.log();

  try {
    const customer = getCustomer();

    // =========================================================================
    // ACCOUNT LEVEL
    // =========================================================================
    console.log('🏢 ACCOUNT LEVEL METRICS');
    console.log('-'.repeat(80));

    const accountMetrics = await customer.query(`
      SELECT
        metrics.clicks,
        metrics.impressions,
        metrics.cost_micros,
        metrics.conversions,
        metrics.ctr,
        metrics.average_cpc
      FROM customer
    `);

    if (accountMetrics.length > 0) {
      const m = accountMetrics[0] as any;
      const totalSpend = m.metrics.cost_micros || 0;
      const conversions = m.metrics.conversions || 0;
      const clicks = m.metrics.clicks || 0;
      const impressions = m.metrics.impressions || 0;

      console.log(`   Total Spend:          ${formatCurrency(totalSpend)}`);
      console.log(`   Conversions:          ${conversions}`);
      console.log(`   Cost per Conversion:  ${formatCostPerConversion(totalSpend, conversions)}`);
      console.log(`   Clicks:               ${clicks}`);
      console.log(`   Impressions:          ${impressions}`);
      console.log(`   CTR:                  ${((m.metrics.ctr || 0) * 100).toFixed(2)}%`);
      console.log(`   Avg CPC:              ${formatCurrency(m.metrics.average_cpc || 0)}`);
    }
    console.log();

    // =========================================================================
    // CAMPAIGN LEVEL
    // =========================================================================
    console.log('📋 CAMPAIGN LEVEL METRICS');
    console.log('-'.repeat(80));

    const campaignMetrics = await customer.query(`
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        metrics.clicks,
        metrics.impressions,
        metrics.cost_micros,
        metrics.conversions,
        metrics.ctr,
        metrics.average_cpc
      FROM campaign
      WHERE campaign.status != 'REMOVED'
      ORDER BY metrics.cost_micros DESC
    `);

    for (const row of campaignMetrics as any[]) {
      const spend = row.metrics.cost_micros || 0;
      const conv = row.metrics.conversions || 0;
      const status = row.campaign.status === 2 ? '🟢' : row.campaign.status === 3 ? '⏸️' : '⚪';

      console.log(`\n   ${status} ${row.campaign.name} (ID: ${row.campaign.id})`);
      console.log(`      Spend:              ${formatCurrency(spend)}`);
      console.log(`      Conversions:        ${conv}`);
      console.log(`      Cost/Conversion:    ${formatCostPerConversion(spend, conv)}`);
      console.log(`      Clicks:             ${row.metrics.clicks || 0}`);
      console.log(`      Impressions:        ${row.metrics.impressions || 0}`);
      console.log(`      CTR:                ${((row.metrics.ctr || 0) * 100).toFixed(2)}%`);
      console.log(`      Avg CPC:            ${formatCurrency(row.metrics.average_cpc || 0)}`);
    }
    console.log();

    // =========================================================================
    // AD GROUP LEVEL
    // =========================================================================
    console.log('📁 AD GROUP LEVEL METRICS');
    console.log('-'.repeat(80));

    const adGroupMetrics = await customer.query(`
      SELECT
        campaign.name,
        ad_group.id,
        ad_group.name,
        ad_group.status,
        metrics.clicks,
        metrics.impressions,
        metrics.cost_micros,
        metrics.conversions,
        metrics.ctr,
        metrics.average_cpc
      FROM ad_group
      WHERE ad_group.status != 'REMOVED'
      ORDER BY campaign.name, metrics.cost_micros DESC
    `);

    let currentCampaign = '';
    for (const row of adGroupMetrics as any[]) {
      if (row.campaign.name !== currentCampaign) {
        currentCampaign = row.campaign.name;
        console.log(`\n   📋 ${currentCampaign}`);
      }

      const spend = row.metrics.cost_micros || 0;
      const conv = row.metrics.conversions || 0;
      const status = row.ad_group.status === 2 ? '🟢' : '⚪';

      console.log(`      ${status} ${row.ad_group.name}`);
      console.log(`         Spend: ${formatCurrency(spend)} | Conv: ${conv} | Cost/Conv: ${formatCostPerConversion(spend, conv)} | Clicks: ${row.metrics.clicks || 0} | CPC: ${formatCurrency(row.metrics.average_cpc || 0)}`);
    }
    console.log();

    // =========================================================================
    // KEYWORD LEVEL (Top 20 by spend)
    // =========================================================================
    console.log('🔑 KEYWORD LEVEL METRICS (Top 20 by Spend)');
    console.log('-'.repeat(80));

    const keywordMetrics = await customer.query(`
      SELECT
        campaign.name,
        ad_group.name,
        ad_group_criterion.keyword.text,
        ad_group_criterion.keyword.match_type,
        metrics.clicks,
        metrics.impressions,
        metrics.cost_micros,
        metrics.conversions,
        metrics.average_cpc
      FROM keyword_view
      WHERE ad_group_criterion.status != 'REMOVED'
        AND ad_group_criterion.negative = false
      ORDER BY metrics.cost_micros DESC
      LIMIT 20
    `);

    for (const row of keywordMetrics as any[]) {
      const spend = row.metrics.cost_micros || 0;
      const conv = row.metrics.conversions || 0;
      const matchType = row.ad_group_criterion.keyword.match_type === 3 ? 'PHRASE' :
                        row.ad_group_criterion.keyword.match_type === 2 ? 'EXACT' : 'BROAD';

      console.log(`\n   "${row.ad_group_criterion.keyword.text}" [${matchType}]`);
      console.log(`      Campaign: ${row.campaign.name} > ${row.ad_group.name}`);
      console.log(`      Spend: ${formatCurrency(spend)} | Conv: ${conv} | Cost/Conv: ${formatCostPerConversion(spend, conv)}`);
      console.log(`      Clicks: ${row.metrics.clicks || 0} | Impressions: ${row.metrics.impressions || 0} | CPC: ${formatCurrency(row.metrics.average_cpc || 0)}`);
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ Report Complete');
    console.log('='.repeat(80));

  } catch (error: any) {
    console.error('❌ Error generating report:');
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
