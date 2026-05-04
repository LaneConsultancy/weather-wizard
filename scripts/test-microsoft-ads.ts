/**
 * Microsoft Ads (Bing Ads) API Test Script
 *
 * Verifies that:
 * 1. All required Microsoft Ads credentials are present in .env
 * 2. The refresh token can be exchanged for a valid access token
 * 3. The API is reachable via the Customer Management Service
 * 4. The authenticated user info can be retrieved
 *
 * Usage: npm run test-microsoft-ads
 */

import * as path from 'path';
import * as dotenv from 'dotenv';

// Load env from the project root (.env is one directory above weather-wizard-site)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ── Constants ────────────────────────────────────────────────────────────────

const TOKEN_ENDPOINT =
  'https://login.microsoftonline.com/common/oauth2/v2.0/token';

const CUSTOMER_MANAGEMENT_ENDPOINT =
  'https://clientcenter.api.bingads.microsoft.com/Api/CustomerManagement/v13/CustomerManagementService.svc';

const MICROSOFT_ADS_SCOPE =
  'https://ads.microsoft.com/msads.manage offline_access';

// ── Types ─────────────────────────────────────────────────────────────────────

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token?: string;
}

interface MicrosoftAdsCredentials {
  developerToken: string;
  accountId: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

// ── Credential loading ────────────────────────────────────────────────────────

/**
 * Reads and validates all required Microsoft Ads env vars.
 * Throws with a clear message listing any that are missing.
 */
function loadCredentials(): MicrosoftAdsCredentials {
  const required: Record<string, string | undefined> = {
    MICROSOFT_ADS_DEVELOPER_TOKEN: process.env.MICROSOFT_ADS_DEVELOPER_TOKEN,
    MICROSOFT_ADS_ACCOUNT_ID: process.env.MICROSOFT_ADS_ACCOUNT_ID,
    MICROSOFT_ADS_CLIENT_ID: process.env.MICROSOFT_ADS_CLIENT_ID,
    MICROSOFT_ADS_CLIENT_SECRET: process.env.MICROSOFT_ADS_CLIENT_SECRET,
    MICROSOFT_ADS_REFRESH_TOKEN: process.env.MICROSOFT_ADS_REFRESH_TOKEN,
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map((k) => `  - ${k}`).join('\n')}\n\n` +
        'Ensure these are set in the .env file at the project root.'
    );
  }

  return {
    developerToken: required.MICROSOFT_ADS_DEVELOPER_TOKEN!,
    accountId: required.MICROSOFT_ADS_ACCOUNT_ID!,
    clientId: required.MICROSOFT_ADS_CLIENT_ID!,
    clientSecret: required.MICROSOFT_ADS_CLIENT_SECRET!,
    refreshToken: required.MICROSOFT_ADS_REFRESH_TOKEN!,
  };
}

// ── OAuth token exchange ──────────────────────────────────────────────────────

/**
 * Exchanges a refresh token for a fresh access token via the Microsoft
 * identity platform. A new refresh token may also be returned and should
 * replace the stored one, though we only use it within this session.
 */
async function refreshAccessToken(
  credentials: MicrosoftAdsCredentials
): Promise<TokenResponse> {
  const body = new URLSearchParams({
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    refresh_token: credentials.refreshToken,
    grant_type: 'refresh_token',
    scope: MICROSOFT_ADS_SCOPE,
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const responseText = await response.text();

  if (!response.ok) {
    // Parse the error body if possible for a more useful message
    let errorDetail = responseText;
    try {
      const parsed = JSON.parse(responseText);
      errorDetail = parsed.error_description ?? parsed.error ?? responseText;
    } catch {
      // Response was not JSON; use raw text as-is
    }
    throw new Error(
      `Token refresh failed (HTTP ${response.status}): ${errorDetail}`
    );
  }

  return JSON.parse(responseText) as TokenResponse;
}

// ── SOAP API call ─────────────────────────────────────────────────────────────

/**
 * Builds the SOAP envelope for the GetUser operation.
 * Passing a nil UserId returns info for the authenticated user.
 */
function buildGetUserSoapEnvelope(
  accessToken: string,
  developerToken: string
): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Header>
    <h:ApplicationToken xmlns:h="https://bingads.microsoft.com/Customer/v13" />
    <h:AuthenticationToken xmlns:h="https://bingads.microsoft.com/Customer/v13">${accessToken}</h:AuthenticationToken>
    <h:DeveloperToken xmlns:h="https://bingads.microsoft.com/Customer/v13">${developerToken}</h:DeveloperToken>
  </s:Header>
  <s:Body>
    <GetUserRequest xmlns="https://bingads.microsoft.com/Customer/v13">
      <UserId xmlns:i="http://www.w3.org/2001/XMLSchema-instance" i:nil="true" />
    </GetUserRequest>
  </s:Body>
</s:Envelope>`;
}

/**
 * Calls the Customer Management Service GetUser operation and returns the
 * raw XML response body as a string.
 */
async function callGetUser(
  accessToken: string,
  developerToken: string
): Promise<string> {
  const soapEnvelope = buildGetUserSoapEnvelope(accessToken, developerToken);

  const response = await fetch(CUSTOMER_MANAGEMENT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: 'GetUser',
    },
    body: soapEnvelope,
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `SOAP request failed (HTTP ${response.status}):\n${responseText}`
    );
  }

  // Check for a SOAP fault, which arrives as HTTP 200 but contains an error
  if (responseText.includes('<s:Fault>') || responseText.includes(':Fault>')) {
    const faultMatch = responseText.match(/<faultstring[^>]*>([\s\S]*?)<\/faultstring>/i);
    const messageMatch = responseText.match(/<Message>([\s\S]*?)<\/Message>/i);
    const detail = messageMatch?.[1] ?? faultMatch?.[1] ?? 'See raw response below';
    throw new Error(`SOAP fault returned: ${detail}\n\nRaw response:\n${responseText}`);
  }

  return responseText;
}

