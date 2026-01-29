"use client";

import { useEffect, useRef } from "react";
import { trackGoogleAdsConversion } from "./google-ads";

interface GoogleAdsConversionProps {
  conversionLabel: string;
  conversionValue?: number;
  currency?: string;
}

/**
 * Component that fires a Google Ads conversion when mounted.
 * Use on thank-you/confirmation pages.
 */
export function GoogleAdsConversion({
  conversionLabel,
  conversionValue,
  currency = "GBP",
}: GoogleAdsConversionProps) {
  const hasFired = useRef(false);

  useEffect(() => {
    // Only fire once per page load
    if (hasFired.current) return;
    hasFired.current = true;

    // Small delay to ensure gtag is loaded
    const timer = setTimeout(() => {
      trackGoogleAdsConversion(conversionLabel, conversionValue, currency);
      console.log("[Google Ads] Conversion fired:", conversionLabel);
    }, 100);

    return () => clearTimeout(timer);
  }, [conversionLabel, conversionValue, currency]);

  // This component doesn't render anything visible
  return null;
}
