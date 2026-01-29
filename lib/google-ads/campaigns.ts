/**
 * Campaign Management Utilities
 *
 * Functions for creating, listing, and managing Google Ads campaigns
 */

import { Customer, enums } from 'google-ads-api';
import { getCustomer } from './client';

export interface CampaignSummary {
  id: string;
  name: string;
  status: string;
  advertisingChannelType: string;
  biddingStrategy: string;
  budget: {
    id: string;
    name: string;
    amountMicros: string;
  };
  metrics?: {
    impressions: string;
    clicks: string;
    cost: string;
    conversions: string;
  };
}

export interface CreateSearchCampaignOptions {
  name: string;
  budgetAmountMicros: string; // e.g., "10000000" for £10/day
  budgetName?: string;
  targetLocation?: string; // e.g., "Kent, UK"
  startDate?: string; // YYYYMMDD format
  endDate?: string; // YYYYMMDD format
}

/**
 * List all campaigns in the account with basic metrics
 */
export async function listCampaigns(customer?: Customer): Promise<CampaignSummary[]> {
  const c = customer || getCustomer();

  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.advertising_channel_type,
      campaign.bidding_strategy_type,
      campaign_budget.id,
      campaign_budget.name,
      campaign_budget.amount_micros,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions
    FROM campaign
    WHERE campaign.status != 'REMOVED'
    ORDER BY campaign.name
  `;

  try {
    const campaigns = await c.query(query);

    return campaigns.map((row: any) => ({
      id: row.campaign.id.toString(),
      name: row.campaign.name,
      status: row.campaign.status,
      advertisingChannelType: row.campaign.advertising_channel_type,
      biddingStrategy: row.campaign.bidding_strategy_type,
      budget: {
        id: row.campaign_budget.id.toString(),
        name: row.campaign_budget.name,
        amountMicros: row.campaign_budget.amount_micros.toString(),
      },
      metrics: row.metrics
        ? {
            impressions: row.metrics.impressions?.toString() || '0',
            clicks: row.metrics.clicks?.toString() || '0',
            cost: row.metrics.cost_micros?.toString() || '0',
            conversions: row.metrics.conversions?.toString() || '0',
          }
        : undefined,
    }));
  } catch (error) {
    console.error('Error listing campaigns:', error);
    throw error;
  }
}

/**
 * Get details of a specific campaign by ID
 */
export async function getCampaign(
  campaignId: string,
  customer?: Customer
): Promise<CampaignSummary | null> {
  const c = customer || getCustomer();

  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.advertising_channel_type,
      campaign.bidding_strategy_type,
      campaign_budget.id,
      campaign_budget.name,
      campaign_budget.amount_micros
    FROM campaign
    WHERE campaign.id = ${campaignId}
  `;

  try {
    const campaigns = await c.query(query);
    if (campaigns.length === 0) {
      return null;
    }

    const row = campaigns[0];
    if (!row.campaign || !row.campaign_budget) {
      return null;
    }
    return {
      id: row.campaign.id?.toString() ?? '',
      name: row.campaign.name ?? '',
      status: String(row.campaign.status ?? ''),
      advertisingChannelType: String(row.campaign.advertising_channel_type ?? ''),
      biddingStrategy: String(row.campaign.bidding_strategy_type ?? ''),
      budget: {
        id: row.campaign_budget.id?.toString() ?? '',
        name: row.campaign_budget.name ?? '',
        amountMicros: row.campaign_budget.amount_micros?.toString() ?? '0',
      },
    };
  } catch (error) {
    console.error(`Error getting campaign ${campaignId}:`, error);
    throw error;
  }
}

/**
 * Create a new Search campaign
 *
 * Note: This creates the campaign shell only. You'll need to add ad groups,
 * keywords, and ads separately.
 */
export async function createSearchCampaign(
  options: CreateSearchCampaignOptions,
  customer?: Customer
): Promise<{ campaignId: string; budgetId: string }> {
  const c = customer || getCustomer();

  const budgetName = options.budgetName || `${options.name} Budget`;

  try {
    // First, create a campaign budget
    const budgetOperation: any = {
      create: {
        name: budgetName,
        amount_micros: options.budgetAmountMicros,
        delivery_method: enums.BudgetDeliveryMethod.STANDARD,
        explicitly_shared: false,
      },
    };

    const budgetResponse = await c.campaignBudgets.create([budgetOperation]);
    const budgetResourceName = budgetResponse.results[0].resource_name!;
    const budgetId = budgetResourceName.split('/').pop()!;

    // Then create the campaign
    const campaignOperation: any = {
      create: {
        name: options.name,
        status: enums.CampaignStatus.PAUSED, // Start paused for safety
        advertising_channel_type: enums.AdvertisingChannelType.SEARCH,
        campaign_budget: budgetResourceName,
        bidding_strategy_type: enums.BiddingStrategyType.MAXIMIZE_CONVERSIONS,
        network_settings: {
          target_google_search: true,
          target_search_network: true,
          target_content_network: false,
          target_partner_search_network: false,
        },
      },
    };

    // Add start/end dates if provided
    if (options.startDate) {
      campaignOperation.create.start_date = options.startDate;
    }
    if (options.endDate) {
      campaignOperation.create.end_date = options.endDate;
    }

    const campaignResponse = await c.campaigns.create([campaignOperation]);
    const campaignResourceName = campaignResponse.results[0].resource_name!;
    const campaignId = campaignResourceName.split('/').pop()!;

    return {
      campaignId,
      budgetId,
    };
  } catch (error) {
    console.error('Error creating search campaign:', error);
    throw error;
  }
}

/**
 * Pause a campaign (set status to PAUSED)
 */
export async function pauseCampaign(campaignId: string, customer?: Customer): Promise<void> {
  const c = customer || getCustomer();

  try {
    await c.campaigns.update([
      {
        resource_name: `customers/${c.credentials.customer_id}/campaigns/${campaignId}`,
        status: enums.CampaignStatus.PAUSED,
      },
    ]);
  } catch (error) {
    console.error(`Error pausing campaign ${campaignId}:`, error);
    throw error;
  }
}

/**
 * Enable a campaign (set status to ENABLED)
 */
export async function enableCampaign(campaignId: string, customer?: Customer): Promise<void> {
  const c = customer || getCustomer();

  try {
    await c.campaigns.update([
      {
        resource_name: `customers/${c.credentials.customer_id}/campaigns/${campaignId}`,
        status: enums.CampaignStatus.ENABLED,
      },
    ]);
  } catch (error) {
    console.error(`Error enabling campaign ${campaignId}:`, error);
    throw error;
  }
}
