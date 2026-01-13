"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useConsent } from "@/lib/cookie-consent";

declare global {
  interface Window {
    $wc_leads?: {
      doc: {
        url: string;
        ref: string;
        search: string;
        hash: string;
      };
    };
  }
}

export function WhatConverts() {
  const { consent, hasInteracted } = useConsent();
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Only load WhatConverts if user has consented to analytics OR marketing
    // WhatConverts is primarily for lead/call tracking (analytics-like functionality)
    if (hasInteracted && (consent.analytics || consent.marketing)) {
      // Initialize the $wc_leads object before the script loads
      const safeJsonParse = (value: string): string => {
        try {
          return JSON.parse(JSON.stringify(value));
        } catch {
          return "";
        }
      };

      window.$wc_leads = window.$wc_leads || {
        doc: {
          url: safeJsonParse(document.URL),
          ref: safeJsonParse(document.referrer),
          search: safeJsonParse(location.search),
          hash: safeJsonParse(location.hash),
        },
      };

      setShouldLoad(true);
    } else {
      setShouldLoad(false);
    }
  }, [consent.analytics, consent.marketing, hasInteracted]);

  // Don't render anything if consent hasn't been given
  if (!shouldLoad) {
    return null;
  }

  return (
    <Script
      id="whatconverts"
      src="//s.ksrndkehqnwntyxlhgto.com/159946.js"
      strategy="afterInteractive"
    />
  );
}
