/**
 * Add Service-Specific Negative Keywords to Roofing Campaigns
 *
 * Adds phrase-match negative keywords to the two existing roofing campaigns so
 * they don't compete with the new service-specific campaigns (guttering, bird
 * proofing, exterior painting).
 *
 * Target campaigns:
 *   - "Search - Roofing - Top 5 Towns"
 *   - "Search - Roofing - Kent Wide"
 *
 * Run with: npm run add-service-negatives
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

// These terms relate to services now handled by dedicated campaigns.
// Adding them as negatives here prevents the roofing campaigns from triggering
// on guttering, bird proofing, or exterior painting queries and wasting budget
// that should go to the more relevant specialist campaigns.
const NEGATIVE_KEYWORDS: string[] = [
  'gutter',
  'guttering',
  'gutter cleaning',
  'gutter repair',
  'gutter repairs',
  'blocked gutters',
  'bird',
  'pigeon',
  'bird proofing',
  'pigeon proofing',
  'netting',
  'mesh',
  'solar panel bird',
  'painting',
  'painter',
  'decorator',
  'exterior painting',
  'house painting',
  'exterior decorator',
];

// Target campaign names — queried by name so the script is resilient to
// account restructuring and doesn't require hard-coded campaign IDs.
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
 * Query the account for all active/paused campaigns and return those matching
 * our target names.
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
        resourceName: row.campaign?.resource_name ?? '',
        name: campaignName,
        status: row.campaign?.status as number ?? 0,
      });
    }
  }

  return found;
}

/**
 * Fetch all existing campaign-level negative keywords for a campaign so we
 * can skip any that are already present and avoid duplicate-entry API errors.
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
  } catch {
    // If the query fails (e.g. no criteria exist yet), treat as an empty set
    // so the script continues rather than aborting on a non-critical fetch.
    console.warn('    Warning: Could not fetch existing negatives, proceeding anyway.');
    return new Set();
  }
}

/**
 * Add phrase-match negative keywords to a campaign, skipping any already present.
 */
async function addCampaignNegatives(
  customer: ReturnType<typeof getCustomer>,
  campaign: CampaignInfo
): Promise<void> {
  const statusLabel = campaign.status === enums.CampaignStatus.ENABLED ? 'ACTIVE' : 'PAUSED';
  console.log(`\nCampaign: "${campaign.name}" [${statusLabel}]`);
  console.log(`Resource: ${campaign.resourceName}`);

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
  console.log('Add Service Negative Keywords to Roofing Campaigns');
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

    // Warn if we only found a subset of the expected campaigns
    const foundNames = campaigns.map((c) => c.name);
    const missingNames = TARGET_CAMPAIGN_NAMES.filter((name) => !foundNames.includes(name));
    if (missingNames.length > 0) {
      console.warn('\nWarning: Could not find the following campaigns:');
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
