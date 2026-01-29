/**
 * Update Google Ads Final URLs with Dynamic Keyword Insertion
 *
 * This script updates all existing Responsive Search Ads to include
 * dynamic keyword insertion in their final URLs for better tracking.
 *
 * IMPORTANT: RSAs cannot be directly updated in Google Ads. Instead, this script:
 * 1. Queries existing RSAs to get their details
 * 2. Creates new RSAs with the same headlines/descriptions but updated final URLs
 * 3. Logs what was created (old ads remain active unless manually removed)
 *
 * URL Format:
 * - Location pages: https://www.weatherwizardroofing.co.uk/[location]?keyword={keyword:fallback}
 * - Base URL: https://www.weatherwizardroofing.co.uk?keyword={keyword:roof+repairs+kent}
 *
 * Run with: npm run update-ad-urls
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { Customer, enums } from 'google-ads-api';
import { getCustomer } from '../lib/google-ads/client';
import { getAllAreas } from '../lib/areas';
import * as readline from 'readline';

// Load environment variables from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const BASE_URL = 'https://www.weatherwizardroofing.co.uk';

// Interface for ad data
interface AdData {
  adGroupId: string;
  adGroupName: string;
  adId: string;
  currentFinalUrl: string;
  headlines: Array<{ text: string; pinned_field?: number }>;
  descriptions: Array<{ text: string }>;
  status: string;
}

/**
 * Generate new final URL with dynamic keyword insertion
 */
function generateNewFinalUrl(currentUrl: string): string {
  // Remove existing query parameters if any
  const urlObj = new URL(currentUrl);
  const pathname = urlObj.pathname;

  // Determine fallback keyword based on URL
  let fallbackKeyword = 'roof+repairs+kent';

  // Check if this is a location-specific URL
  const areas = getAllAreas();
  const areaSlug = pathname.substring(1); // Remove leading slash

  if (areaSlug && areas.find(area => area.slug === areaSlug)) {
    const areaName = areas.find(area => area.slug === areaSlug)?.name || areaSlug;
    fallbackKeyword = `roof+repairs+${areaName.toLowerCase().replace(/\s+/g, '+')}`;
  }

  // Build new URL with dynamic keyword insertion
  return `${BASE_URL}${pathname}?keyword={keyword:${fallbackKeyword}}`;
}

/**
 * Query all existing Responsive Search Ads
 */
async function queryExistingAds(customer: Customer): Promise<AdData[]> {
  const query = `
    SELECT
      ad_group.id,
      ad_group.name,
      ad_group_ad.ad.id,
      ad_group_ad.ad.final_urls,
      ad_group_ad.ad.responsive_search_ad.headlines,
      ad_group_ad.ad.responsive_search_ad.descriptions,
      ad_group_ad.status
    FROM ad_group_ad
    WHERE ad_group_ad.status != 'REMOVED'
      AND ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD'
  `;

  const results = await customer.query(query);
  const adsData: AdData[] = [];

  for (const row of results) {
    const adGroup = row.ad_group;
    const ad = row.ad_group_ad.ad;
    const rsa = ad.responsive_search_ad;

    adsData.push({
      adGroupId: adGroup.id.toString(),
      adGroupName: adGroup.name,
      adId: ad.id.toString(),
      currentFinalUrl: ad.final_urls[0],
      headlines: rsa.headlines.map((h: any) => ({
        text: h.text,
        pinned_field: h.pinned_field,
      })),
      descriptions: rsa.descriptions.map((d: any) => ({ text: d.text })),
      status: row.ad_group_ad.status,
    });
  }

  return adsData;
}

/**
 * Preview changes before applying
 */
function previewChanges(adsData: AdData[]): void {
  console.log('\n📋 Preview of URL Changes:');
  console.log('='.repeat(80));

  for (const ad of adsData) {
    const newUrl = generateNewFinalUrl(ad.currentFinalUrl);

    console.log(`\n📂 Ad Group: ${ad.adGroupName}`);
    console.log(`   Ad ID: ${ad.adId}`);
    console.log(`   Current URL: ${ad.currentFinalUrl}`);
    console.log(`   New URL:     ${newUrl}`);
    console.log(`   Headlines: ${ad.headlines.length}, Descriptions: ${ad.descriptions.length}`);
  }

  console.log('\n' + '='.repeat(80));
}

