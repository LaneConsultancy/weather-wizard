/**
 * Create Complete Weather Wizard Google Ads Campaigns
 *
 * This script creates TWO comprehensive campaigns for Weather Wizard roofing:
 * 1. Search - Roofing - Top 5 Towns (£30/day)
 * 2. Search - Roofing - Kent Wide (£20/day)
 *
 * Each campaign includes:
 * - Campaign budgets and settings
 * - Multiple ad groups with location/service targeting
 * - Keywords (phrase match) with cross-negative keywords
 * - Responsive Search Ads (RSAs) with headlines and descriptions
 * - Sitelink extensions (account level)
 * - Callout extensions
 *
 * All campaigns are created in PAUSED status for safety.
 *
 * Run with: npm run create-campaigns
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { Customer, enums } from 'google-ads-api';
import { getCustomer, accountConfig } from '../lib/google-ads/client';
import { toMicros } from '../lib/google-ads/types';

// Load environment variables from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Base website URL - production domain
const BASE_URL = 'https://www.weatherwizardroofing.co.uk';

// Campaign configuration
interface CampaignConfig {
  name: string;
  budgetAmountMicros: string;
  budgetName: string;
  adGroups: AdGroupConfig[];
  campaignNegativeKeywords?: string[]; // Campaign-level negative keywords
}

interface AdGroupConfig {
  name: string;
  keywords: KeywordConfig[];
  negativeKeywords?: string[]; // Ad group level negatives
  ads: RSAConfig[];
}

interface KeywordConfig {
  text: string;
  matchType: 'EXACT' | 'PHRASE' | 'BROAD';
}

interface RSAConfig {
  headlines: HeadlineConfig[];
  descriptions: string[];
  finalUrl: string;
  path1?: string;
  path2?: string;
}

interface HeadlineConfig {
  text: string;
  pinPosition?: 1 | 2 | 3; // Pin to specific position
}

// ============================================================================
// CAMPAIGN 1: Search - Roofing - Top 5 Towns
// ============================================================================

const topTownsCampaign: CampaignConfig = {
  name: 'Search - Roofing - Top 5 Towns',
  budgetAmountMicros: toMicros(30), // £30/day
  budgetName: 'Top 5 Towns Budget',
  adGroups: [
    // MAIDSTONE
    {
      name: 'Maidstone',
      keywords: [
        { text: 'maidstone roofers', matchType: 'PHRASE' },
        { text: 'maidstone roofing', matchType: 'PHRASE' },
        { text: 'roof repairs maidstone', matchType: 'PHRASE' },
        { text: 'roofer in maidstone', matchType: 'PHRASE' },
        { text: 'roofing company maidstone', matchType: 'PHRASE' },
        { text: 'emergency roofer maidstone', matchType: 'PHRASE' },
        { text: 'roof repair maidstone', matchType: 'PHRASE' },
        { text: 'local roofer maidstone', matchType: 'PHRASE' },
      ],
      negativeKeywords: ['dartford', 'gillingham', 'chatham', 'ashford'],
      ads: [
        {
          headlines: [
            { text: "Maidstone's Trusted Roofers", pinPosition: 1 },
            { text: 'Top Rated Roofer in Maidstone', pinPosition: 1 },
            { text: 'Maidstone Roof Repair Experts', pinPosition: 1 },
            { text: 'Expert Roof Repairs' },
            { text: 'Emergency Roofing Services' },
            { text: '24/7 Emergency Call-Outs' },
            { text: 'Free Quote in 2 Hours' },
            { text: 'Rated 4.9/5 by Customers' },
            { text: '20+ Years Experience' },
            { text: 'Fully Insured & Guaranteed' },
            { text: 'Same Day Repairs Available' },
            { text: 'No Call-Out Charge' },
            { text: 'Get Your Free Quote' },
            { text: 'Call Now - Free Estimate' },
            { text: 'Family-Owned Business' },
          ],
          descriptions: [
            'Professional roof repairs in Maidstone. 24/7 emergency service, free quotes. Call now!',
            'Stop roof leaks fast. 20+ years experience, 10-year warranty. Free quote today.',
            'Expert roof repairs & gutter work in Maidstone. Family-owned, fully insured.',
            'Free inspections, transparent pricing, guaranteed work. Serving Maidstone.',
          ],
          finalUrl: `${BASE_URL}/maidstone`,
        },
      ],
    },

    // DARTFORD
    {
      name: 'Dartford',
      keywords: [
        { text: 'dartford roofers', matchType: 'PHRASE' },
        { text: 'dartford roofing', matchType: 'PHRASE' },
        { text: 'roof repairs dartford', matchType: 'PHRASE' },
        { text: 'roofer in dartford', matchType: 'PHRASE' },
        { text: 'roofing company dartford', matchType: 'PHRASE' },
        { text: 'emergency roofer dartford', matchType: 'PHRASE' },
        { text: 'roof repair dartford', matchType: 'PHRASE' },
        { text: 'local roofer dartford', matchType: 'PHRASE' },
      ],
      negativeKeywords: ['maidstone', 'gillingham', 'chatham', 'ashford'],
      ads: [
        {
          headlines: [
            { text: "Dartford's Trusted Roofers", pinPosition: 1 },
            { text: 'Top Rated Roofer in Dartford', pinPosition: 1 },
            { text: 'Dartford Roof Repair Experts', pinPosition: 1 },
            { text: 'Expert Roof Repairs' },
            { text: 'Emergency Roofing Services' },
            { text: '24/7 Emergency Call-Outs' },
            { text: 'Free Quote in 2 Hours' },
            { text: 'Rated 4.9/5 by Customers' },
            { text: '20+ Years Experience' },
            { text: 'Fully Insured & Guaranteed' },
            { text: 'Same Day Repairs Available' },
            { text: 'No Call-Out Charge' },
            { text: 'Get Your Free Quote' },
            { text: 'Call Now - Free Estimate' },
            { text: 'Family-Owned Business' },
          ],
          descriptions: [
            'Professional roof repairs in Dartford. 24/7 emergency service, free quotes. Call now!',
            'Stop roof leaks fast. 20+ years experience, 10-year warranty. Free quote today.',
            'Expert roof repairs & gutter work in Dartford. Family-owned, fully insured.',
            'Free inspections, transparent pricing, guaranteed work. Serving Dartford.',
          ],
          finalUrl: `${BASE_URL}/dartford`,
        },
      ],
    },

    // GILLINGHAM
    {
      name: 'Gillingham',
      keywords: [
        { text: 'gillingham roofers', matchType: 'PHRASE' },
        { text: 'gillingham roofing', matchType: 'PHRASE' },
        { text: 'roof repairs gillingham', matchType: 'PHRASE' },
        { text: 'roofer in gillingham', matchType: 'PHRASE' },
        { text: 'roofing company gillingham', matchType: 'PHRASE' },
        { text: 'emergency roofer gillingham', matchType: 'PHRASE' },
        { text: 'roof repair gillingham', matchType: 'PHRASE' },
        { text: 'local roofer gillingham', matchType: 'PHRASE' },
      ],
      negativeKeywords: ['maidstone', 'dartford', 'chatham', 'ashford'],
      ads: [
        {
          headlines: [
            { text: "Gillingham's Trusted Roofers", pinPosition: 1 },
            { text: 'Top Rated Roofer in Gillingham', pinPosition: 1 },
            { text: 'Gillingham Roof Repair Experts', pinPosition: 1 },
            { text: 'Expert Roof Repairs' },
            { text: 'Emergency Roofing Services' },
            { text: '24/7 Emergency Call-Outs' },
            { text: 'Free Quote in 2 Hours' },
            { text: 'Rated 4.9/5 by Customers' },
            { text: '20+ Years Experience' },
            { text: 'Fully Insured & Guaranteed' },
            { text: 'Same Day Repairs Available' },
            { text: 'No Call-Out Charge' },
            { text: 'Get Your Free Quote' },
            { text: 'Call Now - Free Estimate' },
            { text: 'Family-Owned Business' },
          ],
          descriptions: [
            'Professional roof repairs in Gillingham. 24/7 emergency service, free quotes. Call!',
            'Stop roof leaks fast. 20+ years experience, 10-year warranty. Free quote today.',
            'Expert roof repairs & gutter work in Gillingham. Family-owned, fully insured.',
            'Free inspections, transparent pricing, guaranteed work. Serving Gillingham.',
          ],
          finalUrl: `${BASE_URL}/gillingham`,
        },
      ],
    },

    // CHATHAM
    {
      name: 'Chatham',
      keywords: [
        { text: 'chatham roofers', matchType: 'PHRASE' },
        { text: 'chatham roofing', matchType: 'PHRASE' },
        { text: 'roof repairs chatham', matchType: 'PHRASE' },
        { text: 'roofer in chatham', matchType: 'PHRASE' },
        { text: 'roofing company chatham', matchType: 'PHRASE' },
        { text: 'emergency roofer chatham', matchType: 'PHRASE' },
        { text: 'roof repair chatham', matchType: 'PHRASE' },
        { text: 'local roofer chatham', matchType: 'PHRASE' },
      ],
      negativeKeywords: ['maidstone', 'dartford', 'gillingham', 'ashford'],
      ads: [
        {
          headlines: [
            { text: "Chatham's Trusted Roofers", pinPosition: 1 },
            { text: 'Top Rated Roofer in Chatham', pinPosition: 1 },
            { text: 'Chatham Roof Repair Experts', pinPosition: 1 },
            { text: 'Expert Roof Repairs' },
            { text: 'Emergency Roofing Services' },
            { text: '24/7 Emergency Call-Outs' },
            { text: 'Free Quote in 2 Hours' },
            { text: 'Rated 4.9/5 by Customers' },
            { text: '20+ Years Experience' },
            { text: 'Fully Insured & Guaranteed' },
            { text: 'Same Day Repairs Available' },
            { text: 'No Call-Out Charge' },
            { text: 'Get Your Free Quote' },
            { text: 'Call Now - Free Estimate' },
            { text: 'Family-Owned Business' },
          ],
          descriptions: [
            'Professional roof repairs in Chatham. 24/7 emergency service, free quotes. Call now!',
            'Stop roof leaks fast. 20+ years experience, 10-year warranty. Free quote today.',
            'Expert roof repairs & gutter work in Chatham. Family-owned, fully insured.',
            'Free inspections, transparent pricing, guaranteed work. Serving Chatham.',
          ],
          finalUrl: `${BASE_URL}/chatham`,
        },
      ],
    },

    // ASHFORD
    {
      name: 'Ashford',
      keywords: [
        { text: 'ashford roofers', matchType: 'PHRASE' },
        { text: 'ashford roofing', matchType: 'PHRASE' },
        { text: 'roof repairs ashford', matchType: 'PHRASE' },
        { text: 'roofer in ashford', matchType: 'PHRASE' },
        { text: 'roofing company ashford', matchType: 'PHRASE' },
        { text: 'emergency roofer ashford', matchType: 'PHRASE' },
        { text: 'roof repair ashford', matchType: 'PHRASE' },
        { text: 'local roofer ashford', matchType: 'PHRASE' },
      ],
      negativeKeywords: ['maidstone', 'dartford', 'gillingham', 'chatham'],
      ads: [
        {
          headlines: [
            { text: "Ashford's Trusted Roofers", pinPosition: 1 },
            { text: 'Top Rated Roofer in Ashford', pinPosition: 1 },
            { text: 'Ashford Roof Repair Experts', pinPosition: 1 },
            { text: 'Expert Roof Repairs' },
            { text: 'Emergency Roofing Services' },
            { text: '24/7 Emergency Call-Outs' },
            { text: 'Free Quote in 2 Hours' },
            { text: 'Rated 4.9/5 by Customers' },
            { text: '20+ Years Experience' },
            { text: 'Fully Insured & Guaranteed' },
            { text: 'Same Day Repairs Available' },
            { text: 'No Call-Out Charge' },
            { text: 'Get Your Free Quote' },
            { text: 'Call Now - Free Estimate' },
            { text: 'Family-Owned Business' },
          ],
          descriptions: [
            'Professional roof repairs in Ashford. 24/7 emergency service, free quotes. Call now!',
            'Stop roof leaks fast. 20+ years experience, 10-year warranty. Free quote today.',
            'Expert roof repairs & gutter work in Ashford. Family-owned, fully insured.',
            'Free inspections, transparent pricing, guaranteed work. Serving Ashford.',
          ],
          finalUrl: `${BASE_URL}/ashford`,
        },
      ],
    },
  ],
};

// ============================================================================
// CAMPAIGN 2: Search - Roofing - Kent Wide
// ============================================================================

const kentWideCampaign: CampaignConfig = {
  name: 'Search - Roofing - Kent Wide',
  budgetAmountMicros: toMicros(20), // £20/day
  budgetName: 'Kent Wide Budget',
  campaignNegativeKeywords: ['maidstone', 'dartford', 'gillingham', 'chatham', 'ashford'], // Exclude top 5 towns
  adGroups: [
    // EMERGENCY ROOF REPAIRS
    {
      name: 'Emergency Roof Repairs',
      keywords: [
        { text: 'emergency roof repair', matchType: 'PHRASE' },
        { text: 'emergency roofer', matchType: 'PHRASE' },
        { text: 'urgent roof repair', matchType: 'PHRASE' },
        { text: 'roof leak emergency', matchType: 'PHRASE' },
        { text: 'emergency roofing', matchType: 'PHRASE' },
        { text: '24 hour roofer', matchType: 'PHRASE' },
        { text: 'same day roof repair', matchType: 'PHRASE' },
        { text: 'roof repair urgent', matchType: 'PHRASE' },
      ],
      ads: [
        {
          headlines: [
            { text: '24/7 Emergency Roofers' },
            { text: 'Kent Emergency Roof Repairs' },
            { text: 'Urgent Roof Leak? Call Now' },
            { text: 'Same Day Emergency Service' },
            { text: 'Stop Roof Leaks Fast' },
            { text: 'Emergency Call-Out Available' },
            { text: 'Rapid Response Roofers' },
            { text: '24 Hour Roofing Service' },
            { text: 'Free Emergency Quote' },
            { text: 'Fully Insured Roofers' },
            { text: 'No Call-Out Charge' },
            { text: "We're Here When You Need Us" },
            { text: "Don't Wait - Call Now" },
            { text: 'Fast Professional Repairs' },
            { text: 'Trusted Kent Roofers' },
          ],
          descriptions: [
            'Kent emergency roofing services. Free quotes, fully insured. 20+ years experience.',
            'Expert roof repairs & gutter cleaning. Family-owned, 10-year warranty. Call today!',
            'Free inspections, transparent pricing, guaranteed work. Serving all of Kent.',
            'Trusted Kent roofers rated 4.9/5. Same-day service, no call-out charge.',
          ],
          finalUrl: BASE_URL,
        },
      ],
    },

    // ROOF REPAIRS GENERAL
    {
      name: 'Roof Repairs General',
      keywords: [
        { text: 'roof repairs kent', matchType: 'PHRASE' },
        { text: 'roofer near me', matchType: 'PHRASE' },
        { text: 'local roofer', matchType: 'PHRASE' },
        { text: 'roofing company kent', matchType: 'PHRASE' },
        { text: 'roof fix', matchType: 'PHRASE' },
        { text: 'roof repair service', matchType: 'PHRASE' },
        { text: 'professional roofer', matchType: 'PHRASE' },
        { text: 'trusted roofer', matchType: 'PHRASE' },
      ],
      ads: [
        {
          headlines: [
            { text: "Kent's Trusted Roofers" },
            { text: 'Professional Roof Repairs' },
            { text: 'Local Roofing Experts' },
            { text: 'Quality Roof Repairs' },
            { text: 'Expert Roofing Services' },
            { text: 'Trusted Local Roofers' },
            { text: '20+ Years Experience' },
            { text: 'Free No-Obligation Quote' },
            { text: 'Fully Insured & Guaranteed' },
            { text: 'Family-Owned Business' },
            { text: 'Rated 4.9/5 Stars' },
            { text: 'Competitive Pricing' },
            { text: 'Get Your Free Quote' },
            { text: 'Call Today - Free Estimate' },
            { text: 'Serving All of Kent' },
          ],
          descriptions: [
            'Professional Kent roofing. Emergency call-outs, free quotes, fully insured. Call now!',
            'Expert roof repairs & gutter cleaning. Family-owned, 10-year warranty. Call today!',
            'Free inspections, transparent pricing, guaranteed work. Serving all of Kent.',
            'Trusted Kent roofers rated 4.9/5. Same-day service, no call-out charge.',
          ],
          finalUrl: BASE_URL,
        },
      ],
    },

    // GUTTER & CHIMNEY SERVICES
    {
      name: 'Gutter & Chimney Services',
      keywords: [
        { text: 'gutter repairs kent', matchType: 'PHRASE' },
        { text: 'gutter cleaning kent', matchType: 'PHRASE' },
        { text: 'chimney repairs kent', matchType: 'PHRASE' },
        { text: 'fascia soffit repairs', matchType: 'PHRASE' },
        { text: 'guttering services', matchType: 'PHRASE' },
        { text: 'chimney repair service', matchType: 'PHRASE' },
      ],
      ads: [
        {
          headlines: [
            { text: 'Gutter Repairs Kent' },
            { text: 'Chimney Repair Experts' },
            { text: 'Professional Gutter Cleaning' },
            { text: 'Fascia & Soffit Repairs' },
            { text: 'Complete Gutter Services' },
            { text: 'Chimney Specialists Kent' },
            { text: 'Prevent Water Damage' },
            { text: 'Free Gutter Inspection' },
            { text: 'Expert Chimney Repairs' },
            { text: '20+ Years Experience' },
            { text: 'Fully Insured Team' },
            { text: 'Competitive Prices' },
            { text: 'Get Your Free Quote' },
            { text: 'Same Day Service' },
            { text: 'Trusted Local Experts' },
          ],
          descriptions: [
            'Gutter & chimney repairs across Kent. Free quotes, fully insured. 20+ years exp.',
            'Expert gutter cleaning & chimney work. Family-owned, 10-year warranty. Call now!',
            'Prevent water damage. Free inspections, guaranteed workmanship. Serving Kent.',
            'Trusted Kent specialists rated 4.9/5. Same-day service, no call-out charge.',
          ],
          finalUrl: BASE_URL,
        },
      ],
    },
  ],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if a campaign already exists by name
 */
