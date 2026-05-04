import type { Metadata } from "next";
import Image from "next/image";
import { Phone } from "lucide-react";
import { PhoneLink } from "@/components/phone-link";
import { ServiceHero } from "@/components/upfolded/service-hero";
import { TrustBar } from "@/components/upfolded/trust-bar";
import { WhyChoose } from "@/components/upfolded/why-choose";
import { ServicesGrid } from "@/components/upfolded/services-grid";
import { ServiceHowItWorks } from "@/components/upfolded/service-how-it-works";
import { TestimonialsStrip } from "@/components/upfolded/testimonials-strip";
import { GuaranteesSection } from "@/components/upfolded/guarantees-section";
import { ServiceLossAversion } from "@/components/upfolded/service-loss-aversion";
import { ServiceContentSection } from "@/components/upfolded/service-content-section";
import { AreasCovered } from "@/components/upfolded/areas-covered";
import { ServiceFaq } from "@/components/upfolded/service-faq";
import { FinalCta } from "@/components/upfolded/final-cta";
import { UpfoldedFooter } from "@/components/upfolded/upfolded-footer";
import { UpfoldedStickyCta } from "@/components/upfolded/upfolded-sticky-cta";
import { getService } from "@/lib/content/services";
import { SITE_URL, SITE_NAME, createUrl } from "@/lib/config";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

const SERVICE_SLUG = "exterior-painting";

export async function generateMetadata(): Promise<Metadata> {
  const service = getService(SERVICE_SLUG);
  if (!service) return {};

  return {
    metadataBase: new URL(SITE_URL),
    title: service.meta.title,
    description: service.meta.description,
    keywords: service.meta.keywords,
    robots: { index: true, follow: true },
    openGraph: {
      title: service.meta.title,
      description: service.meta.description,
      url: createUrl(SERVICE_SLUG),
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: service.image,
          width: 1200,
          height: 630,
          alt: `${service.name} services by Weather Wizard`,
        },
      ],
    },
    alternates: {
      canonical: createUrl(SERVICE_SLUG),
    },
  };
}

export default function ExteriorPaintingPage() {
  const service = getService(SERVICE_SLUG);
  if (!service) notFound();

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    name: `Weather Wizard - ${service.name}`,
    description: service.meta.description,
    url: createUrl(SERVICE_SLUG),
    telephone: "08003162922",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Maidstone",
      addressRegion: "Kent",
      addressCountry: "GB",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Kent",
    },
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: service.name, item: createUrl(SERVICE_SLUG) },
    ],
  };

  return (
    <main className="min-h-screen">
      <a
        href="#quote-form"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-slate-900 focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-sm focus:font-medium"
      >
        Skip to quote form
      </a>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <header className="bg-slate-900 border-b border-white/10">
        <div className="container mx-auto px-4">
          <nav aria-label="Main" className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Image
                src="/weather-wizard-logo-no-bg.png"
                alt="Weather Wizard"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <span className="text-white font-semibold text-lg hidden sm:inline">
                Weather Wizard
              </span>
            </div>

            <PhoneLink
              className="inline-flex items-center gap-2 bg-copper hover:bg-copper/90 text-white px-4 py-2 rounded-lg font-semibold transition-colors min-h-[44px]"
              label="service_header_phone"
            >
              <Phone className="h-4 w-4" />
              <span>0800 316 2922</span>
            </PhoneLink>
          </nav>
        </div>
      </header>

      <ServiceHero service={service} locationName="Kent" />
      <TestimonialsStrip />
      <TrustBar locationName="Kent" />
      <WhyChoose />
      <ServicesGrid />
      <ServiceHowItWorks service={service} />
      <GuaranteesSection />
      <ServiceLossAversion service={service} locationName="Kent" />
      <ServiceContentSection service={service} />
      <AreasCovered />
      <ServiceFaq service={service} />
      <FinalCta locationName="Kent" />
      <UpfoldedFooter />
      <UpfoldedStickyCta />
    </main>
  );
}
