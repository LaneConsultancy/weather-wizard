/**
 * Google Ads API Client Setup
 *
 * This module initializes and exports a configured Google Ads API client
 * using credentials from environment variables.
 */

import { GoogleAdsApi, Customer } from 'google-ads-api';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from the parent directory's .env file
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

// Validate required environment variables
const requiredEnvVars = [
  'GOOGLE_ADS_DEVELOPER_TOKEN',
  'GOOGLE_ADS_CLIENT_ID',
  'GOOGLE_ADS_CLIENT_SECRET',
  'GOOGLE_ADS_REFRESH_TOKEN',
  'GOOGLE_ADS_LOGIN_CUSTOMER_ID',
  'GOOGLE_ADS_CUSTOMER_ID',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

/**
 * Initialize the Google Ads API client with credentials from environment variables
 */
const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
});

/**
 * Get a Customer instance for the Weather Wizard account
 * This is the main interface for making API calls
 */
export function getCustomer(): Customer {
  return client.Customer({
    customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID!,
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
    login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
  });
}

/**
 * Get the base GoogleAdsApi client instance
 * Useful for accessing multiple customer accounts or performing account-level operations
 */
export function getClient(): GoogleAdsApi {
  return client;
}

/**
 * Get account IDs from environment
 */
export const accountConfig = {
  customerId: process.env.GOOGLE_ADS_CUSTOMER_ID!,
  loginCustomerId: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID!,
  refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
};

/**
 * Default customer instance for Weather Wizard account
 */
export const weatherWizardCustomer = getCustomer();
