/**
 * Google Ads API Client - Main Export
 *
 * Convenient re-exports of all Google Ads utilities
 */

// Client
export { getClient, getCustomer, weatherWizardCustomer, accountConfig } from './client';

// Types and Helpers
export {
  LocationIds,
  LanguageIds,
  GeoTargetConstants,
  LanguageConstants,
  toMicros,
  fromMicros,
  formatCurrency,
  formatCampaignDate,
  formatReportDate,
  type KeywordMatchType,
  type CampaignStatus,
  type AdvertisingChannelType,
  type BiddingStrategyType,
  type KeywordCompetition,
  type Micros,
  type DateString,
  type CampaignDate,
  type ResourceName,
  type GoogleAdsError,
  type GoogleAdsApiError,
} from './types';

// Campaigns
export {
  listCampaigns,
  getCampaign,
  createSearchCampaign,
  pauseCampaign,
  enableCampaign,
  type CampaignSummary,
  type CreateSearchCampaignOptions,
} from './campaigns';

// Keywords
export {
  getKeywordIdeas,
  addKeywordsToAdGroup,
  getAdGroupKeywords,
  removeKeyword,
  getCampaignNegativeKeywords,
  type KeywordIdea,
  type KeywordIdeasOptions,
  type AddKeywordOptions,
} from './keywords';

// Reporting
export {
  getCampaignPerformance,
  getAccountOverview,
  getSearchTermsReport,
  DateRanges,
  type DateRange,
  type CampaignPerformance,
  type AccountOverview,
} from './reporting';
