# Google Ads API Client

This directory contains a TypeScript client for the Google Ads API, configured for the Weather Wizard account.

## Setup

The client is already configured and ready to use. Environment variables are loaded from the `.env` file in the project root.

### Environment Variables

Required variables (already set in `.env`):
- `GOOGLE_ADS_DEVELOPER_TOKEN` - Your Google Ads developer token
- `GOOGLE_ADS_CLIENT_ID` - OAuth2 client ID
- `GOOGLE_ADS_CLIENT_SECRET` - OAuth2 client secret
- `GOOGLE_ADS_REFRESH_TOKEN` - OAuth2 refresh token
- `GOOGLE_ADS_LOGIN_CUSTOMER_ID` - MCC manager account ID (5151905694)
- `GOOGLE_ADS_CUSTOMER_ID` - Weather Wizard sub-account ID (6652965980)

## Testing the Connection

To verify the API connection is working:

```bash
npm run test-google-ads
```

This will:
1. List all accessible customer accounts
2. List campaigns in the Weather Wizard account
3. Show an account performance overview for the last 30 days

## Usage Examples

### Importing the Client

```typescript
import { getCustomer, weatherWizardCustomer } from '@/lib/google-ads/client';
import { listCampaigns, createSearchCampaign } from '@/lib/google-ads/campaigns';
import { getKeywordIdeas } from '@/lib/google-ads/keywords';
import { getAccountOverview, DateRanges } from '@/lib/google-ads/reporting';
```

Or import everything from the index:

```typescript
import {
  weatherWizardCustomer,
  listCampaigns,
  getKeywordIdeas,
  getAccountOverview,
  DateRanges
} from '@/lib/google-ads';
```

### Campaign Management

#### List All Campaigns

```typescript
import { listCampaigns } from '@/lib/google-ads';

const campaigns = await listCampaigns();
campaigns.forEach(campaign => {
  console.log(`${campaign.name} (${campaign.status})`);
  console.log(`Budget: £${parseInt(campaign.budget.amountMicros) / 1_000_000}/day`);
});
```

#### Create a New Search Campaign

```typescript
import { createSearchCampaign } from '@/lib/google-ads';

const { campaignId, budgetId } = await createSearchCampaign({
  name: 'Roof Repairs - Kent',
  budgetAmountMicros: '20000000', // £20/day
  budgetName: 'Roof Repairs Budget',
  startDate: '20260201', // February 1, 2026
});

console.log(`Created campaign ${campaignId} with budget ${budgetId}`);
```

#### Pause/Enable a Campaign

```typescript
import { pauseCampaign, enableCampaign } from '@/lib/google-ads';

// Pause a campaign
await pauseCampaign('1234567890');

// Enable a campaign
await enableCampaign('1234567890');
```

### Keyword Research

#### Get Keyword Ideas

```typescript
import { getKeywordIdeas } from '@/lib/google-ads';

const keywords = await getKeywordIdeas(
  ['roof repair', 'roofing', 'guttering'],
  {
    location: '2826', // UK
    language: '1000', // English
  }
);

keywords.forEach(keyword => {
  console.log(`${keyword.text}`);
  console.log(`  Monthly Searches: ${keyword.avgMonthlySearches}`);
  console.log(`  Competition: ${keyword.competition}`);
  console.log(`  Suggested Bid: £${parseInt(keyword.lowTopOfPageBidMicros) / 1_000_000} - £${parseInt(keyword.highTopOfPageBidMicros) / 1_000_000}`);
});
```

#### Add Keywords to an Ad Group

```typescript
import { addKeywordsToAdGroup } from '@/lib/google-ads';

const keywordIds = await addKeywordsToAdGroup('9876543210', [
  { text: 'roof repair kent', matchType: 'PHRASE' },
  { text: 'emergency roof repair', matchType: 'PHRASE' },
  { text: 'roof leak repair', matchType: 'EXACT', bidAmountMicros: '5000000' }, // £5 CPC
]);

console.log(`Added ${keywordIds.length} keywords`);
```

### Reporting