async function campaignExists(customer: Customer, campaignName: string): Promise<boolean> {
  const query = `
    SELECT campaign.id, campaign.name
    FROM campaign
    WHERE campaign.name = "${campaignName}"
      AND campaign.status != 'REMOVED'
  `;

  try {
    const results = await customer.query(query);
    return results.length > 0;
  } catch (error) {
    console.error(`Error checking if campaign exists: ${error}`);
    return false;
  }
}

/**
 * Create a campaign budget using mutateResources
 */
async function createBudget(
  customer: Customer,
  name: string,
  amountMicros: string
): Promise<string> {
  const response = await customer.mutateResources([
    {
      entity: 'campaign_budget',
      operation: 'create',
      resource: {
        name,
        amount_micros: parseInt(amountMicros, 10),
        delivery_method: enums.BudgetDeliveryMethod.STANDARD,
      },
    },
  ]);

  const budgetResult = (response as any).mutate_operation_responses?.[0]?.campaign_budget_result;
  const budgetResourceName = budgetResult?.resource_name;

  if (!budgetResourceName) {
    throw new Error('Failed to create budget - no resource name returned');
  }

  const budgetId = budgetResourceName.split('/').pop()!;
  console.log(`   ✅ Budget created: ${name} (ID: ${budgetId})`);
  return budgetResourceName;
}