// ── XML parsing helpers ───────────────────────────────────────────────────────

/**
 * Extracts the text content of the first matching XML element by tag name.
 * Uses a simple regex since we control the response structure and don't need
 * a full DOM parser for this script.
 */
function extractXmlField(xml: string, tagName: string): string {
  const pattern = new RegExp(`<(?:[a-zA-Z]+:)?${tagName}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z]+:)?${tagName}>`, 'i');
  const match = xml.match(pattern);
  return match?.[1]?.trim() ?? 'N/A';
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Testing Microsoft Ads API Connection\n');
  console.log('='.repeat(60));

  // Step 1: Load and validate credentials
  console.log('\nStep 1: Loading credentials...');

  let credentials: MicrosoftAdsCredentials;
  try {
    credentials = loadCredentials();
    console.log('  Developer Token: ' + credentials.developerToken.substring(0, 6) + '...');
    console.log('  Account ID:      ' + credentials.accountId);
    console.log('  Client ID:       ' + credentials.clientId.substring(0, 8) + '...');
    console.log('  Refresh Token:   ' + credentials.refreshToken.substring(0, 8) + '...');
    console.log('  All credentials loaded successfully.');
  } catch (error: any) {
    console.error('\n  FAILED - credentials missing or incomplete');
    console.error(`  ${error.message}`);
    process.exit(1);
  }

  // Step 2: Exchange refresh token for access token
  console.log('\nStep 2: Refreshing access token...');

  let accessToken: string;
  try {
    const tokenResponse = await refreshAccessToken(credentials);
    accessToken = tokenResponse.access_token;

    const expiresInMinutes = Math.round(tokenResponse.expires_in / 60);
    console.log(`  Token type:    ${tokenResponse.token_type}`);
    console.log(`  Expires in:    ${expiresInMinutes} minutes`);
    console.log(`  Access token:  ${accessToken.substring(0, 20)}...`);
    if (tokenResponse.refresh_token) {
      console.log('  New refresh token received (rotation active).');
    }
    console.log('  Token refresh successful.');
  } catch (error: any) {
    console.error('\n  FAILED - could not obtain access token');
    console.error(`  ${error.message}`);
    console.error('\nTroubleshooting:');
    console.error('  - Verify MICROSOFT_ADS_REFRESH_TOKEN has not expired');
    console.error('  - Verify MICROSOFT_ADS_CLIENT_ID and CLIENT_SECRET are correct');
    console.error('  - Refresh tokens expire if unused for 90 days');
    process.exit(1);
  }

  // Step 3: Call Customer Management API
  console.log('\nStep 3: Calling Customer Management Service (GetUser)...');

  let responseXml: string;
  try {
    responseXml = await callGetUser(accessToken, credentials.developerToken);
    console.log('  API call succeeded.');
  } catch (error: any) {
    console.error('\n  FAILED - API call returned an error');
    console.error(`  ${error.message}`);
    console.error('\nTroubleshooting:');
    console.error('  - Verify MICROSOFT_ADS_DEVELOPER_TOKEN is correct and active');
    console.error('  - Check that the account has API access enabled');
    console.error('  - Ensure the developer token is not in sandbox-only mode');
    process.exit(1);
  }

  // Step 4: Parse and display user info
  console.log('\nStep 4: Parsing user info from response...');

  const firstName = extractXmlField(responseXml, 'FirstName');
  const lastName  = extractXmlField(responseXml, 'LastName');
  const email     = extractXmlField(responseXml, 'Email');
  const userId    = extractXmlField(responseXml, 'Id');
  const lcid      = extractXmlField(responseXml, 'Lcid');

  console.log(`  User ID:    ${userId}`);
  console.log(`  Name:       ${firstName} ${lastName}`);
  console.log(`  Email:      ${email}`);
  console.log(`  Locale:     ${lcid}`);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Microsoft Ads API connection is working correctly.');
  console.log('='.repeat(60));
  console.log('\nAccount details:');
  console.log(`  Account ID:       ${credentials.accountId}`);
  console.log(`  Authenticated as: ${firstName} ${lastName} <${email}>`);
  console.log('');
}

main();
