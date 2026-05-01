/**
 * Ad Performance Report
 *
 * Pulls performance data for a custom date range from:
 *   - Google Ads (spend, impressions, clicks, conversions per campaign) via REST API v22
 *   - Microsoft Ads (spend, impressions, clicks, conversions) via SOAP Reporting API v13
 *   - Tally forms (completed lead submissions)
 *   - Twilio (unique inbound callers)
 *
 * All four data sources run in parallel via Promise.allSettled so a single
 * API failure does not prevent the rest of the report from printing.
 *
 * Usage:
 *   tsx scripts/ad-report.ts                          # default: last 14 days
 *   tsx scripts/ad-report.ts 2026-03-09 2026-03-20   # explicit date range
 *
 * Environment variables:
 *   .env.local  — Google Ads, Tally, Twilio credentials
 *   ../../.env  — Microsoft Ads credentials
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
// adm-zip uses `export =` so we need the CommonJS-style import
// eslint-disable-next-line @typescript-eslint/no-require-imports
const AdmZip = require('adm-zip') as typeof import('adm-zip');

// Load .env.local first (Google Ads, Tally, Twilio)
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Load project-root .env second — does NOT override already-set keys
// (Microsoft Ads credentials live here)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ---------------------------------------------------------------------------
// Date range configuration
// ---------------------------------------------------------------------------

/**
 * Compute the default date range as last 14 days (inclusive of today).
 * Returns YYYY-MM-DD strings in UTC to avoid timezone drift.
 */
function getDefaultDateRange(): { startDate: string; endDate: string } {
  const now = new Date();
  const endDate = now.toISOString().split('T')[0];
  const start = new Date(now);
  start.setUTCDate(start.getUTCDate() - 13); // 13 days back + today = 14 days
  const startDate = start.toISOString().split('T')[0];
  return { startDate, endDate };
}

function parseDateRange(): { startDate: string; endDate: string } {
  const args = process.argv.slice(2);

  const defaults = getDefaultDateRange();
  const startDate = args[0] ?? defaults.startDate;
  const endDate = args[1] ?? defaults.endDate;

  // Basic YYYY-MM-DD validation so bad args fail loudly
  const isoPattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoPattern.test(startDate) || !isoPattern.test(endDate)) {
    console.error(
      'Error: Dates must be in YYYY-MM-DD format.\n' +
        'Usage: tsx scripts/ad-report.ts [startDate] [endDate]'
    );
    process.exit(1);
  }

  if (startDate > endDate) {
    console.error('Error: startDate must be on or before endDate.');
    process.exit(1);
  }

  return { startDate, endDate };
}

/**
 * Format a YYYY-MM-DD string as "9 Mar 2026" for the report header.
 */
