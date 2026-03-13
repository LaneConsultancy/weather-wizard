import "dotenv/config";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { GoogleAdsApi } from "google-ads-api";

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID || "",
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || "",
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || "",
});
const customer = client.Customer({
  customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID || "",
  login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || "",
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN || "",
});

async function main() {
  // Search terms report
  const terms = await customer.query(
    "SELECT search_term_view.search_term, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM search_term_view WHERE segments.date DURING LAST_14_DAYS ORDER BY metrics.clicks DESC LIMIT 30"
  );

  console.log("=== TOP SEARCH TERMS (Last 14 Days) ===\n");
  for (const row of terms) {
    const term = String(row.search_term_view?.search_term || "?");
    const clicks = Number(row.metrics?.clicks || 0);
    const impr = Number(row.metrics?.impressions || 0);
    const cost = Number(row.metrics?.cost_micros || 0) / 1e6;
    const conv = Number(row.metrics?.conversions || 0);
    console.log(`${term.padEnd(50)} | ${String(clicks).padStart(2)} clicks | ${String(impr).padStart(3)} impr | £${cost.toFixed(2).padStart(6)} | ${conv.toFixed(1)} conv`);
  }

  // Ad approval status
  const ads = await customer.query(
    "SELECT ad_group.name, ad_group.status, ad_group_ad.ad.final_urls, ad_group_ad.status, ad_group_ad.policy_summary.approval_status FROM ad_group_ad WHERE campaign.status = 2 LIMIT 20"
  );

  console.log("\n=== AD STATUS & APPROVALS ===\n");
  for (const row of ads) {
    const adGroup = String(row.ad_group?.name || "?");
    const adStatus = row.ad_group_ad?.status || "?";
    const approval = row.ad_group_ad?.policy_summary?.approval_status || "?";
    const urls = row.ad_group_ad?.ad?.final_urls || [];
    console.log(`${adGroup} | Status: ${adStatus} | Approval: ${approval} | URL: ${urls.join(", ")}`);
  }

  // Impression share data
  const share = await customer.query(
    "SELECT campaign.name, metrics.search_impression_share, metrics.search_budget_lost_impression_share, metrics.search_rank_lost_impression_share FROM campaign WHERE segments.date DURING LAST_7_DAYS AND campaign.status = 2"
  );

  console.log("\n=== IMPRESSION SHARE (Last 7 Days) ===\n");
  for (const row of share) {
    const camp = String(row.campaign?.name || "?");
    const is_val = row.metrics?.search_impression_share;
    const budgetLost = row.metrics?.search_budget_lost_impression_share;
    const rankLost = row.metrics?.search_rank_lost_impression_share;
    console.log(`${camp}: IS ${is_val} | Lost to Budget: ${budgetLost} | Lost to Rank: ${rankLost}`);
  }
}

main().catch((e) => console.error("Error:", e.message));