/**
 * Create a search campaign using mutateResources
 */
async function createCampaign(
  customer: Customer,
  name: string,
  budgetResourceName: string
): Promise<string> {
  const response = await customer.mutateResources([
    {
      entity: 'campaign',
      operation: 'create',
      resource: {
        name,
        status: enums.CampaignStatus.PAUSED,
        advertising_channel_type: enums.AdvertisingChannelType.SEARCH,
        campaign_budget: budgetResourceName,
        manual_cpc: {
          enhanced_cpc_enabled: false,
        },
        network_settings: {
          target_google_search: true,
          target_search_network: false,
          target_content_network: false,
          target_partner_search_network: false,
        },
        // EU Political Advertising declaration (required for EU advertisers)
        // 2 = DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING
        contains_eu_political_advertising: 2,
      },
    },
  ]);

  const campaignResult = (response as any).mutate_operation_responses?.[0]?.campaign_result;
  const campaignResourceName = campaignResult?.resource_name;

  if (!campaignResourceName) {
    throw new Error('Failed to create campaign - no resource name returned');
  }

  const campaignId = campaignResourceName.split('/').pop()!;
  console.log(`   ✅ Campaign created: ${name} (ID: ${campaignId})`);
  return campaignResourceName; // Return full resource name for ad groups
}

