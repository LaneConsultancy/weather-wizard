/**
 * Create Service-Specific Google Ads Campaigns for Weather Wizard
 *
 * This script creates THREE campaigns targeting non-roofing services:
 * 1. Search - Guttering - Kent (£20/day)
 * 2. Search - Bird Proofing - Kent (£20/day)
 * 3. Search - Exterior Painting - Kent (£20/day)
 *
 * Each campaign includes:
 * - Campaign budget and settings
 * - 6 ad groups (1 Kent-wide + 5 town-specific: Maidstone, Dartford, Gillingham, Chatham, Ashford)
 * - Keywords (phrase match) with cross-town negative keywords
 * - Responsive Search Ads (RSAs) with pinned headlines and descriptions
 *
 * All campaigns are created in PAUSED status for safety.
 *
 * Run with: npm run create-service-campaigns
 *
 * NOTE: After running this script, add these negative keywords to the existing
 * roofing campaigns (Search - Roofing - Top 5 Towns, Search - Roofing - Kent Wide)
 * to prevent cannibalism across campaigns:
 *   - guttering, gutter, bird proofing, pigeon proofing, exterior painting,
 *     house painting, exterior decorator, fascia painting, soffit painting
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { Customer, enums } from 'google-ads-api';
import { getCustomer } from '../lib/google-ads/client';
import { toMicros } from '../lib/google-ads/types';

// Load environment variables from project root
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Base website URL - production domain
const BASE_URL = 'https://www.weatherwizardroofing.co.uk';

// Campaign configuration types - identical to the existing campaign script
interface CampaignConfig {
  name: string;
  budgetAmountMicros: string;
  budgetName: string;
  adGroups: AdGroupConfig[];
  campaignNegativeKeywords?: string[];
}

interface AdGroupConfig {
  name: string;
  keywords: KeywordConfig[];
  negativeKeywords?: string[];
  ads: RSAConfig[];
}

interface KeywordConfig {
  text: string;
  matchType: 'EXACT' | 'PHRASE' | 'BROAD';
}

interface RSAConfig {
  headlines: HeadlineConfig[];
  descriptions: string[];
  finalUrl: string;
  path1?: string;
  path2?: string;
}

interface HeadlineConfig {
  text: string;
  pinPosition?: 1 | 2 | 3;
}

// ============================================================================
// CAMPAIGN 1: Search - Guttering - Kent
// ============================================================================

const gutteringCampaign: CampaignConfig = {
  name: 'Search - Guttering - Kent',
  budgetAmountMicros: toMicros(20), // £20/day
  budgetName: 'Guttering Kent Budget',
  // Prevent roofing and unrelated searches bleeding into this campaign
  campaignNegativeKeywords: ['roofing', 'roofer', 'roof', 'chimney', 'bird', 'pigeon', 'painting', 'painter', 'decorator'],
  adGroups: [
    // GUTTERING - KENT WIDE
    {
      name: 'Guttering Kent Wide',
      keywords: [
        { text: 'gutter repairs kent', matchType: 'PHRASE' },
        { text: 'gutter cleaning kent', matchType: 'PHRASE' },
        { text: 'guttering services kent', matchType: 'PHRASE' },
        { text: 'blocked gutters kent', matchType: 'PHRASE' },
        { text: 'gutter replacement kent', matchType: 'PHRASE' },
        { text: 'leaking gutters kent', matchType: 'PHRASE' },
        { text: 'gutter repair near me', matchType: 'PHRASE' },
        { text: 'guttering near me', matchType: 'PHRASE' },
      ],
      ads: [
        {
          headlines: [
            { text: 'Gutter Repairs Kent', pinPosition: 1 },
            { text: 'Expert Guttering Services', pinPosition: 1 },
            { text: 'Kent Gutter Specialists', pinPosition: 1 },
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
            'Expert gutter repairs & cleaning across Kent. Free inspection, no call-out fee. Call now!',
            'Blocked gutters cause damp walls. 25+ years experience, fully insured. Free quote today.',
            'Gutter repairs, cleaning & replacement. Fixed pricing, guaranteed work. Serving all Kent.',
            'Prevent water damage with professional guttering services. Same-day response available.',
          ],
          finalUrl: `${BASE_URL}/guttering`,
          path1: 'Guttering',
          path2: 'Kent',
        },
      ],
    },

    // GUTTERING - MAIDSTONE
    {
      name: 'Guttering Maidstone',
      keywords: [
        { text: 'gutter repairs maidstone', matchType: 'PHRASE' },
        { text: 'gutter cleaning maidstone', matchType: 'PHRASE' },
        { text: 'guttering maidstone', matchType: 'PHRASE' },
        { text: 'gutter repair maidstone', matchType: 'PHRASE' },
      ],
      negativeKeywords: ['dartford', 'gillingham', 'chatham', 'ashford'],
      ads: [
        {
          headlines: [
            { text: 'Gutter Repairs Maidstone', pinPosition: 1 },
            { text: 'Expert Guttering Maidstone', pinPosition: 1 },
            { text: 'Maidstone Gutter Specialists', pinPosition: 1 },
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
            'Expert gutter repairs & cleaning in Maidstone. Free inspection, no call-out fee. Call now!',
            'Blocked gutters cause damp walls. 25+ years experience, fully insured. Free quote today.',
            'Gutter repairs, cleaning & replacement. Fixed pricing, guaranteed work. Serving Maidstone.',
            'Prevent water damage with professional guttering services. Same-day response available.',
          ],
          finalUrl: `${BASE_URL}/maidstone/guttering`,
          path1: 'Maidstone',
          path2: 'Guttering',
        },
      ],
    },

    // GUTTERING - DARTFORD
    {
      name: 'Guttering Dartford',
      keywords: [
        { text: 'gutter repairs dartford', matchType: 'PHRASE' },
        { text: 'gutter cleaning dartford', matchType: 'PHRASE' },
        { text: 'guttering dartford', matchType: 'PHRASE' },
        { text: 'gutter repair dartford', matchType: 'PHRASE' },
      ],
      negativeKeywords: ['maidstone', 'gillingham', 'chatham', 'ashford'],
      ads: [
        {
          headlines: [
            { text: 'Gutter Repairs Dartford', pinPosition: 1 },
            { text: 'Expert Guttering Dartford', pinPosition: 1 },
            { text: 'Dartford Gutter Specialists', pinPosition: 1 },
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
            'Expert gutter repairs & cleaning in Dartford. Free inspection, no call-out fee. Call now!',
            'Blocked gutters cause damp walls. 25+ years experience, fully insured. Free quote today.',
            'Gutter repairs, cleaning & replacement. Fixed pricing, guaranteed work. Serving Dartford.',
            'Prevent water damage with professional guttering services. Same-day response available.',
          ],
          finalUrl: `${BASE_URL}/dartford/guttering`,
          path1: 'Dartford',
          path2: 'Guttering',
        },
      ],
    },

    // GUTTERING - GILLINGHAM
    {
      name: 'Guttering Gillingham',
      keywords: [
        { text: 'gutter repairs gillingham', matchType: 'PHRASE' },
        { text: 'gutter cleaning gillingham', matchType: 'PHRASE' },
        { text: 'guttering gillingham', matchType: 'PHRASE' },
      ],
      negativeKeywords: ['maidstone', 'dartford', 'chatham', 'ashford'],
      ads: [
        {
          headlines: [
            { text: 'Gutter Repairs Gillingham', pinPosition: 1 },
            { text: 'Expert Guttering Gillingham', pinPosition: 1 },
            { text: 'Gillingham Gutter Specialists', pinPosition: 1 },
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
            'Expert gutter repairs & cleaning in Gillingham. Free inspection, no call-out fee. Call!',
            'Blocked gutters cause damp walls. 25+ years experience, fully insured. Free quote today.',
            'Gutter repairs, cleaning & replacement. Fixed pricing, guaranteed work. Serving Gillingham.',
            'Prevent water damage with professional guttering services. Same-day response available.',
          ],
          finalUrl: `${BASE_URL}/gillingham/guttering`,
          path1: 'Gillingham',
          path2: 'Guttering',
        },
      ],
    },

    // GUTTERING - CHATHAM
    {
      name: 'Guttering Chatham',
      keywords: [
        { text: 'gutter repairs chatham', matchType: 'PHRASE' },
        { text: 'gutter cleaning chatham', matchType: 'PHRASE' },
        { text: 'guttering chatham', matchType: 'PHRASE' },
      ],
      negativeKeywords: ['maidstone', 'dartford', 'gillingham', 'ashford'],
      ads: [
        {
          headlines: [
            { text: 'Gutter Repairs Chatham', pinPosition: 1 },
            { text: 'Expert Guttering Chatham', pinPosition: 1 },
            { text: 'Chatham Gutter Specialists', pinPosition: 1 },
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
            'Expert gutter repairs & cleaning in Chatham. Free inspection, no call-out fee. Call now!',
            'Blocked gutters cause damp walls. 25+ years experience, fully insured. Free quote today.',
            'Gutter repairs, cleaning & replacement. Fixed pricing, guaranteed work. Serving Chatham.',
            'Prevent water damage with professional guttering services. Same-day response available.',
          ],
          finalUrl: `${BASE_URL}/chatham/guttering`,
          path1: 'Chatham',
          path2: 'Guttering',
        },
      ],
    },

    // GUTTERING - ASHFORD
    {
      name: 'Guttering Ashford',
      keywords: [
        { text: 'gutter repairs ashford', matchType: 'PHRASE' },
        { text: 'gutter cleaning ashford', matchType: 'PHRASE' },
        { text: 'guttering ashford', matchType: 'PHRASE' },
      ],
      negativeKeywords: ['maidstone', 'dartford', 'gillingham', 'chatham'],
      ads: [
        {
          headlines: [
            { text: 'Gutter Repairs Ashford', pinPosition: 1 },
            { text: 'Expert Guttering Ashford', pinPosition: 1 },
            { text: 'Ashford Gutter Specialists', pinPosition: 1 },
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
            'Expert gutter repairs & cleaning in Ashford. Free inspection, no call-out fee. Call now!',
            'Blocked gutters cause damp walls. 25+ years experience, fully insured. Free quote today.',
            'Gutter repairs, cleaning & replacement. Fixed pricing, guaranteed work. Serving Ashford.',
            'Prevent water damage with professional guttering services. Same-day response available.',
          ],
          finalUrl: `${BASE_URL}/ashford/guttering`,
          path1: 'Ashford',
          path2: 'Guttering',
        },
      ],
    },
  ],
};

// ============================================================================
// CAMPAIGN 2: Search - Bird Proofing - Kent
// ============================================================================

const birdProofingCampaign: CampaignConfig = {
  name: 'Search - Bird Proofing - Kent',
  budgetAmountMicros: toMicros(20), // £20/day
  budgetName: 'Bird Proofing Kent Budget',
  // Exclude roofing and other service searches to avoid cannibalism
  campaignNegativeKeywords: ['roofing', 'roofer', 'roof repair', 'gutter', 'guttering', 'painting', 'painter', 'decorator'],
  adGroups: [
    // BIRD PROOFING - KENT WIDE
    {
      name: 'Bird Proofing Kent Wide',
      keywords: [
        { text: 'bird proofing kent', matchType: 'PHRASE' },
        { text: 'pigeon proofing kent', matchType: 'PHRASE' },
        { text: 'solar panel bird proofing', matchType: 'PHRASE' },
        { text: 'pigeon netting kent', matchType: 'PHRASE' },
        { text: 'bird netting kent', matchType: 'PHRASE' },
        { text: 'pigeon control kent', matchType: 'PHRASE' },
        { text: 'bird mesh solar panels', matchType: 'PHRASE' },
        { text: 'pigeon deterrent kent', matchType: 'PHRASE' },
        { text: 'solar panel pigeon guard', matchType: 'PHRASE' },
        { text: 'bird proofing near me', matchType: 'PHRASE' },
      ],
      ads: [
        {
          headlines: [
            { text: 'Bird Proofing Kent', pinPosition: 1 },
            { text: 'Pigeon Control Specialists', pinPosition: 1 },
            { text: 'Solar Panel Bird Proofing', pinPosition: 1 },
            { text: 'Stop Pigeons Nesting' },
            { text: 'Humane Bird Deterrents' },
            { text: 'Solar Panel Mesh & Guards' },
            { text: 'Pigeon Netting Installed' },
            { text: 'Free Bird Proofing Survey' },
            { text: '25+ Years Experience' },
            { text: 'Fully Insured & Guaranteed' },
            { text: 'No Call-Out Charge' },
            { text: 'Professional Bird Control' },
            { text: 'Protect Your Solar Panels' },
            { text: 'Get Your Free Quote' },
            { text: 'Same Day Appointments' },
          ],
          descriptions: [
            'Professional bird & pigeon proofing across Kent. Solar panel mesh, netting & spikes. Call now!',
            'Stop pigeons nesting under solar panels. Humane solutions, fully insured. Free survey.',
            'Expert bird proofing for homes & businesses. 25+ years experience. Free no-obligation quote.',
            'Protect your property from bird damage. Professional deterrents installed. Kent-wide service.',
          ],
          finalUrl: `${BASE_URL}/bird-proofing`,
          path1: 'Bird-Proofing',
          path2: 'Kent',
        },
      ],
    },

    // BIRD PROOFING - MAIDSTONE
    {
      name: 'Bird Proofing Maidstone',
      keywords: [
        { text: 'bird proofing maidstone', matchType: 'PHRASE' },
        { text: 'pigeon proofing maidstone', matchType: 'PHRASE' },
        { text: 'solar panel bird proofing maidstone', matchType: 'PHRASE' },
        { text: 'pigeon control maidstone', matchType: 'PHRASE' },
      ],
      negativeKeywords: ['dartford', 'gillingham', 'chatham', 'ashford'],
      ads: [
        {
          headlines: [
            { text: 'Bird Proofing Maidstone', pinPosition: 1 },
            { text: 'Pigeon Control Maidstone', pinPosition: 1 },
            { text: 'Solar Panel Bird Proofing', pinPosition: 1 },
            { text: 'Stop Pigeons Nesting' },
            { text: 'Humane Bird Deterrents' },
            { text: 'Solar Panel Mesh & Guards' },
            { text: 'Pigeon Netting Installed' },
            { text: 'Free Bird Proofing Survey' },
            { text: '25+ Years Experience' },
            { text: 'Fully Insured & Guaranteed' },
            { text: 'No Call-Out Charge' },
            { text: 'Professional Bird Control' },
            { text: 'Protect Your Solar Panels' },
            { text: 'Get Your Free Quote' },
            { text: 'Same Day Appointments' },
          ],
          descriptions: [
            'Professional bird & pigeon proofing in Maidstone. Solar panel mesh, netting & spikes. Call!',
            'Stop pigeons nesting under solar panels. Humane solutions, fully insured. Free survey.',
            'Expert bird proofing for homes & businesses. 25+ years experience. Free no-obligation quote.',
            'Protect your property from bird damage. Professional deterrents installed. Maidstone.',
          ],
          finalUrl: `${BASE_URL}/maidstone/bird-proofing`,
          path1: 'Maidstone',
          path2: 'Bird-Proofing',
        },
      ],
    },

    // BIRD PROOFING - DARTFORD
    {
      name: 'Bird Proofing Dartford',
      keywords: [
        { text: 'bird proofing dartford', matchType: 'PHRASE' },
        { text: 'pigeon proofing dartford', matchType: 'PHRASE' },
        { text: 'solar panel bird proofing dartford', matchType: 'PHRASE' },
      ],
      negativeKeywords: ['maidstone', 'gillingham', 'chatham', 'ashford'],
      ads: [
        {
          headlines: [
            { text: 'Bird Proofing Dartford', pinPosition: 1 },
            { text: 'Pigeon Control Dartford', pinPosition: 1 },
            { text: 'Solar Panel Bird Proofing', pinPosition: 1 },
            { text: 'Stop Pigeons Nesting' },
            { text: 'Humane Bird Deterrents' },
            { text: 'Solar Panel Mesh & Guards' },
            { text: 'Pigeon Netting Installed' },
            { text: 'Free Bird Proofing Survey' },
            { text: '25+ Years Experience' },
            { text: 'Fully Insured & Guaranteed' },
            { text: 'No Call-Out Charge' },
            { text: 'Professional Bird Control' },
            { text: 'Protect Your Solar Panels' },
            { text: 'Get Your Free Quote' },
            { text: 'Same Day Appointments' },
          ],
          descriptions: [
            'Professional bird & pigeon proofing in Dartford. Solar panel mesh, netting & spikes. Call!',
            'Stop pigeons nesting under solar panels. Humane solutions, fully insured. Free survey.',
            'Expert bird proofing for homes & businesses. 25+ years experience. Free no-obligation quote.',
            'Protect your property from bird damage. Professional deterrents installed. Dartford.',
          ],
          finalUrl: `${BASE_URL}/dartford/bird-proofing`,
          path1: 'Dartford',
          path2: 'Bird-Proofing',
        },
      ],
    },

    // BIRD PROOFING - GILLINGHAM
    {
      name: 'Bird Proofing Gillingham',
      keywords: [
        { text: 'bird proofing gillingham', matchType: 'PHRASE' },
        { text: 'pigeon proofing gillingham', matchType: 'PHRASE' },
      ],
      negativeKeywords: ['maidstone', 'dartford', 'chatham', 'ashford'],
      ads: [
        {
          headlines: [
            { text: 'Bird Proofing Gillingham', pinPosition: 1 },
            { text: 'Pigeon Control Gillingham', pinPosition: 1 },
            { text: 'Solar Panel Bird Proofing', pinPosition: 1 },
            { text: 'Stop Pigeons Nesting' },
            { text: 'Humane Bird Deterrents' },
            { text: 'Solar Panel Mesh & Guards' },
            { text: 'Pigeon Netting Installed' },
            { text: 'Free Bird Proofing Survey' },
            { text: '25+ Years Experience' },
            { text: 'Fully Insured & Guaranteed' },
            { text: 'No Call-Out Charge' },
            { text: 'Professional Bird Control' },
            { text: 'Protect Your Solar Panels' },
            { text: 'Get Your Free Quote' },
            { text: 'Same Day Appointments' },
          ],
          descriptions: [
            'Professional bird & pigeon proofing in Gillingham. Solar panel mesh, netting & spikes. Call!',
            'Stop pigeons nesting under solar panels. Humane solutions, fully insured. Free survey.',
            'Expert bird proofing for homes & businesses. 25+ years experience. Free no-obligation quote.',
            'Protect your property from bird damage. Professional deterrents installed. Gillingham.',
          ],
          finalUrl: `${BASE_URL}/gillingham/bird-proofing`,
          path1: 'Gillingham',
          path2: 'Bird-Proofing',
        },
      ],
    },

    // BIRD PROOFING - CHATHAM
    {
      name: 'Bird Proofing Chatham',
      keywords: [
        { text: 'bird proofing chatham', matchType: 'PHRASE' },
        { text: 'pigeon proofing chatham', matchType: 'PHRASE' },
      ],
      negativeKeywords: ['maidstone', 'dartford', 'gillingham', 'ashford'],
      ads: [
        {
          headlines: [
            { text: 'Bird Proofing Chatham', pinPosition: 1 },
            { text: 'Pigeon Control Chatham', pinPosition: 1 },
            { text: 'Solar Panel Bird Proofing', pinPosition: 1 },
            { text: 'Stop Pigeons Nesting' },
            { text: 'Humane Bird Deterrents' },
            { text: 'Solar Panel Mesh & Guards' },
            { text: 'Pigeon Netting Installed' },
            { text: 'Free Bird Proofing Survey' },
            { text: '25+ Years Experience' },
            { text: 'Fully Insured & Guaranteed' },
            { text: 'No Call-Out Charge' },
            { text: 'Professional Bird Control' },
            { text: 'Protect Your Solar Panels' },
            { text: 'Get Your Free Quote' },
            { text: 'Same Day Appointments' },
          ],
          descriptions: [
            'Professional bird & pigeon proofing in Chatham. Solar panel mesh, netting & spikes. Call!',
            'Stop pigeons nesting under solar panels. Humane solutions, fully insured. Free survey.',
            'Expert bird proofing for homes & businesses. 25+ years experience. Free no-obligation quote.',
            'Protect your property from bird damage. Professional deterrents installed. Chatham.',
          ],
          finalUrl: `${BASE_URL}/chatham/bird-proofing`,
          path1: 'Chatham',
          path2: 'Bird-Proofing',
        },
      ],
    },

    // BIRD PROOFING - ASHFORD
    {
      name: 'Bird Proofing Ashford',
      keywords: [
        { text: 'bird proofing ashford', matchType: 'PHRASE' },
        { text: 'pigeon proofing ashford', matchType: 'PHRASE' },
      ],
      negativeKeywords: ['maidstone', 'dartford', 'gillingham', 'chatham'],
      ads: [
        {
          headlines: [
            { text: 'Bird Proofing Ashford', pinPosition: 1 },
            { text: 'Pigeon Control Ashford', pinPosition: 1 },
            { text: 'Solar Panel Bird Proofing', pinPosition: 1 },
            { text: 'Stop Pigeons Nesting' },
            { text: 'Humane Bird Deterrents' },
            { text: 'Solar Panel Mesh & Guards' },
            { text: 'Pigeon Netting Installed' },
            { text: 'Free Bird Proofing Survey' },
            { text: '25+ Years Experience' },
            { text: 'Fully Insured & Guaranteed' },
            { text: 'No Call-Out Charge' },
            { text: 'Professional Bird Control' },
            { text: 'Protect Your Solar Panels' },
            { text: 'Get Your Free Quote' },
            { text: 'Same Day Appointments' },
          ],
          descriptions: [
            'Professional bird & pigeon proofing in Ashford. Solar panel mesh, netting & spikes. Call!',
            'Stop pigeons nesting under solar panels. Humane solutions, fully insured. Free survey.',
            'Expert bird proofing for homes & businesses. 25+ years experience. Free no-obligation quote.',
            'Protect your property from bird damage. Professional deterrents installed. Ashford.',
          ],
          finalUrl: `${BASE_URL}/ashford/bird-proofing`,
          path1: 'Ashford',
          path2: 'Bird-Proofing',
        },
      ],
    },
  ],
};

// ============================================================================
// CAMPAIGN 3: Search - Exterior Painting - Kent
// ============================================================================

const exteriorPaintingCampaign: CampaignConfig = {
  name: 'Search - Exterior Painting - Kent',
  budgetAmountMicros: toMicros(20), // £20/day
  budgetName: 'Exterior Painting Kent Budget',
  // Exclude roofing, guttering, and bird proofing searches
  campaignNegativeKeywords: ['roofing', 'roofer', 'roof', 'gutter', 'guttering', 'bird', 'pigeon', 'interior'],
  adGroups: [
    // EXTERIOR PAINTING - KENT WIDE
    {
      name: 'Exterior Painting Kent Wide',
      keywords: [
        { text: 'exterior painting kent', matchType: 'PHRASE' },
        { text: 'house painting kent', matchType: 'PHRASE' },
        { text: 'outside painting kent', matchType: 'PHRASE' },
        { text: 'exterior decorator kent', matchType: 'PHRASE' },
        { text: 'external painting kent', matchType: 'PHRASE' },
        { text: 'fascia painting kent', matchType: 'PHRASE' },
        { text: 'soffit painting kent', matchType: 'PHRASE' },
        { text: 'exterior painter near me', matchType: 'PHRASE' },
        { text: 'house painter near me', matchType: 'PHRASE' },
      ],
      ads: [
        {
          headlines: [
            { text: 'Exterior Painting Kent', pinPosition: 1 },
            { text: 'Professional House Painters', pinPosition: 1 },
            { text: 'Kent Exterior Decorators', pinPosition: 1 },
            { text: 'Fascia & Soffit Painting' },
            { text: 'Weather-Proof Your Home' },
            { text: 'Expert Exterior Painting' },
            { text: 'Free Painting Estimate' },
            { text: '25+ Years Experience' },
            { text: 'No Scaffolding Charge' },
            { text: 'Fully Insured & Guaranteed' },
            { text: 'Quality Paint & Prep Work' },
            { text: 'Rated 4.9/5 by Customers' },
            { text: 'Transform Your Home' },
            { text: 'Get Your Free Quote' },
            { text: 'Family-Owned Business' },
          ],
          descriptions: [
            'Professional exterior painting across Kent. Fascias, soffits & walls. Free estimate. Call now!',
            'Protect your home from the elements. 25+ years experience, fully insured. Free quote today.',
            'Expert exterior decorating. Proper prep work, quality paints, guaranteed finish. Kent-wide.',
            'Fascia, soffit & exterior painting specialists. Fixed pricing, no hidden costs. Call today.',
          ],
          finalUrl: `${BASE_URL}/exterior-painting`,
          path1: 'Exterior-Painting',
          path2: 'Kent',
        },
      ],
    },

    // EXTERIOR PAINTING - MAIDSTONE
    {
      name: 'Exterior Painting Maidstone',
      keywords: [
        { text: 'exterior painting maidstone', matchType: 'PHRASE' },
        { text: 'house painting maidstone', matchType: 'PHRASE' },
        { text: 'exterior decorator maidstone', matchType: 'PHRASE' },
        { text: 'painter maidstone', matchType: 'PHRASE' },
      ],
      negativeKeywords: ['dartford', 'gillingham', 'chatham', 'ashford'],
      ads: [
        {
          headlines: [
            { text: 'Exterior Painting Maidstone', pinPosition: 1 },
            { text: 'House Painters Maidstone', pinPosition: 1 },
            { text: 'Maidstone Exterior Decorators', pinPosition: 1 },
            { text: 'Fascia & Soffit Painting' },
            { text: 'Weather-Proof Your Home' },
            { text: 'Expert Exterior Painting' },
            { text: 'Free Painting Estimate' },
            { text: '25+ Years Experience' },
            { text: 'No Scaffolding Charge' },
            { text: 'Fully Insured & Guaranteed' },
            { text: 'Quality Paint & Prep Work' },
            { text: 'Rated 4.9/5 by Customers' },
            { text: 'Transform Your Home' },
            { text: 'Get Your Free Quote' },
            { text: 'Family-Owned Business' },
          ],
          descriptions: [
            'Professional exterior painting in Maidstone. Fascias, soffits & walls. Free estimate. Call!',
            'Protect your home from the elements. 25+ years experience, fully insured. Free quote today.',
            'Expert exterior decorating in Maidstone. Proper prep work, quality paints, guaranteed finish.',
            'Fascia, soffit & exterior painting specialists. Fixed pricing, no hidden costs. Call today.',
          ],
          finalUrl: `${BASE_URL}/maidstone/exterior-painting`,
          path1: 'Maidstone',
          path2: 'Ext-Painting',
        },
      ],
    },

    // EXTERIOR PAINTING - DARTFORD
    {
      name: 'Exterior Painting Dartford',
      keywords: [
        { text: 'exterior painting dartford', matchType: 'PHRASE' },
        { text: 'house painting dartford', matchType: 'PHRASE' },
        { text: 'exterior decorator dartford', matchType: 'PHRASE' },
      ],
      negativeKeywords: ['maidstone', 'gillingham', 'chatham', 'ashford'],
      ads: [
        {
          headlines: [
            { text: 'Exterior Painting Dartford', pinPosition: 1 },
            { text: 'House Painters Dartford', pinPosition: 1 },
            { text: 'Dartford Exterior Decorators', pinPosition: 1 },
            { text: 'Fascia & Soffit Painting' },
            { text: 'Weather-Proof Your Home' },
            { text: 'Expert Exterior Painting' },
            { text: 'Free Painting Estimate' },
            { text: '25+ Years Experience' },
            { text: 'No Scaffolding Charge' },
            { text: 'Fully Insured & Guaranteed' },
            { text: 'Quality Paint & Prep Work' },
            { text: 'Rated 4.9/5 by Customers' },
            { text: 'Transform Your Home' },
            { text: 'Get Your Free Quote' },
            { text: 'Family-Owned Business' },
          ],
          descriptions: [
            'Professional exterior painting in Dartford. Fascias, soffits & walls. Free estimate. Call!',
            'Protect your home from the elements. 25+ years experience, fully insured. Free quote today.',
            'Expert exterior decorating in Dartford. Proper prep work, quality paints, guaranteed finish.',
            'Fascia, soffit & exterior painting specialists. Fixed pricing, no hidden costs. Call today.',
          ],
          finalUrl: `${BASE_URL}/dartford/exterior-painting`,
          path1: 'Dartford',
          path2: 'Ext-Painting',
        },
      ],
    },

    // EXTERIOR PAINTING - GILLINGHAM
    {
      name: 'Exterior Painting Gillingham',
      keywords: [
        { text: 'exterior painting gillingham', matchType: 'PHRASE' },
        { text: 'house painting gillingham', matchType: 'PHRASE' },
      ],
      negativeKeywords: ['maidstone', 'dartford', 'chatham', 'ashford'],
      ads: [
        {
          headlines: [
            { text: 'Exterior Painting Gillingham', pinPosition: 1 },
            { text: 'House Painters Gillingham', pinPosition: 1 },
            { text: 'Gillingham Ext. Decorators', pinPosition: 1 },
            { text: 'Fascia & Soffit Painting' },
            { text: 'Weather-Proof Your Home' },
            { text: 'Expert Exterior Painting' },
            { text: 'Free Painting Estimate' },
            { text: '25+ Years Experience' },
            { text: 'No Scaffolding Charge' },
            { text: 'Fully Insured & Guaranteed' },
            { text: 'Quality Paint & Prep Work' },
            { text: 'Rated 4.9/5 by Customers' },
            { text: 'Transform Your Home' },
            { text: 'Get Your Free Quote' },
            { text: 'Family-Owned Business' },
          ],
          descriptions: [
            'Professional exterior painting in Gillingham. Fascias, soffits & walls. Free estimate. Call!',
            'Protect your home from the elements. 25+ years experience, fully insured. Free quote today.',
            'Expert exterior decorating in Gillingham. Proper prep work, quality paints, guaranteed finish.',
            'Fascia, soffit & exterior painting specialists. Fixed pricing, no hidden costs. Call today.',
          ],
          finalUrl: `${BASE_URL}/gillingham/exterior-painting`,
          path1: 'Gillingham',
          path2: 'Ext-Painting',
        },
      ],
    },

    // EXTERIOR PAINTING - CHATHAM
    {
      name: 'Exterior Painting Chatham',
      keywords: [
        { text: 'exterior painting chatham', matchType: 'PHRASE' },
        { text: 'house painting chatham', matchType: 'PHRASE' },
      ],
      negativeKeywords: ['maidstone', 'dartford', 'gillingham', 'ashford'],
      ads: [
        {
          headlines: [
            { text: 'Exterior Painting Chatham', pinPosition: 1 },
            { text: 'House Painters Chatham', pinPosition: 1 },
            { text: 'Chatham Exterior Decorators', pinPosition: 1 },
            { text: 'Fascia & Soffit Painting' },
            { text: 'Weather-Proof Your Home' },
            { text: 'Expert Exterior Painting' },
            { text: 'Free Painting Estimate' },
            { text: '25+ Years Experience' },
            { text: 'No Scaffolding Charge' },
            { text: 'Fully Insured & Guaranteed' },
            { text: 'Quality Paint & Prep Work' },
            { text: 'Rated 4.9/5 by Customers' },
            { text: 'Transform Your Home' },
            { text: 'Get Your Free Quote' },
            { text: 'Family-Owned Business' },
          ],
          descriptions: [
            'Professional exterior painting in Chatham. Fascias, soffits & walls. Free estimate. Call!',
            'Protect your home from the elements. 25+ years experience, fully insured. Free quote today.',
            'Expert exterior decorating in Chatham. Proper prep work, quality paints, guaranteed finish.',
            'Fascia, soffit & exterior painting specialists. Fixed pricing, no hidden costs. Call today.',
          ],
          finalUrl: `${BASE_URL}/chatham/exterior-painting`,
          path1: 'Chatham',
          path2: 'Ext-Painting',
        },
      ],
    },

    // EXTERIOR PAINTING - ASHFORD
    {
      name: 'Exterior Painting Ashford',
      keywords: [
        { text: 'exterior painting ashford', matchType: 'PHRASE' },
        { text: 'house painting ashford', matchType: 'PHRASE' },
      ],
      negativeKeywords: ['maidstone', 'dartford', 'gillingham', 'chatham'],
      ads: [
        {
          headlines: [
            { text: 'Exterior Painting Ashford', pinPosition: 1 },
            { text: 'House Painters Ashford', pinPosition: 1 },
            { text: 'Ashford Exterior Decorators', pinPosition: 1 },
            { text: 'Fascia & Soffit Painting' },
            { text: 'Weather-Proof Your Home' },
            { text: 'Expert Exterior Painting' },
            { text: 'Free Painting Estimate' },
            { text: '25+ Years Experience' },
            { text: 'No Scaffolding Charge' },
            { text: 'Fully Insured & Guaranteed' },
            { text: 'Quality Paint & Prep Work' },
            { text: 'Rated 4.9/5 by Customers' },
            { text: 'Transform Your Home' },
            { text: 'Get Your Free Quote' },
            { text: 'Family-Owned Business' },
          ],
          descriptions: [
            'Professional exterior painting in Ashford. Fascias, soffits & walls. Free estimate. Call!',
            'Protect your home from the elements. 25+ years experience, fully insured. Free quote today.',
            'Expert exterior decorating in Ashford. Proper prep work, quality paints, guaranteed finish.',
            'Fascia, soffit & exterior painting specialists. Fixed pricing, no hidden costs. Call today.',
          ],
          finalUrl: `${BASE_URL}/ashford/exterior-painting`,
          path1: 'Ashford',
          path2: 'Ext-Painting',
        },
      ],
    },
  ],
};

// ============================================================================
// HELPER FUNCTIONS
// (Identical pattern to create-weather-wizard-campaigns.ts)
// ============================================================================

/**
 * Check if a campaign already exists by name to make this script safely re-runnable
 */
