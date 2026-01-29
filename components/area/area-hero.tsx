"use client";

import { Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Shield, Clock, Wrench } from "lucide-react";
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
    <section className="relative min-h-[90vh] flex items-center pt-20 bg-gradient-to-b from-[#1a2e42] to-[#0f1c2a]">
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="lg:col-span-3 max-w-2xl">
            {/* Badges Row - Horizontally aligned */}
            <div className="flex flex-wrap items-center gap-3 mb-6 animate-fade-in">
              {/* Urgency Badge */}
              <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-green-400">
                  Available today
                </span>
              </div>

              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 bg-copper/20 border border-copper/30 rounded-full px-4 py-2">
                <MapPin className="h-4 w-4 text-copper" />
                <span className="text-sm font-medium text-copper">
                  {area.displayName}
                </span>
              </div>
            </div>

            {/* Main Headline - SEO optimized with area name or dynamic keyword */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight animate-fade-up">
              {displayHeadline}
              <span className="block text-copper">I&apos;ll Fix It Properly.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed animate-fade-up delay-100">
              {heroSubheadline}
            </p>

            {/* Trust Badges Row */}
            <div className="flex flex-wrap gap-4 mb-10 animate-fade-up delay-200">
              <div className="flex items-center gap-2 text-white">
                <div className="p-1.5 bg-copper/20 rounded-md">
                  <Wrench className="h-4 w-4 text-copper" />
                </div>
                <span className="text-sm font-medium">25 Years&apos; Experience</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <div className="p-1.5 bg-copper/20 rounded-md">
                  <Shield className="h-4 w-4 text-copper" />
                </div>
                <span className="text-sm font-medium">Public Liability Insured</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <div className="p-1.5 bg-copper/20 rounded-md">
                  <Clock className="h-4 w-4 text-copper" />
                </div>
                <span className="text-sm font-medium">24/7 Emergency</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-fade-up delay-300">
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

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 animate-fade-up delay-400">
              <div>
                <p className="text-2xl md:text-3xl font-bold text-copper">25+</p>
                <p className="text-sm text-white/70">Years in the Trade</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-copper">Maidstone</p>
                <p className="text-sm text-white/70">Based Locally</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-copper">{area.displayName}</p>
                <p className="text-sm text-white/70">Area Covered</p>
              </div>
            </div>
          </div>

          {/* Right Column - Wizard Mascot */}
          <div className="lg:col-span-2 flex justify-center lg:justify-end items-center animate-fade-up delay-500">
            <div className="relative">
              {/* Golden glow effect behind mascot */}
              <div className="absolute inset-0 bg-gradient-radial from-[#d4af37]/20 to-transparent blur-3xl" />

              {/* Wizard mascot image */}
              <div className="relative">
                <Image
                  src="/images/wizard-mascot.webp"
                  alt="Weather Wizard mascot"
                  width={1024}
                  height={1024}
                  className="w-64 sm:w-80 lg:w-full max-w-md drop-shadow-[0_0_30px_rgba(212,175,55,0.25)] animate-float"
                  priority
                />
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
      <section className="relative min-h-[90vh] flex items-center pt-20 bg-gradient-to-b from-[#1a2e42] to-[#0f1c2a]">
        <div className="container mx-auto px-4 relative z-10 py-16 md:py-24">
          <div className="text-white text-center">Loading...</div>
        </div>
      </section>
    }>
      <AreaHeroContent {...props} />
    </Suspense>
  );
}
