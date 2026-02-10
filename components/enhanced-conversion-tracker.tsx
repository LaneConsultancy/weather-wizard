"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  setEnhancedConversionUserData,
  trackGoogleAdsConversion,
} from "./google-ads";
import { trackConversion } from "./microsoft-uet";

interface EnhancedConversionTrackerProps {
  /** Google Ads conversion label (e.g., "Lx0ZCNmdzO4b") */
  conversionLabel: string;
  /** Conversion value in GBP */
  conversionValue?: number;
}

export function EnhancedConversionTracker({
  conversionLabel,
  conversionValue = 50,
}: EnhancedConversionTrackerProps) {
  const searchParams = useSearchParams();
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;

    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");
    const postcode = searchParams.get("postcode");

    // Parse first name from full name (Tally collects full name in one field)
    const firstName = name?.split(" ")[0] || undefined;
    const lastName = name?.split(" ").slice(1).join(" ") || undefined;

    // Generate a transaction ID for deduplication
    const transactionId = `tally-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    async function fireConversions() {
      // 1. Set enhanced user data (hashes PII automatically)
      await setEnhancedConversionUserData({
        email: email || undefined,
        phone: phone || undefined,
        firstName: firstName,
        lastName: lastName,
        postalCode: postcode || undefined,
        country: "GB",
      });

      // 2. Fire Google Ads conversion with enhanced data attached
      trackGoogleAdsConversion(
        conversionLabel,
        conversionValue,
        "GBP",
        transactionId
      );

      // 3. Fire Bing UET conversion with enhanced data
      trackConversion(
        "form_submission",
        "lead",
        "tally_form",
        conversionValue,
        {
          email: email || undefined,
          phone: phone || undefined,
        }
      );

      console.log(
        "[Enhanced Conversions] Fired for:",
        email ? "email provided" : "no email",
        phone ? "phone provided" : "no phone"
      );
    }

    // Small delay to ensure gtag and UET scripts are loaded
    const timer = setTimeout(() => {
      fireConversions();
    }, 200);

    // 4. Strip PII from URL immediately (don't wait for tracking)
    if (name || email || phone || postcode) {
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }

    return () => clearTimeout(timer);
  }, [searchParams, conversionLabel, conversionValue]);

  // Renders nothing -- tracking only
  return null;
}