async function campaignExists(customer: Customer, campaignName: string): Promise<boolean> {
  const query = `
    SELECT campaign.id, campaign.name
    FROM campaign
    WHERE campaign.name = "${campaignName}"
      AND campaign.status != 'REMOVED'
  `;

  try {
    const results = await customer.query(query);
    return results.length > 0;
  } catch (error) {
    console.error(`Error checking if campaign exists: ${error}`);
    return false;
  }
}

/**
 * Create a campaign budget using mutateResources
 */
async function createBudget(
  customer: Customer,
  name: string,
  amountMicros: string
): Promise<string> {
  const response = await customer.mutateResources([
    {
      entity: 'campaign_budget',
      operation: 'create',
      resource: {
        name,
        amount_micros: parseInt(amountMicros, 10),
        delivery_method: enums.BudgetDeliveryMethod.STANDARD,
      },
    },
  ]);

  const budgetResult = (response as any).mutate_operation_responses?.[0]?.campaign_budget_result;
  const budgetResourceName = budgetResult?.resource_name;

  if (!budgetResourceName) {
    throw new Error('Failed to create budget - no resource name returned');
  }

  const budgetId = budgetResourceName.split('/').pop()!;
  console.log(`   Budget created: ${name} (ID: ${budgetId})`);
  return budgetResourceName;
}

