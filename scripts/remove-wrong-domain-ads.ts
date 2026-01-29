/**
 * Remove Google Ads RSAs with Wrong Domain
 *
 * This script REMOVES (deletes) Responsive Search Ads that use the incorrect domain
 * "weatherwizard.co.uk" instead of the correct "weatherwizardroofing.co.uk".
 *
 * The script:
 * 1. Queries all existing RSAs (ENABLED and PAUSED)
 * 2. Filters for ads with final URLs containing "weatherwizard.co.uk" but NOT "weatherwizardroofing.co.uk"
 * 3. Shows a preview of which ads will be removed
 * 4. Removes them by setting status to REMOVED
 *
 * Run with: npm run remove-wrong-ads
 * Auto-confirm: npm run remove-wrong-ads -- --yes
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { Customer, enums } from 'google-ads-api';
import { getCustomer } from '../lib/google-ads/client';
import * as readline from 'readline';

// Load environment variables from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const WRONG_DOMAIN = 'weatherwizard.co.uk';
const CORRECT_DOMAIN = 'weatherwizardroofing.co.uk';

// Interface for ad data
interface AdData {
  resourceName: string;
  adGroupId: string;
  adGroupName: string;
  adId: string;
  finalUrl: string;
  headlines: string[];
  status: string;
}

/**
 * Check if URL contains the wrong domain
 */
function hasWrongDomain(url: string): boolean {
  const urlLower = url.toLowerCase();
  return urlLower.includes(WRONG_DOMAIN) && !urlLower.includes(CORRECT_DOMAIN);
}

/**
 * Query all existing Responsive Search Ads
 */
async function queryAllAds(customer: Customer): Promise<AdData[]> {
  const query = `
    SELECT
      ad_group_ad.resource_name,
      ad_group.id,
      ad_group.name,
      ad_group_ad.ad.id,
      ad_group_ad.ad.final_urls,
      ad_group_ad.ad.responsive_search_ad.headlines,
      ad_group_ad.status
    FROM ad_group_ad
    WHERE ad_group_ad.status IN ('ENABLED', 'PAUSED')
      AND ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD'
  `;

  const results = await customer.query(query);
  const adsData: AdData[] = [];

  for (const row of results) {
    const adGroup = row.ad_group;
    const ad = row.ad_group_ad.ad;
    const rsa = ad.responsive_search_ad;

    adsData.push({
      resourceName: row.ad_group_ad.resource_name,
      adGroupId: adGroup.id.toString(),
      adGroupName: adGroup.name,
      adId: ad.id.toString(),
      finalUrl: ad.final_urls[0],
      headlines: rsa.headlines.map((h: any) => h.text),
      status: row.ad_group_ad.status,
    });
  }

  return adsData;
}

/**
 * Filter ads with wrong domain
 */
function filterWrongDomainAds(adsData: AdData[]): AdData[] {
  return adsData.filter(ad => hasWrongDomain(ad.finalUrl));
}

/**
 * Preview ads to be removed
 */
