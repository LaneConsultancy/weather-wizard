"use client";

import { useEffect } from "react";
import Script from "next/script";

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
  useEffect(() => {
    window.$wc_leads = window.$wc_leads || {
      doc: {
        url: document.URL,
        ref: document.referrer,
        search: location.search,
        hash: location.hash,
      },
    };
  }, []);

  return (
    <Script
      id="whatconverts"
      src="//s.ksrndkehqnwntyxlhgto.com/159946.js"
      strategy="afterInteractive"
    />
  );
}