/**
 * Create a search campaign in PAUSED status using mutateResources
 */
async function createCampaign(
  customer: Customer,
  name: string,
  budgetResourceName: string
): Promise<string> {
  const response = await customer.mutateResources([
    {
      entity: 'campaign',
      operation: 'create',
      resource: {
        name,
        status: enums.CampaignStatus.PAUSED,
        advertising_channel_type: enums.AdvertisingChannelType.SEARCH,
        campaign_budget: budgetResourceName,
        manual_cpc: {
          enhanced_cpc_enabled: false,
        },
        network_settings: {
          target_google_search: true,
          target_search_network: false,
          target_content_network: false,
          target_partner_search_network: false,
        },
        // EU Political Advertising declaration (required for EU advertisers)
        // 2 = DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING
        contains_eu_political_advertising: 2,
      },
    },
  ]);

  const campaignResult = (response as any).mutate_operation_responses?.[0]?.campaign_result;
  const campaignResourceName = campaignResult?.resource_name;

  if (!campaignResourceName) {
    throw new Error('Failed to create campaign - no resource name returned');
  }

  const campaignId = campaignResourceName.split('/').pop()!;
  console.log(`   Campaign created: ${name} (ID: ${campaignId})`);
  return campaignResourceName;
}

/**
 * Add Kent geo targeting to a campaign
 */