function formatDateForDisplay(isoDate: string): string {
  // Parse as UTC noon to avoid timezone-shift issues
  const d = new Date(`${isoDate}T12:00:00Z`);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// ---------------------------------------------------------------------------
// Google Ads — REST API v22
// ---------------------------------------------------------------------------

const GOOGLE_OAUTH_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const GOOGLE_ADS_API_BASE = 'https://googleads.googleapis.com/v22';

interface GoogleAdsCampaignResult {
  name: string;
  spend: number;
  clicks: number;
  impressions: number;
  conversions: number;
}

interface GoogleAdsResult {
  totalSpend: number;
  totalClicks: number;
  totalImpressions: number;
  totalConversions: number;
  campaigns: GoogleAdsCampaignResult[];
}

async function refreshGoogleAdsAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'Missing Google Ads OAuth credentials. ' +
        'Ensure GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET, and GOOGLE_ADS_REFRESH_TOKEN are set in .env.local'
    );
  }

  const response = await fetch(GOOGLE_OAUTH_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }).toString(),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Google OAuth token refresh failed (${response.status}): ${text}`);
  }

  const data = JSON.parse(text);
  return data.access_token as string;
}

/**
 * Query Google Ads via REST API v22 searchStream endpoint.
 *
 * GAQL uses snake_case field names in the query string, but the JSON response
 * uses camelCase (e.g. `costMicros` not `cost_micros`). costMicros is returned
 * as a string and must be divided by 1,000,000 to get GBP.
 */
async function fetchGoogleAdsData(startDate: string, endDate: string): Promise<GoogleAdsResult> {
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID?.replace(/-/g, '');
  const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID?.replace(/-/g, '');

  if (!developerToken || !customerId || !loginCustomerId) {
    throw new Error(
      'Missing Google Ads credentials. ' +
        'Ensure GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_CUSTOMER_ID, and GOOGLE_ADS_LOGIN_CUSTOMER_ID are set in .env.local'
    );
  }

  const accessToken = await refreshGoogleAdsAccessToken();

  const query =
    `SELECT campaign.name, metrics.cost_micros, metrics.clicks, ` +
    `metrics.impressions, metrics.conversions ` +
    `FROM campaign ` +
    `WHERE segments.date BETWEEN '${startDate}' AND '${endDate}' ` +
    `AND campaign.status != 'REMOVED'`;

  const response = await fetch(
    `${GOOGLE_ADS_API_BASE}/customers/${customerId}/googleAds:searchStream`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'developer-token': developerToken,
        // login-customer-id is the MCC (manager) account ID used for access delegation
        'login-customer-id': loginCustomerId,
      },
      body: JSON.stringify({ query }),
    }
  );

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Google Ads searchStream failed (${response.status}): ${text}`);
  }

  // searchStream returns an array of batch objects, each with a `results` array.
  // Response field names are camelCase even though the GAQL query uses snake_case.
  const batches: Array<{
    results?: Array<{
      campaign?: { name?: string };
      metrics?: {
        costMicros?: string; // string representation of micros
        clicks?: string;
        impressions?: string;
        conversions?: string;
      };
    }>;
  }> = JSON.parse(text);

  // Aggregate by campaign name across all batches
  const campaignMap = new Map<
    string,
    { spend: number; clicks: number; impressions: number; conversions: number }
  >();

  for (const batch of batches) {
    for (const result of batch.results ?? []) {
      const name = result.campaign?.name ?? '(unknown)';
      const spendMicros = parseInt(result.metrics?.costMicros ?? '0', 10);
      const clicks = parseInt(result.metrics?.clicks ?? '0', 10);
      const impressions = parseInt(result.metrics?.impressions ?? '0', 10);
      const conversions = parseFloat(result.metrics?.conversions ?? '0');

      const existing = campaignMap.get(name) ?? {
        spend: 0,
        clicks: 0,
        impressions: 0,
        conversions: 0,
      };
      campaignMap.set(name, {
        spend: existing.spend + spendMicros / 1_000_000,
        clicks: existing.clicks + clicks,
        impressions: existing.impressions + impressions,
        conversions: existing.conversions + conversions,
      });
    }
  }

  const campaigns: GoogleAdsCampaignResult[] = Array.from(campaignMap.entries()).map(
    ([name, metrics]) => ({ name, ...metrics })
  );

  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);

  return { totalSpend, totalClicks, totalImpressions, totalConversions, campaigns };
}

// ---------------------------------------------------------------------------
// Microsoft Ads — SOAP Reporting API v13
// ---------------------------------------------------------------------------

const MSADS_TOKEN_ENDPOINT = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
const MSADS_REPORTING_ENDPOINT =
  'https://reporting.api.bingads.microsoft.com/Api/Advertiser/Reporting/v13/ReportingService.svc';
const MSADS_SCOPE = 'https://ads.microsoft.com/msads.manage offline_access';

/** Maximum milliseconds to poll for a report to become ready. */
const REPORT_POLL_TIMEOUT_MS = 90_000;
/** Milliseconds between poll attempts. */
const REPORT_POLL_INTERVAL_MS = 4_000;

/**
 * The numeric account ID required by the SOAP <a:long> element.
 *
 * MICROSOFT_ADS_ACCOUNT_ID in .env may hold a non-numeric value (e.g. "F1108HVE").
 * MICROSOFT_ADS_NUMERIC_ACCOUNT_ID takes precedence; if neither env var contains
 * a purely numeric string, we fall back to the known-good hardcoded value.
 */
const KNOWN_NUMERIC_ACCOUNT_ID = '141613328';

function resolveMicrosoftAdsNumericAccountId(): string {
  const explicit = process.env.MICROSOFT_ADS_NUMERIC_ACCOUNT_ID;
  if (explicit && /^\d+$/.test(explicit)) {
    return explicit;
  }

  const fallback = process.env.MICROSOFT_ADS_ACCOUNT_ID;
  if (fallback && /^\d+$/.test(fallback)) {
    return fallback;
  }

  // Neither env var is a pure numeric string — use the known-good hardcoded value
  console.warn(
    `Warning: MICROSOFT_ADS_NUMERIC_ACCOUNT_ID and MICROSOFT_ADS_ACCOUNT_ID are not ` +
      `purely numeric. Falling back to hardcoded account ID ${KNOWN_NUMERIC_ACCOUNT_ID}.`
  );
  return KNOWN_NUMERIC_ACCOUNT_ID;
}

