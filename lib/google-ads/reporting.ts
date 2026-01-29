/**
 * Reporting and Analytics Utilities
 *
 * Functions for retrieving performance metrics and generating reports
 */

import { Customer } from 'google-ads-api';
import { getCustomer } from './client';

export interface DateRange {
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
}

export interface CampaignPerformance {
  campaignId: string;
  campaignName: string;
  impressions: string;
  clicks: string;
  cost: string;
  conversions: string;
  ctr: number; // Click-through rate (percentage)
  averageCpc: number; // Average cost per click (in currency units)
  costPerConversion: number; // Cost per conversion (in currency units)
  conversionRate: number; // Conversion rate (percentage)
}

export interface AccountOverview {
  totalImpressions: string;
  totalClicks: string;
  totalCost: string;
  totalConversions: string;
  averageCtr: number;
  averageCpc: number;
  averageCostPerConversion: number;
  activeCampaigns: number;
  campaigns: CampaignPerformance[];
}

/**
 * Get performance metrics for a specific campaign
 */
export async function getCampaignPerformance(
  campaignId: string,
  dateRange: DateRange,
  customer?: Customer
): Promise<CampaignPerformance | null> {
  const c = customer || getCustomer();

  const query = `
    SELECT
      campaign.id,
      campaign.name,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions,
      metrics.ctr,
      metrics.average_cpc
    FROM campaign
    WHERE campaign.id = ${campaignId}
      AND segments.date BETWEEN '${dateRange.startDate}' AND '${dateRange.endDate}'
  `;

  try {
    const results = await c.query(query);

    if (results.length === 0) {
      return null;
    }

    // Aggregate metrics across all rows (one per day)
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalCostMicros = 0;
    let totalConversions = 0;

    let campaignName = '';

    results.forEach((row: any) => {
      campaignName = row.campaign.name;
      totalImpressions += parseInt(row.metrics.impressions || '0');
      totalClicks += parseInt(row.metrics.clicks || '0');
      totalCostMicros += parseInt(row.metrics.cost_micros || '0');
      totalConversions += parseFloat(row.metrics.conversions || '0');
    });

    const totalCost = totalCostMicros / 1_000_000; // Convert micros to currency units
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const averageCpc = totalClicks > 0 ? totalCost / totalClicks : 0;
    const costPerConversion = totalConversions > 0 ? totalCost / totalConversions : 0;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    return {
      campaignId,
      campaignName,
      impressions: totalImpressions.toString(),
      clicks: totalClicks.toString(),
      cost: totalCost.toFixed(2),
      conversions: totalConversions.toFixed(2),
      ctr: parseFloat(ctr.toFixed(2)),
      averageCpc: parseFloat(averageCpc.toFixed(2)),
      costPerConversion: parseFloat(costPerConversion.toFixed(2)),
      conversionRate: parseFloat(conversionRate.toFixed(2)),
    };
  } catch (error) {
    console.error(`Error getting campaign performance for ${campaignId}:`, error);
    throw error;
  }
}

/**
 * Get account-wide performance overview
 */
