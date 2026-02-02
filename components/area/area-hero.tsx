"use client";

import { Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Phone, Shield, Clock, Wrench, Check } from "lucide-react";
import { Area } from "@/lib/areas";
import { sanitizeKeyword, titleCase } from "@/lib/utils";

interface AreaHeroProps {
  area: Area;
  heroHeadline: string;
  heroSubheadline: string;
}

function AreaHeroContent({ area, heroHeadline, heroSubheadline }: AreaHeroProps) {
  const searchParams = useSearchParams();
  const keywordParam = searchParams.get('keyword');
  const sanitizedKeyword = sanitizeKeyword(keywordParam);

  // Use keyword if present, otherwise use fallback
  const displayHeadline = sanitizedKeyword
    ? titleCase(sanitizedKeyword)
    : `Roof Repairs ${area.displayName}`;

  return (
    <section className="relative flex flex-col md:block md:min-h-[90vh] md:pt-20 overflow-hidden">
      {/* Mobile: Visible image at top */}
      <div className="relative w-full h-64 sm:h-80 md:hidden mt-16">
        <Image
          src="/images/hero-roofer.webp"
          alt="Professional roofer ready to help with your roofing needs"
          fill
          className="object-cover object-[center_20%]"
          sizes="100vw"
          priority
        />
        {/* Subtle gradient at bottom to blend into content */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#1a2e42] to-transparent" />
      </div>

      {/* Desktop: Background Image - positioned to show Rufus clearly */}
      <Image
        src="/images/hero-roofer.webp"
        alt="Professional roofer ready to help with your roofing needs"
        fill
        className="hidden md:block object-cover object-[center_10%]"
        sizes="100vw"
        priority
      />

      {/* Desktop: Gradient Overlay - Navy fading to transparent */}
      <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#1a2e42] via-[#1a2e42]/90 to-transparent" />

      {/* Mobile: Solid background for content area */}
      <div className="flex-1 bg-[#1a2e42] md:bg-transparent">
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 py-8 md:py-24 md:flex md:items-center md:min-h-[90vh]">
          <div className="max-w-7xl mx-auto w-full">
            {/* Content constrained to left side */}
            <div className="max-w-xl lg:max-w-2xl">
              {/* Badges Row - Matches homepage structure */}
              <div className="flex flex-wrap items-center gap-3 mb-6 animate-fade-in delay-100">
                {/* Urgency Badge */}
                <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-medium text-green-400">
                    Available today
                  </span>
                </div>
              </div>

              {/* Main Headline - Area specific */}
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight animate-fade-up">
                {displayHeadline}
                <span className="block text-copper mt-2">Free Quote Within 24 Hours</span>
              </h1>

              {/* Value Proposition */}
              <div className="flex flex-wrap items-center gap-3 mb-8 animate-fade-up delay-100">
                <div className="flex items-center gap-2 text-white/90">
                  <Check className="h-5 w-5 text-[#5ba8a0]" />
                  <span className="text-base md:text-lg font-medium">No Call-Out Fee</span>
                </div>
                <span className="text-white/40">•</span>
                <div className="flex items-center gap-2 text-white/90">
                  <Check className="h-5 w-5 text-[#5ba8a0]" />
                  <span className="text-base md:text-lg font-medium">Same-Day Response</span>
                </div>
                <span className="text-white/40">•</span>
                <div className="flex items-center gap-2 text-white/90">
                  <Check className="h-5 w-5 text-[#5ba8a0]" />
                  <span className="text-base md:text-lg font-medium">Fixed Pricing</span>
                </div>
              </div>

              {/* Description - Area specific */}
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed animate-fade-up delay-100">
                {heroSubheadline}
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 mb-10 animate-fade-up delay-200">
                <div className="flex items-center gap-2 text-white">
                  <div className="p-1.5 bg-copper/20 rounded-md backdrop-blur-sm">
                    <Wrench className="h-4 w-4 text-copper" />
                  </div>
                  <span className="text-sm font-medium">25 Years&apos; Experience</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <div className="p-1.5 bg-copper/20 rounded-md backdrop-blur-sm">
                    <Shield className="h-4 w-4 text-copper" />
                  </div>
                  <span className="text-sm font-medium">Public Liability Insured</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <div className="p-1.5 bg-copper/20 rounded-md backdrop-blur-sm">
                    <Clock className="h-4 w-4 text-copper" />
                  </div>
                  <span className="text-sm font-medium">24/7 Emergency</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6 animate-fade-up delay-300">
                <Button
                  size="lg"
                  className="bg-copper hover:bg-copper-500 text-white font-semibold text-lg px-8 py-6 shadow-copper hover:shadow-copper-lg transition-all duration-300 btn-shine"
                  asChild
                >
                  <a href="tel:08003162922" className="flex items-center gap-3">
                    <Phone className="h-5 w-5" />
                    Call 0800 316 2922
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 font-semibold text-lg px-8 py-6 backdrop-blur-sm transition-all duration-300"
                  asChild
                >
                  <a href="#contact">Get Free Quote</a>
                </Button>
              </div>

              {/* Risk Reversal Badges */}
              <div className="flex flex-wrap gap-4 mb-10 animate-fade-up delay-350">
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#5ba8a0]/20 flex items-center justify-center backdrop-blur-sm">
                    <Check className="h-3 w-3 text-[#5ba8a0]" />
                  </div>
                  <span>No call-out fee</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#5ba8a0]/20 flex items-center justify-center backdrop-blur-sm">
                    <Check className="h-3 w-3 text-[#5ba8a0]" />
                  </div>
                  <span>No deposit required</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#5ba8a0]/20 flex items-center justify-center backdrop-blur-sm">
                    <Check className="h-3 w-3 text-[#5ba8a0]" />
                  </div>
                  <span>Fixed price guarantee</span>
                </div>
              </div>

              {/* Stats Row - Area specific */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 animate-fade-up delay-400">
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-copper">25+</p>
                  <p className="text-sm text-white/70">Years in the Trade</p>
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-copper">Kent</p>
                  <p className="text-sm text-white/70">Local Roofer</p>
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-copper">{area.displayName}</p>
                  <p className="text-sm text-white/70">Area Covered</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AreaHero(props: AreaHeroProps) {
  return (
    <Suspense fallback={
      <section className="relative flex flex-col md:block md:min-h-[90vh] md:pt-20 overflow-hidden">
        <div className="relative w-full h-64 sm:h-80 md:hidden mt-16 bg-[#1a2e42]" />
        <div className="flex-1 bg-[#1a2e42]">
          <div className="container mx-auto px-4 relative z-10 py-8 md:py-24">
            <div className="text-white text-center">Loading...</div>
          </div>
        </div>
      </section>
    }>
      <AreaHeroContent {...props} />
    </Suspense>
  );
}