/**
 * Ask user for confirmation
 */
async function askConfirmation(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

/**
 * Create new RSA with updated final URL
 */
async function createUpdatedRSA(
  customer: Customer,
  adGroupId: string,
  ad: AdData
): Promise<void> {
  const newFinalUrl = generateNewFinalUrl(ad.currentFinalUrl);

  // Get the customer ID for building resource name
  const customerId = customer.credentials.customer_id.replace(/-/g, '');
  const adGroupResourceName = `customers/${customerId}/adGroups/${adGroupId}`;

  await customer.mutateResources([
    {
      entity: 'ad_group_ad',
      operation: 'create',
      resource: {
        ad_group: adGroupResourceName,
        status: enums.AdGroupAdStatus.ENABLED,
        ad: {
          final_urls: [newFinalUrl],
          responsive_search_ad: {
            headlines: ad.headlines,
            descriptions: ad.descriptions,
          },
        },
      },
    },
  ]);
}

/**
 * Apply updates by creating new RSAs with updated URLs
 */
async function applyUpdates(customer: Customer, adsData: AdData[]): Promise<void> {
  console.log('\n🔄 Creating New RSAs with Updated URLs...');
  console.log('='.repeat(80));

  let successCount = 0;
  let errorCount = 0;

  for (const ad of adsData) {
    try {
      await createUpdatedRSA(customer, ad.adGroupId, ad);
      const newUrl = generateNewFinalUrl(ad.currentFinalUrl);
      console.log(`   ✅ Created new RSA in "${ad.adGroupName}"`);
      console.log(`      New URL: ${newUrl}`);
      successCount++;
    } catch (error: any) {
      console.error(`   ❌ Failed to create RSA in "${ad.adGroupName}": ${error.message}`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`✅ Successfully created: ${successCount} RSAs`);
  if (errorCount > 0) {
    console.log(`❌ Failed: ${errorCount} RSAs`);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Update Google Ads Final URLs with Dynamic Keyword Insertion');
  console.log('='.repeat(80));
  console.log('\nThis script will:');
  console.log('   1. Query all existing Responsive Search Ads');
  console.log('   2. Show a preview of URL changes');
  console.log('   3. Create new RSAs with updated final URLs');
  console.log('   4. Keep old RSAs active (you can pause/remove them manually)');
  console.log('\n⚠️  Note: RSAs cannot be directly updated, so new ads will be created.\n');
  console.log('='.repeat(80));

  try {
    const customer = getCustomer();

    // Step 1: Query existing ads
    console.log('\n🔍 Querying Existing Ads...');
    const adsData = await queryExistingAds(customer);

    if (adsData.length === 0) {
      console.log('   ℹ️  No active Responsive Search Ads found.');
      return;
    }

    console.log(`   ✅ Found ${adsData.length} active RSAs`);

    // Step 2: Preview changes
    previewChanges(adsData);

    // Step 3: Ask for confirmation (skip if --yes flag provided)
    const autoConfirm = process.argv.includes('--yes') || process.argv.includes('-y');

    if (!autoConfirm) {
      const confirmed = await askConfirmation('\n❓ Do you want to proceed with creating new RSAs? (y/n): ');

      if (!confirmed) {
        console.log('\n❌ Update cancelled by user.');
        return;
      }
    } else {
      console.log('\n✅ Auto-confirming with --yes flag');
    }

    // Step 4: Apply updates
    await applyUpdates(customer, adsData);

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('✨ URL Update Complete!');
    console.log('='.repeat(80));
    console.log('\n📌 Next Steps:');
    console.log('   1. Review new ads in Google Ads UI');
    console.log('   2. Verify URLs are correct');
    console.log('   3. Pause or remove old ads if desired');
    console.log('   4. Monitor performance of new ads');
    console.log('\n⚠️  Note: Old ads are still active. You can pause them manually.\n');

  } catch (error: any) {
    console.error('\n❌ Error updating ads:');
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
