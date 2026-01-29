/**
 * Keyword Research and Management Utilities
 *
 * Functions for getting keyword ideas and adding keywords to ad groups
 */

import { Customer, enums } from 'google-ads-api';
import { getCustomer, accountConfig } from './client';

export interface KeywordIdea {
  text: string;
  avgMonthlySearches: string;
  competition: string;
  competitionIndex: string;
  lowTopOfPageBidMicros: string;
  highTopOfPageBidMicros: string;
}

export interface KeywordIdeasOptions {
  location?: string; // Location ID (e.g., "2826" for UK)
  language?: string; // Language ID (e.g., "1000" for English)
  includeAdultKeywords?: boolean;
}

export interface AddKeywordOptions {
  text: string;
  matchType: 'EXACT' | 'PHRASE' | 'BROAD';
  bidAmountMicros?: string; // Optional: manual bid override
}

/**
 * Get keyword ideas based on seed keywords
 *
 * Uses the Keyword Planner API to generate keyword suggestions
 */
export async function getKeywordIdeas(
  seedKeywords: string[],
  options: KeywordIdeasOptions = {},
  customer?: Customer
): Promise<KeywordIdea[]> {
  const c = customer || getCustomer();

  const keywordPlanIdeaService = c.keywordPlanIdeas;

  try {
    const request: any = {
      customer_id: accountConfig.customerId,
      keyword_seed: {
        keywords: seedKeywords,
      },
      include_adult_keywords: options.includeAdultKeywords || false,
    };

    // Add location targeting if provided (UK = 2826)
    if (options.location) {
      request.geo_target_constants = [
        `geoTargetConstants/${options.location}`,
      ];
    }

    // Add language targeting if provided (English = 1000)
    if (options.language) {
      request.language = `languageConstants/${options.language}`;
    }

    const response = await keywordPlanIdeaService.generateKeywordIdeas(request);

    return response.results.map((result: any) => ({
      text: result.text,
      avgMonthlySearches: result.keyword_idea_metrics?.avg_monthly_searches?.toString() || '0',
      competition: result.keyword_idea_metrics?.competition || 'UNSPECIFIED',
      competitionIndex: result.keyword_idea_metrics?.competition_index?.toString() || '0',
      lowTopOfPageBidMicros:
        result.keyword_idea_metrics?.low_top_of_page_bid_micros?.toString() || '0',
      highTopOfPageBidMicros:
        result.keyword_idea_metrics?.high_top_of_page_bid_micros?.toString() || '0',
    }));
  } catch (error) {
    console.error('Error getting keyword ideas:', error);
    throw error;
  }
}

/**
 * Add keywords to an ad group
 *
 * @param adGroupId - The ID of the ad group to add keywords to
 * @param keywords - Array of keyword configurations
 * @param customer - Optional customer instance
 */
export async function addKeywordsToAdGroup(
  adGroupId: string,
  keywords: AddKeywordOptions[],
  customer?: Customer
): Promise<string[]> {
  const c = customer || getCustomer();

  try {
    const operations = keywords.map((keyword) => {
      const operation: any = {
        create: {
          ad_group: `customers/${accountConfig.customerId}/adGroups/${adGroupId}`,
          keyword: {
            text: keyword.text,
            match_type: enums.KeywordMatchType[keyword.matchType],
          },
          status: enums.AdGroupCriterionStatus.ENABLED,
        },
      };

      // Add manual bid if provided
      if (keyword.bidAmountMicros) {
        operation.create.cpc_bid_micros = keyword.bidAmountMicros;
      }

      return operation;
    });

    const response = await c.adGroupCriteria.create(operations);

    return response.results.map((result: any) => {
      const resourceName = result.resource_name;
      return resourceName.split('/').pop()!;
    });
  } catch (error) {
    console.error('Error adding keywords to ad group:', error);
    throw error;
  }
}

/**
 * Get keywords in an ad group
 */
export async function getAdGroupKeywords(
  adGroupId: string,
  customer?: Customer
): Promise<Array<{ id: string; text: string; matchType: string; status: string }>> {
  const c = customer || getCustomer();

  const query = `
    SELECT
      ad_group_criterion.criterion_id,
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type,
      ad_group_criterion.status
    FROM ad_group_criterion
    WHERE ad_group_criterion.type = 'KEYWORD'
      AND ad_group.id = ${adGroupId}
      AND ad_group_criterion.status != 'REMOVED'
  `;

  try {
    const results = await c.query(query);

    return results.map((row: any) => ({
      id: row.ad_group_criterion.criterion_id.toString(),
      text: row.ad_group_criterion.keyword.text,
      matchType: row.ad_group_criterion.keyword.match_type,
      status: row.ad_group_criterion.status,
    }));
  } catch (error) {
    console.error(`Error getting keywords for ad group ${adGroupId}:`, error);
    throw error;
  }
}

/**
 * Remove a keyword from an ad group
 */
export async function removeKeyword(
  adGroupId: string,
  criterionId: string,
  customer?: Customer
): Promise<void> {
  const c = customer || getCustomer();

  try {
    await c.adGroupCriteria.remove([
      `customers/${accountConfig.customerId}/adGroupCriteria/${adGroupId}~${criterionId}`,
    ]);
  } catch (error) {
    console.error(`Error removing keyword ${criterionId}:`, error);
    throw error;
  }
}

/**
 * Get negative keywords for a campaign
 */
export async function getCampaignNegativeKeywords(
  campaignId: string,
  customer?: Customer
): Promise<Array<{ id: string; text: string; matchType: string }>> {
  const c = customer || getCustomer();

  const query = `
    SELECT
      campaign_criterion.criterion_id,
      campaign_criterion.keyword.text,
      campaign_criterion.keyword.match_type
    FROM campaign_criterion
    WHERE campaign_criterion.type = 'KEYWORD'
      AND campaign_criterion.negative = true
      AND campaign.id = ${campaignId}
      AND campaign_criterion.status != 'REMOVED'
  `;

  try {
    const results = await c.query(query);

    return results.map((row: any) => ({
      id: row.campaign_criterion.criterion_id.toString(),
      text: row.campaign_criterion.keyword.text,
      matchType: row.campaign_criterion.keyword.match_type,
    }));
  } catch (error) {
    console.error(`Error getting negative keywords for campaign ${campaignId}:`, error);
    throw error;
  }
}