export async function getAccountOverview(
  dateRange: DateRange,
  customer?: Customer
): Promise<AccountOverview> {
  const c = customer || getCustomer();

  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions
    FROM campaign
    WHERE campaign.status != 'REMOVED'
      AND segments.date BETWEEN '${dateRange.startDate}' AND '${dateRange.endDate}'
  `;

  try {
    const results = await c.query(query);

    // Group results by campaign
    const campaignMap = new Map<string, any>();

    results.forEach((row: any) => {
      const campaignId = row.campaign.id.toString();

      if (!campaignMap.has(campaignId)) {
        campaignMap.set(campaignId, {
          campaignId,
          campaignName: row.campaign.name,
          status: row.campaign.status,
          impressions: 0,
          clicks: 0,
          costMicros: 0,
          conversions: 0,
        });
      }

      const campaign = campaignMap.get(campaignId);
      campaign.impressions += parseInt(row.metrics.impressions || '0');
      campaign.clicks += parseInt(row.metrics.clicks || '0');
      campaign.costMicros += parseInt(row.metrics.cost_micros || '0');
      campaign.conversions += parseFloat(row.metrics.conversions || '0');
    });

    // Calculate aggregates
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalCostMicros = 0;
    let totalConversions = 0;
    let activeCampaigns = 0;

    const campaigns: CampaignPerformance[] = Array.from(campaignMap.values()).map((campaign) => {
      const cost = campaign.costMicros / 1_000_000;
      const ctr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions) * 100 : 0;
      const averageCpc = campaign.clicks > 0 ? cost / campaign.clicks : 0;
      const costPerConversion = campaign.conversions > 0 ? cost / campaign.conversions : 0;
      const conversionRate = campaign.clicks > 0 ? (campaign.conversions / campaign.clicks) * 100 : 0;

      totalImpressions += campaign.impressions;
      totalClicks += campaign.clicks;
      totalCostMicros += campaign.costMicros;
      totalConversions += campaign.conversions;

      if (campaign.status === 'ENABLED') {
        activeCampaigns++;
      }

      return {
        campaignId: campaign.campaignId,
        campaignName: campaign.campaignName,
        impressions: campaign.impressions.toString(),
        clicks: campaign.clicks.toString(),
        cost: cost.toFixed(2),
        conversions: campaign.conversions.toFixed(2),
        ctr: parseFloat(ctr.toFixed(2)),
        averageCpc: parseFloat(averageCpc.toFixed(2)),
        costPerConversion: parseFloat(costPerConversion.toFixed(2)),
        conversionRate: parseFloat(conversionRate.toFixed(2)),
      };
    });

    const totalCost = totalCostMicros / 1_000_000;
    const averageCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const averageCpc = totalClicks > 0 ? totalCost / totalClicks : 0;
    const averageCostPerConversion = totalConversions > 0 ? totalCost / totalConversions : 0;

    return {
      totalImpressions: totalImpressions.toString(),
      totalClicks: totalClicks.toString(),
      totalCost: totalCost.toFixed(2),
      totalConversions: totalConversions.toFixed(2),
      averageCtr: parseFloat(averageCtr.toFixed(2)),
      averageCpc: parseFloat(averageCpc.toFixed(2)),
      averageCostPerConversion: parseFloat(averageCostPerConversion.toFixed(2)),
      activeCampaigns,
      campaigns,
    };
  } catch (error) {
    console.error('Error getting account overview:', error);
    throw error;
  }
}

/**
 * Get search terms report for a campaign
 * Shows what queries triggered your ads
 */
export async function getSearchTermsReport(
  campaignId: string,
  dateRange: DateRange,
  customer?: Customer
): Promise<Array<{
  searchTerm: string;
  impressions: string;
  clicks: string;
  cost: string;
  conversions: string;
}>> {
  const c = customer || getCustomer();

  const query = `
    SELECT
      search_term_view.search_term,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions
    FROM search_term_view
    WHERE campaign.id = ${campaignId}
      AND segments.date BETWEEN '${dateRange.startDate}' AND '${dateRange.endDate}'
    ORDER BY metrics.impressions DESC
  `;

  try {
    const results = await c.query(query);

    return results.map((row: any) => ({
      searchTerm: row.search_term_view.search_term,
      impressions: row.metrics.impressions?.toString() || '0',
      clicks: row.metrics.clicks?.toString() || '0',
      cost: (parseInt(row.metrics.cost_micros || '0') / 1_000_000).toFixed(2),
      conversions: row.metrics.conversions?.toString() || '0',
    }));
  } catch (error) {
    console.error(`Error getting search terms report for campaign ${campaignId}:`, error);
    throw error;
  }
}

/**
 * Helper function to get common date ranges
 */
export const DateRanges = {
  today(): DateRange {
    const today = new Date().toISOString().split('T')[0];
    return { startDate: today, endDate: today };
  },

  yesterday(): DateRange {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const date = yesterday.toISOString().split('T')[0];
    return { startDate: date, endDate: date };
  },

  last7Days(): DateRange {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  },

  last30Days(): DateRange {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  },

  thisMonth(): DateRange {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0],
    };
  },

  lastMonth(): DateRange {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  },
};
