/**
 * Create Microsoft Ads (Bing Ads) Campaigns for Weather Wizard
 *
 * Creates three new service campaigns for Weather Wizard roofing via the
 * Microsoft Ads Campaign Management SOAP API v13:
 *   1. Search - Guttering - Kent     (£20/day)
 *   2. Search - Bird Proofing - Kent (£20/day)
 *   3. Search - Exterior Painting - Kent (£20/day)
 *
 * Each campaign includes:
 *   - Campaign with daily budget and campaign-level negative keywords
 *   - 6 ad groups (Kent Wide + 5 towns: Maidstone, Dartford, Gillingham, Chatham, Ashford)
 *   - Phrase-match keywords per ad group
 *   - Ad group-level negative keywords (cross-town exclusions)
 *   - Responsive Search Ads with pinned headlines
 *
 * All campaigns are created in PAUSED status for safety.
 *
 * Usage: npm run create-ms-campaigns
 */

import * as path from 'path';
import * as dotenv from 'dotenv';

// Load env from project root — one directory above weather-wizard-site
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ── Constants ────────────────────────────────────────────────────────────────

const TOKEN_ENDPOINT =
  'https://login.microsoftonline.com/common/oauth2/v2.0/token';

const CAMPAIGN_MGMT_ENDPOINT =
  'https://campaign.api.bingads.microsoft.com/Api/Advertiser/CampaignManagement/v13/CampaignManagementService.svc';

const MICROSOFT_ADS_SCOPE =
  'https://ads.microsoft.com/msads.manage offline_access';

const BASE_URL = 'https://www.weatherwizardroofing.co.uk';

// Towns used for town-specific ad groups (mirrors Google Ads setup)
const TOWNS = ['Maidstone', 'Dartford', 'Gillingham', 'Chatham', 'Ashford'] as const;
type Town = typeof TOWNS[number];

// ── Types ─────────────────────────────────────────────────────────────────────

