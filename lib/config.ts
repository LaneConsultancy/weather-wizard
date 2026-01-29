/**
 * Shared site configuration
 * 
 * Single source of truth for site-wide constants to prevent URL mismatches
 * and inconsistencies across the application.
 */

// Site URL - used for canonical URLs, structured data, and sitemaps
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://weatherwizard.co.uk';

// Site metadata
export const SITE_NAME = 'Weather Wizard';
export const SITE_DESCRIPTION = 'Expert Roofing & Guttering Services in Kent';

// Contact information
export const CONTACT_PHONE = '08003162922';
export const CONTACT_PHONE_DISPLAY = '0800 316 2922';

// Business information
export const BUSINESS_LOCATION = {
  locality: 'Maidstone',
  region: 'Kent',
  country: 'GB',
};

// Social/External URLs
export const EXTERNAL_URLS = {
  checkatrade: 'https://www.checkatrade.com/trades/weatherwizardroofing',
} as const;

/**
 * Helper to create absolute URLs
 * @param path - The path (e.g., '/about' or 'roofer-dartford')
 * @returns Full URL (e.g., 'https://weatherwizard.co.uk/about')
 */
export function createUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}
