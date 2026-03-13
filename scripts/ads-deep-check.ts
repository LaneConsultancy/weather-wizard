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
  // ALL campaigns including paused/removed
  console.log("=== ALL CAMPAIGNS (including paused/removed) ===\n");
  const allCampaigns = await customer.query(
    "SELECT campaign.name, campaign.status, campaign.bidding_strategy_type, campaign_budget.amount_micros, metrics.impressions, metrics.clicks, metrics.conversions, metrics.cost_micros FROM campaign WHERE segments.date DURING LAST_30_DAYS"
  );

  for (const row of allCampaigns) {
    const name = String(row.campaign?.name || "?");
    const status = row.campaign?.status;
    const bidStrategy = row.campaign?.bidding_strategy_type;
    const budget = Number(row.campaign_budget?.amount_micros || 0) / 1e6;
    const cost = Number(row.metrics?.cost_micros || 0) / 1e6;
    const clicks = Number(row.metrics?.clicks || 0);
    const conv = Number(row.metrics?.conversions || 0);
    const impr = Number(row.metrics?.impressions || 0);
    console.log(`${name}`);
    console.log(`  Status: ${status} | Bid Strategy: ${bidStrategy} | Budget: £${budget.toFixed(2)}/day`);
    console.log(`  30d: £${cost.toFixed(2)} spend | ${clicks} clicks | ${impr} impr | ${conv.toFixed(1)} conv`);
    console.log();
  }

  // Ad group level detail
  console.log("=== AD GROUPS ===\n");
  const adGroups = await customer.query(
    "SELECT ad_group.name, ad_group.status, campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM ad_group WHERE segments.date DURING LAST_14_DAYS ORDER BY metrics.cost_micros DESC LIMIT 20"
  );

  for (const row of adGroups) {
    const camp = String(row.campaign?.name || "?");
    const ag = String(row.ad_group?.name || "?");
    const status = row.ad_group?.status;
    const clicks = Number(row.metrics?.clicks || 0);
    const cost = Number(row.metrics?.cost_micros || 0) / 1e6;
    const conv = Number(row.metrics?.conversions || 0);
    console.log(`${camp} > ${ag} [${status}]: £${cost.toFixed(2)} | ${clicks} clicks | ${conv.toFixed(1)} conv`);
  }

  // Check for ad disapprovals
  console.log("\n=== AD APPROVAL STATUS ===\n");
  const adApprovals = await customer.query(
    "SELECT ad_group.name, ad_group_ad.status, ad_group_ad.policy_summary.approval_status, ad_group_ad.ad.final_urls FROM ad_group_ad LIMIT 30"
  );

  for (const row of adApprovals) {
    const ag = String(row.ad_group?.name || "?");
    const status = row.ad_group_ad?.status;
    const approval = row.ad_group_ad?.policy_summary?.approval_status;
    const urls = row.ad_group_ad?.ad?.final_urls || [];
    console.log(`${ag} | Ad Status: ${status} | Approval: ${approval} | ${urls.join(", ")}`);
  }

  // Keywords with quality scores
  console.log("\n=== KEYWORDS & QUALITY SCORES ===\n");
  const keywords = await customer.query(
    "SELECT ad_group.name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, ad_group_criterion.status, ad_group_criterion.quality_info.quality_score, metrics.impressions, metrics.clicks, metrics.cost_micros FROM ad_group_criterion WHERE ad_group_criterion.type = 'KEYWORD' AND segments.date DURING LAST_14_DAYS ORDER BY metrics.cost_micros DESC LIMIT 30"
  );

  for (const row of keywords) {
    const ag = String(row.ad_group?.name || "?");
    const kw = String(row.ad_group_criterion?.keyword?.text || "?");
    const match = row.ad_group_criterion?.keyword?.match_type;
    const status = row.ad_group_criterion?.status;
    const qs = row.ad_group_criterion?.quality_info?.quality_score;
    const clicks = Number(row.metrics?.clicks || 0);
    const cost = Number(row.metrics?.cost_micros || 0) / 1e6;
    console.log(`${kw} [${match}] QS:${qs || "?"} | ${ag} | ${status} | ${clicks} clicks | £${cost.toFixed(2)}`);
  }

  // Change history - what changed recently
  console.log("\n=== RECENT CHANGES ===\n");
  try {
    const changes = await customer.query(
      "SELECT change_status.resource_type, change_status.resource_status, change_status.last_change_date_time, campaign.name FROM change_status WHERE change_status.last_change_date_time DURING LAST_14_DAYS ORDER BY change_status.last_change_date_time DESC LIMIT 20"
    );

    for (const row of changes) {
      const type = row.change_status?.resource_type;
      const resStatus = row.change_status?.resource_status;
      const date = row.change_status?.last_change_date_time;
      const camp = String(row.campaign?.name || "?");
      console.log(`${date} | ${type} ${resStatus} | ${camp}`);
    }
  } catch (e: any) {
    console.log("Could not fetch change history:", e.message?.substring(0, 200));
  }
}

main().catch((e) => console.error("Error:", e.message));
