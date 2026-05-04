import type { Metadata } from "next";
import { Albert_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SITE_URL } from "@/lib/config";
import { ConsentProvider } from "@/lib/cookie-consent";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { MicrosoftUET } from "@/components/microsoft-uet";
import { MicrosoftClarity } from "@/components/microsoft-clarity";
import { WhatConverts } from "@/components/whatconverts";
import { GoogleAds } from "@/components/google-ads";
import { StickyCallBar } from "@/components/sticky-call-bar";

const albert = Albert_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-albert",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Weather Wizard | Expert Roofing Services in Kent | Roof Repairs & Guttering",
  description:
    "Trusted roofing specialists in Kent. Expert roof repairs, guttering, chimney work & more. 25+ years experience. Free quotes. Call today for professional service.",
  keywords: [
    "roofing Kent",
    "roof repairs Kent",
    "guttering repairs",
    "chimney repairs",
    "flat roofing",
    "fascias soffits",
    "roofing company Kent",
    "local roofer",
  ],
  authors: [{ name: "Weather Wizard Roofing & Guttering" }],
  openGraph: {
    title: "Weather Wizard | Expert Roofing Services in Kent",
    description:
      "Trusted roofing specialists in Kent. Expert roof repairs, guttering, chimney work & more. 25+ years experience.",
    type: "website",
    locale: "en_GB",
    siteName: "Weather Wizard",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  other: {
    "facebook-domain-verification": "lg3u3wsim0xll44zn62xrzubl1m746",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Weather Wizard",
  description: "Expert Roofing & Guttering Services in Kent",
  image: "/weather-wizard-logo-no-bg.png",
  url: SITE_URL,
  telephone: "+44-1622-123456",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kent",
    addressCountry: "GB",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 51.2787,
    longitude: 1.0808,
  },
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: 51.2787,
      longitude: 1.0808,
    },
    geoRadius: "50000",
  },
  priceRange: "££",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "08:00",
    closes: "18:00",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "127",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Roofing Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Roof Repairs",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Guttering Repairs",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Chimney Repairs",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Flat Roofing",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Fascias & Soffits",
        },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={albert.variable}>
      <head>
        {/* Consent Mode v2 defaults - MUST be synchronous and before all tracking scripts */}
        <script
          dangerouslySetInnerHTML={{ __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied',
              'url_passthrough': true,
              'ads_data_redaction': true,
              'wait_for_update': 500
            });

            window.uetq = window.uetq || [];
            window.uetq.push('consent', 'default', {
              'ad_storage': 'denied'
            });
          ` }}
        />

        {/* Preconnect to Tally — the form iframe loads above the fold */}
        <link rel="preconnect" href="https://tally.so" crossOrigin="anonymous" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-sans" suppressHydrationWarning>
        <ConsentProvider>
          {children}
          <StickyCallBar />
          <CookieConsentBanner />
          {/* Tracking scripts - only load after consent */}
          <GoogleAds />
          <MicrosoftUET />
          <MicrosoftClarity />
          <WhatConverts />
        </ConsentProvider>

        {/* Tally Form Widget Script */}
        <Script
          src="https://tally.so/widgets/embed.js"
          strategy="lazyOnload"
        />

        {/* Meta Pixel — base code
            Pixel ID is intentionally hardcoded: it is a public identifier
            rendered into every page's HTML and carries no secret value.
            strategy="afterInteractive" loads after hydration without blocking
            paint, and is compatible with Next.js static export. */}
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1367676768740652');
          fbq('track', 'PageView');
        `}</Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1367676768740652&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