async function addGeoTargeting(customer: Customer, campaignResourceName: string): Promise<void> {
  // Kent geo target constant ID
  const kentGeoTargetId = '1010300';

  await customer.mutateResources([
    {
      entity: 'campaign_criterion',
      operation: 'create',
      resource: {
        campaign: campaignResourceName,
        location: {
          geo_target_constant: `geoTargetConstants/${kentGeoTargetId}`,
        },
      },
    },
  ]);
  console.log(`   Geo targeting added: Kent, UK`);
}

/**
 * Add campaign-level negative keywords (phrase match)
 */
async function addCampaignNegativeKeywords(
  customer: Customer,
  campaignResourceName: string,
  negativeKeywords: string[]
): Promise<void> {
  if (negativeKeywords.length === 0) return;

  const operations = negativeKeywords.map((keyword) => ({
    entity: 'campaign_criterion' as const,
    operation: 'create' as const,
    resource: {
      campaign: campaignResourceName,
      keyword: {
        text: keyword,
        match_type: enums.KeywordMatchType.PHRASE,
      },
      negative: true,
    },
  }));

  await customer.mutateResources(operations);
  console.log(`   Added ${negativeKeywords.length} campaign negative keywords`);
}

/**
 * Create an ad group using mutateResources
 */
async function createAdGroup(
  customer: Customer,
  campaignResourceName: string,
  name: string
): Promise<string> {
  const response = await customer.mutateResources([
    {
      entity: 'ad_group',
      operation: 'create',
      resource: {
        name,
        campaign: campaignResourceName,
        status: enums.AdGroupStatus.ENABLED,
        type: enums.AdGroupType.SEARCH_STANDARD,
        cpc_bid_micros: 5000000, // £5.00 default CPC bid
      },
    },
  ]);

  const adGroupResult = (response as any).mutate_operation_responses?.[0]?.ad_group_result;
  const adGroupResourceName = adGroupResult?.resource_name;

  if (!adGroupResourceName) {
    throw new Error('Failed to create ad group - no resource name returned');
  }

  const adGroupId = adGroupResourceName.split('/').pop()!;
  console.log(`      Ad group created: ${name} (ID: ${adGroupId})`);
  return adGroupResourceName;
}

