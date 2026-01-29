#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { GoogleAdsApi, enums } from "google-ads-api";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

// Validate required environment variables
const requiredEnvVars = [
  "GOOGLE_ADS_CLIENT_ID",
  "GOOGLE_ADS_CLIENT_SECRET",
  "GOOGLE_ADS_DEVELOPER_TOKEN",
  "GOOGLE_ADS_REFRESH_TOKEN",
  "GOOGLE_ADS_CUSTOMER_ID",
];

const missingVars = requiredEnvVars.filter((v) => !process.env[v]);
if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(", ")}`);
  process.exit(1);
}

// Initialize Google Ads client
const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
});

const customer = client.Customer({
  customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID!,
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
  login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
});

// Zod schemas for input validation
const CampaignIdSchema = z.object({
  campaign_id: z.string().describe("The campaign resource name or ID"),
});

const AdIdSchema = z.object({
  ad_id: z.string().describe("The ad resource name or ID"),
  new_final_url: z.string().url().describe("The new final URL for the ad"),
});

const RemoveAdsSchema = z.object({
  ad_ids: z.array(z.string()).describe("Array of ad resource names or IDs to remove"),
});

const CampaignPerformanceSchema = z.object({
  campaign_id: z.string().describe("The campaign resource name or ID"),
  date_range: z.string().optional().describe("Date range (e.g., LAST_30_DAYS, THIS_MONTH)"),
});

const SearchTermsSchema = z.object({
  campaign_id: z.string().optional().describe("Optional campaign ID to filter by"),
});

const AdGroupIdSchema = z.object({
  ad_group_id: z.string().describe("The ad group resource name or ID"),
});

const AddKeywordsSchema = z.object({
  ad_group_id: z.string().describe("The ad group resource name or ID"),
  keywords: z.array(z.object({
    text: z.string().describe("Keyword text"),
    match_type: z.enum(["EXACT", "PHRASE", "BROAD"]).describe("Keyword match type"),
  })).describe("Array of keywords to add"),
});

const KeywordIdSchema = z.object({
  keyword_id: z.string().describe("The keyword resource name or ID"),
});

// Create MCP server
const server = new Server(
  { name: "google-ads", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Define all tools
const tools = [
  {
    name: "google_ads_list_campaigns",
    description: "List all campaigns with their status, budgets, and key metrics",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "google_ads_get_campaign",
    description: "Get detailed information about a specific campaign",
    inputSchema: {
      type: "object",
      properties: {
        campaign_id: {
          type: "string",
          description: "The campaign resource name or ID",
        },
      },
      required: ["campaign_id"],
    },
  },
  {
    name: "google_ads_pause_campaign",
    description: "Pause an active campaign",
    inputSchema: {
      type: "object",
      properties: {
        campaign_id: {
          type: "string",
          description: "The campaign resource name or ID",
        },
      },
      required: ["campaign_id"],
    },
  },
  {
    name: "google_ads_enable_campaign",
    description: "Enable a paused campaign",
    inputSchema: {
      type: "object",
      properties: {
        campaign_id: {
          type: "string",
          description: "The campaign resource name or ID",
        },
      },
      required: ["campaign_id"],
    },
  },
  {
    name: "google_ads_list_ads",
    description: "List all ads with their URLs, status, and performance",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "google_ads_update_ad_urls",
    description: "Update the final URL of an ad (e.g., to add dynamic keyword parameters)",
    inputSchema: {
      type: "object",
      properties: {
        ad_id: {
          type: "string",
          description: "The ad resource name or ID",
        },
        new_final_url: {
          type: "string",
          description: "The new final URL for the ad",
        },
      },
      required: ["ad_id", "new_final_url"],
    },
  },
  {
    name: "google_ads_remove_ads",
    description: "Remove multiple ads by their IDs",
    inputSchema: {
      type: "object",
      properties: {
        ad_ids: {
          type: "array",
          items: { type: "string" },
          description: "Array of ad resource names or IDs to remove",
        },
      },
      required: ["ad_ids"],
    },
  },
  {
    name: "google_ads_account_overview",
    description: "Get account-wide performance metrics and overview",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "google_ads_campaign_performance",
    description: "Get performance metrics for a specific campaign",
    inputSchema: {
      type: "object",
      properties: {
        campaign_id: {
          type: "string",
          description: "The campaign resource name or ID",
        },
        date_range: {
          type: "string",
          description: "Date range (e.g., LAST_30_DAYS, THIS_MONTH, LAST_7_DAYS)",
        },
      },
      required: ["campaign_id"],
    },
  },
  {
    name: "google_ads_search_terms_report",
    description: "See what search terms triggered your ads",
    inputSchema: {
      type: "object",
      properties: {
        campaign_id: {
          type: "string",
          description: "Optional campaign ID to filter by",
        },
      },
    },
  },
  {
    name: "google_ads_list_keywords",
    description: "List all keywords in an ad group",
    inputSchema: {
      type: "object",
      properties: {
        ad_group_id: {
          type: "string",
          description: "The ad group resource name or ID",
        },
      },
      required: ["ad_group_id"],
    },
  },
  {
    name: "google_ads_add_keywords",
    description: "Add keywords to an ad group",
    inputSchema: {
      type: "object",
      properties: {
        ad_group_id: {
          type: "string",
          description: "The ad group resource name or ID",
        },
        keywords: {
          type: "array",
          items: {
            type: "object",
            properties: {
              text: { type: "string", description: "Keyword text" },
              match_type: {
                type: "string",
                enum: ["EXACT", "PHRASE", "BROAD"],
                description: "Keyword match type",
              },
            },
            required: ["text", "match_type"],
          },
          description: "Array of keywords to add",
        },
      },
      required: ["ad_group_id", "keywords"],
    },
  },
  {
    name: "google_ads_remove_keyword",
    description: "Remove a keyword from an ad group",
    inputSchema: {
      type: "object",
      properties: {
        keyword_id: {
          type: "string",
          description: "The keyword resource name or ID",
        },
      },
      required: ["keyword_id"],
    },
  },
];

// Handle ListTools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle CallTool request
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "google_ads_list_campaigns": {
        const query = `
          SELECT
            campaign.id,
            campaign.name,
            campaign.status,
            campaign_budget.amount_micros,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions
          FROM campaign
          WHERE campaign.status != 'REMOVED'
          ORDER BY campaign.name
        `;

        const campaigns = await customer.query(query);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(campaigns, null, 2),
            },
          ],
        };
      }

      case "google_ads_get_campaign": {
        const { campaign_id } = CampaignIdSchema.parse(args);

        const query = `
          SELECT
            campaign.id,
            campaign.name,
            campaign.status,
            campaign.advertising_channel_type,
            campaign.bidding_strategy_type,
            campaign_budget.amount_micros,
            campaign.target_cpa.target_cpa_micros,
            campaign.start_date,
            campaign.end_date,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions,
            metrics.conversion_value
          FROM campaign
          WHERE campaign.id = ${campaign_id}
        `;

        const campaignData = await customer.query(query);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(campaignData, null, 2),
            },
          ],
        };
      }

      case "google_ads_pause_campaign": {
        const { campaign_id } = CampaignIdSchema.parse(args);

        const campaign = {
          resource_name: `customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/campaigns/${campaign_id}`,
          status: enums.CampaignStatus.PAUSED,
        };

        const result = await customer.campaigns.update([campaign]);

        return {
          content: [
            {
              type: "text",
              text: `Campaign ${campaign_id} paused successfully. Result: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case "google_ads_enable_campaign": {
        const { campaign_id } = CampaignIdSchema.parse(args);

        const campaign = {
          resource_name: `customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/campaigns/${campaign_id}`,
          status: enums.CampaignStatus.ENABLED,
        };

        const result = await customer.campaigns.update([campaign]);

        return {
          content: [
            {
              type: "text",
              text: `Campaign ${campaign_id} enabled successfully. Result: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case "google_ads_list_ads": {
        const query = `
          SELECT
            ad_group_ad.ad.id,
            ad_group_ad.ad.name,
            ad_group_ad.ad.final_urls,
            ad_group_ad.status,
            ad_group.id,
            ad_group.name,
            campaign.id,
            campaign.name,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros
          FROM ad_group_ad
          WHERE ad_group_ad.status != 'REMOVED'
          ORDER BY campaign.name, ad_group.name
        `;

        const ads = await customer.query(query);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(ads, null, 2),
            },
          ],
        };
      }

      case "google_ads_update_ad_urls": {
        const { ad_id, new_final_url } = AdIdSchema.parse(args);

        const ad = {
          resource_name: `customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/ads/${ad_id}`,
          final_urls: [new_final_url],
        };

        const result = await customer.ads.update([ad]);

        return {
          content: [
            {
              type: "text",
              text: `Ad ${ad_id} URL updated to ${new_final_url}. Result: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case "google_ads_remove_ads": {
        const { ad_ids } = RemoveAdsSchema.parse(args);

        const resourceNames = ad_ids.map((ad_id) =>
          `customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/adGroupAds/${ad_id}`
        );

        const result = await customer.adGroupAds.remove(resourceNames);

        return {
          content: [
            {
              type: "text",
              text: `${ad_ids.length} ads removed successfully. Result: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case "google_ads_account_overview": {
        const query = `
          SELECT
            customer.id,
            customer.descriptive_name,
            customer.currency_code,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions,
            metrics.conversion_value,
            metrics.average_cpc
          FROM customer
          WHERE segments.date DURING LAST_30_DAYS
        `;

        const overview = await customer.query(query);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(overview, null, 2),
            },
          ],
        };
      }

      case "google_ads_campaign_performance": {
        const { campaign_id, date_range = "LAST_30_DAYS" } = CampaignPerformanceSchema.parse(args);

        const query = `
          SELECT
            campaign.id,
            campaign.name,
            metrics.impressions,
            metrics.clicks,
            metrics.ctr,
            metrics.average_cpc,
            metrics.cost_micros,
            metrics.conversions,
            metrics.conversion_rate,
            metrics.cost_per_conversion,
            metrics.conversion_value
          FROM campaign
          WHERE campaign.id = ${campaign_id}
            AND segments.date DURING ${date_range}
        `;

        const performance = await customer.query(query);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(performance, null, 2),
            },
          ],
        };
      }

      case "google_ads_search_terms_report": {
        const { campaign_id } = SearchTermsSchema.parse(args);

        let query = `
          SELECT
            search_term_view.search_term,
            search_term_view.status,
            campaign.id,
            campaign.name,
            ad_group.id,
            ad_group.name,
            metrics.impressions,
            metrics.clicks,
            metrics.ctr,
            metrics.cost_micros,
            metrics.conversions
          FROM search_term_view
          WHERE segments.date DURING LAST_30_DAYS
        `;

        if (campaign_id) {
          query += ` AND campaign.id = ${campaign_id}`;
        }

        query += ` ORDER BY metrics.impressions DESC LIMIT 100`;

        const searchTerms = await customer.query(query);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(searchTerms, null, 2),
            },
          ],
        };
      }

      case "google_ads_list_keywords": {
        const { ad_group_id } = AdGroupIdSchema.parse(args);

        const query = `
          SELECT
            ad_group_criterion.criterion_id,
            ad_group_criterion.keyword.text,
            ad_group_criterion.keyword.match_type,
            ad_group_criterion.status,
            ad_group_criterion.quality_info.quality_score,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros
          FROM ad_group_criterion
          WHERE ad_group.id = ${ad_group_id}
            AND ad_group_criterion.type = 'KEYWORD'
            AND ad_group_criterion.status != 'REMOVED'
        `;

        const keywords = await customer.query(query);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(keywords, null, 2),
            },
          ],
        };
      }

      case "google_ads_add_keywords": {
        const { ad_group_id, keywords } = AddKeywordsSchema.parse(args);

        const adGroupCriteria = keywords.map((keyword) => ({
          ad_group: `customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/adGroups/${ad_group_id}`,
          status: enums.AdGroupCriterionStatus.ENABLED,
          keyword: {
            text: keyword.text,
            match_type: enums.KeywordMatchType[keyword.match_type],
          },
        }));

        const result = await customer.adGroupCriteria.create(adGroupCriteria);

        return {
          content: [
            {
              type: "text",
              text: `${keywords.length} keywords added successfully. Result: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case "google_ads_remove_keyword": {
        const { keyword_id } = KeywordIdSchema.parse(args);

        const resourceName = `customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/adGroupCriteria/${keyword_id}`;

        const result = await customer.adGroupCriteria.remove([resourceName]);

        return {
          content: [
            {
              type: "text",
              text: `Keyword ${keyword_id} removed successfully. Result: ${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error executing ${name}: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);

console.error("Google Ads MCP Server running on stdio");