interface MicrosoftAdsCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  developerToken: string;
  numericAccountId: string;
}

function loadMicrosoftAdsCredentials(): MicrosoftAdsCredentials {
  const required: Record<string, string | undefined> = {
    MICROSOFT_ADS_CLIENT_ID: process.env.MICROSOFT_ADS_CLIENT_ID,
    MICROSOFT_ADS_CLIENT_SECRET: process.env.MICROSOFT_ADS_CLIENT_SECRET,
    MICROSOFT_ADS_REFRESH_TOKEN: process.env.MICROSOFT_ADS_REFRESH_TOKEN,
    MICROSOFT_ADS_DEVELOPER_TOKEN: process.env.MICROSOFT_ADS_DEVELOPER_TOKEN,
  };

  const missing = Object.entries(required)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length > 0) {
    throw new Error(
      `Missing Microsoft Ads credentials (from ../../.env):\n` +
        missing.map((k) => `  - ${k}`).join('\n')
    );
  }

  return {
    clientId: required.MICROSOFT_ADS_CLIENT_ID!,
    clientSecret: required.MICROSOFT_ADS_CLIENT_SECRET!,
    refreshToken: required.MICROSOFT_ADS_REFRESH_TOKEN!,
    developerToken: required.MICROSOFT_ADS_DEVELOPER_TOKEN!,
    numericAccountId: resolveMicrosoftAdsNumericAccountId(),
  };
}