/**
 * Add geo targeting to campaign (Kent, UK)
 */
async function addGeoTargeting(customer: Customer, campaignResourceName: string): Promise<void> {
  // Kent geo target constant ID
  const kentGeoTargetId = '1010300';

  await customer.mutateResources([
    {
      entity: 'campaign_criterion',
      operation: 'create',
      resource: {
        campaign: campaignResourceName,
        location: {
          geo_target_constant: `geoTargetConstants/${kentGeoTargetId}`,
        },
      },
    },
  ]);
  console.log(`   ✅ Geo targeting added: Kent, UK`);
}

/**
 * Add campaign-level negative keywords
 */
async function addCampaignNegativeKeywords(
  customer: Customer,
  campaignResourceName: string,
  negativeKeywords: string[]
): Promise<void> {
  if (negativeKeywords.length === 0) return;

  const operations = negativeKeywords.map((keyword) => ({
    entity: 'campaign_criterion' as const,
    operation: 'create' as const,
    resource: {
      campaign: campaignResourceName,
      keyword: {
        text: keyword,
        match_type: enums.KeywordMatchType.PHRASE,
      },
      negative: true,
    },
  }));

  await customer.mutateResources(operations);
  console.log(`   ✅ Added ${negativeKeywords.length} campaign negative keywords`);
}

