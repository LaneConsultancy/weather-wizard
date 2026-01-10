import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone, Shield, Award, Zap, Users } from "lucide-react";
import { AreaHero } from "@/components/area/area-hero";
import { AreaTrustSignals } from "@/components/area/area-trust-signals";
import { AreaServices } from "@/components/area/area-services";
import { AreaLocalInfo } from "@/components/area/area-local-info";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import {
  getAllAreas,
  getAreaBySlug,
  getAllAreaSlugs
} from "@/lib/areas";
import {
  generateAreaContent,
  generateTrustSignals,
  generateLocalBusinessStructuredData,
  generateBreadcrumbStructuredData
} from "@/lib/content/area-content";
import { Cinzel } from "next/font/google";
import { Metadata } from "next";
import { notFound } from "next/navigation";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["700"] });

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
  const trustSignals = generateTrustSignals(area);
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
      <header className="bg-navy text-white py-4 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/weather-wizard-logo-no-bg.png"
                alt="Weather Wizard Logo"
                width={80}
                height={80}
                className="w-20 h-20"
              />
              <div className="flex flex-col">
                <span className={`${cinzel.className} text-2xl text-gold tracking-wide`}>
                  Weather Wizard
                </span>
                <span className="text-xs text-white/80 italic">
                  We Weather Every Storm
                </span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#services" className="text-white/90 hover:text-gold transition-colors">Services</a>
              <a href="#about" className="text-white/90 hover:text-gold transition-colors">About</a>
              <a href="#testimonials" className="text-white/90 hover:text-gold transition-colors">Reviews</a>
              <a href="#contact" className="text-white/90 hover:text-gold transition-colors">Contact</a>
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex flex-col items-end mr-2">
                <span className="text-xs text-teal font-semibold">24/7 Emergency Response</span>
                <span className="text-sm text-white/80">Call: 01622 123456</span>
              </div>
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-navy font-bold" asChild>
                <a href="tel:01622123456">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <nav className="bg-navy-50 py-3">
        <div className="container mx-auto px-4">
          <ol className="flex items-center gap-2 text-sm text-navy/70">
            <li>
              <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            </li>
            <li>→</li>
            <li className="text-navy font-semibold">{area.name}</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <AreaHero
        area={area}
        heroHeadline={content.heroHeadline}
        heroSubheadline={content.heroSubheadline}
      />

      {/* Trust Signals Bar */}
      <AreaTrustSignals
        area={area}
        homesProtected={trustSignals.homesProtected}
      />

      {/* Services Section */}
      <AreaServices area={area} />

      {/* Why Choose Weather Wizard Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-navy to-navy-700 text-white relative overflow-hidden">
        {/* Subtle roof tile texture overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(255, 255, 255, 0.1) 12px, rgba(255, 255, 255, 0.1) 13px), repeating-linear-gradient(-45deg, transparent, transparent 12px, rgba(255, 255, 255, 0.1) 12px, rgba(255, 255, 255, 0.1) 13px)'}} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className={`${cinzel.className} text-4xl md:text-5xl font-bold mb-4`}>
              Why Choose Weather Wizard in {area.name}?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Trusted by {area.name} residents for over 25 years
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-gold/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-gold" />
              </div>
              <h3 className={`${cinzel.className} font-bold text-xl mb-3`}>25+ Years Experience</h3>
              <p className="text-white/80">
                Over two decades serving homes in {area.name} and across Kent. Proven track record of excellence.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gold/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-gold" />
              </div>
              <h3 className={`${cinzel.className} font-bold text-xl mb-3`}>Guaranteed Results</h3>
              <p className="text-white/80">
                Comprehensive guarantees on all work. We stand behind our service with full insurance and certification.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gold/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-gold" />
              </div>
              <h3 className={`${cinzel.className} font-bold text-xl mb-3`}>Local Expertise</h3>
              <p className="text-white/80">
                Family-run Kent business with deep local knowledge of {area.name}. We understand local weather and homes.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gold/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-10 h-10 text-gold" />
              </div>
              <h3 className={`${cinzel.className} font-bold text-xl mb-3`}>Emergency Service</h3>
              <p className="text-white/80">
                24/7 emergency repairs available in {area.name}. When disaster strikes, we respond fast to protect your property.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Local Info & Nearby Areas */}
      <AreaLocalInfo area={area} />

      {/* Final CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
