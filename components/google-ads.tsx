"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useConsent } from "@/lib/cookie-consent";

// Google Ads account ID (from customer ID 6652965980)
const GOOGLE_ADS_ID = "AW-17329716108";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

// SHA256 hashing function for enhanced conversions
async function sha256Hash(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

// Normalize email for hashing (lowercase, trim whitespace)
function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// Normalize phone to E.164 format (e.g., +447123456789)
function normalizePhone(phone: string): string {
  // Remove all non-digit characters except +
  let normalized = phone.replace(/[^\d+]/g, "");

  // If no country code, assume UK (+44)
  if (!normalized.startsWith("+")) {
    // Remove leading 0 if present (UK format)
    if (normalized.startsWith("0")) {
      normalized = normalized.substring(1);
    }
    normalized = "+44" + normalized;
  }

  return normalized;
}

// Normalize name (lowercase, trim)
function normalizeName(name: string): string {
  return name.toLowerCase().trim();
}

export function GoogleAds() {
  const { consent } = useConsent();

  useEffect(() => {
    // Initialize dataLayer if not exists
    window.dataLayer = window.dataLayer || [];

    // Define gtag function if not exists
    if (!window.gtag) {
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer.push(args);
      };
    }

    // Set default consent state
    window.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });

    // Update consent based on user preferences
    const consentValue = consent.marketing ? "granted" : "denied";
    window.gtag("consent", "update", {
      ad_storage: consentValue,
      ad_user_data: consentValue,
      ad_personalization: consentValue,
    });

    // Listen for consent updates
    const handleConsentUpdate = (event: CustomEvent<{ marketing: boolean }>) => {
      const newConsentValue = event.detail.marketing ? "granted" : "denied";
      window.gtag("consent", "update", {
        ad_storage: newConsentValue,
        ad_user_data: newConsentValue,
        ad_personalization: newConsentValue,
      });
    };

    window.addEventListener("consentUpdated", handleConsentUpdate as EventListener);

    return () => {
      window.removeEventListener("consentUpdated", handleConsentUpdate as EventListener);
    };
  }, [consent.marketing]);

  return (
    <>
      {/* Google Ads gtag.js - lazyOnload to avoid blocking LCP */}
      <Script
        id="google-ads-gtag"
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
      />
      <Script
        id="google-ads-config"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}', {
              allow_enhanced_conversions: true
            });
          `,
        }}
      />
    </>
  );
}

// User data interface for enhanced conversions
export interface EnhancedConversionUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  streetAddress?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
}

// Set user data for enhanced conversions (hashes automatically)
// Call this BEFORE the conversion event when you have user data
export async function setEnhancedConversionUserData(userData: EnhancedConversionUserData) {
  if (typeof window === "undefined" || !window.gtag) return;

  const hashedUserData: Record<string, unknown> = {};

  // Hash email if provided
  if (userData.email) {
    hashedUserData.sha256_email_address = await sha256Hash(normalizeEmail(userData.email));
  }

  // Hash phone if provided
  if (userData.phone) {
    hashedUserData.sha256_phone_number = await sha256Hash(normalizePhone(userData.phone));
  }

  // Build address object if any address fields provided
  if (userData.firstName || userData.lastName || userData.postalCode || userData.country) {
    const address: Record<string, string> = {};

    if (userData.firstName) {
      address.sha256_first_name = await sha256Hash(normalizeName(userData.firstName));
    }
    if (userData.lastName) {
      address.sha256_last_name = await sha256Hash(normalizeName(userData.lastName));
    }
    if (userData.streetAddress) {
      address.street = userData.streetAddress;
    }
    if (userData.city) {
      address.city = userData.city;
    }
    if (userData.region) {
      address.region = userData.region;
    }
    if (userData.postalCode) {
      address.postal_code = userData.postalCode;
    }
    if (userData.country) {
      address.country = userData.country || "GB";
    }

    hashedUserData.address = address;
  }

  // Send hashed user data to Google
  window.gtag("set", "user_data", hashedUserData);
}

// Track Google Ads conversions with enhanced data
// Call setEnhancedConversionUserData() before this if you have user data
export function trackGoogleAdsConversion(
  conversionLabel: string,
  conversionValue?: number,
  currency?: string,
  transactionId?: string
) {
  if (typeof window === "undefined" || !window.gtag) return;

  const conversionData: Record<string, unknown> = {
    send_to: `${GOOGLE_ADS_ID}/${conversionLabel}`,
  };

  if (conversionValue !== undefined) {
    conversionData.value = conversionValue;
    conversionData.currency = currency || "GBP";
  }

  if (transactionId) {
    conversionData.transaction_id = transactionId;
  }

  window.gtag("event", "conversion", conversionData);
}

// Combined function: set user data and track conversion in one call
export async function trackEnhancedConversion(
  conversionLabel: string,
  userData: EnhancedConversionUserData,
  conversionValue?: number,
  currency?: string,
  transactionId?: string
) {
  // First, set the user data
  await setEnhancedConversionUserData(userData);

  // Then trigger the conversion
  trackGoogleAdsConversion(conversionLabel, conversionValue, currency, transactionId);
}

// Helper: Track phone click with enhanced data
export async function trackPhoneClickConversion(
  conversionLabel: string,
  phoneNumber?: string
) {
  if (phoneNumber) {
    await setEnhancedConversionUserData({ phone: phoneNumber });
  }
  trackGoogleAdsConversion(conversionLabel);
}

// Helper: Track form submission with enhanced data
export async function trackFormSubmissionConversion(
  conversionLabel: string,
  formData: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    postalCode?: string;
  },
  conversionValue?: number
) {
  await setEnhancedConversionUserData({
    email: formData.email,
    phone: formData.phone,
    firstName: formData.firstName,
    lastName: formData.lastName,
    postalCode: formData.postalCode,
    country: "GB",
  });
  trackGoogleAdsConversion(conversionLabel, conversionValue);
}
