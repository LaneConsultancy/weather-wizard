import type { Metadata } from "next";
import Image from "next/image";
import { Phone } from "lucide-react";
import { PhoneLink } from "@/components/phone-link";
import { ServiceHero } from "@/components/upfolded/service-hero";
import { TrustBar } from "@/components/upfolded/trust-bar";
import { ServiceHowItWorks } from "@/components/upfolded/service-how-it-works";
import { TestimonialsStrip } from "@/components/upfolded/testimonials-strip";
import { ServiceLossAversion } from "@/components/upfolded/service-loss-aversion";
import { ServiceContentSection } from "@/components/upfolded/service-content-section";
import { ServiceFaq } from "@/components/upfolded/service-faq";
import { UpfoldedStickyCta } from "@/components/upfolded/upfolded-sticky-cta";
import { getServiceForArea, getService } from "@/lib/content/services";
import { getAreaBySlug } from "@/lib/areas";
import { SITE_URL, SITE_NAME, createUrl } from "@/lib/config";
import { notFound } from "next/navigation";

const SERVICE_SLUG = "exterior-painting";

const TOP_AREA_SLUGS = ["maidstone", "dartford", "gillingham", "chatham", "ashford"];

interface PageProps {
  params: Promise<{ area: string }>;
}

export async function generateStaticParams() {
  return TOP_AREA_SLUGS.map((area) => ({ area }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { area: areaSlug } = await params;
  const area = getAreaBySlug(areaSlug);
  if (!area) return {};

  const service = getServiceForArea(SERVICE_SLUG, area.name);

  return {
    metadataBase: new URL(SITE_URL),
    title: service.resolvedMeta.title,
    description: service.resolvedMeta.description,
    keywords: service.meta.keywords,
    robots: { index: true, follow: true },
    openGraph: {
      title: service.resolvedMeta.title,
      description: service.resolvedMeta.description,
      url: createUrl(`${areaSlug}/${SERVICE_SLUG}`),
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: service.image,
          width: 1200,
          height: 630,
          alt: `${service.name} in ${area.name} by Weather Wizard`,
        },
      ],
    },
    alternates: {
      canonical: createUrl(`${areaSlug}/${SERVICE_SLUG}`),
    },
  };
}

export default async function AreaExteriorPaintingPage({ params }: PageProps) {
  const { area: areaSlug } = await params;
  const area = getAreaBySlug(areaSlug);
  if (!area || !TOP_AREA_SLUGS.includes(areaSlug)) notFound();

  const service = getServiceForArea(SERVICE_SLUG, area.name);
  const baseService = getService(SERVICE_SLUG)!;

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    name: `Weather Wizard - ${service.name} in ${area.name}`,
    description: service.resolvedMeta.description,
    url: createUrl(`${areaSlug}/${SERVICE_SLUG}`),
    telephone: "08003162922",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Maidstone",
      addressRegion: "Kent",
      addressCountry: "GB",
    },
    areaServed: {
      "@type": "City",
      name: area.name,
      containedIn: { "@type": "AdministrativeArea", name: area.county },
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: area.coordinates.lat,
      longitude: area.coordinates.lng,
    },
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: area.name, item: createUrl(areaSlug) },
      { "@type": "ListItem", position: 3, name: service.name, item: createUrl(`${areaSlug}/${SERVICE_SLUG}`) },
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
              className="flex items-center gap-2 text-white hover:text-copper transition-colors font-semibold min-h-[44px]"
              label="service_header_phone"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">0800 316 2922</span>
              <span className="sm:hidden">Call Us</span>
            </PhoneLink>
          </nav>
        </div>
      </header>

      <ServiceHero service={baseService} locationName={area.name} />
      <TrustBar locationName={area.name} />
      <ServiceHowItWorks service={baseService} />
      <TestimonialsStrip />
      <ServiceLossAversion service={baseService} locationName={area.name} />
      <ServiceContentSection service={baseService} />
      <ServiceFaq service={baseService} />

      <section className="bg-slate-900 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            No Obligation. No Call-Out Fee. No Surprises.
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Get a free quote for exterior painting in {area.name} and I&apos;ll tell you exactly
            what needs doing &mdash; and what doesn&apos;t. If it can wait, I&apos;ll say so.
          </p>
          <a
            href="#quote-form"
            className="inline-flex items-center gap-2 bg-[#c2410c] hover:bg-[#c2410c]/90 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-copper transition-all btn-shine"
          >
            Get Your Free Quote
          </a>
        </div>
      </section>

      <footer className="bg-slate-950 border-t border-white/10 py-6 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/50">
            <a href="/" className="hover:text-white/80 transition-colors min-h-[44px] inline-flex items-center">Home</a>
            <span className="hidden sm:inline" aria-hidden="true">&middot;</span>
            <a href="/privacy" className="hover:text-white/80 transition-colors min-h-[44px] inline-flex items-center">Privacy Policy</a>
            <span className="hidden sm:inline" aria-hidden="true">&middot;</span>
            <a href="/cookies" className="hover:text-white/80 transition-colors min-h-[44px] inline-flex items-center">Cookie Policy</a>
          </div>
          <p className="text-center text-white/60 text-xs mt-4">
            &copy; {new Date().getFullYear()} Weather Wizard Roofing &amp; Guttering
          </p>
        </div>
      </footer>

      <UpfoldedStickyCta />
    </main>
  );
}
