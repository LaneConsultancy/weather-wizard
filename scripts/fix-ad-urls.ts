/**
 * Fix ad URLs - update from weatherwizard.co.uk to weatherwizardroofing.co.uk
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { GoogleAdsApi } from 'google-ads-api';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const OLD_DOMAIN = 'weatherwizard.co.uk';
const NEW_DOMAIN = 'www.weatherwizardroofing.co.uk';

async function main() {
  console.log(`Updating ad URLs from ${OLD_DOMAIN} to ${NEW_DOMAIN}...\n`);

  const client = new GoogleAdsApi({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  });

  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID!;

  const customer = client.Customer({
    customer_id: customerId,
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
    login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
  });

  try {
    // Get all ads with their URLs
    const ads = await customer.query(`
      SELECT
        ad_group_ad.ad.id,
        ad_group_ad.ad.resource_name,
        ad_group_ad.ad.final_urls,
        ad_group_ad.ad.responsive_search_ad.headlines,
        ad_group_ad.ad_group,
        ad_group.name,
        campaign.name
      FROM ad_group_ad
      WHERE ad_group_ad.status != 'REMOVED'
        AND campaign.status != 'REMOVED'
    `);

    console.log(`Found ${ads.length} ads to check\n`);

    let updatedCount = 0;

    for (const row of ads) {
      const ad = row.ad_group_ad?.ad;
      const adGroupName = row.ad_group?.name;
      const campaignName = row.campaign?.name;

      if (!ad?.final_urls || ad.final_urls.length === 0) continue;

      const currentUrl = ad.final_urls[0];

      if (currentUrl.includes(OLD_DOMAIN)) {
        const newUrl = currentUrl.replace(OLD_DOMAIN, NEW_DOMAIN);

        console.log(`Campaign: ${campaignName}`);
        console.log(`Ad Group: ${adGroupName}`);
        console.log(`  Old URL: ${currentUrl}`);
        console.log(`  New URL: ${newUrl}`);

        // Update the ad - need to remove and recreate since final_urls can't be updated
        // Actually, let's try updating via mutateResources
        try {
          await customer.mutateResources([
            {
              entity: 'ad',
              operation: 'update',
              resource: {
                resource_name: ad.resource_name,
                final_urls: [newUrl],
              },
            },
          ]);
          console.log(`  ✅ Updated\n`);
          updatedCount++;
        } catch (updateError: any) {
          console.log(`  ❌ Error: ${updateError.message}\n`);
        }
      }
    }

    console.log(`\n✅ Updated ${updatedCount} ads`);

    if (updatedCount > 0) {
      console.log('\n📋 Next steps:');
      console.log('   1. Wait for Google to re-review the ads (usually 1-2 business days)');
      console.log('   2. Make sure the landing pages are live and accessible');
      console.log('   3. Check the ads again in Google Ads UI');
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);

    if (error.errors) {
      console.error('\nAPI Errors:');
      for (const e of error.errors) {
        console.error(`   - ${e.message}`);
      }
    }
  }
}

main();
