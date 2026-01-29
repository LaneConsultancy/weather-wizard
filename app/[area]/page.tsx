import Link from "next/link";
import { Shield, Wrench, MapPin, Phone, ChevronRight } from "lucide-react";
import { Header } from "@/components/header";
import { AreaHero } from "@/components/area/area-hero";
import { AreaTrustSignals } from "@/components/area/area-trust-signals";
import { AreaServices } from "@/components/area/area-services";
import { AreaLocalInfo } from "@/components/area/area-local-info";
import { ReviewsSection } from "@/components/reviews-section";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import {
  getAreaBySlug,
  getAllAreaSlugs
} from "@/lib/areas";
import {
  generateAreaContent,
  generateLocalBusinessStructuredData,
  generateBreadcrumbStructuredData
} from "@/lib/content/area-content";
import { Metadata } from "next";
import { notFound } from "next/navigation";

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
    title: content.metaTitle,
    description: content.metaDescription,
    keywords: content.keywords,
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: `https://weatherwizard.co.uk/${area.slug}`,
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
      canonical: `https://weatherwizard.co.uk/${area.slug}`,
    },
  };
}

export default async function AreaPage({ params }: AreaPageProps) {
  const { area: areaSlug } = await params;
  const area = getAreaBySlug(areaSlug);

  if (!area) {
    notFound();
  }

  const content = generateAreaContent(area);
  const localBusinessData = generateLocalBusinessStructuredData(area);
  const breadcrumbData = generateBreadcrumbStructuredData(area);

  // Safely serialize structured data (controlled, non-user content)
  const localBusinessJson = JSON.stringify(localBusinessData);
  const breadcrumbJson = JSON.stringify(breadcrumbData);

  return (
    <main className="min-h-screen">
      {/* Structured Data - Generated from controlled sources, not user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: localBusinessJson }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJson }}
      />

      {/* Header */}
      <Header />

      {/* Breadcrumb Navigation */}
      <nav className="bg-slate-50 border-b border-slate-100 py-3">
        <div className="container mx-auto px-4">
          <ol className="flex items-center gap-2 text-sm text-slate-500">
            <li>
              <Link href="/" className="hover:text-copper transition-colors">Home</Link>
            </li>
            <li><ChevronRight className="w-3.5 h-3.5 text-slate-300" /></li>
            <li className="text-slate-900 font-semibold">{area.name}</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section with Integrated Form */}
      <AreaHero
        area={area}
        heroHeadline={content.heroHeadline}
        heroSubheadline={content.heroSubheadline}
      />

      {/* Reviews Section - Real Checkatrade Reviews */}
      <ReviewsSection />

      {/* Trust Signals Bar */}
      <AreaTrustSignals area={area} />

      {/* Services Section */}
      <AreaServices area={area} />

      {/* Why Choose Weather Wizard Section */}
      <section id="about" className="relative py-20 md:py-28 bg-slate-900 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 slate-pattern opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-slate-900" />

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-copper/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-slate-700/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block text-copper font-semibold text-sm tracking-wider uppercase mb-3">
              About Me
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Why {area.name} Homeowners Call Me
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              25 years fixing roofs has taught me what matters: turn up when you say you will, do the job properly, and answer your phone when people need you.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Wrench,
                title: "25 Years' Experience",
                description: `I've fixed every type of roof Kent has to offer. Missing tiles to full rebuilds — I've done the lot.`
              },
              {
                icon: Shield,
                title: "Properly Insured",
                description: "Public liability insurance means you're covered. I wouldn't work on anyone's roof without it."
              },
              {
                icon: MapPin,
                title: "Based in Maidstone",
                description: `${area.name} is my patch. I know the local roofs, the local weather, and I'll be here if anything goes wrong.`
              },
              {
                icon: Phone,
                title: "I Answer the Phone",
                description: `Call me any time — I pick up. No call centres, no callbacks. Just me, ready to help.`
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-copper/30 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Icon */}
                  <div className="mb-5">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-copper/20 to-copper/5 group-hover:from-copper/30 group-hover:to-copper/10 transition-colors duration-300">
                      <Icon className="w-7 h-7 text-copper" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-xl font-bold text-white mb-3 group-hover:text-copper transition-colors duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/60 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Decorative accent */}
                  <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-copper/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Local Info & Nearby Areas */}
      <AreaLocalInfo area={area} />

      {/* Final CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
