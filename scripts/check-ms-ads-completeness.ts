/**
 * Microsoft Ads Completeness Audit
 *
 * Lists all campaigns, ad groups, keywords, and ads to check for gaps
 * (e.g. ad groups with 0 ads or 0 keywords).
 *
 * Usage: npx tsx scripts/check-ms-ads-completeness.ts
 */

import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const TOKEN_ENDPOINT = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
const CAMPAIGN_MGMT_ENDPOINT = 'https://campaign.api.bingads.microsoft.com/Api/Advertiser/CampaignManagement/v13/CampaignManagementService.svc';
const CUSTOMER_MGMT_ENDPOINT = 'https://clientcenter.api.bingads.microsoft.com/Api/CustomerManagement/v13/CustomerManagementService.svc';
const MS_SCOPE = 'https://ads.microsoft.com/msads.manage offline_access';

interface Credentials {
  developerToken: string;
  accountNumber: string;
  accountId: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

function loadCredentials(): Credentials {
  const required: Record<string, string | undefined> = {
    MICROSOFT_ADS_DEVELOPER_TOKEN: process.env.MICROSOFT_ADS_DEVELOPER_TOKEN,
    MICROSOFT_ADS_ACCOUNT_ID: process.env.MICROSOFT_ADS_ACCOUNT_ID,
    MICROSOFT_ADS_CLIENT_ID: process.env.MICROSOFT_ADS_CLIENT_ID,
    MICROSOFT_ADS_CLIENT_SECRET: process.env.MICROSOFT_ADS_CLIENT_SECRET,
    MICROSOFT_ADS_REFRESH_TOKEN: process.env.MICROSOFT_ADS_REFRESH_TOKEN,
  };

  const missing = Object.entries(required).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length > 0) {
    throw new Error(`Missing env vars: ${missing.join(', ')}`);
  }

  return {
    developerToken: required.MICROSOFT_ADS_DEVELOPER_TOKEN!,
    accountNumber: required.MICROSOFT_ADS_ACCOUNT_ID!,
    accountId: '', // resolved below
    clientId: required.MICROSOFT_ADS_CLIENT_ID!,
    clientSecret: required.MICROSOFT_ADS_CLIENT_SECRET!,
    refreshToken: required.MICROSOFT_ADS_REFRESH_TOKEN!,
  };
}

async function getAccessToken(creds: Credentials): Promise<string> {
  const body = new URLSearchParams({
    client_id: creds.clientId,
    client_secret: creds.clientSecret,
    refresh_token: creds.refreshToken,
    grant_type: 'refresh_token',
    scope: MS_SCOPE,
  });

  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) throw new Error(`Token refresh failed: ${await res.text()}`);
  const json = await res.json();
  return json.access_token;
}