async function refreshMicrosoftAdsToken(credentials: MicrosoftAdsCredentials): Promise<string> {
  const body = new URLSearchParams({
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    refresh_token: credentials.refreshToken,
    grant_type: 'refresh_token',
    scope: MSADS_SCOPE,
  });

  const response = await fetch(MSADS_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const text = await response.text();
  if (!response.ok) {
    let detail = text;
    try {
      const parsed = JSON.parse(text);
      detail = parsed.error_description ?? parsed.error ?? text;
    } catch {
      // non-JSON error body — use raw text as-is
    }
    throw new Error(`Microsoft Ads token refresh failed (${response.status}): ${detail}`);
  }

  const data = JSON.parse(text);
  return data.access_token as string;
}

/**
 * Submit an AccountPerformanceReport request using the v13: namespace prefix format
 * that the Bing Ads SOAP API requires. Returns the report request ID for polling.
 */
async function submitMicrosoftAdsReportRequest(
  accessToken: string,
  credentials: MicrosoftAdsCredentials,
  startDate: string,
  endDate: string
): Promise<string> {
  const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
  const [endYear, endMonth, endDay] = endDate.split('-').map(Number);

  const soapBody = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:v13="https://bingads.microsoft.com/Reporting/v13">
  <s:Header>
    <v13:AuthenticationToken>${accessToken}</v13:AuthenticationToken>
    <v13:DeveloperToken>${credentials.developerToken}</v13:DeveloperToken>
  </s:Header>
  <s:Body>
    <v13:SubmitGenerateReportRequest>
      <v13:ReportRequest xmlns:i="http://www.w3.org/2001/XMLSchema-instance" i:type="v13:AccountPerformanceReportRequest">
        <v13:ExcludeColumnHeaders>false</v13:ExcludeColumnHeaders>
        <v13:ExcludeReportFooter>true</v13:ExcludeReportFooter>
        <v13:ExcludeReportHeader>true</v13:ExcludeReportHeader>
        <v13:Format>Csv</v13:Format>
        <v13:ReturnOnlyCompleteData>false</v13:ReturnOnlyCompleteData>
        <v13:Aggregation>Summary</v13:Aggregation>
        <v13:Columns>
          <v13:AccountPerformanceReportColumn>AccountName</v13:AccountPerformanceReportColumn>
          <v13:AccountPerformanceReportColumn>Spend</v13:AccountPerformanceReportColumn>
          <v13:AccountPerformanceReportColumn>Impressions</v13:AccountPerformanceReportColumn>
          <v13:AccountPerformanceReportColumn>Clicks</v13:AccountPerformanceReportColumn>
          <v13:AccountPerformanceReportColumn>Conversions</v13:AccountPerformanceReportColumn>
        </v13:Columns>
        <v13:Scope>
          <v13:AccountIds xmlns:a="http://schemas.microsoft.com/2003/10/Serialization/Arrays">
            <a:long>${credentials.numericAccountId}</a:long>
          </v13:AccountIds>
        </v13:Scope>
        <v13:Time>
          <v13:CustomDateRangeEnd>
            <v13:Day>${endDay}</v13:Day>
            <v13:Month>${endMonth}</v13:Month>
            <v13:Year>${endYear}</v13:Year>
          </v13:CustomDateRangeEnd>
          <v13:CustomDateRangeStart>
            <v13:Day>${startDay}</v13:Day>
            <v13:Month>${startMonth}</v13:Month>
            <v13:Year>${startYear}</v13:Year>
          </v13:CustomDateRangeStart>
        </v13:Time>
      </v13:ReportRequest>
    </v13:SubmitGenerateReportRequest>
  </s:Body>
</s:Envelope>`;

  const response = await fetch(MSADS_REPORTING_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'SubmitGenerateReport',
    },
    body: soapBody,
  });

  const text = await response.text();

  if (!response.ok || text.includes('<s:Fault>') || text.includes(':Fault>')) {
    const faultMatch = text.match(/<faultstring[^>]*>([\s\S]*?)<\/faultstring>/i);
    const messageMatch = text.match(/<Message>([\s\S]*?)<\/Message>/i);
    const detail = messageMatch?.[1] ?? faultMatch?.[1] ?? text.slice(0, 400);
    throw new Error(`Microsoft Ads SubmitGenerateReport SOAP fault: ${detail}`);
  }

  const idMatch = text.match(/<ReportRequestId[^>]*>([\s\S]*?)<\/ReportRequestId>/i);
  if (!idMatch?.[1]) {
    throw new Error(
      `Microsoft Ads: Could not extract ReportRequestId from response:\n${text.slice(0, 400)}`
    );
  }

  return idMatch[1].trim();
}

/**
 * Poll PollGenerateReport until the report is ready or the timeout elapses.
 * Returns the download URL when ready.
 */
async function pollMicrosoftAdsReport(
  accessToken: string,
  credentials: MicrosoftAdsCredentials,
  reportRequestId: string
): Promise<string> {
  const deadline = Date.now() + REPORT_POLL_TIMEOUT_MS;

  const soapBody = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:v13="https://bingads.microsoft.com/Reporting/v13">
  <s:Header>
    <v13:AuthenticationToken>${accessToken}</v13:AuthenticationToken>
    <v13:DeveloperToken>${credentials.developerToken}</v13:DeveloperToken>
  </s:Header>
  <s:Body>
    <v13:PollGenerateReportRequest>
      <v13:ReportRequestId>${reportRequestId}</v13:ReportRequestId>
    </v13:PollGenerateReportRequest>
  </s:Body>
</s:Envelope>`;

  while (Date.now() < deadline) {
    const response = await fetch(MSADS_REPORTING_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: 'PollGenerateReport',
      },
      body: soapBody,
    });

    const text = await response.text();

    if (!response.ok || text.includes('<s:Fault>') || text.includes(':Fault>')) {
      const faultMatch = text.match(/<faultstring[^>]*>([\s\S]*?)<\/faultstring>/i);
      const messageMatch = text.match(/<Message>([\s\S]*?)<\/Message>/i);
      const detail = messageMatch?.[1] ?? faultMatch?.[1] ?? text.slice(0, 400);
      throw new Error(`Microsoft Ads PollGenerateReport SOAP fault: ${detail}`);
    }

    const statusMatch = text.match(/<Status[^>]*>([\s\S]*?)<\/Status>/i);
    const status = statusMatch?.[1]?.trim();

    if (status === 'Error') {
      throw new Error('Microsoft Ads report generation failed with Status=Error');
    }

    if (status === 'Success') {
      const urlMatch = text.match(/<ReportDownloadUrl[^>]*>([\s\S]*?)<\/ReportDownloadUrl>/i);
      if (!urlMatch?.[1]) {
        throw new Error(
          'Microsoft Ads report is complete but no download URL was returned. ' +
            'This can happen when the date range has no data.'
        );
      }
      return urlMatch[1].trim().replace(/&amp;/g, '&');
    }

    // Status is Pending or NotStarted — wait and try again
    await new Promise((resolve) => setTimeout(resolve, REPORT_POLL_INTERVAL_MS));
  }

  throw new Error(
    `Microsoft Ads report did not complete within ${REPORT_POLL_TIMEOUT_MS / 1000}s. ` +
      `Request ID: ${reportRequestId}`
  );
}

interface MicrosoftAdsReportData {
  spend: number;
  clicks: number;
  impressions: number;
  conversions: number;
}

