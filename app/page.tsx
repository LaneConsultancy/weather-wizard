import type { Metadata } from "next";
import Image from "next/image";
import { Phone } from "lucide-react";
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
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Kent Roofers. No Call-Out Fee. Fixed Prices. | Weather Wizard",
  description:
    "Trusted Kent roofer with 25 years' experience. No call-out fee, fixed prices, written quotes. Roof repairs, guttering, chimneys & more. Free quote in 30 seconds.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Kent Roofers. No Call-Out Fee. Fixed Prices. | Weather Wizard",
    description:
      "Trusted Kent roofer with 25 years' experience. No call-out fee, fixed prices, written quotes. Free quote in 30 seconds.",
    url: SITE_URL,
    siteName: "Weather Wizard",
    type: "website",
    locale: "en_GB",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Skip navigation */}
      <a
        href="#quote-form"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-slate-900 focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-sm focus:font-medium"
      >
        Skip to quote form
      </a>

      {/* Minimal brand bar — logo + phone CTA */}
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
              className="flex items-center gap-2 text-white hover:text-copper transition-colors font-semibold min-h-[44px]"
              label="home_header_phone"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">0800 316 2922</span>
              <span className="sm:hidden">Call Us</span>
            </PhoneLink>
          </nav>
        </div>
      </header>

      <UpfoldedHero locationName="Kent" />
      <TrustBar locationName="Kent" />
      <WhyChoose />
      <ServicesGrid />
      <HowItWorksStrip />
      <TestimonialsStrip />
      <GuaranteesSection />
      <LossAversionSection locationName="Kent" />
      <AreasCovered />
      <FaqSection />
      <FinalCta locationName="Kent" />
      <UpfoldedFooter />
      <UpfoldedStickyCta />
    </main>
  );
}
