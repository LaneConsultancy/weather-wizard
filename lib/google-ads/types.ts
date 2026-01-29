/**
 * Shared TypeScript types for Google Ads API
 *
 * These types provide better IDE support and type safety
 * across the Google Ads integration.
 */

/**
 * Match types for keywords
 */
export type KeywordMatchType = 'EXACT' | 'PHRASE' | 'BROAD';

/**
 * Campaign status values
 */
export type CampaignStatus = 'ENABLED' | 'PAUSED' | 'REMOVED';

/**
 * Advertising channel types
 */
export type AdvertisingChannelType =
  | 'SEARCH'
  | 'DISPLAY'
  | 'SHOPPING'
  | 'VIDEO'
  | 'MULTI_CHANNEL'
  | 'LOCAL'
  | 'SMART'
  | 'PERFORMANCE_MAX';

/**
 * Bidding strategy types
 */
export type BiddingStrategyType =
  | 'TARGET_CPA'
  | 'TARGET_ROAS'
  | 'MAXIMIZE_CONVERSIONS'
  | 'MAXIMIZE_CONVERSION_VALUE'
  | 'TARGET_SPEND'
  | 'MANUAL_CPC'
  | 'MANUAL_CPM'
  | 'MANUAL_CPV';

/**
 * Competition level for keywords
 */
export type KeywordCompetition = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNSPECIFIED';

/**
 * Budget delivery method
 */
export type BudgetDeliveryMethod = 'STANDARD' | 'ACCELERATED';

/**
 * Ad group criterion status
 */
export type AdGroupCriterionStatus = 'ENABLED' | 'PAUSED' | 'REMOVED';

/**
 * Currency amounts in micros (millionths)
 * Example: £10 = 10000000 micros
 */
export type Micros = string;

/**
 * Date in YYYY-MM-DD format
 */
export type DateString = string;

/**
 * Date in YYYYMMDD format (for campaign dates)
 */
export type CampaignDate = string;

/**
 * Resource name format: "customers/{customer_id}/campaigns/{campaign_id}"
 */
export type ResourceName = string;

/**
 * Base interface for Google Ads API errors
 */
export interface GoogleAdsError {
  error_code: {
    [key: string]: string | number;
  };
  message: string;
  location?: {
    field_path_elements?: Array<{
      field_name: string;
      index?: number;
    }>;
  };
  trigger?: {
    [key: string]: any;
  };
}

/**
 * API error response structure
 */
export interface GoogleAdsApiError extends Error {
  errors: GoogleAdsError[];
  request_id: string;
}

/**
 * Common location IDs for targeting
 */
export const LocationIds = {
  UNITED_KINGDOM: '2826',
  ENGLAND: '2840',
  LONDON: '1006886',
  KENT: '1010300', // Approximate
} as const;

/**
 * Common language IDs
 */
export const LanguageIds = {
  ENGLISH: '1000',
  ENGLISH_UK: '1003',
} as const;

/**
 * Helper to convert pounds to micros
 */
export function toMicros(pounds: number): Micros {
  return (pounds * 1_000_000).toString();
}

/**
 * Helper to convert micros to pounds
 */
export function fromMicros(micros: Micros | string | number): number {
  const microValue = typeof micros === 'string' ? parseInt(micros) : micros;
  return microValue / 1_000_000;
}

/**
 * Format currency from micros
 */
export function formatCurrency(micros: Micros | string | number, symbol = '£'): string {
  return `${symbol}${fromMicros(micros).toFixed(2)}`;
}

/**
 * Format date for Google Ads API (YYYYMMDD)
 */
export function formatCampaignDate(date: Date): CampaignDate {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Format date for reporting (YYYY-MM-DD)
 */
export function formatReportDate(date: Date): DateString {
  return date.toISOString().split('T')[0];
}

/**
 * Common GeoTargetConstants for UK regions
 */
export const GeoTargetConstants = {
  UK: 'geoTargetConstants/2826',
  ENGLAND: 'geoTargetConstants/2840',
  LONDON: 'geoTargetConstants/1006886',
  KENT: 'geoTargetConstants/1010300',
} as const;

/**
 * Common LanguageConstants
 */
export const LanguageConstants = {
  ENGLISH: 'languageConstants/1000',
  ENGLISH_UK: 'languageConstants/1003',
} as const;
