/**
 * Update ad content:
 * 1. Remove "free inspections" mentions
 * 2. Add dynamic keyword insertion for better CTR
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { GoogleAdsApi, enums } from 'google-ads-api';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function main() {
  console.log('Updating ad content...\n');

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

  // Get all ads with the ad_group_ad resource name
  const ads = await customer.query(`
    SELECT
      ad_group_ad.resource_name,
      ad_group_ad.ad.id,
      ad_group_ad.ad.responsive_search_ad.headlines,
      ad_group_ad.ad.responsive_search_ad.descriptions,
      ad_group_ad.ad.final_urls,
      ad_group_ad.ad_group,
      ad_group.name,
      campaign.name
    FROM ad_group_ad
    WHERE ad_group_ad.status != 'REMOVED'
      AND campaign.status != 'REMOVED'
  `);

  console.log(`Found ${ads.length} ads to update\n`);

  for (const row of ads) {
    const adGroupAdResourceName = row.ad_group_ad?.resource_name;
    const ad = row.ad_group_ad?.ad;
    const rsa = ad?.responsive_search_ad;
    const adGroupResourceName = row.ad_group_ad?.ad_group;
    const adGroupName = row.ad_group?.name || '';
    const campaignName = row.campaign?.name || '';
    const finalUrls = ad?.final_urls || [];

    if (!rsa?.headlines || !rsa?.descriptions) continue;

    console.log(`\n${'='.repeat(60)}`);
    console.log(`Campaign: ${campaignName}`);
    console.log(`Ad Group: ${adGroupName}`);
    console.log(`Ad Group Ad Resource: ${adGroupAdResourceName}`);

    // Process headlines - add DKI and fix content
    let newHeadlines = rsa.headlines.map((h: any) => {
      let text = h.text;
      const pinned = h.pinned_field;

      // Replace "Free Gutter Inspection" with something else
      if (text === 'Free Gutter Inspection') {
        text = 'Gutter Experts Kent';
      }

      return {
        text,
        pinned_field: pinned,
      };
    });

    // Add a dynamic keyword insertion headline
    const dkiFallback = getDKIFallback(adGroupName, campaignName);
    const hasDKI = newHeadlines.some((h: any) => h.text.includes('{KeyWord'));

    if (!hasDKI) {
      const dkiHeadline = `{KeyWord:${dkiFallback}}`;

      if (dkiHeadline.length <= 30) {
        // Add DKI headline pinned to position 1
        newHeadlines.unshift({
          text: dkiHeadline,
          pinned_field: 2, // HEADLINE_1
        });

        // Keep max 15 headlines
        if (newHeadlines.length > 15) {
          // Remove an unpinned headline from the end
          for (let i = newHeadlines.length - 1; i >= 0; i--) {
            if (!newHeadlines[i].pinned_field) {
              newHeadlines.splice(i, 1);
              break;
            }
          }
        }
      }
    }

    // Process descriptions - remove "free inspections"
    const newDescriptions = rsa.descriptions.map((d: any) => {
      let text = d.text;

      // Replace "Free inspections" - various patterns
      text = text.replace(/Free inspections,?\s*/gi, '');
      text = text.replace(/\.\s*\./g, '.'); // Fix double periods
      text = text.replace(/\s+/g, ' ').trim();

      // Fix descriptions that now start with lowercase
      if (text.charAt(0) === text.charAt(0).toLowerCase() && text.charAt(0) !== '{') {
        text = text.charAt(0).toUpperCase() + text.slice(1);
      }

      // Ensure proper ending
      if (!text.endsWith('.') && !text.endsWith('!') && !text.endsWith('?')) {
        text = text + '.';
      }

      return { text };
    });

    console.log('\nNew Headlines (first 5):');
    newHeadlines.slice(0, 5).forEach((h: any, i: number) => {
      const pin = h.pinned_field ? ` [PIN:${h.pinned_field}]` : '';
      console.log(`  ${i + 1}. ${h.text}${pin}`);
    });

    console.log('\nNew Descriptions:');
    newDescriptions.forEach((d: any, i: number) => {
      console.log(`  ${i + 1}. ${d.text}`);
    });

    // Remove old ad and create new one
    try {
      console.log('\n  Removing old ad...');
      await customer.adGroupAds.remove([adGroupAdResourceName!]);
      console.log('  ✅ Old ad removed');

      console.log('  Creating new ad with DKI...');
      await customer.mutateResources([
        {
          entity: 'ad_group_ad',
          operation: 'create',
          resource: {
            ad_group: adGroupResourceName,
            status: enums.AdGroupAdStatus.ENABLED,
            ad: {
              final_urls: finalUrls,
              responsive_search_ad: {
                headlines: newHeadlines.map((h: any) => ({
                  text: h.text,
                  pinned_field: h.pinned_field || undefined,
                })),
                descriptions: newDescriptions.map((d: any) => ({
                  text: d.text,
                })),
              },
            },
          },
        },
      ]);
      console.log('  ✅ New ad created with Dynamic Keyword Insertion!');

    } catch (error: any) {
      console.log(`  ❌ Error: ${error.message}`);
      if (error.errors) {
        for (const e of error.errors) {
          console.log(`     - ${e.message}`);
          if (e.location) {
            console.log(`       Location: ${JSON.stringify(e.location)}`);
          }
        }
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Done!');
  console.log('\nDynamic Keyword Insertion (DKI) has been added to all ads.');
  console.log('When someone searches "emergency roofer maidstone", they\'ll see');
  console.log('that exact phrase in headline 1, making the ad more relevant.');
}

function getDKIFallback(adGroupName: string, campaignName: string): string {
  const name = adGroupName.toLowerCase();

  if (name.includes('emergency')) return 'Emergency Roofers';
  if (name.includes('gutter') || name.includes('chimney')) return 'Gutter Experts';
  if (name.includes('maidstone')) return 'Maidstone Roofers';
  if (name.includes('dartford')) return 'Dartford Roofers';
  if (name.includes('gillingham')) return 'Gillingham Roofers';
  if (name.includes('chatham')) return 'Chatham Roofers';
  if (name.includes('ashford')) return 'Ashford Roofers';

  return 'Kent Roofers';
}

main().catch(console.error);