interface Credentials {
  developerToken: string;
  accountId: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

/** Microsoft Ads RSA headline — text up to 30 chars, optional pin to position 1/2/3 */
interface AdHeadline {
  text: string;
  /** When set, the headline is pinned to this position in every impression */
  pinnedField?: 'Headline1' | 'Headline2' | 'Headline3';
}

interface ResponsiveSearchAd {
  headlines: AdHeadline[];
  descriptions: string[];
  finalUrl: string;
}

interface AdGroupSpec {
  name: string;
  keywords: string[];
  /** Town names to exclude at ad group level (cross-town negatives) */
  negativeKeywords: string[];
  ads: ResponsiveSearchAd[];
}

interface CampaignSpec {
  name: string;
  dailyBudgetGbp: number;
  /** Campaign-level negative keywords (broad service exclusions) */
  campaignNegativeKeywords: string[];
  adGroups: AdGroupSpec[];
}

// ── Campaign Data ─────────────────────────────────────────────────────────────

/**
 * Builds the 6 ad groups for a guttering campaign:
 * one Kent-wide group and one per town.
 */
function buildGutteringAdGroups(): AdGroupSpec[] {
  const townList = TOWNS.map((t) => t.toLowerCase());

  const kentWide: AdGroupSpec = {
    name: 'Guttering Kent Wide',
    keywords: [
      'gutter repairs kent',
      'gutter cleaning kent',
      'guttering services kent',
      'blocked gutters kent',
      'gutter replacement kent',
      'leaking gutters kent',
      'gutter repair near me',
      'guttering near me',
    ],
    negativeKeywords: townList,
    ads: [
      {
        headlines: [
          { text: 'Gutter Repairs Kent', pinnedField: 'Headline1' },
          { text: 'Expert Guttering Services', pinnedField: 'Headline1' },
          { text: 'Kent Gutter Specialists', pinnedField: 'Headline1' },
          { text: 'Blocked Gutters? Call Now' },
          { text: 'Gutter Cleaning & Repairs' },
          { text: 'Stop Water Damage Today' },
          { text: 'Free Gutter Inspection' },
          { text: '25+ Years Experience' },
          { text: 'No Call-Out Charge' },
          { text: 'Same Day Service' },
          { text: 'Fully Insured & Guaranteed' },
          { text: 'Rated 4.9/5 by Customers' },
          { text: 'UPVC & Cast Iron Gutters' },
          { text: 'Get Your Free Quote' },
          { text: 'Family-Owned Business' },
        ],
        descriptions: [
          'Expert gutter repairs, cleaning & replacement across Kent. Free quotes, no call-out charge.',
          'Blocked or leaking gutters? We fix them fast. 25+ years experience, fully insured.',
          'UPVC & cast iron guttering specialists. Same day service available. Call for a free quote.',
          'Protect your home from water damage. Professional guttering services throughout Kent.',
        ],
        finalUrl: `${BASE_URL}/guttering`,
      },
    ],
  };

  const townGroups: AdGroupSpec[] = TOWNS.map((town) => {
    const townLower = town.toLowerCase();
    const otherTowns = townList.filter((t) => t !== townLower);
    return {
      name: `Guttering ${town}`,
      keywords: [
        `gutter repairs ${townLower}`,
        `gutter cleaning ${townLower}`,
        `guttering ${townLower}`,
      ],
      negativeKeywords: otherTowns,
      ads: [
        {
          headlines: [
            { text: `Gutter Repairs ${town}`, pinnedField: 'Headline1' },
            { text: 'Expert Guttering Services', pinnedField: 'Headline1' },
            { text: 'Kent Gutter Specialists', pinnedField: 'Headline1' },
            { text: 'Blocked Gutters? Call Now' },
            { text: 'Gutter Cleaning & Repairs' },
            { text: 'Stop Water Damage Today' },
            { text: 'Free Gutter Inspection' },
            { text: '25+ Years Experience' },
            { text: 'No Call-Out Charge' },
            { text: 'Same Day Service' },
            { text: 'Fully Insured & Guaranteed' },
            { text: 'Rated 4.9/5 by Customers' },
            { text: 'UPVC & Cast Iron Gutters' },
            { text: 'Get Your Free Quote' },
            { text: 'Family-Owned Business' },
          ],
          descriptions: [
            `Expert gutter repairs, cleaning & replacement in ${town}. Free quotes, no call-out charge.`,
            'Blocked or leaking gutters? We fix them fast. 25+ years experience, fully insured.',
            'UPVC & cast iron guttering specialists. Same day service available. Call for a free quote.',
            `Protect your home from water damage. Professional guttering services in ${town}.`,
          ],
          finalUrl: `${BASE_URL}/${townLower}/guttering`,
        },
      ],
    };
  });

  return [kentWide, ...townGroups];
}

/**
 * Builds the 6 ad groups for a bird proofing campaign.
 */
function buildBirdProofingAdGroups(): AdGroupSpec[] {
  const townList = TOWNS.map((t) => t.toLowerCase());

  const kentWide: AdGroupSpec = {
    name: 'Bird Proofing Kent Wide',
    keywords: [
      'bird proofing kent',
      'pigeon proofing kent',
      'solar panel bird proofing kent',
      'pigeon netting kent',
      'bird netting kent',
      'pigeon control kent',
      'bird mesh solar panels kent',
      'pigeon deterrent kent',
    ],
    negativeKeywords: townList,
    ads: [
      {
        headlines: [
          { text: 'Bird Proofing Kent', pinnedField: 'Headline1' },
          { text: 'Pigeon Control Specialists', pinnedField: 'Headline1' },
          { text: 'Solar Panel Bird Proofing', pinnedField: 'Headline1' },
          { text: 'Humane Pigeon Deterrents' },
          { text: 'Bird Netting & Mesh Installed' },
          { text: 'Protect Your Solar Panels' },
          { text: 'Free Bird Proofing Quote' },
          { text: '25+ Years Experience' },
          { text: 'No Call-Out Charge' },
          { text: 'Fully Insured & Guaranteed' },
          { text: 'Rated 4.9/5 by Customers' },
          { text: 'Same Day Service Available' },
          { text: 'CHAS Accredited Business' },
          { text: 'Get Your Free Quote' },
          { text: 'Family-Owned Business' },
        ],
        descriptions: [
          'Professional bird & pigeon proofing across Kent. Solar panel protection specialists.',
          'Pigeons on your roof or solar panels? We install humane deterrents. Free quotes.',
          'Bird netting, spikes & mesh installation. 25+ years experience. No call-out charge.',
          'Protect your property from bird damage. Fully insured, guaranteed workmanship.',
        ],
        finalUrl: `${BASE_URL}/bird-proofing`,
      },
    ],
  };

  const townGroups: AdGroupSpec[] = TOWNS.map((town) => {
    const townLower = town.toLowerCase();
    const otherTowns = townList.filter((t) => t !== townLower);
    return {
      name: `Bird Proofing ${town}`,
      keywords: [
        `bird proofing ${townLower}`,
        `pigeon proofing ${townLower}`,
        `solar panel bird proofing ${townLower}`,
        `pigeon control ${townLower}`,
      ],
      negativeKeywords: otherTowns,
      ads: [
        {
          headlines: [
            { text: `Bird Proofing ${town}`, pinnedField: 'Headline1' },
            { text: 'Pigeon Control Specialists', pinnedField: 'Headline1' },
            { text: 'Solar Panel Bird Proofing', pinnedField: 'Headline1' },
            { text: 'Humane Pigeon Deterrents' },
            { text: 'Bird Netting & Mesh Installed' },
            { text: 'Protect Your Solar Panels' },
            { text: 'Free Bird Proofing Quote' },
            { text: '25+ Years Experience' },
            { text: 'No Call-Out Charge' },
            { text: 'Fully Insured & Guaranteed' },
            { text: 'Rated 4.9/5 by Customers' },
            { text: 'Same Day Service Available' },
            { text: 'CHAS Accredited Business' },
            { text: 'Get Your Free Quote' },
            { text: 'Family-Owned Business' },
          ],
          descriptions: [
            `Professional bird & pigeon proofing in ${town}. Solar panel protection specialists.`,
            'Pigeons on your roof or solar panels? We install humane deterrents. Free quotes.',
            'Bird netting, spikes & mesh installation. 25+ years experience. No call-out charge.',
            `Protect your property from bird damage in ${town}. Fully insured, guaranteed work.`,
          ],
          finalUrl: `${BASE_URL}/${townLower}/bird-proofing`,
        },
      ],
    };
  });

  return [kentWide, ...townGroups];
}

/**
 * Builds the 6 ad groups for an exterior painting campaign.
 */
function buildExteriorPaintingAdGroups(): AdGroupSpec[] {
  const townList = TOWNS.map((t) => t.toLowerCase());

  const kentWide: AdGroupSpec = {
    name: 'Exterior Painting Kent Wide',
    keywords: [
      'exterior painting kent',
      'house painting kent',
      'outside painting kent',
      'exterior decorator kent',
      'fascia painting kent',
      'soffit painting kent',
    ],
    negativeKeywords: townList,
    ads: [
      {
        headlines: [
          { text: 'Exterior Painting Kent', pinnedField: 'Headline1' },
          { text: 'Professional House Painters', pinnedField: 'Headline1' },
          { text: 'Kent Exterior Decorators', pinnedField: 'Headline1' },
          { text: 'Fascia & Soffit Painting' },
          { text: 'Weatherproof Paint Finishes' },
          { text: 'Transform Your Home Exterior' },
          { text: 'Free Exterior Paint Quote' },
          { text: '25+ Years Experience' },
          { text: 'No Call-Out Charge' },
          { text: 'Fully Insured & Guaranteed' },
          { text: 'Rated 4.9/5 by Customers' },
          { text: 'Same Day Quotes Available' },
          { text: 'Long-Lasting Finishes' },
          { text: 'Get Your Free Quote' },
          { text: 'Family-Owned Business' },
        ],
        descriptions: [
          'Professional exterior painting across Kent. Fascias, soffits, walls & more. Free quotes.',
          'Transform your home exterior with a weatherproof finish. 25+ years experience.',
          'Expert house painters in Kent. Fully insured, guaranteed workmanship. No call-out charge.',
          'From fascia painting to full house exteriors. Competitive rates, free inspections.',
        ],
        finalUrl: `${BASE_URL}/exterior-painting`,
      },
    ],
  };

  const townGroups: AdGroupSpec[] = TOWNS.map((town) => {
    const townLower = town.toLowerCase();
    const otherTowns = townList.filter((t) => t !== townLower);
    return {
      name: `Exterior Painting ${town}`,
      keywords: [
        `exterior painting ${townLower}`,
        `house painting ${townLower}`,
        `exterior decorator ${townLower}`,
        `outside painting ${townLower}`,
      ],
      negativeKeywords: otherTowns,
      ads: [
        {
          headlines: [
            { text: `Exterior Painting ${town}`, pinnedField: 'Headline1' },
            { text: 'Professional House Painters', pinnedField: 'Headline1' },
            { text: 'Kent Exterior Decorators', pinnedField: 'Headline1' },
            { text: 'Fascia & Soffit Painting' },
            { text: 'Weatherproof Paint Finishes' },
            { text: 'Transform Your Home Exterior' },
            { text: 'Free Exterior Paint Quote' },
            { text: '25+ Years Experience' },
            { text: 'No Call-Out Charge' },
            { text: 'Fully Insured & Guaranteed' },
            { text: 'Rated 4.9/5 by Customers' },
            { text: 'Same Day Quotes Available' },
            { text: 'Long-Lasting Finishes' },
            { text: 'Get Your Free Quote' },
            { text: 'Family-Owned Business' },
          ],
          descriptions: [
            `Professional exterior painting in ${town}. Fascias, soffits, walls & more. Free quotes.`,
            'Transform your home exterior with a weatherproof finish. 25+ years experience.',
            `Expert house painters in ${town}. Fully insured, guaranteed work. No call-out charge.`,
            'From fascia painting to full house exteriors. Competitive rates, free inspections.',
          ],
          finalUrl: `${BASE_URL}/${townLower}/exterior-painting`,
        },
      ],
    };
  });

  return [kentWide, ...townGroups];
}

/** The three campaigns to create — all paused at £20/day */
const CAMPAIGNS: CampaignSpec[] = [
  {
    name: 'Search - Guttering - Kent',
    dailyBudgetGbp: 20,
    campaignNegativeKeywords: [
      'roofing', 'roofer', 'roof', 'chimney', 'bird', 'pigeon',
      'painting', 'painter', 'decorator',
    ],
    adGroups: buildGutteringAdGroups(),
  },
  {
    name: 'Search - Bird Proofing - Kent',
    dailyBudgetGbp: 20,
    campaignNegativeKeywords: [
      'roofing', 'roofer', 'roof repair', 'gutter', 'guttering',
      'painting', 'painter', 'decorator',
    ],
    adGroups: buildBirdProofingAdGroups(),
  },
  {
    name: 'Search - Exterior Painting - Kent',
    dailyBudgetGbp: 20,
    campaignNegativeKeywords: [
      'roofing', 'roofer', 'roof', 'gutter', 'guttering',
      'bird', 'pigeon', 'interior',
    ],
    adGroups: buildExteriorPaintingAdGroups(),
  },
];

// ── Credential loading ────────────────────────────────────────────────────────

/**
 * Reads and validates all required Microsoft Ads env vars from the project
 * root .env file. Throws with a clear list of any missing variables.
 */
function loadCredentials(): Credentials {
  const required: Record<string, string | undefined> = {
    MICROSOFT_ADS_DEVELOPER_TOKEN: process.env.MICROSOFT_ADS_DEVELOPER_TOKEN,
    MICROSOFT_ADS_ACCOUNT_ID:      process.env.MICROSOFT_ADS_ACCOUNT_ID,
    MICROSOFT_ADS_CLIENT_ID:       process.env.MICROSOFT_ADS_CLIENT_ID,
    MICROSOFT_ADS_CLIENT_SECRET:   process.env.MICROSOFT_ADS_CLIENT_SECRET,
    MICROSOFT_ADS_REFRESH_TOKEN:   process.env.MICROSOFT_ADS_REFRESH_TOKEN,
  };

  const missing = Object.entries(required)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.map((k) => `  - ${k}`).join('\n')}\n\n` +
        'Ensure these are set in the .env file at the project root.'
    );
  }

  return {
    developerToken: required.MICROSOFT_ADS_DEVELOPER_TOKEN!,
    accountId:      required.MICROSOFT_ADS_ACCOUNT_ID!,
    clientId:       required.MICROSOFT_ADS_CLIENT_ID!,
    clientSecret:   required.MICROSOFT_ADS_CLIENT_SECRET!,
    refreshToken:   required.MICROSOFT_ADS_REFRESH_TOKEN!,
  };
}

// ── OAuth token exchange ──────────────────────────────────────────────────────

/**
 * Exchanges the stored refresh token for a fresh access token.
 * Called once at script start; the resulting token is reused for the session.
 */
async function getAccessToken(credentials: Credentials): Promise<string> {
  const body = new URLSearchParams({
    client_id:     credentials.clientId,
    client_secret: credentials.clientSecret,
    refresh_token: credentials.refreshToken,
    grant_type:    'refresh_token',
    scope:         MICROSOFT_ADS_SCOPE,
  });

  const response = await fetch(TOKEN_ENDPOINT, {
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
    } catch { /* raw text is fine */ }
    throw new Error(`Token refresh failed (HTTP ${response.status}): ${detail}`);
  }

  const data = JSON.parse(text) as TokenResponse;
  return data.access_token;
}

// ── SOAP helpers ──────────────────────────────────────────────────────────────

/**
 * Sends a SOAP request to the Campaign Management Service and returns the
 * raw XML response. Throws on HTTP errors and SOAP Faults.
 *
 * @param action      - SOAP action name (used in SOAPAction header and request element)
 * @param bodyContent - Inner XML content placed inside the request element
 * @param credentials - Credentials used to populate the SOAP header
 * @param accessToken - OAuth2 access token for the AuthenticationToken header field
 */
async function soapRequest(
  action: string,
  bodyContent: string,
  credentials: Credentials,
  accessToken: string
): Promise<string> {
  // Campaign Management Service uses https://bingads.microsoft.com/CampaignManagement/v13 namespace
  const envelope = `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
  <s:Header>
    <h:AuthenticationToken xmlns:h="https://bingads.microsoft.com/CampaignManagement/v13">${accessToken}</h:AuthenticationToken>
    <h:CustomerAccountId xmlns:h="https://bingads.microsoft.com/CampaignManagement/v13">${credentials.accountId}</h:CustomerAccountId>
    <h:DeveloperToken xmlns:h="https://bingads.microsoft.com/CampaignManagement/v13">${credentials.developerToken}</h:DeveloperToken>
  </s:Header>
  <s:Body>
    <${action}Request xmlns="https://bingads.microsoft.com/CampaignManagement/v13">
      ${bodyContent}
    </${action}Request>
  </s:Body>
</s:Envelope>`;

  const response = await fetch(CAMPAIGN_MGMT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: action,
    },
    body: envelope,
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`SOAP HTTP error (${response.status}) for ${action}:\n${text.substring(0, 1000)}`);
  }

  // SOAP Faults arrive as HTTP 200 but contain application-level errors
  if (text.includes('<s:Fault>') || text.includes(':Fault>')) {
    const faultDetail =
      extractXml(text, 'TrackingId') ??
      extractXml(text, 'Message') ??
      extractXml(text, 'faultstring') ??
      'See raw response';
    throw new Error(`SOAP Fault in ${action}: ${faultDetail}\n\nRaw:\n${text.substring(0, 2000)}`);
  }

  return text;
}

/**
 * Extracts the text content of the first XML element matching the given tag,
 * ignoring namespace prefixes. Returns null if not found.
 */
function extractXml(xml: string, tag: string): string | null {
  const re = new RegExp(
    `<(?:[a-zA-Z]+:)?${tag}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z]+:)?${tag}>`,
    'i'
  );
  return xml.match(re)?.[1]?.trim() ?? null;
}

/**
 * Extracts all text occurrences of a repeating XML element by tag name.
 * Used to collect multiple IDs from list responses (e.g. CampaignId, AdGroupId).
 */
function extractAllXml(xml: string, tag: string): string[] {
  const re = new RegExp(
    `<(?:[a-zA-Z]+:)?${tag}[^>]*>([\\s\\S]*?)<\\/(?:[a-zA-Z]+:)?${tag}>`,
    'gi'
  );
  const results: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = re.exec(xml)) !== null) {
    results.push(match[1].trim());
  }
  return results;
}

// ── Campaign Management Operations ───────────────────────────────────────────

/**
 * Creates campaigns in the account and returns their assigned IDs.
 * All campaigns are created in PAUSED status so they don't serve immediately.
 *
 * @returns Array of campaign IDs in the same order as the input specs
 */
async function addCampaigns(
  specs: CampaignSpec[],
  credentials: Credentials,
  accessToken: string
): Promise<string[]> {
  const campaignsXml = specs
    .map(
      (c) => `<Campaign>
        <BudgetType>DailyBudgetStandard</BudgetType>
        <DailyBudget>${c.dailyBudgetGbp}</DailyBudget>
        <Name>${escapeXml(c.name)}</Name>
        <Status>Paused</Status>
        <TimeZone>Europe/London</TimeZone>
        <CampaignType>Search</CampaignType>
      </Campaign>`
    )
    .join('\n      ');

  const body = `<Campaigns>${campaignsXml}</Campaigns>`;
  const xml = await soapRequest('AddCampaigns', body, credentials, accessToken);

  const ids = extractAllXml(xml, 'long');
  if (ids.length !== specs.length) {
    throw new Error(
      `AddCampaigns returned ${ids.length} IDs but expected ${specs.length}.\nResponse:\n${xml.substring(0, 2000)}`
    );
  }
  return ids;
}

/**
 * Creates negative keywords at the campaign level.
 * Uses phrase match to mirror the Google Ads setup.
 *
 * @param campaignId       - Campaign to attach the negatives to
 * @param negativeKeywords - Keyword texts to negate
 */
async function addCampaignNegativeKeywords(
  campaignId: string,
  negativeKeywords: string[],
  credentials: Credentials,
  accessToken: string
): Promise<void> {
  if (negativeKeywords.length === 0) return;

  const keywordsXml = negativeKeywords
    .map(
      (kw) => `<NegativeKeyword>
            <MatchType>Phrase</MatchType>
            <Text>${escapeXml(kw)}</Text>
          </NegativeKeyword>`
    )
    .join('\n          ');

  const body = `<EntityNegativeKeywords>
      <EntityNegativeKeyword>
        <EntityId>${campaignId}</EntityId>
        <EntityType>Campaign</EntityType>
        <NegativeKeywords>
          ${keywordsXml}
        </NegativeKeywords>
      </EntityNegativeKeyword>
    </EntityNegativeKeywords>`;

  await soapRequest('AddNegativeKeywordsToEntities', body, credentials, accessToken);
}

/**
 * Creates ad groups within a campaign and returns their assigned IDs.
 * Ad groups start with a £0.50 CPC bid which can be adjusted after review.
 *
 * @returns Array of ad group IDs in the same order as the input specs
 */
async function addAdGroups(
  campaignId: string,
  adGroupSpecs: AdGroupSpec[],
  credentials: Credentials,
  accessToken: string
): Promise<string[]> {
  const adGroupsXml = adGroupSpecs
    .map(
      (ag) => `<AdGroup>
        <CpcBid>
          <Amount>0.50</Amount>
        </CpcBid>
        <Name>${escapeXml(ag.name)}</Name>
        <Status>Paused</Status>
      </AdGroup>`
    )
    .join('\n      ');

  const body = `<CampaignId>${campaignId}</CampaignId>
    <AdGroups>${adGroupsXml}</AdGroups>`;

  const xml = await soapRequest('AddAdGroups', body, credentials, accessToken);

  const ids = extractAllXml(xml, 'long');
  if (ids.length !== adGroupSpecs.length) {
    throw new Error(
      `AddAdGroups returned ${ids.length} IDs but expected ${adGroupSpecs.length} for campaign ${campaignId}.`
    );
  }
  return ids;
}

/**
 * Creates ad group-level negative keywords (cross-town exclusions).
 * Phrase match prevents ads showing for queries containing another town name.
 */
async function addAdGroupNegativeKeywords(
  adGroupId: string,
  negativeKeywords: string[],
  credentials: Credentials,
  accessToken: string
): Promise<void> {
  if (negativeKeywords.length === 0) return;

  const keywordsXml = negativeKeywords
    .map(
      (kw) => `<NegativeKeyword>
            <MatchType>Phrase</MatchType>
            <Text>${escapeXml(kw)}</Text>
          </NegativeKeyword>`
    )
    .join('\n          ');

  const body = `<EntityNegativeKeywords>
      <EntityNegativeKeyword>
        <EntityId>${adGroupId}</EntityId>
        <EntityType>AdGroup</EntityType>
        <NegativeKeywords>
          ${keywordsXml}
        </NegativeKeywords>
      </EntityNegativeKeyword>
    </EntityNegativeKeywords>`;

  await soapRequest('AddNegativeKeywordsToEntities', body, credentials, accessToken);
}

/**
 * Adds phrase-match keywords to an ad group.
 *
 * @param adGroupId - Target ad group
 * @param keywords  - Keyword texts (all added as Phrase match)
 */
async function addKeywords(
  adGroupId: string,
  keywords: string[],
  credentials: Credentials,
  accessToken: string
): Promise<void> {
  if (keywords.length === 0) return;

  const keywordsXml = keywords
    .map(
      (kw) => `<Keyword>
        <MatchType>Phrase</MatchType>
        <Status>Active</Status>
        <Text>${escapeXml(kw)}</Text>
      </Keyword>`
    )
    .join('\n      ');

  const body = `<AdGroupId>${adGroupId}</AdGroupId>
    <Keywords>${keywordsXml}</Keywords>`;

  await soapRequest('AddKeywords', body, credentials, accessToken);
}

/**
 * Adds a Responsive Search Ad to an ad group.
 *
 * Headlines marked with pinnedField are pinned to the specified position
 * (Headline1, Headline2, or Headline3). The Microsoft Ads API requires a
 * minimum of 3 headlines and 2 descriptions for RSAs.
 *
 * @param adGroupId - Target ad group
 * @param ad        - RSA configuration with headlines, descriptions, and final URL
 */
async function addResponsiveSearchAd(
  adGroupId: string,
  ad: ResponsiveSearchAd,
  credentials: Credentials,
  accessToken: string
): Promise<void> {
  const headlinesXml = ad.headlines
    .map((h) => {
      const pinXml = h.pinnedField
        ? `<PinnedField>${h.pinnedField}</PinnedField>`
        : '';
      return `<AssetLink>
          <Asset xmlns:i="http://www.w3.org/2001/XMLSchema-instance" i:type="TextAsset">
            <Text>${escapeXml(h.text)}</Text>
          </Asset>
          ${pinXml}
        </AssetLink>`;
    })
    .join('\n        ');

  const descriptionsXml = ad.descriptions
    .map(
      (d) => `<AssetLink>
          <Asset xmlns:i="http://www.w3.org/2001/XMLSchema-instance" i:type="TextAsset">
            <Text>${escapeXml(d)}</Text>
          </Asset>
        </AssetLink>`
    )
    .join('\n        ');

  const body = `<AdGroupId>${adGroupId}</AdGroupId>
    <Ads>
      <Ad xmlns:i="http://www.w3.org/2001/XMLSchema-instance" i:type="ResponsiveSearchAd">
        <FinalUrls>
          <string>${escapeXml(ad.finalUrl)}</string>
        </FinalUrls>
        <Status>Paused</Status>
        <Descriptions>
          ${descriptionsXml}
        </Descriptions>
        <Headlines>
          ${headlinesXml}
        </Headlines>
      </Ad>
    </Ads>`;

  await soapRequest('AddAds', body, credentials, accessToken);
}

// ── XML utility ───────────────────────────────────────────────────────────────

/**
 * Escapes the five XML special characters so a string can be safely
 * embedded as XML text content.
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ── Main orchestration ────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('Weather Wizard — Microsoft Ads Campaign Creation');
  console.log('='.repeat(60));

  // ── Step 1: Load credentials ────────────────────────────────────────────────
  console.log('\nStep 1: Loading credentials...');
  let credentials: Credentials;
  try {
    credentials = loadCredentials();
    console.log(`  Account ID:       ${credentials.accountId}`);
    console.log(`  Developer Token:  ${credentials.developerToken.substring(0, 6)}...`);
    console.log('  OK');
  } catch (err: any) {
    console.error(`\nFailed to load credentials: ${err.message}`);
    process.exit(1);
  }

  // ── Step 2: Obtain access token ─────────────────────────────────────────────
  console.log('\nStep 2: Obtaining access token...');
  let accessToken: string;
  try {
    accessToken = await getAccessToken(credentials);
    console.log(`  Token:  ${accessToken.substring(0, 20)}...`);
    console.log('  OK');
  } catch (err: any) {
    console.error(`\nFailed to obtain access token: ${err.message}`);
    console.error('  Check that MICROSOFT_ADS_REFRESH_TOKEN has not expired.');
    process.exit(1);
  }

  // ── Step 3: Create campaigns ────────────────────────────────────────────────
  console.log('\nStep 3: Creating campaigns...');
  let campaignIds: string[];
  try {
    campaignIds = await addCampaigns(CAMPAIGNS, credentials, accessToken);
    for (let i = 0; i < CAMPAIGNS.length; i++) {
      console.log(`  [${campaignIds[i]}] ${CAMPAIGNS[i].name}`);
    }
    console.log('  OK');
  } catch (err: any) {
    console.error(`\nFailed to create campaigns: ${err.message}`);
    process.exit(1);
  }

  // ── Step 4: Per-campaign: negatives, ad groups, keywords, ads ───────────────
  for (let ci = 0; ci < CAMPAIGNS.length; ci++) {
    const campaign = CAMPAIGNS[ci];
    const campaignId = campaignIds[ci];

    console.log(`\n${'-'.repeat(60)}`);
    console.log(`Campaign: ${campaign.name} (ID: ${campaignId})`);

    // Campaign-level negative keywords
    if (campaign.campaignNegativeKeywords.length > 0) {
      console.log(`  Adding ${campaign.campaignNegativeKeywords.length} campaign-level negatives...`);
      try {
        await addCampaignNegativeKeywords(
          campaignId,
          campaign.campaignNegativeKeywords,
          credentials,
          accessToken
        );
        console.log('  OK');
      } catch (err: any) {
        // Non-fatal — log and continue so partial setup is visible in the UI
        console.error(`  ERROR adding campaign negatives: ${err.message}`);
      }
    }

    // Create all ad groups for this campaign
    console.log(`  Creating ${campaign.adGroups.length} ad groups...`);
    let adGroupIds: string[];
    try {
      adGroupIds = await addAdGroups(campaignId, campaign.adGroups, credentials, accessToken);
      for (let agi = 0; agi < campaign.adGroups.length; agi++) {
        console.log(`    [${adGroupIds[agi]}] ${campaign.adGroups[agi].name}`);
      }
      console.log('  OK');
    } catch (err: any) {
      console.error(`  ERROR creating ad groups: ${err.message}`);
      // Skip this campaign's keywords/ads if ad groups failed
      continue;
    }

    // For each ad group: negative keywords, keywords, ads
    for (let agi = 0; agi < campaign.adGroups.length; agi++) {
      const adGroup = campaign.adGroups[agi];
      const adGroupId = adGroupIds[agi];

      console.log(`\n  Ad group: ${adGroup.name} (ID: ${adGroupId})`);

      // Ad group-level negatives (cross-town)
      if (adGroup.negativeKeywords.length > 0) {
        console.log(`    Adding ${adGroup.negativeKeywords.length} ad group negatives...`);
        try {
          await addAdGroupNegativeKeywords(adGroupId, adGroup.negativeKeywords, credentials, accessToken);
          console.log('    OK');
        } catch (err: any) {
          console.error(`    ERROR adding ad group negatives: ${err.message}`);
        }
      }

      // Phrase-match keywords
      console.log(`    Adding ${adGroup.keywords.length} keywords...`);
      try {
        await addKeywords(adGroupId, adGroup.keywords, credentials, accessToken);
        console.log('    OK');
      } catch (err: any) {
        console.error(`    ERROR adding keywords: ${err.message}`);
      }

      // Responsive Search Ads
      console.log(`    Adding ${adGroup.ads.length} RSA(s)...`);
      for (const ad of adGroup.ads) {
        try {
          await addResponsiveSearchAd(adGroupId, ad, credentials, accessToken);
          console.log(`    OK — ${ad.finalUrl}`);
        } catch (err: any) {
          console.error(`    ERROR adding RSA: ${err.message}`);
        }
      }
    }
  }

  // ── Summary ─────────────────────────────────────────────────────────────────
  console.log(`\n${'='.repeat(60)}`);
  console.log('Campaign creation complete.');
  console.log('');
  console.log('Campaigns created (all PAUSED — enable in Microsoft Ads UI):');
  for (let i = 0; i < CAMPAIGNS.length; i++) {
    console.log(`  [${campaignIds[i]}] ${CAMPAIGNS[i].name}`);
  }
  console.log('');
  console.log('Next steps:');
  console.log('  1. Review campaigns in the Microsoft Ads UI');
  console.log('  2. Set geographic targeting to Kent / South East England');
  console.log('  3. Verify ad copy meets Microsoft Ads editorial guidelines');
  console.log('  4. Enable campaigns when ready to serve');
}

main().catch((err) => {
  console.error('\nUnhandled error:', err.message ?? err);
  process.exit(1);
});
