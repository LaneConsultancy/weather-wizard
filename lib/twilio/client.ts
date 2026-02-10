/**
 * Twilio API Client Setup
 *
 * Initialises and exports a configured Twilio REST API client
 * using credentials from environment variables.
 *
 * Usage:
 *   import { twilioClient } from '../lib/twilio/client';
 *   const calls = await twilioClient.calls.list({ ... });
 */

import Twilio from 'twilio';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env vars from parent directory (same pattern as lib/google-ads/client.ts)
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const requiredEnvVars = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(
      `Missing required environment variable: ${envVar}. ` +
      `Get this from Twilio Console > Account Info.`
    );
  }
}

/**
 * Singleton Twilio REST API client.
 * All Twilio operations in this project should use this export.
 */
export const twilioClient = Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

/** The Weather Wizard business phone number in E.164 format */
export const BUSINESS_PHONE_NUMBER = '+448003162922';