#### Get Account Overview

```typescript
import { getAccountOverview, DateRanges } from '@/lib/google-ads';

// Last 30 days
const overview = await getAccountOverview(DateRanges.last30Days());
console.log(`Total Cost: £${overview.totalCost}`);
console.log(`Total Clicks: ${overview.totalClicks}`);
console.log(`Average CPC: £${overview.averageCpc.toFixed(2)}`);

// This month
const thisMonth = await getAccountOverview(DateRanges.thisMonth());

// Custom date range
const custom = await getAccountOverview({
  startDate: '2026-01-01',
  endDate: '2026-01-31',
});
```

#### Get Campaign Performance

```typescript
import { getCampaignPerformance, DateRanges } from '@/lib/google-ads';

const performance = await getCampaignPerformance(
  '1234567890',
  DateRanges.last7Days()
);

console.log(`Campaign: ${performance.campaignName}`);
console.log(`Impressions: ${performance.impressions}`);
console.log(`Clicks: ${performance.clicks}`);
console.log(`CTR: ${performance.ctr}%`);
console.log(`Conversions: ${performance.conversions}`);
```

#### Get Search Terms Report

```typescript
import { getSearchTermsReport, DateRanges } from '@/lib/google-ads';

const searchTerms = await getSearchTermsReport(
  '1234567890',
  DateRanges.last7Days()
);

searchTerms.forEach(term => {
  console.log(`"${term.searchTerm}"`);
  console.log(`  Impressions: ${term.impressions}`);
  console.log(`  Clicks: ${term.clicks}`);
  console.log(`  Cost: £${term.cost}`);
});
```

## File Structure

```
lib/google-ads/
├── client.ts         - Main API client setup and configuration
├── campaigns.ts      - Campaign management utilities
├── keywords.ts       - Keyword research and management
├── reporting.ts      - Performance reports and analytics
├── index.ts          - Convenient re-exports
└── README.md         - This file
```

## Available Date Ranges

The `DateRanges` helper provides common date ranges:

- `DateRanges.today()` - Today only
- `DateRanges.yesterday()` - Yesterday only
- `DateRanges.last7Days()` - Last 7 days including today
- `DateRanges.last30Days()` - Last 30 days including today
- `DateRanges.thisMonth()` - Current month to date
- `DateRanges.lastMonth()` - Previous month (full month)

## Common Location IDs

- United Kingdom: `2826`
- England: `2840`
- London: `1006886`
- Kent: `1010300` (approximate)

## Common Language IDs

- English: `1000`
- English (UK): `1003`

## Currency

All monetary values in the API are in **micros** (millionths of the currency unit).

To convert:
- **To micros**: `amount * 1_000_000` (e.g., £10 = 10000000 micros)
- **From micros**: `micros / 1_000_000` (e.g., 10000000 micros = £10)

Example:
```typescript
// Set a daily budget of £25
const budgetAmountMicros = '25000000'; // £25 * 1,000,000

// Read cost from API
const costPounds = parseInt(campaign.metrics.cost) / 1_000_000;
```

## Error Handling

All functions may throw errors. Always wrap API calls in try/catch:

```typescript
try {
  const campaigns = await listCampaigns();
  console.log(`Found ${campaigns.length} campaigns`);
} catch (error) {
  console.error('Error listing campaigns:', error);
  // Handle error appropriately
}
```

Google Ads API errors typically include:
- `error.errors` - Array of error objects
- `error.errors[].error_code` - Specific error code
- `error.errors[].message` - Human-readable error message

## Resources

- [Google Ads API Documentation](https://developers.google.com/google-ads/api/docs/start)
- [google-ads-api Node.js Library](https://github.com/Opteo/google-ads-api)
- [Google Ads Query Language (GAQL)](https://developers.google.com/google-ads/api/docs/query/overview)

## Notes

- The account currently has no active campaigns (verified on 2026-01-28)
- The MCC (login customer) manages the Weather Wizard sub-account
- All API calls are authenticated using OAuth2 with a refresh token
- The developer token is in **test mode** - may have limitations
