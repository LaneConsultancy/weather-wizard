/**
 * Add Secondary Towns to Existing Campaign
 *
 * This script adds 5 new ad groups (Hastings, Gravesend, Rochester, Margate, Canterbury)
 * to the existing "Search - Roofing - Top 5 Towns" campaign.
 *
 * Campaign ID: 23510018792
 * Customer ID: 6652965980
 *
 * For each town, the script:
 * 1. Creates a new ad group
 * 2. Adds 8 keywords (PHRASE match)
 * 3. Creates an RSA with 15 headlines (3 pinned) and 4 descriptions
 * 4. Adds cross-negative keywords for other 9 towns
 * 5. Updates existing 5 ad groups with new negative keywords
 *
 * Run with: npm run add-secondary-towns
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { Customer, enums } from 'google-ads-api';
import { getCustomer, accountConfig } from '../lib/google-ads/client';

// Load environment variables from project root
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Base website URL - production domain
const BASE_URL = 'https://www.weatherwizardroofing.co.uk';

// Existing campaign details
const CUSTOMER_ID = '6652965980';
const CAMPAIGN_ID = '23510018792';
const CAMPAIGN_RESOURCE_NAME = `customers/${CUSTOMER_ID}/campaigns/${CAMPAIGN_ID}`;

// Town configurations
interface TownConfig {
  name: string;
  slug: string;
}

const NEW_TOWNS: TownConfig[] = [
  { name: 'Hastings', slug: 'hastings' },
  { name: 'Gravesend', slug: 'gravesend' },
  { name: 'Rochester', slug: 'rochester' },
  { name: 'Margate', slug: 'margate' },
  { name: 'Canterbury', slug: 'canterbury' },
];

const ORIGINAL_TOWNS = ['maidstone', 'dartford', 'gillingham', 'chatham', 'ashford'];
const ALL_OTHER_TOWNS = [...ORIGINAL_TOWNS, ...NEW_TOWNS.map(t => t.slug)];

// Generic headlines (same for all ads)
const GENERIC_HEADLINES = [
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
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if an ad group already exists by name in the campaign
 */
async function adGroupExists(customer: Customer, adGroupName: string): Promise<boolean> {
  const query = `
    SELECT ad_group.id, ad_group.name
    FROM ad_group
    WHERE ad_group.name = "${adGroupName}"
      AND ad_group.campaign = "${CAMPAIGN_RESOURCE_NAME}"
      AND ad_group.status != 'REMOVED'
  `;

  try {
    const results = await customer.query(query);
    return results.length > 0;
  } catch (error) {
    console.error(`Error checking if ad group exists: ${error}`);
    return false;
  }
}

/**
 * Get existing ad groups in the campaign
 */
async function getExistingAdGroups(customer: Customer): Promise<Array<{ name: string; resourceName: string }>> {
  const query = `
    SELECT ad_group.id, ad_group.name, ad_group.resource_name
    FROM ad_group
    WHERE ad_group.campaign = "${CAMPAIGN_RESOURCE_NAME}"
      AND ad_group.status != 'REMOVED'
  `;

  try {
    const results = await customer.query(query);
    return results.map((row: any) => ({
      name: row.ad_group.name,
      resourceName: row.ad_group.resource_name,
    }));
  } catch (error) {
    console.error(`Error getting existing ad groups: ${error}`);
    return [];
  }
}

/**
 * Create an ad group using mutateResources
 */
async function createAdGroup(
  customer: Customer,
  name: string
): Promise<string> {
  const response = await customer.mutateResources([
    {
      entity: 'ad_group',
      operation: 'create',
      resource: {
        name,
        campaign: CAMPAIGN_RESOURCE_NAME,
        status: enums.AdGroupStatus.ENABLED,
        type: enums.AdGroupType.SEARCH_STANDARD,
        cpc_bid_micros: 5000000, // £5.00 default CPC bid
      },
    },
  ]);

  const adGroupResult = (response as any).mutate_operation_responses?.[0]?.ad_group_result;
  const adGroupResourceName = adGroupResult?.resource_name;

  if (!adGroupResourceName) {
    throw new Error('Failed to create ad group - no resource name returned');
  }

  const adGroupId = adGroupResourceName.split('/').pop()!;
  console.log(`   ✅ Ad group created: ${name} (ID: ${adGroupId})`);
  return adGroupResourceName;
}

/**
 * Add keywords to an ad group
 */
async function addKeywords(
  customer: Customer,
  adGroupResourceName: string,
  keywords: string[]
): Promise<void> {
  const operations = keywords.map((keyword) => ({
    entity: 'ad_group_criterion' as const,
    operation: 'create' as const,
    resource: {
      ad_group: adGroupResourceName,
      keyword: {
        text: keyword,
        match_type: enums.KeywordMatchType.PHRASE,
      },
      status: enums.AdGroupCriterionStatus.ENABLED,
    },
  }));

  await customer.mutateResources(operations);
  console.log(`      ✅ Added ${keywords.length} keywords`);
}

/**
 * Add negative keywords to an ad group
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
  console.log(`      ✅ Added ${negativeKeywords.length} negative keywords`);
}

/**
 * Create a Responsive Search Ad
 */
