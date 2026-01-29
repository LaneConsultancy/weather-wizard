/**
 * Example: Create a Complete Google Ads Campaign
 *
 * This example demonstrates how to create a full campaign structure:
 * 1. Create a campaign
 * 2. Create an ad group
 * 3. Add keywords
 * 4. Create ads (placeholder - requires additional setup)
 *
 * NOTE: This is an example only. Do not run without reviewing.
 * Run with: npm run example-create-campaign
 */

import { createSearchCampaign, enableCampaign } from '../lib/google-ads/campaigns';
import { addKeywordsToAdGroup } from '../lib/google-ads/keywords';
import { getCustomer } from '../lib/google-ads/client';
import { toMicros, formatCampaignDate } from '../lib/google-ads/types';

async function createExampleCampaign() {
  console.log('📝 Example: Create a Google Ads Campaign for Roof Repairs\n');
  console.log('='.repeat(60));
  console.log('⚠️  This is an example script. Review before running in production.\n');

  const DRY_RUN = true; // Set to false to actually create the campaign

  if (DRY_RUN) {
    console.log('🔒 DRY RUN MODE - No changes will be made\n');
  }

  try {
    // Step 1: Create the campaign
    console.log('📋 Step 1: Create Campaign');
    console.log('-'.repeat(60));

    const campaignConfig = {
      name: 'Roof Repairs - Maidstone',
      budgetAmountMicros: toMicros(25), // £25/day
      budgetName: 'Roof Repairs Maidstone Budget',
      startDate: formatCampaignDate(new Date()), // Start today
      // endDate: '20261231', // Optional: end date
    };

    console.log('Campaign Config:');
    console.log(`   Name: ${campaignConfig.name}`);
    console.log(`   Budget: £25/day`);
    console.log(`   Start Date: ${campaignConfig.startDate}`);
    console.log('');

    if (DRY_RUN) {
      console.log('✅ [DRY RUN] Would create campaign\n');
    } else {
      const { campaignId, budgetId } = await createSearchCampaign(campaignConfig);
      console.log(`✅ Campaign created!`);
      console.log(`   Campaign ID: ${campaignId}`);
      console.log(`   Budget ID: ${budgetId}\n`);
    }

    // Step 2: Create an ad group
    console.log('📋 Step 2: Create Ad Group');
    console.log('-'.repeat(60));

    const adGroupConfig = {
      name: 'Emergency Roof Repairs',
      // In real implementation, you'd use the campaignId from step 1
    };

    console.log('Ad Group Config:');
    console.log(`   Name: ${adGroupConfig.name}`);
    console.log('');

    if (DRY_RUN) {
      console.log('✅ [DRY RUN] Would create ad group\n');
    } else {
      // You would create the ad group here using the Google Ads API
      // const adGroupId = await createAdGroup(campaignId, adGroupConfig);
      console.log('⚠️  Ad group creation not yet implemented in this example\n');
    }

    // Step 3: Add keywords
    console.log('📋 Step 3: Add Keywords');
    console.log('-'.repeat(60));

    const keywords = [
      { text: 'emergency roof repair maidstone', matchType: 'PHRASE' as const },
      { text: 'roof repair maidstone', matchType: 'PHRASE' as const },
      { text: 'roofer maidstone', matchType: 'PHRASE' as const },
      { text: 'emergency roofer maidstone', matchType: 'PHRASE' as const },
      { text: 'roof leak repair maidstone', matchType: 'EXACT' as const },
    ];

    console.log('Keywords to add:');
    keywords.forEach((kw, index) => {
      console.log(`   ${index + 1}. "${kw.text}" [${kw.matchType}]`);
    });
    console.log('');

    if (DRY_RUN) {
      console.log('✅ [DRY RUN] Would add keywords\n');
    } else {
      // You would add keywords here after creating the ad group
      // const keywordIds = await addKeywordsToAdGroup(adGroupId, keywords);
      console.log('⚠️  Keywords would be added after ad group creation\n');
    }

    // Step 4: Create responsive search ads
    console.log('📋 Step 4: Create Responsive Search Ads');
    console.log('-'.repeat(60));

    const adConfig = {
      headlines: [
        'Emergency Roof Repairs',
        'Expert Roofers in Maidstone',
        '24/7 Roof Repair Service',
        'Fast & Reliable Roofing',
      ],
      descriptions: [
        'Professional roof repair services in Maidstone. Available 24/7 for emergencies.',
        'Trusted local roofers serving Kent for over 20 years.',
      ],
      finalUrl: 'https://weatherwizard.co.uk/maidstone',
    };

    console.log('Ad Config:');
    console.log('Headlines:');
    adConfig.headlines.forEach((h, i) => console.log(`   ${i + 1}. "${h}"`));
    console.log('\nDescriptions:');
    adConfig.descriptions.forEach((d, i) => console.log(`   ${i + 1}. "${d}"`));
    console.log(`\nFinal URL: ${adConfig.finalUrl}`);
    console.log('');

    if (DRY_RUN) {
      console.log('✅ [DRY RUN] Would create responsive search ad\n');
    } else {
      // You would create the ad here
      // const adId = await createResponsiveSearchAd(adGroupId, adConfig);
      console.log('⚠️  Ad creation not yet implemented in this example\n');
    }

    // Step 5: Enable the campaign
    console.log('📋 Step 5: Enable Campaign');
    console.log('-'.repeat(60));

    if (DRY_RUN) {
      console.log('✅ [DRY RUN] Would enable campaign (set to ENABLED status)\n');
    } else {
      // After verifying everything is set up correctly, enable the campaign
      // await enableCampaign(campaignId);
      console.log('⚠️  Campaign would be enabled after verification\n');
    }

    // Summary
    console.log('='.repeat(60));
    console.log('\n✨ Campaign Creation Flow Complete!\n');

    if (DRY_RUN) {
      console.log('To actually create this campaign:');
      console.log('1. Review the configuration above');
      console.log('2. Set DRY_RUN = false in the script');
      console.log('3. Implement ad group and ad creation');
      console.log('4. Run the script again\n');
    }

    console.log('📌 Important Notes:');
    console.log('   • Campaigns are created in PAUSED status by default');
    console.log('   • Always verify setup before enabling');
    console.log('   • Monitor performance and adjust bids accordingly');
    console.log('   • Link campaigns to your area-specific landing pages');
    console.log('   • Set up conversion tracking for better optimization\n');

  } catch (error: any) {
    console.error('\n❌ Error creating campaign:');
    console.error(error.message);
    if (error.errors) {
      error.errors.forEach((err: any) => {
        console.error(`   ${err.message}`);
      });
    }
    process.exit(1);
  }
}

// Run the example
createExampleCampaign();
