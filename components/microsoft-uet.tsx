"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useConsent } from "@/lib/cookie-consent";

// Replace with your actual UET Tag ID from Microsoft Advertising
const UET_TAG_ID = process.env.NEXT_PUBLIC_BING_UET_TAG_ID || "";

declare global {
  interface Window {
    uetq: unknown[];
  }
}

export function MicrosoftUET() {
  const { consent, hasInteracted } = useConsent();

  // Consent DEFAULTS are set synchronously in <head> (layout.tsx).
  // This effect only handles UPDATES after user interaction.
  useEffect(() => {
    // Guard: uetq should already be defined by the inline script in <head>.
    if (!window.uetq) {
      window.uetq = [];
    }

    // If user has previously set consent, send an update
    if (hasInteracted) {
      const consentValue = consent.marketing ? "granted" : "denied";
      window.uetq.push("consent", "update", {
        ad_storage: consentValue,
      });
    }

    // Listen for real-time consent changes from the cookie banner
    const handleConsentUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ marketing: boolean }>).detail;
      const newConsentValue = detail.marketing ? "granted" : "denied";
      window.uetq.push("consent", "update", {
        ad_storage: newConsentValue,
      });
    };

    window.addEventListener("consentUpdated", handleConsentUpdate);

    return () => {
      window.removeEventListener("consentUpdated", handleConsentUpdate);
    };
  }, [consent.marketing, hasInteracted]);

  // Don't render the script if no UET Tag ID is configured
  if (!UET_TAG_ID) {
    return null;
  }

  return (
    <>
      {/* Microsoft UET Script - lazyOnload to avoid blocking LCP */}
      <Script
        id="microsoft-uet"
        strategy="lazyOnload"
        src="//bat.bing.com/bat.js"
        onLoad={() => {
          // Initialize UET after script loads
          const uetConfig = {
            ti: UET_TAG_ID,
            enableAutoSpaTracking: true,
            q: window.uetq,
          };
          // @ts-expect-error UET is defined by the loaded script
          window.uetq = new UET(uetConfig);
          window.uetq.push("pageLoad");
        }}
      />
    </>
  );
}

// Helper function to track conversions with enhanced data
// Call this when a user completes a conversion action (e.g., form submission, phone click)
export function trackConversion(
  eventAction: string,
  eventCategory?: string,
  eventLabel?: string,
  eventValue?: number,
  enhancedData?: {
    email?: string;
    phone?: string;
  }
) {
  if (typeof window === "undefined" || !window.uetq) return;

  const eventData: Record<string, unknown> = {
    ea: eventAction,
  };

  if (eventCategory) eventData.ec = eventCategory;
  if (eventLabel) eventData.el = eventLabel;
  if (eventValue) eventData.ev = eventValue;

  // Enhanced conversions: hash PII data before sending
  // Microsoft will hash this on their end, but for extra privacy you can pre-hash
  if (enhancedData?.email) {
    eventData.email = enhancedData.email.toLowerCase().trim();
  }
  if (enhancedData?.phone) {
    // Remove all non-numeric characters except +
    eventData.phone = enhancedData.phone.replace(/[^\d+]/g, "");
  }

  window.uetq.push("event", eventAction, eventData);
}

// Track phone click conversions
export function trackPhoneClick(label: string = "header_phone") {
  trackConversion("phone_click", "contact", label);
}