/**
 * Download the report zip, extract the CSV, and return the aggregated metrics.
 *
 * Microsoft Ads returns a zipped CSV. We use adm-zip (pure JS, no native deps)
 * to extract it — Node.js does not expose the Web API DecompressionStream.
 */
async function downloadAndParseMicrosoftAdsReport(
  downloadUrl: string
): Promise<MicrosoftAdsReportData> {
  const response = await fetch(downloadUrl);

  if (!response.ok) {
    throw new Error(
      `Microsoft Ads report download failed (HTTP ${response.status}): ${downloadUrl}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const zip = new AdmZip(buffer);
  const entries = zip.getEntries();

  if (entries.length === 0) {
    throw new Error('Microsoft Ads report zip contains no files.');
  }

  const csvEntry = entries.find((e) => e.entryName.endsWith('.csv')) ?? entries[0];
  const csvContent = csvEntry.getData().toString('utf-8');

  return parseMicrosoftAdsCsvMetrics(csvContent);
}

/**
 * Parse aggregated metrics from a Microsoft Ads AccountPerformanceReport CSV.
 *
 * Expected columns: AccountName, Spend, Impressions, Clicks, Conversions
 * Column headers are always present (ExcludeColumnHeaders=false).
 * Numeric values use a period as decimal separator regardless of locale.
 */
function parseMicrosoftAdsCsvMetrics(csv: string): MicrosoftAdsReportData {
  const lines = csv
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    // API returns an empty report (header only) when there are no impressions
    return { spend: 0, clicks: 0, impressions: 0, conversions: 0 };
  }

  const headers = lines[0]
    .split(',')
    .map((h) => h.replace(/^"|"$/g, '').trim().toLowerCase());

  const spendIdx = headers.indexOf('spend');
  const clicksIdx = headers.indexOf('clicks');
  const impressionsIdx = headers.indexOf('impressions');
  const conversionsIdx = headers.indexOf('conversions');

  if (spendIdx === -1) {
    throw new Error(
      `Microsoft Ads CSV missing "Spend" column. Headers found: ${headers.join(', ')}`
    );
  }

  let totalSpend = 0;
  let totalClicks = 0;
  let totalImpressions = 0;
  let totalConversions = 0;

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const getValue = (idx: number): number => {
      if (idx === -1) return 0;
      const raw = cols[idx]?.replace(/^"|"$/g, '').trim() ?? '0';
      const value = parseFloat(raw);
      return isNaN(value) ? 0 : value;
    };

    totalSpend += getValue(spendIdx);
    totalClicks += getValue(clicksIdx);
    totalImpressions += getValue(impressionsIdx);
    totalConversions += getValue(conversionsIdx);
  }

  return {
    spend: totalSpend,
    clicks: totalClicks,
    impressions: totalImpressions,
    conversions: totalConversions,
  };
}

async function fetchMicrosoftAdsData(
  startDate: string,
  endDate: string
): Promise<MicrosoftAdsReportData> {
  const credentials = loadMicrosoftAdsCredentials();
  const accessToken = await refreshMicrosoftAdsToken(credentials);
  const reportRequestId = await submitMicrosoftAdsReportRequest(
    accessToken,
    credentials,
    startDate,
    endDate
  );
  const downloadUrl = await pollMicrosoftAdsReport(accessToken, credentials, reportRequestId);
  return downloadAndParseMicrosoftAdsReport(downloadUrl);
}

// ---------------------------------------------------------------------------
// Tally form submissions
// ---------------------------------------------------------------------------

const TALLY_API_BASE = 'https://api.tally.so';

/**
 * Form configs mirror import-tally-conversions.ts.
 * gclidQuestionId is the hidden-fields question whose answer object holds
 * both `gclid` and `msclkid` keys.
 */
const TALLY_FORMS_WITH_CLICK_IDS: Array<{
  formId: string;
  gclidQuestionId: string;
  label: string;
}> = [
  { formId: 'VL5e5l', gclidQuestionId: 'zK7AqE', label: 'Landing page form' },
  { formId: 'npqGpV', gclidQuestionId: 'XeJqdg', label: 'Original quote form' },
];

/** Traffic source classification for a single lead. */
type TrafficSource = 'google' | 'microsoft' | 'direct';

interface TallySubmissionFull {
  id: string;
  isCompleted: boolean;
  submittedAt: string;
  responses: Array<{
    id: string;
    questionId: string;
    /** Hidden-field answers are objects like { gclid: "...", msclkid: "..." } */
    answer: unknown;
  }>;
}

interface TallyPage {
  submissions: TallySubmissionFull[];
  hasMore: boolean;
}

/**
 * Extract gclid from a Tally submission's hidden-field response.
 * Mirrors the logic in import-tally-conversions.ts — the answer for a
 * hidden-fields question is an object keyed by field name.
 */
function extractTallyGclid(
  submission: TallySubmissionFull,
  gclidQuestionId: string
): string | null {
  const response = submission.responses.find((r) => r.questionId === gclidQuestionId);
  if (!response) return null;

  const answer = response.answer;
  if (!answer || typeof answer !== 'object') return null;

  const gclid = (answer as Record<string, unknown>).gclid;
  if (!gclid || typeof gclid !== 'string' || gclid.trim() === '') return null;
  if (gclid.toLowerCase().startsWith('test_') || gclid === 'test') return null;

  return gclid.trim();
}

/**
 * Extract msclkid from a Tally submission's hidden-field response.
 * Same object shape as gclid — just reads the `msclkid` key instead.
 */
function extractTallyMsclkid(
  submission: TallySubmissionFull,
  gclidQuestionId: string
): string | null {
  const response = submission.responses.find((r) => r.questionId === gclidQuestionId);
  if (!response) return null;

  const answer = response.answer;
  if (!answer || typeof answer !== 'object') return null;

  const msclkid = (answer as Record<string, unknown>).msclkid;
  if (!msclkid || typeof msclkid !== 'string' || msclkid.trim() === '') return null;
  if (msclkid.toLowerCase().startsWith('test_') || msclkid === 'test') return null;

  return msclkid.trim();
}

/**
 * Classify a completed Tally submission's traffic source.
 *   google    — gclid present and valid
 *   microsoft — msclkid present and valid, no gclid
 *   direct    — neither
 */
function classifyTallySubmission(
  submission: TallySubmissionFull,
  gclidQuestionId: string
): TrafficSource {
  const gclid = extractTallyGclid(submission, gclidQuestionId);
  if (gclid) return 'google';

  const msclkid = extractTallyMsclkid(submission, gclidQuestionId);
  if (msclkid) return 'microsoft';

  return 'direct';
}

interface TallySourceCounts {
  total: number;
  google: number;
  microsoft: number;
  direct: number;
}

/**
 * Fetch completed Tally form submissions within the given date range and
 * classify each by traffic source (google / microsoft / direct).
 *
 * Tally returns submissions newest-first. We stop paginating as soon as we
 * pass startDate to avoid fetching the entire history for high-traffic forms.
 */
async function countTallySubmissionsBySource(
  startDate: string,
  endDate: string
): Promise<TallySourceCounts> {
  const apiKey = process.env.TALLY_API_KEY;
  if (!apiKey) {
    throw new Error('TALLY_API_KEY is not set in .env.local');
  }

  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T23:59:59Z`);

  const counts: TallySourceCounts = { total: 0, google: 0, microsoft: 0, direct: 0 };

  for (const form of TALLY_FORMS_WITH_CLICK_IDS) {
    let page = 1;

    while (true) {
      const url = `${TALLY_API_BASE}/forms/${form.formId}/submissions?page=${page}&limit=100`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(
          `Tally API error for form ${form.formId} page ${page}: ${response.status} ${body}`
        );
      }

      const data: TallyPage = await response.json();
      const submissions: TallySubmissionFull[] = data.submissions ?? [];
      let hitCutoff = false;

      for (const sub of submissions) {
        const submittedAt = new Date(sub.submittedAt);

        // Submissions arrive newest-first; stop once we're before the window
        if (submittedAt < start) {
          hitCutoff = true;
          break;
        }

        if (sub.isCompleted && submittedAt >= start && submittedAt <= end) {
          counts.total++;
          const source = classifyTallySubmission(sub, form.gclidQuestionId);
          counts[source]++;
        }
      }

      if (hitCutoff || !data.hasMore) {
        break;
      }

      page++;
    }
  }

  return counts;
}

