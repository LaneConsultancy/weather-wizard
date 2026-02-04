"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useConsent } from "@/lib/cookie-consent";

declare global {
  interface Window {
    clarity?: (command: string, ...args: unknown[]) => void;
  }
}

const CLARITY_ID = "vc95uz2q7q";

export function MicrosoftClarity() {
  const { consent, hasInteracted } = useConsent();
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Only load Microsoft Clarity if user has consented to analytics
    if (hasInteracted && consent.analytics) {
      setShouldLoad(true);
    } else {
      setShouldLoad(false);
    }
  }, [consent.analytics, hasInteracted]);

  // Don't render anything if consent hasn't been given
  if (!shouldLoad) {
    return null;
  }

  return (
    <Script
      id="microsoft-clarity"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_ID}");
        `,
      }}
    />
  );
}