/**
 * Add keywords to an ad group using mutateResources
 */
async function addKeywords(
  customer: Customer,
  adGroupResourceName: string,
  keywords: KeywordConfig[]
): Promise<void> {
  const operations = keywords.map((keyword) => ({
    entity: 'ad_group_criterion' as const,
    operation: 'create' as const,
    resource: {
      ad_group: adGroupResourceName,
      keyword: {
        text: keyword.text,
        match_type: enums.KeywordMatchType[keyword.matchType],
      },
      status: enums.AdGroupCriterionStatus.ENABLED,
    },
  }));

  await customer.mutateResources(operations);
  console.log(`         Added ${keywords.length} keywords`);
}

/**
 * Add negative keywords (phrase match) to an ad group using mutateResources
 */
async function addNegativeKeywords(
  customer: Customer,
  adGroupResourceName: string,
  negativeKeywords: string[]
): Promise<void> {
  if (negativeKeywords.length === 0) return;

  const operations = negativeKeywords.map((keyword) => ({
    entity: 'ad_group_criterion' as const,
    operation: 'create' as const,
    resource: {
      ad_group: adGroupResourceName,
      keyword: {
        text: keyword,
        match_type: enums.KeywordMatchType.PHRASE,
      },
      status: enums.AdGroupCriterionStatus.ENABLED,
      negative: true,
    },
  }));

  await customer.mutateResources(operations);
  console.log(`         Added ${negativeKeywords.length} negative keywords`);
}

