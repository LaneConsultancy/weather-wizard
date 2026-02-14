import type { Metadata } from "next";
import Image from "next/image";
import { Phone } from "lucide-react";
import { PhoneLink } from "@/components/phone-link";
import { UpfoldedHero } from "@/components/upfolded/upfolded-hero";
import { TrustBar } from "@/components/upfolded/trust-bar";
import { HowItWorksStrip } from "@/components/upfolded/how-it-works-strip";
import { TestimonialsStrip } from "@/components/upfolded/testimonials-strip";
import { LossAversionSection } from "@/components/upfolded/loss-aversion-section";
import { UpfoldedQuoteForm } from "@/components/upfolded/upfolded-quote-form";
import { UpfoldedStickyCta } from "@/components/upfolded/upfolded-sticky-cta";
import { getAllAreaSlugs, getAreaBySlug } from "@/lib/areas";

export async function generateStaticParams() {
  return getAllAreaSlugs().map((slug) => ({ location: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ location: string }>;
}): Promise<Metadata> {
  const { location } = await params;
  const area = getAreaBySlug(location);
  const name =
    area?.name || location.charAt(0).toUpperCase() + location.slice(1);

  return {
    title: `Roofers in ${name} - Free Quote | Weather Wizard`,
    description: `Trusted roofers in ${name}, Kent. Don't let a small leak become a big problem. Get a free, no-obligation roofing quote. 25 years' experience. No call-out fee.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function UpfoldedLocationPage({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const { location } = await params;
  const area = getAreaBySlug(location);
  const locationName =
    area?.name || location.charAt(0).toUpperCase() + location.slice(1);

  return (
    <main className="min-h-screen">
      {/* Skip navigation */}
      <a href="#quote-form" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-slate-900 focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-sm focus:font-medium">
        Skip to quote form
      </a>

      {/* Minimal brand bar - logo and phone only, no navigation */}
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
              label="upfolded_header_phone"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">0800 316 2922</span>
              <span className="sm:hidden">Call Us</span>
            </PhoneLink>
          </nav>
        </div>
      </header>

      <UpfoldedHero locationName={locationName} />
      <TrustBar locationName={locationName} />
      <HowItWorksStrip />
      <TestimonialsStrip />
      <UpfoldedQuoteForm locationName={locationName} />
      <LossAversionSection locationName={locationName} />

      {/* Second CTA section - drives back to form */}
      <section className="bg-slate-900 py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            No Obligation. No Call-Out Fee. No Surprises.
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Get a free quote for your {locationName} roof and I&apos;ll tell you exactly
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

      {/* Compliance footer for Google Ads */}
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
