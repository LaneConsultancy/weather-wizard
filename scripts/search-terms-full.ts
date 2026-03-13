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
  // ALL search terms for last 30 days across all campaigns
  const terms = await customer.query(
    "SELECT search_term_view.search_term, campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, segments.date FROM search_term_view WHERE segments.date DURING LAST_30_DAYS ORDER BY metrics.cost_micros DESC LIMIT 200"
  );

  console.log("=== ALL SEARCH TERMS - LAST 30 DAYS ===\n");
  
  let totalSpend = 0;
  let totalClicks = 0;
  
  // Aggregate by search term
  const termMap: Record<string, { clicks: number; impr: number; cost: number; conv: number; campaign: string; dates: string[] }> = {};
  
  for (const row of terms) {
    const term = String(row.search_term_view?.search_term || "?");
    const camp = String(row.campaign?.name || "?");
    const clicks = Number(row.metrics?.clicks || 0);
    const impr = Number(row.metrics?.impressions || 0);
    const cost = Number(row.metrics?.cost_micros || 0);
    const conv = Number(row.metrics?.conversions || 0);
    const date = String(row.segments?.date || "?");
    
    if (!termMap[term]) termMap[term] = { clicks: 0, impr: 0, cost: 0, conv: 0, campaign: camp, dates: [] };
    termMap[term].clicks += clicks;
    termMap[term].impr += impr;
    termMap[term].cost += cost;
    termMap[term].conv += conv;
    termMap[term].dates.push(date);
    
    totalSpend += cost;
    totalClicks += clicks;
  }
  
  console.log(`Total spend: £${(totalSpend / 1e6).toFixed(2)} | Total clicks: ${totalClicks}\n`);
  
  // Sort by cost descending
  const sorted = Object.entries(termMap).sort((a, b) => b[1].cost - a[1].cost);
  
  for (const [term, d] of sorted) {
    const cost = d.cost / 1e6;
    if (cost < 0.01 && d.clicks === 0) continue; // skip zero-cost zero-click
    const cpc = d.clicks > 0 ? cost / d.clicks : 0;
    console.log(`${term}`);
    console.log(`  ${d.campaign} | ${d.clicks} clicks | ${d.impr} impr | £${cost.toFixed(2)} | ${d.conv.toFixed(1)} conv | CPC £${cpc.toFixed(2)}`);
  }
}

main().catch((e) => console.error("Error:", e.message));
