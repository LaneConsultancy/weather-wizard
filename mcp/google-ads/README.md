# Google Ads MCP Server

A Model Context Protocol (MCP) server that provides programmatic access to Google Ads operations. This server allows Claude Code to manage campaigns, ads, keywords, and retrieve performance data directly through the Google Ads API.

## Features

### Campaign Management
- **List Campaigns** - View all campaigns with status, budgets, and key metrics
- **Get Campaign Details** - Retrieve detailed information about a specific campaign
- **Pause Campaign** - Pause an active campaign
- **Enable Campaign** - Re-enable a paused campaign

### Ad Management
- **List Ads** - View all ads with their URLs, status, and performance metrics
- **Update Ad URLs** - Modify ad final URLs (useful for adding dynamic parameters)
- **Remove Ads** - Bulk remove ads by their IDs

### Reporting & Analytics
- **Account Overview** - Get account-wide performance metrics
- **Campaign Performance** - Detailed performance data for specific campaigns with date range options
- **Search Terms Report** - See what search queries triggered your ads

### Keyword Management
- **List Keywords** - View all keywords in an ad group with quality scores
- **Add Keywords** - Bulk add keywords to an ad group with match type control
- **Remove Keyword** - Delete a keyword from an ad group

## Installation

1. Navigate to the MCP server directory:
```bash
cd weather-wizard-site/mcp/google-ads
```

2. Install dependencies:
```bash
npm install
```

3. Build the TypeScript code:
```bash
npm run build
```

## Environment Variables

Create a `.env` file in the project root (`/Users/georgelane/Dropbox/Projects/Weather Wizard/.env`) with the following variables:

```env
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_client_secret
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token
GOOGLE_ADS_CUSTOMER_ID=your_customer_id
```

### How to Obtain These Credentials

1. **Developer Token**: Apply through the [Google Ads API Center](https://ads.google.com/aw/apicenter)
2. **OAuth Credentials** (Client ID & Secret): Create in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
3. **Refresh Token**: Generate using OAuth 2.0 flow with the Google Ads API scope
4. **Customer ID**: Your 10-digit Google Ads account number (without dashes)

## Usage

The MCP server is configured in `.mcp.json` at the project root and will be available to Claude Code automatically.

### Example Tool Calls

**List all campaigns:**
```typescript
google_ads_list_campaigns()
```

**Get campaign performance for last 30 days:**
```typescript
google_ads_campaign_performance({
  campaign_id: "12345678",
  date_range: "LAST_30_DAYS"
})
```

**Add keywords to an ad group:**
```typescript
google_ads_add_keywords({
  ad_group_id: "87654321",
  keywords: [
    { text: "roofing services", match_type: "PHRASE" },
    { text: "roof repair", match_type: "EXACT" }
  ]
})
```

**Update ad URL with dynamic parameters:**
```typescript
google_ads_update_ad_urls({
  ad_id: "11223344",
  new_final_url: "https://example.com/landing?keyword={keyword}&matchtype={matchtype}"
})
```

## Available Tools

| Tool Name | Description | Required Parameters |
|-----------|-------------|---------------------|
| `google_ads_list_campaigns` | List all campaigns | None |
| `google_ads_get_campaign` | Get campaign details | `campaign_id` |
| `google_ads_pause_campaign` | Pause a campaign | `campaign_id` |
| `google_ads_enable_campaign` | Enable a campaign | `campaign_id` |
| `google_ads_list_ads` | List all ads | None |
| `google_ads_update_ad_urls` | Update ad URLs | `ad_id`, `new_final_url` |
| `google_ads_remove_ads` | Remove multiple ads | `ad_ids` (array) |
| `google_ads_account_overview` | Account metrics | None |
| `google_ads_campaign_performance` | Campaign metrics | `campaign_id`, `date_range` (optional) |
| `google_ads_search_terms_report` | Search terms data | `campaign_id` (optional) |
| `google_ads_list_keywords` | List ad group keywords | `ad_group_id` |
| `google_ads_add_keywords` | Add keywords | `ad_group_id`, `keywords` |
| `google_ads_remove_keyword` | Remove a keyword | `keyword_id` |

## Development

Run in watch mode for development:
```bash
npm run dev
```

## Error Handling

All tools include comprehensive error handling and will return meaningful error messages if:
- Required environment variables are missing
- API requests fail
- Invalid parameters are provided
- Authentication fails

Errors are validated using Zod schemas and returned in the MCP response format.

## Security Notes

- Never commit the `.env` file to version control
- Keep your developer token and OAuth credentials secure
- Use read-only API access where possible
- Regularly rotate your refresh tokens
- Monitor API usage to stay within quotas

## Resources

- [Google Ads API Documentation](https://developers.google.com/google-ads/api/docs/start)
- [google-ads-api npm package](https://www.npmjs.com/package/google-ads-api)
- [Model Context Protocol](https://modelcontextprotocol.io/)