async function lookupNumericAccountId(creds: Credentials, accessToken: string): Promise<string> {
  const envelope = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"
            xmlns:i="http://www.w3.org/2001/XMLSchema-instance">
  <s:Header>
    <h:AuthenticationToken xmlns:h="https://bingads.microsoft.com/Customer/v13">${accessToken}</h:AuthenticationToken>
    <h:DeveloperToken xmlns:h="https://bingads.microsoft.com/Customer/v13">${creds.developerToken}</h:DeveloperToken>
  </s:Header>
  <s:Body>
    <GetAccountsInfoRequest xmlns="https://bingads.microsoft.com/Customer/v13">
      <CustomerId i:nil="true" />
      <OnlyParentAccounts>false</OnlyParentAccounts>
    </GetAccountsInfoRequest>
  </s:Body>
</s:Envelope>`;

  const res = await fetch(CUSTOMER_MGMT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/xml; charset=utf-8', SOAPAction: 'GetAccountsInfo' },
    body: envelope,
  });

  const xml = await res.text();
  if (!res.ok) throw new Error(`GetAccountsInfo HTTP ${res.status}:\n${xml.substring(0, 1000)}`);

  // Find the AccountInfo block containing our account number
  const blockRe = /<[^>]*AccountInfo[^>]*>[\s\S]*?<\/[^>]*AccountInfo>/gi;
  const blocks = xml.match(blockRe) ?? [];
  for (const block of blocks) {
    if (block.includes(creds.accountNumber)) {
      const idMatch = block.match(/<[^>]*Id[^>]*>(\d+)<\/[^>]*Id>/i);
      if (idMatch?.[1]) return idMatch[1];
    }
  }

  throw new Error(`Could not resolve numeric account ID for ${creds.accountNumber}`);
}

function extractXml(xml: string, tag: string): string | null {
  const re = new RegExp(`<(?:[a-zA-Z]+:)?${tag}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z]+:)?${tag}>`, 'i');
  return xml.match(re)?.[1]?.trim() ?? null;
}

async function soapRequest(action: string, bodyContent: string, creds: Credentials, accessToken: string): Promise<string> {
  const envelope = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Header>
    <h:AuthenticationToken xmlns:h="https://bingads.microsoft.com/CampaignManagement/v13">${accessToken}</h:AuthenticationToken>
    <h:CustomerAccountId xmlns:h="https://bingads.microsoft.com/CampaignManagement/v13">${creds.accountId}</h:CustomerAccountId>
    <h:DeveloperToken xmlns:h="https://bingads.microsoft.com/CampaignManagement/v13">${creds.developerToken}</h:DeveloperToken>
  </s:Header>
  <s:Body>
    <${action}Request xmlns="https://bingads.microsoft.com/CampaignManagement/v13">
      ${bodyContent}
    </${action}Request>
  </s:Body>
</s:Envelope>`;

  const res = await fetch(CAMPAIGN_MGMT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/xml; charset=utf-8', SOAPAction: action },
    body: envelope,
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`SOAP HTTP ${res.status} for ${action}:\n${text.substring(0, 1000)}`);
  if (text.includes('<s:Fault>') || text.includes(':Fault>')) {
    const detail = extractXml(text, 'Message') ?? extractXml(text, 'faultstring') ?? 'Unknown fault';
    throw new Error(`SOAP Fault in ${action}: ${detail}`);
  }
  return text;
}

interface CampaignInfo { id: string; name: string; status: string; }
interface AdGroupInfo { id: string; name: string; status: string; }

async function getCampaigns(creds: Credentials, accessToken: string): Promise<CampaignInfo[]> {
  const body = `<AccountId>${creds.accountId}</AccountId>
    <CampaignType>Search</CampaignType>`;
  const xml = await soapRequest('GetCampaignsByAccountId', body, creds, accessToken);

  const campaigns: CampaignInfo[] = [];
  const blockRe = /<(?:[a-zA-Z]+:)?Campaign\b[^>]*>[\s\S]*?<\/(?:[a-zA-Z]+:)?Campaign>/gi;
  let block: RegExpExecArray | null;
  while ((block = blockRe.exec(xml)) !== null) {
    const id = block[0].match(/<(?:[a-zA-Z]+:)?Id[^>]*>(\d+)<\/(?:[a-zA-Z]+:)?Id>/i)?.[1];
    const name = block[0].match(/<(?:[a-zA-Z]+:)?Name[^>]*>([\s\S]*?)<\/(?:[a-zA-Z]+:)?Name>/i)?.[1]?.trim();
    const status = block[0].match(/<(?:[a-zA-Z]+:)?Status[^>]*>([\s\S]*?)<\/(?:[a-zA-Z]+:)?Status>/i)?.[1]?.trim();
    if (id && name) campaigns.push({ id, name, status: status ?? 'Unknown' });
  }
  return campaigns;
}