/**
 * Create an ad group using mutateResources
 */
async function createAdGroup(
  customer: Customer,
  campaignResourceName: string,
  name: string
): Promise<string> {
  const response = await customer.mutateResources([
    {
      entity: 'ad_group',
      operation: 'create',
      resource: {
        name,
        campaign: campaignResourceName,
        status: enums.AdGroupStatus.ENABLED,
        type: enums.AdGroupType.SEARCH_STANDARD,
        cpc_bid_micros: 5000000, // £5.00 default CPC bid (based on keyword research)
      },
    },
  ]);

  const adGroupResult = (response as any).mutate_operation_responses?.[0]?.ad_group_result;
  const adGroupResourceName = adGroupResult?.resource_name;

  if (!adGroupResourceName) {
    throw new Error('Failed to create ad group - no resource name returned');
  }

  const adGroupId = adGroupResourceName.split('/').pop()!;
  console.log(`      ✅ Ad group created: ${name} (ID: ${adGroupId})`);
  return adGroupResourceName; // Return full resource name for keywords and ads
}

/**
 * Add keywords to an ad group using mutateResources
 */
async function addKeywords(
  customer: Customer,
  adGroupResourceName: string,
  keywords: KeywordConfig[]
): Promise<void> {
  const operations = keywords.map((keyword) => ({
    entity: 'ad_group_criterion' as const,
    operation: 'create' as const,
    resource: {
      ad_group: adGroupResourceName,
      keyword: {
        text: keyword.text,
        match_type: enums.KeywordMatchType[keyword.matchType],
      },
      status: enums.AdGroupCriterionStatus.ENABLED,
    },
  }));

  await customer.mutateResources(operations);
  console.log(`         ✅ Added ${keywords.length} keywords`);
}

