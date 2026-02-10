/**
 * WhatConverts API Client
 *
 * WhatConverts uses Basic Authentication with an API Token and Secret.
 * API Docs: https://www.whatconverts.com/api
 * Base URL: https://app.whatconverts.com/api/v1/
 *
 * Rate limits: WhatConverts does not publish explicit rate limits,
 * but the API documentation recommends keeping requests under 60/minute.
 * For daily reconciliation of a small roofing company's calls, this is
 * not a concern (typically 1-3 API calls per run).
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const requiredEnvVars = [
  'WHATCONVERTS_API_TOKEN',
  'WHATCONVERTS_API_SECRET',
  'WHATCONVERTS_ACCOUNT_ID',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(
      `Missing required environment variable: ${envVar}. ` +
      `Get this from WhatConverts > Settings > API.`
    );
  }
}

const API_BASE = 'https://app.whatconverts.com/api/v1';
const API_TOKEN = process.env.WHATCONVERTS_API_TOKEN!;
const API_SECRET = process.env.WHATCONVERTS_API_SECRET!;
export const ACCOUNT_ID = process.env.WHATCONVERTS_ACCOUNT_ID!;

/**
 * Make an authenticated request to the WhatConverts API.
 *
 * @param endpoint - API endpoint path (e.g., "/leads")
 * @param params - URL query parameters
 * @returns Parsed JSON response
 * @throws Error if the response is not OK (non-2xx status)
 */
export async function whatConvertsRequest<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T> {
  const url = new URL(`${API_BASE}${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  // Basic auth: base64(token:secret)
  const authHeader = Buffer.from(`${API_TOKEN}:${API_SECRET}`).toString('base64');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Basic ${authHeader}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `WhatConverts API error: ${response.status} ${response.statusText}\n` +
      `Endpoint: ${endpoint}\n` +
      `Response: ${body}`
    );
  }

  return response.json() as Promise<T>;
}