// ---------------------------------------------------------------------------
// Twilio inbound calls
// ---------------------------------------------------------------------------

const TWILIO_CALLS_API = 'https://api.twilio.com/2010-04-01/Accounts';
const TWILIO_TRACKING_NUMBER = '+448003162922';

/** Minimum call duration in seconds to count as a genuine lead. */
const MIN_CALL_DURATION_SECONDS = 10;

interface TwilioCallerCount {
  total: number;
}

/**
 * Count unique inbound callers via the Twilio REST API.
 *
 * We use the raw REST API rather than the Twilio SDK to keep this script
 * dependency-free and not reliant on SDK initialisation order.
 *
 * Source attribution lives in WhatConverts now — it tracks calls placed via
 * the dynamically-inserted website number and pushes attributed conversions
 * directly to Google Ads and Microsoft Ads.
 */
async function countUniqueTwilioCallers(
  startDate: string,
  endDate: string
): Promise<TwilioCallerCount> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error('TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN is not set in .env.local');
  }

  const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

  const params = new URLSearchParams({
    To: TWILIO_TRACKING_NUMBER,
    Status: 'completed',
    PageSize: '1000',
  });

  // Twilio's StartTime> (greater-than, not >=) is exclusive on the lower bound.
  // Subtract one day to ensure startDate itself is included.
  const startFilterDate = new Date(`${startDate}T00:00:00Z`);
  startFilterDate.setUTCDate(startFilterDate.getUTCDate() - 1);
  params.set('StartTime>', startFilterDate.toISOString().split('T')[0]);
  params.set('StartTime<', `${endDate}T23:59:59Z`);

  const url = `${TWILIO_CALLS_API}/${accountSid}/Calls.json?${params.toString()}`;

  const response = await fetch(url, {
    headers: { Authorization: `Basic ${basicAuth}` },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Twilio Calls API error (${response.status}): ${body}`);
  }

  const data = await response.json();
  const calls: Array<{ from: string; direction: string; duration: string; start_time: string }> =
    data.calls ?? [];

  const endMoment = new Date(`${endDate}T23:59:59Z`);

  // De-duplicate by caller number — keep the earliest qualifying call per number
  const seenCallers = new Set<string>();
  let total = 0;

  for (const call of calls) {
    if (call.direction !== 'inbound') continue;

    const duration = parseInt(call.duration, 10);
    if (isNaN(duration) || duration < MIN_CALL_DURATION_SECONDS) continue;

    const callStart = new Date(call.start_time);
    if (callStart > endMoment) continue;

    if (seenCallers.has(call.from)) continue;
    seenCallers.add(call.from);

    total++;
  }

  return { total };
}

// ---------------------------------------------------------------------------
// Report output
// ---------------------------------------------------------------------------

function formatGbp(amount: number): string {
  return `£${amount.toFixed(2)}`;
}

function printReport(
  dateRange: { startDate: string; endDate: string },
  googleResult: PromiseSettledResult<GoogleAdsResult>,
  microsoftResult: PromiseSettledResult<MicrosoftAdsReportData>,
  tallyResult: PromiseSettledResult<TallySourceCounts>,
  twilioResult: PromiseSettledResult<TwilioCallerCount>
): void {
  const startDisplay = formatDateForDisplay(dateRange.startDate);
  const endDisplay = formatDateForDisplay(dateRange.endDate);

  console.log('');
  console.log(`=== Ad Performance Report: ${startDisplay} - ${endDisplay} ===`);
  console.log('');

  // ── Google Ads ──────────────────────────────────────────────────────────
  console.log('GOOGLE ADS');

  let googleSpend = 0;
  let googleClicks = 0;
  let googleImpressions = 0;
  let googleConversions = 0;

  if (googleResult.status === 'fulfilled') {
    const g = googleResult.value;
    googleSpend = g.totalSpend;
    googleClicks = g.totalClicks;
    googleImpressions = g.totalImpressions;
    googleConversions = g.totalConversions;

    // Sort campaigns by spend descending for readability
    const sorted = [...g.campaigns].sort((a, b) => b.spend - a.spend);

    for (const c of sorted) {
      if (c.spend === 0 && c.clicks === 0 && c.impressions === 0) continue;
      console.log(
        `  Campaign: ${c.name} — Spend: ${formatGbp(c.spend)} | ` +
          `Clicks: ${c.clicks} | Impressions: ${c.impressions.toLocaleString()} | ` +
          `Conv: ${c.conversions.toFixed(1)}`
      );
    }

    console.log(
      `  Total: Spend ${formatGbp(googleSpend)} | ` +
        `Clicks ${googleClicks} | ` +
        `Impressions ${googleImpressions.toLocaleString()} | ` +
        `Conv ${googleConversions.toFixed(1)}`
    );
  } else {
    console.log(`  ERROR: ${(googleResult.reason as Error).message}`);
  }

  console.log('');

  // ── Microsoft Ads ───────────────────────────────────────────────────────
  console.log('MICROSOFT ADS');

  let microsoftSpend = 0;
  let microsoftClicks = 0;
  let microsoftImpressions = 0;
  let microsoftConversions = 0;

  if (microsoftResult.status === 'fulfilled') {
    const m = microsoftResult.value;
    microsoftSpend = m.spend;
    microsoftClicks = m.clicks;
    microsoftImpressions = m.impressions;
    microsoftConversions = m.conversions;
    console.log(
      `  Spend: ${formatGbp(microsoftSpend)} | ` +
        `Clicks: ${microsoftClicks} | ` +
        `Impressions: ${microsoftImpressions.toLocaleString()} | ` +
        `Conv: ${microsoftConversions.toFixed(1)}`
    );
  } else {
    console.log(`  ERROR: ${(microsoftResult.reason as Error).message}`);
  }

  console.log('');

  // ── Combined ────────────────────────────────────────────────────────────
  const combinedSpend = googleSpend + microsoftSpend;
  const combinedClicks = googleClicks + microsoftClicks;
  const combinedImpressions = googleImpressions + microsoftImpressions;

  console.log('COMBINED');
  console.log(`  Total Spend: ${formatGbp(combinedSpend)}`);
  console.log(`  Total Clicks: ${combinedClicks}`);
  console.log(`  Total Impressions: ${combinedImpressions.toLocaleString()}`);

  console.log('');

  // ── Conversions ─────────────────────────────────────────────────────────
  console.log('CONVERSIONS');

  let formSubmissions = 0;
  let uniqueCallers = 0;

  // Tally source counts (with fallback zeros when the API call failed)
  let tallyCounts: TallySourceCounts = { total: 0, google: 0, microsoft: 0, direct: 0 };
  if (tallyResult.status === 'fulfilled') {
    tallyCounts = tallyResult.value;
    formSubmissions = tallyCounts.total;
    console.log(`  Form submissions: ${formSubmissions}`);
  } else {
    console.log(`  Form submissions: ERROR — ${(tallyResult.reason as Error).message}`);
  }

  // Twilio: total unique callers only. WhatConverts handles per-source
  // attribution and pushes calls to Google/Microsoft Ads natively.
  if (twilioResult.status === 'fulfilled') {
    uniqueCallers = twilioResult.value.total;
    console.log(`  Phone calls: ${uniqueCallers} (unique callers — see WhatConverts for source attribution)`);
  } else {
    console.log(`  Phone calls: ERROR — ${(twilioResult.reason as Error).message}`);
  }

  const totalLeads = formSubmissions + uniqueCallers;
  console.log(`  Total leads: ${totalLeads}`);

  console.log('');

  // ── Cost per lead (blended — preserved for downstream consumers) ─────────
  if (totalLeads > 0 && combinedSpend > 0) {
    const costPerLead = combinedSpend / totalLeads;
    console.log(`COST PER LEAD: ${formatGbp(costPerLead)}`);
  } else if (combinedSpend > 0) {
    console.log('COST PER LEAD: N/A (no leads recorded)');
  } else {
    console.log('COST PER LEAD: N/A (no spend data)');
  }

  console.log('');

  // ── Form submissions by source (Tally captures gclid/msclkid in hidden fields) ──
  console.log('FORM SUBMISSIONS BY SOURCE');
  console.log(`  Google:    ${tallyCounts.google}`);
  console.log(`  Microsoft: ${tallyCounts.microsoft}`);
  console.log(`  Direct:    ${tallyCounts.direct}`);

  console.log('');

  // ── Cost per lead (blended only — per-source for calls is in WhatConverts) ──
  if (totalLeads > 0 && combinedSpend > 0) {
    console.log(`COST PER LEAD (blended): ${formatGbp(combinedSpend / totalLeads)}`);
  } else {
    console.log('COST PER LEAD (blended): N/A');
  }

  console.log('');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const dateRange = parseDateRange();

  console.log(
    `Fetching ad performance data for ${dateRange.startDate} to ${dateRange.endDate}...`
  );

  // Run all four data sources in parallel — a failure in one does not abort others
  const [googleResult, microsoftResult, tallyResult, twilioResult] = await Promise.allSettled([
    fetchGoogleAdsData(dateRange.startDate, dateRange.endDate),
    fetchMicrosoftAdsData(dateRange.startDate, dateRange.endDate),
    countTallySubmissionsBySource(dateRange.startDate, dateRange.endDate),
    countUniqueTwilioCallers(dateRange.startDate, dateRange.endDate),
  ]);

  printReport(dateRange, googleResult, microsoftResult, tallyResult, twilioResult);
}

main().catch((error: Error) => {
  console.error('\nFATAL:', error.message);
  process.exit(1);
});