/**
 * Add negative keywords to an ad group using mutateResources
 */
async function addNegativeKeywords(
  customer: Customer,
  adGroupResourceName: string,
  negativeKeywords: string[]
): Promise<void> {
  if (negativeKeywords.length === 0) return;

  const operations = negativeKeywords.map((keyword) => ({
    entity: 'ad_group_criterion' as const,
    operation: 'create' as const,
    resource: {
      ad_group: adGroupResourceName,
      keyword: {
        text: keyword,
        match_type: enums.KeywordMatchType.PHRASE,
      },
      status: enums.AdGroupCriterionStatus.ENABLED,
      negative: true,
    },
  }));

  await customer.mutateResources(operations);
  console.log(`         ✅ Added ${negativeKeywords.length} negative keywords`);
}

/**
 * Create a Responsive Search Ad using mutateResources
 */
async function createRSA(
  customer: Customer,
  adGroupResourceName: string,
  rsaConfig: RSAConfig
): Promise<void> {
  const headlines = rsaConfig.headlines.map((h) => ({
    text: h.text,
    pinned_field: h.pinPosition
      ? h.pinPosition === 1
        ? enums.ServedAssetFieldType.HEADLINE_1
        : h.pinPosition === 2
        ? enums.ServedAssetFieldType.HEADLINE_2
        : enums.ServedAssetFieldType.HEADLINE_3
      : undefined,
  }));

  const descriptions = rsaConfig.descriptions.map((text) => ({ text }));

  await customer.mutateResources([
    {
      entity: 'ad_group_ad',
      operation: 'create',
      resource: {
        ad_group: adGroupResourceName,
        status: enums.AdGroupAdStatus.ENABLED,
        ad: {
          final_urls: [rsaConfig.finalUrl],
          responsive_search_ad: {
            headlines,
            descriptions,
            path1: rsaConfig.path1,
            path2: rsaConfig.path2,
          },
        },
      },
    },
  ]);
  console.log(`         ✅ Created RSA with ${headlines.length} headlines, ${descriptions.length} descriptions`);
}