function previewRemoval(adsData: AdData[]): void {
  console.log('\n📋 Preview of Ads to be REMOVED:');
  console.log('='.repeat(80));

  if (adsData.length === 0) {
    console.log('\n   ℹ️  No ads with wrong domain found.');
    return;
  }

  for (const ad of adsData) {
    console.log(`\n🗑️  Ad Group: ${ad.adGroupName}`);
    console.log(`   Ad ID: ${ad.adId}`);
    console.log(`   Status: ${ad.status}`);
    console.log(`   Final URL: ${ad.finalUrl}`);
    console.log(`   Headlines: ${ad.headlines.slice(0, 2).join(', ')}${ad.headlines.length > 2 ? '...' : ''}`);
  }

  console.log('\n' + '='.repeat(80));
  console.log(`\n⚠️  Total ads to be REMOVED: ${adsData.length}`);
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
 * Remove ads using the 'remove' operation
 */
async function removeAds(customer: Customer, adsData: AdData[]): Promise<void> {
  console.log('\n🗑️  Removing Ads with Wrong Domain...');
  console.log('='.repeat(80));

  let successCount = 0;
  let errorCount = 0;

  for (const ad of adsData) {
    try {
      // Use 'remove' operation to delete the ad - pass resource_name as string
      await customer.mutateResources([
        {
          entity: 'ad_group_ad',
          operation: 'remove',
          resource: ad.resourceName,
        },
      ]);

      console.log(`   ✅ Removed ad ${ad.adId} from "${ad.adGroupName}"`);
      console.log(`      URL: ${ad.finalUrl}`);
      successCount++;
    } catch (error: any) {
      // Extract detailed error information
      let errorMsg = 'Unknown error';
      if (error.message) {
        errorMsg = error.message;
      } else if (error.errors && error.errors.length > 0) {
        errorMsg = error.errors.map((e: any) => e.message || JSON.stringify(e)).join(', ');
      } else {
        errorMsg = JSON.stringify(error);
      }
      console.error(`   ❌ Failed to remove ad ${ad.adId} from "${ad.adGroupName}"`);
      console.error(`      Resource: ${ad.resourceName}`);
      console.error(`      Error: ${errorMsg}`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`✅ Successfully removed: ${successCount} ads`);
  if (errorCount > 0) {
    console.log(`❌ Failed: ${errorCount} ads`);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Remove Google Ads with Wrong Domain');
  console.log('='.repeat(80));
  console.log(`\n   ❌ Wrong domain: ${WRONG_DOMAIN}`);
  console.log(`   ✅ Correct domain: ${CORRECT_DOMAIN}`);
  console.log('\nThis script will:');
  console.log('   1. Query all existing Responsive Search Ads (ENABLED and PAUSED)');
  console.log('   2. Filter for ads with the wrong domain');
  console.log('   3. Show a preview of which ads will be removed');
  console.log('   4. PERMANENTLY REMOVE them by setting status to REMOVED');
  console.log('\n' + '='.repeat(80));

  try {
    const customer = getCustomer();

    // Step 1: Query all ads
    console.log('\n🔍 Querying All Ads...');
    const allAds = await queryAllAds(customer);
    console.log(`   ✅ Found ${allAds.length} active RSAs`);

    // Step 2: Filter for wrong domain
    console.log('\n🔍 Filtering for Wrong Domain...');
    const wrongDomainAds = filterWrongDomainAds(allAds);

    if (wrongDomainAds.length === 0) {
      console.log('   ℹ️  No ads with wrong domain found. All ads are using the correct domain.');
      console.log('\n✨ Nothing to do!');
      return;
    }

    console.log(`   ⚠️  Found ${wrongDomainAds.length} ads with wrong domain`);

    // Step 3: Preview removal
    previewRemoval(wrongDomainAds);

    // Step 4: Ask for confirmation (skip if --yes flag provided)
    const autoConfirm = process.argv.includes('--yes') || process.argv.includes('-y');

    if (!autoConfirm) {
      const confirmed = await askConfirmation('\n❓ Do you want to PERMANENTLY REMOVE these ads? (y/n): ');

      if (!confirmed) {
        console.log('\n❌ Operation cancelled by user.');
        return;
      }
    } else {
      console.log('\n✅ Auto-confirming with --yes flag');
    }

    // Step 5: Remove ads
    await removeAds(customer, wrongDomainAds);

    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('✨ Removal Complete!');
    console.log('='.repeat(80));
    console.log('\n📌 Next Steps:');
    console.log('   1. Verify ads are removed in Google Ads UI');
    console.log('   2. Check that remaining active ads use correct domain');
    console.log('   3. Monitor campaign performance');
    console.log('');

  } catch (error: any) {
    console.error('\n❌ Error removing ads:');
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