/**
 * Create a Responsive Search Ad (RSA) using mutateResources.
 * Headlines with pinPosition are pinned to that slot; others rotate freely.
 */
async function createRSA(
  customer: Customer,
  adGroupResourceName: string,
  rsaConfig: RSAConfig
): Promise<void> {
  const headlines = rsaConfig.headlines.map((h) => ({
    text: h.text,
    pinned_field: h.pinPosition
      ? h.pinPosition === 1
        ? enums.ServedAssetFieldType.HEADLINE_1
        : h.pinPosition === 2
        ? enums.ServedAssetFieldType.HEADLINE_2
        : enums.ServedAssetFieldType.HEADLINE_3
      : undefined,
  }));

  const descriptions = rsaConfig.descriptions.map((text) => ({ text }));

  await customer.mutateResources([
    {
      entity: 'ad_group_ad',
      operation: 'create',
      resource: {
        ad_group: adGroupResourceName,
        status: enums.AdGroupAdStatus.ENABLED,
        ad: {
          final_urls: [rsaConfig.finalUrl],
          responsive_search_ad: {
            headlines,
            descriptions,
            path1: rsaConfig.path1,
            path2: rsaConfig.path2,
          },
        },
      },
    },
  ]);
  console.log(`         Created RSA with ${headlines.length} headlines, ${descriptions.length} descriptions`);
}

