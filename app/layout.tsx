import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cinzel } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
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
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Weather Wizard",
  description: "Expert Roofing & Guttering Services in Kent",
  image: "/weather-wizard-logo-no-bg.png",
  url: "https://weatherwizard.co.uk",
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
    <html lang="en-GB" className={`${plusJakarta.variable} ${cinzel.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
