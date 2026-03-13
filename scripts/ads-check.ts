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
  const campaigns = await customer.query(
    "SELECT campaign.name, campaign.status, campaign_budget.amount_micros, metrics.impressions, metrics.clicks, metrics.conversions, metrics.cost_micros, segments.date FROM campaign WHERE segments.date DURING LAST_14_DAYS ORDER BY segments.date DESC"
  );

  const daily: Record<string, { impressions: number; clicks: number; conversions: number; cost: number }> = {};
  const campTotals: Record<string, { impressions: number; clicks: number; conversions: number; cost: number; status: number; budget: number }> = {};

  for (const row of campaigns) {
    const date = row.segments?.date || "unknown";
    const camp = row.campaign?.name || "unknown";
    const status = row.campaign?.status || 0;

    if (!daily[date]) daily[date] = { impressions: 0, clicks: 0, conversions: 0, cost: 0 };
    daily[date].impressions += Number(row.metrics?.impressions || 0);
    daily[date].clicks += Number(row.metrics?.clicks || 0);
    daily[date].conversions += Number(row.metrics?.conversions || 0);
    daily[date].cost += Number(row.metrics?.cost_micros || 0);

    if (!campTotals[camp]) campTotals[camp] = { impressions: 0, clicks: 0, conversions: 0, cost: 0, status: 0, budget: 0 };
    campTotals[camp].impressions += Number(row.metrics?.impressions || 0);
    campTotals[camp].clicks += Number(row.metrics?.clicks || 0);
    campTotals[camp].conversions += Number(row.metrics?.conversions || 0);
    campTotals[camp].cost += Number(row.metrics?.cost_micros || 0);
    campTotals[camp].status = status;
    campTotals[camp].budget = Number(row.campaign_budget?.amount_micros || 0);
  }

  console.log("=== GOOGLE ADS - LAST 14 DAYS ===\n");

  const vals = Object.values(daily);
  const totalCost = vals.reduce((s, d) => s + d.cost, 0) / 1e6;
  const totalClicks = vals.reduce((s, d) => s + d.clicks, 0);
  const totalImpr = vals.reduce((s, d) => s + d.impressions, 0);
  const totalConv = vals.reduce((s, d) => s + d.conversions, 0);

  console.log(`TOTALS: Spend £${totalCost.toFixed(2)} | Clicks ${totalClicks} | Impr ${totalImpr} | Conv ${totalConv.toFixed(1)}`);
  if (totalClicks > 0) console.log(`CTR ${(totalClicks / totalImpr * 100).toFixed(2)}% | Avg CPC £${(totalCost / totalClicks).toFixed(2)}`);
  if (totalConv > 0) console.log(`CPA £${(totalCost / totalConv).toFixed(2)}`);

  console.log("\n--- Daily Breakdown ---");
  for (const date of Object.keys(daily).sort()) {
    const d = daily[date];
    const cost = d.cost / 1e6;
    console.log(`${date}: £${cost.toFixed(2).padStart(6)} | ${String(d.clicks).padStart(3)} clicks | ${String(d.impressions).padStart(5)} impr | ${d.conversions.toFixed(1)} conv`);
  }

  console.log("\n--- By Campaign ---");
  const sorted = Object.entries(campTotals).sort((a, b) => b[1].cost - a[1].cost);
  for (const [camp, d] of sorted) {
    const cost = d.cost / 1e6;
    const budget = d.budget / 1e6;
    const cpc = d.clicks > 0 ? cost / d.clicks : 0;
    console.log(`${camp} [status:${d.status}] Budget: £${budget.toFixed(2)}/day`);
    console.log(`  Spend £${cost.toFixed(2)} | ${d.clicks} clicks | ${d.conversions.toFixed(1)} conv | CPC £${cpc.toFixed(2)}`);
  }
}

main().catch((e) => console.error("Error:", e.message));
