/**
 * Search Terms Report - Last 7 Days
 *
 * Queries the search_term_view resource to show all search terms
 * that triggered ads, grouped by campaign with metrics.
 *
 * Run with: npx tsx scripts/search-terms-report.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { getCustomer } from '../lib/google-ads/client';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

function formatCurrency(micros: number): string {
  return `£${(micros / 1000000).toFixed(2)}`;
}

function padRight(str: string, len: number): string {
  return str.length >= len ? str.substring(0, len) : str + ' '.repeat(len - str.length);
}

function padLeft(str: string, len: number): string {
  return str.length >= len ? str : ' '.repeat(len - str.length) + str;
}

interface SearchTermRow {
  searchTerm: string;
  campaignName: string;
  clicks: number;
  impressions: number;
  costMicros: number;
  conversions: number;
  ctr: number;
  date: string;
}

async function main() {
  console.log('='.repeat(100));
  console.log('  SEARCH TERMS REPORT - LAST 7 DAYS');
  console.log('='.repeat(100));
  console.log();

  try {
    const customer = getCustomer();

    const results = await customer.query(`
      SELECT
        search_term_view.search_term,
        campaign.name,
        metrics.clicks,
        metrics.impressions,
        metrics.cost_micros,
        metrics.conversions,
        metrics.ctr,
        segments.date
      FROM search_term_view
      WHERE segments.date DURING LAST_7_DAYS
        AND campaign.status = 'ENABLED'
      ORDER BY metrics.cost_micros DESC
    `);

    // Parse results into typed rows
    const rows: SearchTermRow[] = (results as any[]).map((row) => ({
      searchTerm: row.search_term_view?.search_term || row.searchTermView?.searchTerm || '',
      campaignName: row.campaign?.name || '',
      clicks: Number(row.metrics?.clicks || 0),
      impressions: Number(row.metrics?.impressions || 0),
      costMicros: Number(row.metrics?.cost_micros || row.metrics?.costMicros || 0),
      conversions: Number(row.metrics?.conversions || 0),
      ctr: Number(row.metrics?.ctr || 0),
      date: row.segments?.date || '',
    }));

    // Aggregate by search term + campaign (since we have daily rows)
    const aggregated = new Map<string, {
      searchTerm: string;
      campaignName: string;
      clicks: number;
      impressions: number;
      costMicros: number;
      conversions: number;
      dates: string[];
    }>();

    for (const row of rows) {
      const key = `${row.campaignName}|||${row.searchTerm}`;
      const existing = aggregated.get(key);
      if (existing) {
        existing.clicks += row.clicks;
        existing.impressions += row.impressions;
        existing.costMicros += row.costMicros;
        existing.conversions += row.conversions;
        existing.dates.push(row.date);
      } else {
        aggregated.set(key, {
          searchTerm: row.searchTerm,
          campaignName: row.campaignName,
          clicks: row.clicks,
          impressions: row.impressions,
          costMicros: row.costMicros,
          conversions: row.conversions,
          dates: [row.date],
        });
      }
    }

    // Sort by cost descending
    const sortedRows = Array.from(aggregated.values()).sort(
      (a, b) => b.costMicros - a.costMicros
    );

    // Overall totals
    let totalClicks = 0;
    let totalImpressions = 0;
    let totalCostMicros = 0;
    let totalConversions = 0;

    for (const row of sortedRows) {
      totalClicks += row.clicks;
      totalImpressions += row.impressions;
      totalCostMicros += row.costMicros;
      totalConversions += row.conversions;
    }

    console.log('SUMMARY');
    console.log('-'.repeat(100));
    console.log(`  Total unique search terms (by campaign): ${sortedRows.length}`);
    console.log(`  Total raw rows (daily):                  ${rows.length}`);
    console.log(`  Total Spend:                             ${formatCurrency(totalCostMicros)}`);
    console.log(`  Total Clicks:                            ${totalClicks}`);
    console.log(`  Total Impressions:                       ${totalImpressions}`);
    console.log(`  Total Conversions:                       ${totalConversions}`);
    console.log();

    // Group by campaign
    const campaigns = new Map<string, typeof sortedRows>();
    for (const row of sortedRows) {
      const existing = campaigns.get(row.campaignName) || [];
      existing.push(row);
      campaigns.set(row.campaignName, existing);
    }

    // Print table for each campaign
    for (const [campaignName, campaignRows] of campaigns) {
      let campSpend = 0;
      let campClicks = 0;
      let campImpressions = 0;
      let campConversions = 0;

      for (const row of campaignRows) {
        campSpend += row.costMicros;
        campClicks += row.clicks;
        campImpressions += row.impressions;
        campConversions += row.conversions;
      }

      console.log('='.repeat(100));
      console.log(`  CAMPAIGN: ${campaignName}`);
      console.log(`  Spend: ${formatCurrency(campSpend)} | Clicks: ${campClicks} | Impressions: ${campImpressions} | Conversions: ${campConversions}`);
      console.log('='.repeat(100));

      // Table header
      console.log(
        padRight('  Search Term', 55) +
        padLeft('Cost', 10) +
        padLeft('Clicks', 8) +
        padLeft('Impr', 8) +
        padLeft('CTR', 8) +
        padLeft('Conv', 7) +
        padLeft('Days', 5)
      );
      console.log('-'.repeat(100));

      for (const row of campaignRows) {
        const ctr = row.impressions > 0 ? ((row.clicks / row.impressions) * 100).toFixed(1) + '%' : '0.0%';
        console.log(
          padRight('  ' + row.searchTerm, 55) +
          padLeft(formatCurrency(row.costMicros), 10) +
          padLeft(String(row.clicks), 8) +
          padLeft(String(row.impressions), 8) +
          padLeft(ctr, 8) +
          padLeft(String(row.conversions), 7) +
          padLeft(String(row.dates.length), 5)
        );
      }
      console.log();
    }

    // High spend, zero conversions report
    console.log('='.repeat(100));
    console.log('  HIGH SPEND / ZERO CONVERSIONS (Top 20)');
    console.log('='.repeat(100));
    const zeroConvRows = sortedRows
      .filter((r) => r.conversions === 0 && r.costMicros > 0)
      .slice(0, 20);

    console.log(
      padRight('  Search Term', 50) +
      padLeft('Campaign', 35) +
      padLeft('Cost', 10) +
      padLeft('Clicks', 8)
    );
    console.log('-'.repeat(100));

    for (const row of zeroConvRows) {
      console.log(
        padRight('  ' + row.searchTerm, 50) +
        padLeft(row.campaignName, 35) +
        padLeft(formatCurrency(row.costMicros), 10) +
        padLeft(String(row.clicks), 8)
      );
    }

    // Wasted spend total
    let wastedSpend = 0;
    for (const row of sortedRows) {
      if (row.conversions === 0) {
        wastedSpend += row.costMicros;
      }
    }
    console.log();
    console.log(`  Total spend on terms with 0 conversions: ${formatCurrency(wastedSpend)}`);
    console.log(`  (out of ${formatCurrency(totalCostMicros)} total = ${totalCostMicros > 0 ? ((wastedSpend / totalCostMicros) * 100).toFixed(1) : 0}%)`);

    console.log();
    console.log('='.repeat(100));
    console.log('  REPORT COMPLETE');
    console.log('='.repeat(100));

  } catch (error: any) {
    console.error('Error generating search terms report:');
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