/**
 * Create account-level sitelink extensions using mutateResources
 */
async function createSitelinkExtensions(customer: Customer): Promise<void> {
  console.log('\n📎 Creating Account-Level Sitelink Extensions...');
  console.log('─'.repeat(60));

  const sitelinks = [
    { text: 'Our Services', url: `${BASE_URL}`, description1: 'Expert roofing services', description2: 'Trusted professionals' },
    { text: 'Customer Reviews', url: `${BASE_URL}`, description1: 'See what customers say', description2: 'Rated 4.9/5 stars' },
    { text: 'Emergency Service', url: `${BASE_URL}`, description1: '24/7 emergency call-outs', description2: 'Rapid response team' },
    { text: 'Free Quote', url: `${BASE_URL}`, description1: 'Get your free estimate', description2: 'No obligation quote' },
    { text: 'About Us', url: `${BASE_URL}`, description1: 'Family-owned business', description2: '20+ years experience' },
    { text: 'Service Areas', url: `${BASE_URL}`, description1: 'Serving all of Kent', description2: 'Find your local area' },
  ];

  // Create sitelink assets using mutateResources
  const assetOperations = sitelinks.map((sitelink) => ({
    entity: 'asset' as const,
    operation: 'create' as const,
    resource: {
      name: sitelink.text,
      type: enums.AssetType.SITELINK,
      sitelink_asset: {
        link_text: sitelink.text,
        description1: sitelink.description1,
        description2: sitelink.description2,
      },
      final_urls: [sitelink.url],
    },
  }));

  const assetResponse = await customer.mutateResources(assetOperations);
  const assetResults = (assetResponse as any).mutate_operation_responses || [];
  console.log(`   ✅ Created ${assetResults.length} sitelink assets`);

  // Link sitelinks to customer account (account-level)
  const linkOperations = assetResults.map((result: any) => ({
    entity: 'customer_asset' as const,
    operation: 'create' as const,
    resource: {
      asset: result.asset_result?.resource_name,
      field_type: enums.AssetFieldType.SITELINK,
    },
  }));

  await customer.mutateResources(linkOperations);
  console.log(`   ✅ Linked sitelinks to account`);
}

/**
 * Create account-level callout extensions using mutateResources
 */
async function createCalloutExtensions(customer: Customer): Promise<void> {
  console.log('\n📞 Creating Account-Level Callout Extensions...');
  console.log('─'.repeat(60));

  const callouts = [
    'Free Estimates',
    '24/7 Emergency Service',
    'Family-Owned Since 2008',
    'Fully Insured & Licensed',
    'Same-Day Repairs',
    '10-Year Warranty',
    'No Call-Out Charge',
    'Local Kent Roofers',
  ];

  // Create callout assets using mutateResources
  const assetOperations = callouts.map((calloutText) => ({
    entity: 'asset' as const,
    operation: 'create' as const,
    resource: {
      type: enums.AssetType.CALLOUT,
      callout_asset: {
        callout_text: calloutText,
      },
    },
  }));

  const assetResponse = await customer.mutateResources(assetOperations);
  const assetResults = (assetResponse as any).mutate_operation_responses || [];
  console.log(`   ✅ Created ${assetResults.length} callout assets`);

  // Link callouts to customer account (account-level)
  const linkOperations = assetResults.map((result: any) => ({
    entity: 'customer_asset' as const,
    operation: 'create' as const,
    resource: {
      asset: result.asset_result?.resource_name,
      field_type: enums.AssetFieldType.CALLOUT,
    },
  }));

  await customer.mutateResources(linkOperations);
  console.log(`   ✅ Linked callouts to account`);
}

/**
 * Create a complete campaign with all ad groups, keywords, and ads
 */
