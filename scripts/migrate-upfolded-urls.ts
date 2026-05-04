/**
 * Phase F migration — strip `/upfolded-new` prefix from any ad's final URL.
 *
 * Context: the `/upfolded-new/*` route is being retired. Active ads pointing at
 * `/upfolded-new/{slug}` would 308-redirect after the route is removed, hurting
 * Quality Score and slowing landing-page experience. This script finds those
 * ads and creates new RSAs with the prefix stripped.
 *
 * Google Ads RSAs cannot be mutated — they must be re-created. This script:
 *  1. Queries all active RSAs.
 *  2. Filters to those whose final URL contains `/upfolded-new`.
 *  3. For each, creates a NEW RSA in the same ad group with identical
 *     headlines/descriptions but the prefix stripped from the URL.
 *  4. Old RSAs remain active until the user pauses or removes them by hand
 *     in the Google Ads UI (RSAs cannot be programmatically removed safely).
 *
 * Run with:
 *   npx tsx scripts/migrate-upfolded-urls.ts          # preview only
 *   npx tsx scripts/migrate-upfolded-urls.ts --apply  # actually create new RSAs
 *
 * After running with --apply, manually pause the old ads in Google Ads UI
 * (filter by final URL contains "/upfolded-new", select all, pause).
 */

import * as dotenv from "dotenv";
import * as path from "path";
import { Customer, enums } from "google-ads-api";
import { getCustomer } from "../lib/google-ads/client";
import * as readline from "readline";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const BASE_URL = "https://www.weatherwizardroofing.co.uk";
const PREFIX_TO_STRIP = "/upfolded-new";

interface AdRow {
  campaignName: string;
  adGroupId: string;
  adGroupName: string;
  adId: string;
  currentFinalUrl: string;
  newFinalUrl: string;
  headlines: Array<{ text: string; pinned_field?: number }>;
  descriptions: Array<{ text: string }>;
}

function rewriteUrl(currentUrl: string): string | null {
  let urlObj: URL;
  try {
    urlObj = new URL(currentUrl);
  } catch {
    return null;
  }

  if (!urlObj.pathname.startsWith(PREFIX_TO_STRIP)) {
    return null;
  }

  const stripped = urlObj.pathname.slice(PREFIX_TO_STRIP.length) || "/";
  const search = urlObj.search;
  return `${BASE_URL}${stripped}${search}`;
}

async function queryAds(customer: Customer): Promise<AdRow[]> {
  const query = `
    SELECT
      campaign.name,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const results = (await customer.query(query)) as any[];
  const out: AdRow[] = [];

  for (const row of results) {
    const ad = row.ad_group_ad.ad;
    const currentFinalUrl: string = ad.final_urls?.[0] ?? "";
    const newFinalUrl = rewriteUrl(currentFinalUrl);
    if (!newFinalUrl) continue;

    const rsa = ad.responsive_search_ad;
    out.push({
      campaignName: row.campaign.name,
      adGroupId: row.ad_group.id.toString(),
      adGroupName: row.ad_group.name,
      adId: ad.id.toString(),
      currentFinalUrl,
      newFinalUrl,
      headlines: rsa.headlines.map((h: { text: string; pinned_field?: number }) => ({
        text: h.text,
        pinned_field: h.pinned_field,
      })),
      descriptions: rsa.descriptions.map((d: { text: string }) => ({ text: d.text })),
    });
  }

  return out;
}

function preview(rows: AdRow[]): void {
  if (rows.length === 0) {
    console.log("\n✅ No ads found with /upfolded-new in their final URL. Nothing to migrate.\n");
    return;
  }

  console.log(`\n📋 Found ${rows.length} ads to migrate:\n`);
  console.log("=".repeat(80));
  for (const row of rows) {
    console.log(`\n${row.campaignName} > ${row.adGroupName}`);
    console.log(`  Ad ID: ${row.adId}`);
    console.log(`  Old URL: ${row.currentFinalUrl}`);
    console.log(`  New URL: ${row.newFinalUrl}`);
    console.log(`  Headlines: ${row.headlines.length}, Descriptions: ${row.descriptions.length}`);
  }
  console.log("\n" + "=".repeat(80));
}

async function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "y" || answer.trim().toLowerCase() === "yes");
    });
  });
}

async function applyMigration(customer: Customer, rows: AdRow[]): Promise<void> {
  const customerId = customer.credentials.customer_id.replace(/-/g, "");
  let success = 0;
  let failed = 0;

  for (const row of rows) {
    const adGroupResource = `customers/${customerId}/adGroups/${row.adGroupId}`;
    try {
      await customer.mutateResources([
        {
          entity: "ad_group_ad",
          operation: "create",
          resource: {
            ad_group: adGroupResource,
            status: enums.AdGroupAdStatus.ENABLED,
            ad: {
              final_urls: [row.newFinalUrl],
              responsive_search_ad: {
                headlines: row.headlines,
                descriptions: row.descriptions,
              },
            },
          },
        },
      ]);
      console.log(`  ✅ ${row.adGroupName} — new RSA created with ${row.newFinalUrl}`);
      success++;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`  ❌ ${row.adGroupName} — ${message}`);
      failed++;
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log(`✅ Created: ${success} new RSAs`);
  if (failed > 0) console.log(`❌ Failed:  ${failed}`);
  console.log("\n📌 Next steps:");
  console.log("   1. Open Google Ads UI.");
  console.log('   2. Filter ads by Final URL contains "/upfolded-new".');
  console.log("   3. Select all matching ads → Pause (or Remove).");
  console.log("   4. Re-run scripts/ads-deep-check.ts to confirm zero `/upfolded-new` URLs remain.");
  console.log("   5. THEN it is safe to delete the /upfolded-new/ directory (Phase G).");
}

async function main(): Promise<void> {
  console.log("🚀 Phase F — Strip `/upfolded-new` from Google Ads final URLs");
  console.log("=".repeat(80));

  const apply = process.argv.includes("--apply");
  const autoConfirm = process.argv.includes("--yes") || process.argv.includes("-y");

  const customer = getCustomer();
  console.log("\n🔍 Querying active RSAs...");
  const rows = await queryAds(customer);
  preview(rows);

  if (rows.length === 0) return;

  if (!apply) {
    console.log(
      "\nℹ️  Preview only. Re-run with `--apply` to create new RSAs.\n" +
        "   Old RSAs remain active until you pause them in the Google Ads UI.\n"
    );
    return;
  }

  if (!autoConfirm) {
    const yes = await confirm(`\n❓ Create ${rows.length} new RSAs with stripped URLs? (y/n) `);
    if (!yes) {
      console.log("Cancelled.");
      return;
    }
  }

  console.log("\n🔄 Creating new RSAs...");
  await applyMigration(customer, rows);
}

main().catch((error) => {
  console.error("\n❌ Fatal error:", error instanceof Error ? error.message : error);
  process.exit(1);
});