/**
 * Orchestrates the full creation of a single campaign: budget, campaign entity,
 * geo targeting, campaign-level negatives, and all ad groups with their
 * keywords, ad-group negatives, and RSAs.
 */
async function createCompleteCampaign(
  customer: Customer,
  config: CampaignConfig
): Promise<void> {
  console.log(`\nCreating Campaign: ${config.name}`);
  console.log('='.repeat(60));

  // Guard: skip if campaign was already created (makes script safely re-runnable)
  const exists = await campaignExists(customer, config.name);
  if (exists) {
    console.log(`   Campaign "${config.name}" already exists. Skipping...`);
    return;
  }

  // Step 1: Create budget
  console.log('\n   Creating Budget...');
  const budgetResourceName = await createBudget(
    customer,
    config.budgetName,
    config.budgetAmountMicros
  );

  // Step 2: Create campaign (paused)
  console.log('\n   Creating Campaign...');
  const campaignResourceName = await createCampaign(customer, config.name, budgetResourceName);

  // Step 3: Add geo targeting
  console.log('\n   Adding Geo Targeting...');
  await addGeoTargeting(customer, campaignResourceName);

  // Step 4: Add campaign-level negative keywords (if any)
  if (config.campaignNegativeKeywords && config.campaignNegativeKeywords.length > 0) {
    console.log('\n   Adding Campaign Negative Keywords...');
    await addCampaignNegativeKeywords(customer, campaignResourceName, config.campaignNegativeKeywords);
  }

  // Step 5: Create ad groups with keywords and ads
  console.log('\n   Creating Ad Groups...');
  for (const adGroupConfig of config.adGroups) {
    console.log(`\n      Ad Group: ${adGroupConfig.name}`);

    const adGroupResourceName = await createAdGroup(customer, campaignResourceName, adGroupConfig.name);

    console.log(`         Adding Keywords...`);
    await addKeywords(customer, adGroupResourceName, adGroupConfig.keywords);

    if (adGroupConfig.negativeKeywords && adGroupConfig.negativeKeywords.length > 0) {
      console.log(`         Adding Negative Keywords...`);
      await addNegativeKeywords(customer, adGroupResourceName, adGroupConfig.negativeKeywords);
    }

    console.log(`         Creating RSA...`);
    for (const adConfig of adGroupConfig.ads) {
      await createRSA(customer, adGroupResourceName, adConfig);
    }
  }

  console.log(`\nCampaign "${config.name}" created successfully!`);
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  const campaigns = [gutteringCampaign, birdProofingCampaign, exteriorPaintingCampaign];
  const totalAdGroups = campaigns.reduce((sum, c) => sum + c.adGroups.length, 0);

  console.log('Weather Wizard - Service Campaign Setup');
  console.log('='.repeat(80));
  console.log('\nThis script will create THREE service-specific Google Ads campaigns:');
  console.log('   1. Search - Guttering - Kent      (£20/day, 6 ad groups)');
  console.log('   2. Search - Bird Proofing - Kent  (£20/day, 6 ad groups)');
  console.log('   3. Search - Exterior Painting - Kent (£20/day, 6 ad groups)');
  console.log('\nAll campaigns will be created in PAUSED status.');
  console.log('='.repeat(80));

  try {
    const customer = getCustomer();

    for (const campaign of campaigns) {
      await createCompleteCampaign(customer, campaign);
    }

    console.log('\n' + '='.repeat(80));
    console.log('Campaign Setup Complete!');
    console.log('='.repeat(80));
    console.log('\nSummary:');
    console.log(`   ${campaigns.length} campaigns created (PAUSED)`);
    console.log(`   ${totalAdGroups} ad groups created`);
    console.log(`   Keywords and negative keywords added`);
    console.log(`   Responsive Search Ads created`);

    console.log('\nNext Steps:');
    console.log('   1. Ensure landing pages exist for all Final URLs');
    console.log('      (e.g. /guttering, /maidstone/guttering, /bird-proofing, etc.)');
    console.log('   2. Review campaigns in Google Ads UI');
    console.log('   3. Verify ad copy and URLs are correct');
    console.log('   4. Add cross-campaign negatives to the existing roofing campaigns');
    console.log('      (guttering, gutter, bird proofing, pigeon, exterior painting, etc.)');
    console.log('   5. Enable campaigns when ready to go live');
    console.log('   6. Monitor performance and adjust bids as needed');
    console.log('\nIMPORTANT: All campaigns are PAUSED. Enable when ready.\n');

  } catch (error: any) {
    console.error('\nError creating campaigns:');
    console.error(error.message);
    if (error.errors) {
      error.errors.forEach((err: any) => {
        console.error(`   ${err.message}`);
      });
    }
    process.exit(1);
  }
}

// Run the script
main();
