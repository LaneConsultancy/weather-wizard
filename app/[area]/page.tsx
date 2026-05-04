import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Phone } from "lucide-react";
import { notFound } from "next/navigation";
import { PhoneLink } from "@/components/phone-link";
import { UpfoldedHero } from "@/components/upfolded/upfolded-hero";
import { TrustBar } from "@/components/upfolded/trust-bar";
import { WhyChoose } from "@/components/upfolded/why-choose";
import { ServicesGrid } from "@/components/upfolded/services-grid";
import { HowItWorksStrip } from "@/components/upfolded/how-it-works-strip";
import { TestimonialsStrip } from "@/components/upfolded/testimonials-strip";
import { GuaranteesSection } from "@/components/upfolded/guarantees-section";
import { LossAversionSection } from "@/components/upfolded/loss-aversion-section";
import { AreasCovered } from "@/components/upfolded/areas-covered";
import { FaqSection } from "@/components/upfolded/faq-section";
import { FinalCta } from "@/components/upfolded/final-cta";
import { UpfoldedFooter } from "@/components/upfolded/upfolded-footer";
import { UpfoldedStickyCta } from "@/components/upfolded/upfolded-sticky-cta";
import { getAreaBySlug, getAllAreaSlugs } from "@/lib/areas";
import {
  generateAreaContent,
  generateLocalBusinessStructuredData,
  generateBreadcrumbStructuredData,
} from "@/lib/content/area-content";
import { SITE_URL, createUrl } from "@/lib/config";

interface AreaPageProps {
  params: Promise<{
    area: string;
  }>;
}

// Generate static params for all areas
export async function generateStaticParams() {
  const slugs = getAllAreaSlugs();
  return slugs.map((slug) => ({
    area: slug,
  }));
}

// Generate metadata for each area page
export async function generateMetadata({ params }: AreaPageProps): Promise<Metadata> {
  const { area: areaSlug } = await params;
  const area = getAreaBySlug(areaSlug);

  if (!area) {
    return {
      title: 'Area Not Found | Weather Wizard',
      description: 'The requested area could not be found.',
    };
  }

  const content = generateAreaContent(area);

  return {
    metadataBase: new URL(SITE_URL),
    title: content.metaTitle,
    description: content.metaDescription,
    keywords: content.keywords,
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: createUrl(area.slug),
      siteName: 'Weather Wizard',
      type: 'website',
      images: [
        {
          url: '/images/roof-repairs.png',
          width: 1200,
          height: 630,
          alt: `Roofing services in ${area.displayName}`,
        },
      ],
    },
    alternates: {
      canonical: createUrl(area.slug),
    },
  };
}

export default async function AreaPage({ params }: AreaPageProps) {
  const { area: areaSlug } = await params;
  const area = getAreaBySlug(areaSlug);

  if (!area) {
    notFound();
  }

  const localBusinessJson = JSON.stringify(
    generateLocalBusinessStructuredData(area)
  );
  const breadcrumbJson = JSON.stringify(generateBreadcrumbStructuredData(area));

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: localBusinessJson }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJson }}
      />

      {/* Skip navigation */}
      <a
        href="#quote-form"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-slate-900 focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-sm focus:font-medium"
      >
        Skip to quote form
      </a>

      {/* Minimal brand bar */}
      <header className="bg-slate-900 border-b border-white/10">
        <div className="container mx-auto px-4">
          <nav
            aria-label="Main"
            className="flex items-center justify-between py-3"
          >
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
              label="area_header_phone"
            >
              <Phone className="h-4 w-4" />
              <span>0800 316 2922</span>
            </PhoneLink>
          </nav>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="bg-slate-50 border-b border-slate-100 py-3"
      >
        <div className="container mx-auto px-4">
          <ol className="flex items-center gap-2 text-sm text-slate-500">
            <li>
              <Link href="/" className="hover:text-copper transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            </li>
            <li className="text-slate-900 font-semibold" aria-current="page">
              {area.name}
            </li>
          </ol>
        </div>
      </nav>

      <UpfoldedHero locationName={area.name} />
      <TestimonialsStrip />
      <TrustBar locationName={area.name} />
      <WhyChoose />
      <ServicesGrid />
      <HowItWorksStrip />
      <GuaranteesSection />
      <LossAversionSection locationName={area.name} />
      <AreasCovered currentArea={area} />
      <FaqSection />
      <FinalCta locationName={area.name} />
      <UpfoldedFooter />
      <UpfoldedStickyCta />
    </main>
  );
}
