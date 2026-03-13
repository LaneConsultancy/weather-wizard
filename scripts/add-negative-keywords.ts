/**
 * Add Campaign-Level Negative Keywords
 *
 * Adds brand/competitor/supply-related negative keywords (phrase match) to:
 *   - "Search - Roofing - Top 5 Towns" (active)
 *   - "Search - Roofing - Kent Wide" (paused)
 *
 * These negatives prevent wasted spend on competitor brand searches and
 * commercial/supply queries that indicate someone looking to buy materials
 * rather than hire a roofer.
 *
 * Run with: npx tsx scripts/add-negative-keywords.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { enums } from 'google-ads-api';
import { getCustomer } from '../lib/google-ads/client';

// Load environment variables - must come before any code that reads env vars
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// ============================================================================
// NEGATIVE KEYWORDS TO ADD AT CAMPAIGN LEVEL (phrase match)
// ============================================================================

const NEGATIVE_KEYWORDS: string[] = [
  'russell roofing',
  'bert king',
  'roofing sheets',
  'roofing supplies',
  'roof rescue',
  'roofing materials',
  'roofing felt',
  'roof tiles buy',
];

// Target campaign names - we query for their resource names rather than
// hard-coding IDs, so this script is resilient to account restructuring.
const TARGET_CAMPAIGN_NAMES = [
  'Search - Roofing - Top 5 Towns',
  'Search - Roofing - Kent Wide',
];

// ============================================================================
// HELPERS
// ============================================================================

interface CampaignInfo {
  resourceName: string;
  name: string;
  status: number;
}

/**
 * Query the account for all campaigns and return those matching our target names.
 * Using GAQL (Google Ads Query Language) is the idiomatic way to look up
 * resource names without assuming specific campaign IDs.
 */
async function findTargetCampaigns(customer: ReturnType<typeof getCustomer>): Promise<CampaignInfo[]> {
  const query = `
    SELECT
      campaign.resource_name,
      campaign.name,
      campaign.status
    FROM campaign
    WHERE campaign.status IN ('ENABLED', 'PAUSED')
  `;

  const results = await customer.query(query);

  const found: CampaignInfo[] = [];
  for (const row of results) {
    const campaignName: string = row.campaign?.name ?? '';
    if (TARGET_CAMPAIGN_NAMES.includes(campaignName)) {
      found.push({
        resourceName: row.campaign.resource_name,
        name: campaignName,
        status: row.campaign.status,
      });
    }
  }

  return found;
}

/**
 * Check which negative keywords already exist at campaign level so we can
 * skip them and avoid a duplicate-entry API error.
 */
async function getExistingCampaignNegatives(
  customer: ReturnType<typeof getCustomer>,
  campaignResourceName: string
): Promise<Set<string>> {
  const query = `
    SELECT
      campaign_criterion.keyword.text,
      campaign_criterion.keyword.match_type,
      campaign_criterion.negative
    FROM campaign_criterion
    WHERE campaign_criterion.campaign = "${campaignResourceName}"
      AND campaign_criterion.negative = TRUE
      AND campaign_criterion.type = 'KEYWORD'
  `;

  try {
    const results = await customer.query(query);
    const existing = new Set<string>();
    for (const row of results) {
      const text: string = row.campaign_criterion?.keyword?.text ?? '';
      if (text) {
        existing.add(text.toLowerCase());
      }
    }
    return existing;
  } catch (error) {
    // If the query fails (e.g. no criteria exist yet), treat as empty set
    console.warn('    Warning: Could not fetch existing negatives, proceeding anyway.');
    return new Set();
  }
}

/**
 * Add negative phrase-match keywords to a campaign via mutateResources.
 * Skips any keyword that already exists to avoid API errors.
 */
async function addCampaignNegatives(
  customer: ReturnType<typeof getCustomer>,
  campaign: CampaignInfo
): Promise<void> {
  const statusLabel = campaign.status === enums.CampaignStatus.ENABLED ? 'ACTIVE' : 'PAUSED';
  console.log(`\nCampaign: "${campaign.name}" [${statusLabel}]`);
  console.log(`Resource: ${campaign.resourceName}`);

  // Fetch existing negatives so we can skip duplicates
  const existing = await getExistingCampaignNegatives(customer, campaign.resourceName);
  console.log(`  Existing campaign-level negative keywords: ${existing.size}`);

  const toAdd = NEGATIVE_KEYWORDS.filter((kw) => !existing.has(kw.toLowerCase()));
  const skipped = NEGATIVE_KEYWORDS.filter((kw) => existing.has(kw.toLowerCase()));

  if (skipped.length > 0) {
    console.log(`  Skipping ${skipped.length} already-present keyword(s):`);
    skipped.forEach((kw) => console.log(`    - "${kw}"`));
  }

  if (toAdd.length === 0) {
    console.log('  All target negatives are already present. Nothing to add.');
    return;
  }

  const operations = toAdd.map((keyword) => ({
    entity: 'campaign_criterion' as const,
    operation: 'create' as const,
    resource: {
      campaign: campaign.resourceName,
      negative: true,
      keyword: {
        text: keyword,
        match_type: enums.KeywordMatchType.PHRASE,
      },
    },
  }));

  await customer.mutateResources(operations);

  console.log(`  Added ${toAdd.length} negative keyword(s):`);
  toAdd.forEach((kw) => console.log(`    + "${kw}" [PHRASE]`));
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('Add Campaign-Level Negative Keywords');
  console.log('='.repeat(60));
  console.log('\nNegative keywords to add (phrase match):');
  NEGATIVE_KEYWORDS.forEach((kw) => console.log(`  - "${kw}"`));
  console.log(`\nTarget campaigns: ${TARGET_CAMPAIGN_NAMES.join(', ')}`);
  console.log('='.repeat(60));

  try {
    const customer = getCustomer();

    // Step 1: Find the target campaigns
    console.log('\nQuerying account for target campaigns...');
    const campaigns = await findTargetCampaigns(customer);

    if (campaigns.length === 0) {
      console.error('\nNo target campaigns found. Check campaign names and account access.');
      process.exit(1);
    }

    // Warn if we only found a subset of expected campaigns
    const foundNames = campaigns.map((c) => c.name);
    const missingNames = TARGET_CAMPAIGN_NAMES.filter((name) => !foundNames.includes(name));
    if (missingNames.length > 0) {
      console.warn(`\nWarning: Could not find the following campaigns:`);
      missingNames.forEach((name) => console.warn(`  - "${name}"`));
    }

    console.log(`\nFound ${campaigns.length} target campaign(s).`);

    // Step 2: Add negatives to each campaign
    for (const campaign of campaigns) {
      await addCampaignNegatives(customer, campaign);
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('Done!');
    console.log(`  Processed ${campaigns.length} campaign(s)`);
    console.log(`  Negative keywords applied to each: up to ${NEGATIVE_KEYWORDS.length}`);
    console.log('='.repeat(60) + '\n');

  } catch (error: any) {
    console.error('\nError adding negative keywords:');
    console.error(error.message ?? error);
    if (error.errors && Array.isArray(error.errors)) {
      error.errors.forEach((err: any) => {
        console.error(`  [${err.error_code ? JSON.stringify(err.error_code) : 'unknown'}] ${err.message}`);
      });
    }
    process.exit(1);
  }
}

main();