async function createRSA(
  customer: Customer,
  adGroupResourceName: string,
  townName: string,
  slug: string
): Promise<void> {
  // Build headlines with 3 pinned town-specific headlines
  const pinnedHeadlines = [
    { text: `${townName}'s Trusted Roofers`, pinPosition: 1 },
    { text: `Top Rated Roofer in ${townName}`, pinPosition: 1 },
    { text: `${townName} Roof Repair Experts`, pinPosition: 1 },
  ];

  const allHeadlines = [...pinnedHeadlines, ...GENERIC_HEADLINES];

  const headlines = allHeadlines.map((h) => ({
    text: h.text,
    pinned_field: h.pinPosition
      ? enums.ServedAssetFieldType.HEADLINE_1
      : undefined,
  }));

  const descriptions = [
    `Professional roof repairs in ${townName}. 24/7 emergency service, free quotes. Call now!`,
    'Stop roof leaks fast. 20+ years experience, 10-year warranty. Free quote today.',
    `Expert roof repairs & gutter work in ${townName}. Family-owned, fully insured.`,
    `Free inspections, transparent pricing, guaranteed work. Serving ${townName}.`,
  ].map((text) => ({ text }));

  await customer.mutateResources([
    {
      entity: 'ad_group_ad',
      operation: 'create',
      resource: {
        ad_group: adGroupResourceName,
        status: enums.AdGroupAdStatus.ENABLED,
        ad: {
          final_urls: [`${BASE_URL}/${slug}`],
          responsive_search_ad: {
            headlines,
            descriptions,
          },
        },
      },
    },
  ]);
  console.log(`      ✅ Created RSA with ${headlines.length} headlines, ${descriptions.length} descriptions`);
}

/**
 * Create ad group for a town with keywords, negative keywords, and RSA
 */
async function createTownAdGroup(
  customer: Customer,
  town: TownConfig
): Promise<void> {
  console.log(`\n📂 Creating ad group: ${town.name}`);

  // Check if ad group already exists
  const exists = await adGroupExists(customer, town.name);
  if (exists) {
    console.log(`   ⚠️  Ad group "${town.name}" already exists. Skipping...`);
    return;
  }

  // Create ad group
  const adGroupResourceName = await createAdGroup(customer, town.name);

  // Add keywords (8 per town)
  console.log(`   🔑 Adding keywords...`);
  const keywords = [
    `${town.slug} roofers`,
    `${town.slug} roofing`,
    `roof repairs ${town.slug}`,
    `roofer in ${town.slug}`,
    `roofing company ${town.slug}`,
    `emergency roofer ${town.slug}`,
    `roof repair ${town.slug}`,
    `local roofer ${town.slug}`,
  ];
  await addKeywords(customer, adGroupResourceName, keywords);

  // Add negative keywords (all other 9 towns)
  console.log(`   🚫 Adding negative keywords...`);
  const negativeKeywords = ALL_OTHER_TOWNS.filter(t => t !== town.slug);
  await addNegativeKeywords(customer, adGroupResourceName, negativeKeywords);

  // Create RSA
  console.log(`   📝 Creating RSA...`);
  await createRSA(customer, adGroupResourceName, town.name, town.slug);

  console.log(`✅ Ad group "${town.name}" created successfully!`);
}

/**
 * Update existing ad groups with new negative keywords
 */
async function updateExistingAdGroupsWithNewNegatives(customer: Customer): Promise<void> {
  console.log('\n📝 Updating existing ad groups with new negative keywords...');
  console.log('─'.repeat(60));

  const existingAdGroups = await getExistingAdGroups(customer);
  const newTownSlugs = NEW_TOWNS.map(t => t.slug);

  for (const adGroup of existingAdGroups) {
    // Only update original 5 towns
    if (!ORIGINAL_TOWNS.some(town => adGroup.name.toLowerCase() === town)) {
      continue;
    }

    console.log(`\n   Updating: ${adGroup.name}`);
    await addNegativeKeywords(customer, adGroup.resourceName, newTownSlugs);
  }

  console.log('\n✅ Existing ad groups updated with new negative keywords!');
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('🚀 Adding Secondary Towns to Weather Wizard Campaign');
  console.log('='.repeat(80));
  console.log('\nThis script will:');
  console.log('   1. Add 5 new ad groups (Hastings, Gravesend, Rochester, Margate, Canterbury)');
  console.log('   2. Add keywords and RSAs for each new town');
  console.log('   3. Add cross-negative keywords');
  console.log('   4. Update existing 5 ad groups with new negative keywords');
  console.log(`\nTarget Campaign: Search - Roofing - Top 5 Towns (ID: ${CAMPAIGN_ID})`);
  console.log('='.repeat(80));

  try {
    const customer = getCustomer();

    // Create new town ad groups
    console.log('\n📁 Creating New Town Ad Groups...');
    for (const town of NEW_TOWNS) {
      await createTownAdGroup(customer, town);
    }

    // Update existing ad groups
    await updateExistingAdGroupsWithNewNegatives(customer);

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('✨ Secondary Towns Setup Complete!');
    console.log('='.repeat(80));
    console.log('\n📊 Summary:');
    console.log(`   ✅ ${NEW_TOWNS.length} new ad groups created`);
    console.log(`   ✅ ${NEW_TOWNS.length * 8} keywords added (8 per town)`);
    console.log(`   ✅ ${NEW_TOWNS.length * 9} negative keywords added (9 per town)`);
    console.log(`   ✅ ${NEW_TOWNS.length} RSAs created`);
    console.log(`   ✅ ${ORIGINAL_TOWNS.length} existing ad groups updated with new negatives`);

    console.log('\n📌 Next Steps:');
    console.log('   1. Review new ad groups in Google Ads UI');
    console.log('   2. Verify ad copy and URLs are correct');
    console.log('   3. Monitor performance and adjust bids as needed');
    console.log('   4. Consider adjusting campaign budget if needed (currently £30/day for 10 towns)\n');

  } catch (error: any) {
    console.error('\n❌ Error adding secondary towns:');
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