async function createCompleteCampaign(
  customer: Customer,
  config: CampaignConfig
): Promise<void> {
  console.log(`\n📋 Creating Campaign: ${config.name}`);
  console.log('='.repeat(60));

  // Check if campaign already exists
  const exists = await campaignExists(customer, config.name);
  if (exists) {
    console.log(`   ⚠️  Campaign "${config.name}" already exists. Skipping...`);
    return;
  }

  // Step 1: Create budget
  console.log('\n   💰 Creating Budget...');
  const budgetResourceName = await createBudget(
    customer,
    config.budgetName,
    config.budgetAmountMicros
  );

  // Step 2: Create campaign (returns full resource name)
  console.log('\n   🎯 Creating Campaign...');
  const campaignResourceName = await createCampaign(customer, config.name, budgetResourceName);

  // Step 3: Add geo targeting
  console.log('\n   🌍 Adding Geo Targeting...');
  await addGeoTargeting(customer, campaignResourceName);

  // Step 4: Add campaign-level negative keywords (if any)
  if (config.campaignNegativeKeywords && config.campaignNegativeKeywords.length > 0) {
    console.log('\n   🚫 Adding Campaign Negative Keywords...');
    await addCampaignNegativeKeywords(customer, campaignResourceName, config.campaignNegativeKeywords);
  }

  // Step 5: Create ad groups with keywords and ads
  console.log('\n   📁 Creating Ad Groups...');
  for (const adGroupConfig of config.adGroups) {
    console.log(`\n      📂 Ad Group: ${adGroupConfig.name}`);

    // Create ad group (returns full resource name)
    const adGroupResourceName = await createAdGroup(customer, campaignResourceName, adGroupConfig.name);

    // Add keywords
    console.log(`         🔑 Adding Keywords...`);
    await addKeywords(customer, adGroupResourceName, adGroupConfig.keywords);

    // Add negative keywords
    if (adGroupConfig.negativeKeywords && adGroupConfig.negativeKeywords.length > 0) {
      console.log(`         🚫 Adding Negative Keywords...`);
      await addNegativeKeywords(customer, adGroupResourceName, adGroupConfig.negativeKeywords);
    }

    // Create ads
    console.log(`         📝 Creating Ads...`);
    for (const adConfig of adGroupConfig.ads) {
      await createRSA(customer, adGroupResourceName, adConfig);
    }
  }

  console.log(`\n✅ Campaign "${config.name}" created successfully!`);
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('🚀 Weather Wizard Google Ads Campaign Setup');
  console.log('='.repeat(80));
  console.log('\nThis script will create TWO complete Google Ads campaigns:');
  console.log('   1. Search - Roofing - Top 5 Towns (£30/day)');
  console.log('   2. Search - Roofing - Kent Wide (£20/day)');
  console.log('\nAll campaigns will be created in PAUSED status.\n');
  console.log('='.repeat(80));

  try {
    const customer = getCustomer();

    // Create Campaign 1: Top 5 Towns
    await createCompleteCampaign(customer, topTownsCampaign);

    // Create Campaign 2: Kent Wide
    await createCompleteCampaign(customer, kentWideCampaign);

    // Create account-level extensions
    await createSitelinkExtensions(customer);
    await createCalloutExtensions(customer);

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('✨ Campaign Setup Complete!');
    console.log('='.repeat(80));
    console.log('\n📊 Summary:');
    console.log(`   ✅ 2 campaigns created (PAUSED)`);
    console.log(`   ✅ ${topTownsCampaign.adGroups.length + kentWideCampaign.adGroups.length} ad groups created`);
    console.log(`   ✅ Keywords and negative keywords added`);
    console.log(`   ✅ Responsive Search Ads created`);
    console.log(`   ✅ Sitelink extensions added (account-level)`);
    console.log(`   ✅ Callout extensions added (account-level)`);

    console.log('\n📌 Next Steps:');
    console.log('   1. Review campaigns in Google Ads UI');
    console.log('   2. Verify ad copy and URLs are correct');
    console.log('   3. Set up conversion tracking');
    console.log('   4. Enable campaigns when ready to go live');
    console.log('   5. Monitor performance and adjust bids as needed');
    console.log('\n⚠️  Important: All campaigns are PAUSED. Enable when ready.\n');

  } catch (error: any) {
    console.error('\n❌ Error creating campaigns:');
    console.error(error.message);
    if (error.errors) {
      error.errors.forEach((err: any) => {
        console.error(`   ${err.message}`);
      });
    }
    process.exit(1);
  }
}

// Run the script
main();
