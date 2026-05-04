# Google Ads API - Application Design Document

**Applicant:** Lane Consultancy\
**Application type:** Internal agency tool for managing client Google Ads accounts\
**Requested access level:** Basic\
**Date:** February 2026

---

## Table of Contents

1. [Application Summary](#1-application-summary)
2. [Google Ads API Usage](#2-google-ads-api-usage)
3. [Offline Call Conversion Pipeline](#3-offline-call-conversion-pipeline)
4. [Authentication and Security](#4-authentication-and-security)
5. [API Request Volume](#5-api-request-volume)
6. [Technical Implementation](#6-technical-implementation)
7. [Compliance](#7-compliance)

---

## 1. Application Summary

### What the application does

The application is a collection of Node.js/TypeScript scripts used by Lane Consultancy to manage Google Ads accounts for its clients via a Manager (MCC) account. The scripts handle campaign creation, keyword research, performance reporting, ad management, and offline call conversion uploads.

This is an internal agency tool, not a commercial product. It is used solely by Lane Consultancy staff to manage client campaigns. There is no external user interface and no access is provided to clients or third parties.

### Why Basic access is needed

The primary reason for requesting Basic access is to use the **offline call conversion upload** functionality (`uploadCallConversions` endpoint). This feature allows us to import phone call conversions that were not automatically tracked by website analytics (because the caller's browser rejected cookies), giving a more complete picture of campaign performance and enabling smarter bidding.

Under Test access, API usage is limited to a single developer account and restricted request volumes, which is insufficient for the daily automated conversion upload workflow that runs in production via GitHub Actions.

### Technology stack

| Component | Technology |
|-----------|-----------|
| Language | TypeScript (Node.js 20) |
| Google Ads client library | `google-ads-api` npm package v22 |
| Google Ads API version | v19 |
| Runtime | CLI scripts executed via `tsx` |
| Automation | GitHub Actions (daily scheduled workflow) |
| Phone system | Twilio |
| Call tracking | WhatConverts |

### Accounts managed

| Item | Value |
|------|-------|
| Manager (MCC) account | Lane Consultancy manager account (used as the login account for API access) |
| Client accounts managed | Small number of client accounts (e.g., Weather Wizard Roofing Ltd) |
| Access pattern | All API calls are made via the MCC using `login_customer_id`, targeting individual client `customer_id` values |

---

## 2. Google Ads API Usage

The application interacts with the Google Ads API through the following functional areas. Each section describes the specific API services, resources, and operations used.

### 2.1 Campaign Management

**Purpose:** Create and manage Search campaigns for client accounts (e.g., roofing services across Kent towns).

**API resources and operations:**

| Resource | Operation | Description |
|----------|-----------|-------------|
| `campaign_budget` | Create, Update | Set daily budgets for campaigns |
| `campaign` | Create, Update | Create Search campaigns; pause/enable campaigns via status updates |
| `campaign_criterion` | Create | Apply geo-targeting (Kent locations) and campaign-level negative keywords |
| `ad_group` | Create | Create ad groups organised by town or service type |
| `ad_group_criterion` | Create | Add phrase-match keywords and ad-group-level negative keywords |
| `ad_group_ad` | Create, Remove | Create Responsive Search Ads (RSAs); remove outdated ads |
| `asset` | Create | Create sitelink and callout text assets |
| `customer_asset` | Create | Link assets at the account level |

**How it works:** The `create-weather-wizard-campaigns.ts` script defines campaign configurations (budgets, ad groups, keywords, and ad copy) and uses `customer.mutateResources()` to create all resources in a single API call per campaign. All campaigns are created in PAUSED status and manually reviewed before activation.

### 2.2 Keyword Research

**Purpose:** Research keyword ideas and search volumes to inform campaign structure.

**API service:** `KeywordPlanIdeaService.generateKeywordIdeas()`

**Parameters:**
- Seed keywords: roofing service terms (e.g., "roof repairs", "roofer", "guttering") combined with Kent town names
- Geographic target: `geoTargetConstants/2826` (United Kingdom)
- Language: `languageConstants/1000` (English)

**Data retrieved:** keyword text, average monthly search volume, competition level, competition index, low/high top-of-page bid estimates.

**Frequency:** Run manually on an ad-hoc basis during campaign planning. Not automated.

### 2.3 Performance Reporting

**Purpose:** Monitor campaign performance to inform budget allocation and optimisation decisions.

**API method:** `customer.query()` using Google Ads Query Language (GAQL)

**Queries executed:**

| GAQL Resource | Fields Retrieved | Purpose |
|---------------|-----------------|---------|
| `customer` | clicks, impressions, cost_micros, conversions, ctr, average_cpc | Account-level spend and conversion summary |
| `campaign` | campaign.id, campaign.name, campaign.status, clicks, impressions, cost_micros, conversions, ctr, average_cpc | Campaign-level performance breakdown |
| `ad_group` | campaign.name, ad_group.id, ad_group.name, ad_group.status, clicks, impressions, cost_micros, conversions, ctr, average_cpc | Ad group performance within campaigns |
| `keyword_view` | campaign.name, ad_group.name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, clicks, impressions, cost_micros, conversions, average_cpc | Top keywords by spend (limited to 20) |

**Frequency:** Run manually via CLI. Typically once per week for performance reviews. Not automated.

### 2.4 Ad URL Management

**Purpose:** Update final URLs on Responsive Search Ads when the website domain or URL structure changes.

**Process:**
1. Query `ad_group_ad` resources to retrieve existing RSAs and their current final URLs
2. Because Google Ads does not support in-place edits to RSA final URLs, the tool creates new RSAs with the corrected URLs
3. Old ads with incorrect URLs are removed via `ad_group_ad` remove operations

**Frequency:** Run manually on an ad-hoc basis. This is a rare maintenance operation (used once historically when the production domain changed).

### 2.5 Offline Call Conversion Uploads

**Purpose:** Upload phone call conversions to Google Ads that were not automatically tracked by website analytics, enabling more accurate conversion measurement and smarter automated bidding.

**This is the primary reason Basic access is required.** Full details in [Section 3](#3-offline-call-conversion-pipeline).

**API resources and operations:**

| Resource / Endpoint | Operation | Description |
|---------------------|-----------|-------------|
| `conversion_action` | Create (one-time setup) | Create a conversion action of type `UPLOAD_CALLS` with category `PHONE_CALL_LEAD` |
| `POST /customers/{customerId}:uploadCallConversions` | Upload | Upload offline call conversions via the REST API |

**Conversion action configuration:**
- Name: "Offline Phone Call (Twilio)"
- Type: `UPLOAD_CALLS`
- Category: `PHONE_CALL_LEAD`
- Default value: 75 GBP per call
- Counting: `ONE_PER_CLICK` (one conversion per unique caller per click)
- Attribution model: Google Ads Last Click
- Click-through lookback window: 30 days
- View-through lookback window: 1 day

**Upload payload structure:**
```json
{
  "conversions": [
    {
      "callerId": "+447XXXXXXXXX",
      "callStartDateTime": "2026-02-10 14:30:00+00:00",
      "conversionAction": "customers/XXXXXXXXXX/conversionActions/XXXXXXXXXX",
      "conversionValue": 75,
      "currencyCode": "GBP"
    }
  ],
  "partialFailure": true
}
```

**Matching strategy:** Caller ID based. The uploaded phone number and call start time are matched against Google's records of ad interactions involving call assets or call extensions. This does NOT use GCLIDs.

**Idempotency:** Google Ads deduplicates by the combination of `callerId` and `callStartDateTime`. Re-uploading the same conversion is safe and will not create duplicates.

**Frequency:** Automated daily via GitHub Actions at 06:00 UTC, processing the previous day's calls.

---

## 3. Offline Call Conversion Pipeline

### 3.1 Business Rationale

Lane Consultancy manages Google Ads Search campaigns for clients that drive phone calls. When a potential customer clicks an ad and visits the client's website, a cookie-based tracking system (WhatConverts) records the call as a conversion. However, visitors who reject cookies are not tracked by WhatConverts, creating a gap in conversion data.

This gap means Google Ads underreports conversions, which degrades the effectiveness of automated bidding strategies (such as Target CPA or Maximise Conversions). By uploading the untracked calls as offline conversions, the full volume of calls is visible in Google Ads, enabling more accurate bidding and budget allocation.

### 3.2 Architecture Diagram

```
Daily Pipeline (GitHub Actions - 06:00 UTC)
============================================

+------------------+          +---------------------+
|                  |          |                     |
|  Twilio          |          |  WhatConverts       |
|  (Phone System)  |          |  (Call Tracking)    |
|                  |          |                     |
+--------+---------+          +---------+-----------+
         |                              |
         | Fetch inbound calls          | Fetch phone leads
         | (duration >= 60s)            | (same date range)
         |                              |
         v                              v
+--------+------------------------------+-----------+
|                                                    |
|           Reconciliation Engine                    |
|                                                    |
|  1. Normalise phone numbers to E.164              |
|  2. Index WhatConverts leads by caller number     |
|  3. Match Twilio calls to leads:                  |
|     - Same caller number                          |
|     - Start time within +/- 5 minutes             |
|     - Exact match: < 30 seconds                   |
|     - Fuzzy match: < 5 minutes                    |
|  4. Prevent double-matching (one lead per call)   |
|                                                    |
+------------------------+---------------------------+
                         |
            +------------+------------+
            |                         |
            v                         v
   +--------+--------+     +---------+---------+
   |                  |     |                   |
   |  Matched Calls   |     |  Unmatched Calls  |
   |  (tracked by     |     |  (the "gap")      |
   |   WhatConverts)  |     |                   |
   |                  |     |                   |
   |  No action       |     |  Upload as        |
   |  needed          |     |  offline          |
   |                  |     |  conversions      |
   +------------------+     |                   |
                            +---------+---------+
                                      |
                         +------------+------------+
                         |                         |
                         v                         v
               +---------+---------+     +---------+---------+
               |                   |     |                   |
               |  Google Ads API   |     |  Bing Ads API     |
               |  uploadCall-      |     |  (separate        |
               |  Conversions      |     |   module)         |
               |                   |     |                   |
               |  POST /customers/ |     |                   |
               |  {id}:uploadCall  |     |                   |
               |  Conversions      |     |                   |
               |                   |     |                   |
               +-------------------+     +-------------------+
```

### 3.3 Pipeline Steps

**Step 1 - Fetch Twilio calls.** The script connects to the Twilio REST API and retrieves all inbound call records for the target date. Only calls with a duration of 60 seconds or longer are included (shorter calls are unlikely to be genuine enquiries).

**Step 2 - Fetch WhatConverts leads.** The script connects to the WhatConverts API and retrieves all phone call leads for the same date range. These represent calls from visitors who accepted cookies and were tracked by the website.

**Step 3 - Reconcile.** The reconciliation engine matches Twilio calls to WhatConverts leads using the following algorithm:

1. All phone numbers are normalised to E.164 format for consistent comparison
2. WhatConverts leads are indexed by caller number for O(1) lookup
3. For each Twilio call, the engine searches for a WhatConverts lead with the same caller number and a start time within +/- 5 minutes
4. If multiple candidates exist, the closest match (smallest time delta) is selected
5. Each WhatConverts lead can only be matched once (preventing double-matching)
6. Matches within 30 seconds are flagged as "exact"; matches within 5 minutes are flagged as "fuzzy"

**Step 4 - Upload unmatched calls.** Calls that had no matching WhatConverts lead (meaning they came from visitors who rejected cookies) are uploaded as offline conversions to both Google Ads and Bing Ads. Each conversion is assigned a value of 75 GBP.

### 3.4 Automation

The pipeline runs automatically via a GitHub Actions workflow:

- **Schedule:** Daily at 06:00 UTC (after all calls from the previous day are complete)
- **Default behaviour:** Processes the previous day's calls
- **Manual trigger:** Supports manual runs from the GitHub Actions UI with optional date and dry-run parameters
- **Dry-run mode:** Fetches and reconciles data but does not upload to any ad platform (used for testing)

**Exit codes:**
| Code | Meaning |
|------|---------|
| 0 | Success (all uploads completed, or dry-run mode) |
| 1 | Fatal error (API connection failure, missing credentials) |
| 2 | Partial failure (some uploads failed, but the pipeline completed) |

### 3.5 Data Volume

Client call volumes are low (typical for local service businesses):

- Typical daily inbound calls: 5-20
- Typical daily unmatched calls (conversions to upload): 2-10
- Maximum conversions per API request: 2,000 (Google's batch limit)
- All daily conversions are uploaded in a single API request

---

## 4. Authentication and Security

### 4.1 OAuth2 Flow

The application uses the **OAuth2 refresh token flow** for all Google Ads API interactions. There is no interactive user login or consent screen because this is an internal agency tool operated by Lane Consultancy staff only.

**Authentication flow:**

1. A refresh token was obtained once via the standard OAuth2 consent flow using a setup script (`get-google-ads-token.ts`)
2. The refresh token is stored securely in environment variables (locally in `.env`, in CI/CD as GitHub Secrets)
3. For operations using the `google-ads-api` npm package, the library handles token refresh automatically
4. For direct REST API calls (the `uploadCallConversions` endpoint), the application manually exchanges the refresh token for a short-lived access token via `https://oauth2.googleapis.com/token`

### 4.2 Credential Storage

| Environment | Storage Method | Access Control |
|-------------|---------------|----------------|
| Local development | `.env` file (gitignored, never committed) | Developer machine access only |
| CI/CD (GitHub Actions) | GitHub Encrypted Secrets | Repository admin access only |

### 4.3 Security Measures

- **No hardcoded credentials.** All API keys, tokens, and secrets are stored as environment variables, never in source code.
- **No end-user access to credentials.** This is an internal agency tool. No clients or external users interact with the application or have access to any credentials.
- **MCC-scoped access.** All API calls are made via the Lane Consultancy Manager (MCC) account using the `login_customer_id` parameter. Client accounts are accessed through the MCC hierarchy.
- **Environment variable validation.** The application validates that all required environment variables are present at startup and fails fast with a clear error if any are missing.
- **Gitignored secrets.** The `.env` file is listed in `.gitignore` to prevent accidental commits.

---

## 5. API Request Volume

### 5.1 Daily Automated Usage

The only automated API interaction is the offline conversion upload workflow, which runs once daily:

| Operation | Requests per run | Frequency |
|-----------|-----------------|-----------|
| OAuth2 token exchange | 1 | Daily |
| `uploadCallConversions` | 1 (single batch, typically 2-10 conversions) | Daily |

**Total automated requests per day: 2**

### 5.2 Manual / Ad-Hoc Usage

The following operations are run manually by Lane Consultancy staff and are infrequent:

| Operation | Typical Frequency | Requests per Use |
|-----------|-------------------|------------------|
| Performance report (`customer.query()`) | Weekly | 4 queries (account, campaign, ad group, keyword) |
| Keyword research (`generateKeywordIdeas()`) | Monthly | 1-5 requests |
| Campaign creation (`mutateResources()`) | Rarely (campaign restructuring) | 2-5 requests |
| Ad URL updates | Rarely (domain changes) | 2-4 requests |
| Campaign status updates (pause/enable) | As needed | 1 request each |
| Budget updates | As needed | 1 request each |

**Estimated total manual requests per month: 20-50**

### 5.3 Summary

| Usage Type | Requests / Day | Requests / Month |
|------------|---------------|------------------|
| Automated (conversion uploads) | 2 | ~60 |
| Manual (reporting, management) | 0-5 | 20-50 |
| **Total** | **2-7** | **80-110** |

This is well within the Basic access tier limits. There are no bulk operations, no high-frequency polling, and no scenarios where request volume would spike significantly. As client accounts are added, volumes would scale linearly but remain modest given the local service business focus.

---

## 6. Technical Implementation

### 6.1 Project Structure

The Google Ads integration code is organised as follows within the project:

```
weather-wizard-site/
  lib/
    google-ads/
      client.ts            - API client initialisation and Customer instance
      campaigns.ts         - Campaign management utilities
      keywords.ts          - Keyword research and management
      reporting.ts         - GAQL query helpers
      types.ts             - Type definitions and helpers (e.g., toMicros)
      index.ts             - Module exports
    conversions/
      google-ads-upload.ts - uploadCallConversions implementation
      reconcile.ts         - Call reconciliation engine
      phone-utils.ts       - Phone number normalisation (E.164)
      types.ts             - TypeScript interfaces for reconciliation and upload
      bing-upload.ts       - Bing Ads upload (separate from Google)
    twilio/
      call-logs.ts         - Fetch inbound calls from Twilio
      types.ts             - Twilio call type definitions
    whatconverts/
      leads.ts             - Fetch phone leads from WhatConverts
      types.ts             - WhatConverts lead type definitions
  scripts/
    upload-offline-conversions.ts      - Main pipeline orchestrator
    create-offline-conversion-action.ts - One-time conversion action setup
    create-weather-wizard-campaigns.ts - Campaign creation
    research-keywords.ts               - Keyword research
    performance-report.ts              - Performance reporting
    update-ad-urls.ts                  - Ad URL management
    update-campaign-budget.ts          - Budget adjustments
    get-google-ads-token.ts            - OAuth2 token setup
    test-google-ads.ts                 - API connection test
```

### 6.2 Client Initialisation

The `google-ads-api` npm package (v22) is used as the primary client library. The client is initialised once in `lib/google-ads/client.ts`:

```typescript
const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
});

const customer = client.Customer({
  customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID,
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
  login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
});
```

For the `uploadCallConversions` endpoint, which is not covered by the npm package's typed methods, a direct REST API call is made to `https://googleads.googleapis.com/v19/customers/{customerId}:uploadCallConversions` with a manually obtained access token.

### 6.3 Error Handling

- **Partial failure support.** The `uploadCallConversions` request is sent with `partialFailure: true`, allowing some conversions in a batch to succeed even if others fail.
- **Detailed error reporting.** Failed conversions are logged with the caller number and error message. The pipeline does not silently discard errors.
- **Structured exit codes.** The pipeline script uses exit codes (0 = success, 1 = fatal, 2 = partial) so GitHub Actions can distinguish between complete and partial failures.
- **Startup validation.** Required environment variables are validated at client initialisation. Missing credentials cause an immediate, descriptive failure rather than a cryptic API error downstream.

---

## 7. Compliance

### 7.1 Terms of Service

This application complies with the Google Ads API Terms of Service:

- **Internal agency tool.** The application is used by Lane Consultancy to manage Google Ads campaigns for its clients via a Manager (MCC) account. It is not a commercial product and is not offered to third parties. Only Lane Consultancy staff have access.
- **No data resale.** Data retrieved from the Google Ads API (performance metrics, keyword ideas) is used solely for client campaign management. It is not shared with, sold to, or displayed to any external parties beyond the client whose account it relates to.
- **No automated bidding circumvention.** The tool does not attempt to circumvent or manipulate Google Ads' automated bidding systems. Offline conversion uploads provide additional signal to improve automated bidding accuracy.

### 7.2 Data Handling

- **Personally identifiable information (PII).** The only PII handled is caller phone numbers, which are sourced from Twilio call logs. These numbers are uploaded to Google Ads via the `uploadCallConversions` endpoint as required by the API's caller-ID matching strategy. Phone numbers are not stored permanently outside of Twilio's own call log retention.
- **No user data collection.** The application does not collect, store, or process end-user data from website visitors beyond what Twilio and WhatConverts already record as part of their standard call tracking services.

### 7.3 Rate Limiting and Resource Usage

The application makes minimal API requests (approximately 2 per day automated per client account, plus occasional manual queries). There is no polling, no bulk data extraction, and no scenario where the application would generate high request volumes. The daily call volume for local service businesses is far below Google's batch limits.

---

## Summary

Lane Consultancy requests Basic access to the Google Ads API to operate an internal agency tool for managing client Google Ads accounts via its Manager (MCC) account. The tool is a set of TypeScript scripts that handle campaign creation, keyword research, performance reporting, and -- most importantly -- daily offline call conversion uploads. The offline conversion upload feature is the primary driver for this access request, as it requires production-level API access to run reliably via an automated daily workflow. The tool is not a commercial product, serves no external users, and makes minimal API requests.
