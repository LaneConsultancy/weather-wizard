/**
 * Fix extension URLs - update from weatherwizard.co.uk to weatherwizardroofing.co.uk
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { GoogleAdsApi } from 'google-ads-api';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const OLD_DOMAIN = 'weatherwizard.co.uk';
const NEW_DOMAIN = 'www.weatherwizardroofing.co.uk';

async function main() {
  console.log(`Checking extension URLs...\n`);

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
    // Check for sitelink assets
    const assets = await customer.query(`
      SELECT
        asset.id,
        asset.resource_name,
        asset.name,
        asset.type,
        asset.sitelink_asset.link_text,
        asset.sitelink_asset.description1,
        asset.sitelink_asset.description2,
        asset.final_urls
      FROM asset
      WHERE asset.type = 'SITELINK'
    `);

    console.log(`Found ${assets.length} sitelink assets\n`);

    let updatedCount = 0;

    for (const row of assets) {
      const asset = row.asset;
      if (!asset?.final_urls || asset.final_urls.length === 0) continue;

      const currentUrl = asset.final_urls[0];
      const linkText = asset.sitelink_asset?.link_text || 'Unknown';

      if (currentUrl.includes(OLD_DOMAIN)) {
        const newUrl = currentUrl.replace(OLD_DOMAIN, NEW_DOMAIN);

        console.log(`Sitelink: ${linkText}`);
        console.log(`  Old URL: ${currentUrl}`);
        console.log(`  New URL: ${newUrl}`);

        try {
          await customer.mutateResources([
            {
              entity: 'asset',
              operation: 'update',
              resource: {
                resource_name: asset.resource_name,
                final_urls: [newUrl],
              },
            },
          ]);
          console.log(`  ✅ Updated\n`);
          updatedCount++;
        } catch (updateError: any) {
          console.log(`  ❌ Error: ${updateError.message}\n`);
        }
      } else {
        console.log(`Sitelink: ${linkText} - URL already correct: ${currentUrl}`);
      }
    }

    console.log(`\n✅ Updated ${updatedCount} sitelink assets`);

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