async function getAdGroups(campaignId: string, creds: Credentials, accessToken: string): Promise<AdGroupInfo[]> {
  const body = `<CampaignId>${campaignId}</CampaignId>`;
  const xml = await soapRequest('GetAdGroupsByCampaignId', body, creds, accessToken);

  const adGroups: AdGroupInfo[] = [];
  const blockRe = /<(?:[a-zA-Z]+:)?AdGroup\b[^>]*>[\s\S]*?<\/(?:[a-zA-Z]+:)?AdGroup>/gi;
  let block: RegExpExecArray | null;
  while ((block = blockRe.exec(xml)) !== null) {
    const id = block[0].match(/<(?:[a-zA-Z]+:)?Id[^>]*>(\d+)<\/(?:[a-zA-Z]+:)?Id>/i)?.[1];
    const name = block[0].match(/<(?:[a-zA-Z]+:)?Name[^>]*>([\s\S]*?)<\/(?:[a-zA-Z]+:)?Name>/i)?.[1]?.trim();
    const status = block[0].match(/<(?:[a-zA-Z]+:)?Status[^>]*>([\s\S]*?)<\/(?:[a-zA-Z]+:)?Status>/i)?.[1]?.trim();
    if (id && name) adGroups.push({ id, name, status: status ?? 'Unknown' });
  }
  return adGroups;
}

async function getAdCount(adGroupId: string, creds: Credentials, accessToken: string): Promise<number> {
  const body = `<AdGroupId>${adGroupId}</AdGroupId>
    <AdTypes>
      <AdType>ResponsiveSearch</AdType>
    </AdTypes>`;
  const xml = await soapRequest('GetAdsByAdGroupId', body, creds, accessToken);

  const adBlockRe = /<(?:[a-zA-Z]+:)?Ad\b[^>]*i:type/gi;
  let count = 0;
  while (adBlockRe.exec(xml) !== null) count++;
  return count;
}

async function getKeywordCount(adGroupId: string, creds: Credentials, accessToken: string): Promise<number> {
  const body = `<AdGroupId>${adGroupId}</AdGroupId>`;
  const xml = await soapRequest('GetKeywordsByAdGroupId', body, creds, accessToken);

  const kwBlockRe = /<(?:[a-zA-Z]+:)?Keyword\b[^>]*>[\s\S]*?<\/(?:[a-zA-Z]+:)?Keyword>/gi;
  let count = 0;
  while (kwBlockRe.exec(xml) !== null) count++;
  return count;
}

async function main() {
  console.log('Microsoft Ads Completeness Audit');
  console.log('='.repeat(60));

  const creds = loadCredentials();
  console.log('\nAuthenticating...');
  const accessToken = await getAccessToken(creds);
  creds.accountId = await lookupNumericAccountId(creds, accessToken);
  console.log(`Account: ${creds.accountNumber} (numeric: ${creds.accountId})\n`);

  const campaigns = await getCampaigns(creds, accessToken);
  console.log(`Found ${campaigns.length} campaigns\n`);

  let warnings = 0;

  for (const campaign of campaigns) {
    console.log(`${'─'.repeat(60)}`);
    console.log(`CAMPAIGN: ${campaign.name}`);
    console.log(`  Status: ${campaign.status} | ID: ${campaign.id}`);

    const adGroups = await getAdGroups(campaign.id, creds, accessToken);
    console.log(`  Ad Groups: ${adGroups.length}`);

    for (const ag of adGroups) {
      const [adCount, kwCount] = await Promise.all([
        getAdCount(ag.id, creds, accessToken),
        getKeywordCount(ag.id, creds, accessToken),
      ]);

      const adWarning = adCount === 0 ? ' !! NO ADS' : '';
      const kwWarning = kwCount === 0 ? ' !! NO KEYWORDS' : '';
      if (adCount === 0) warnings++;
      if (kwCount === 0) warnings++;

      console.log(`    ${ag.name} [${ag.status}] -- ${kwCount} keywords, ${adCount} ads${adWarning}${kwWarning}`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  if (warnings > 0) {
    console.log(`\n!! ${warnings} WARNING(S) FOUND -- see above for details`);
  } else {
    console.log('\nAll campaigns and ad groups have keywords and ads');
  }
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
