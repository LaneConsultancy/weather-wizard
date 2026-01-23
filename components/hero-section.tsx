"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Shield, Clock, Wrench, FileText } from "lucide-react";

export function HeroSection() {
  useEffect(() => {
    // Load Tally embeds after component mounts
    if (typeof window !== "undefined" && (window as any).Tally) {
      (window as any).Tally.loadEmbeds();
    }
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/roof-repairs.png"
          alt="Professional roofing services in Kent"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={85}
        />
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column - Hero Content */}
          <div className="max-w-2xl">
            {/* Location Badge */}
            <div className="inline-flex items-center gap-2 bg-copper/20 border border-copper/30 rounded-full px-4 py-2 mb-6 animate-fade-in">
              <MapPin className="h-4 w-4 text-copper" />
              <span className="text-sm font-medium text-copper">
                Maidstone-based, covering all of Kent
              </span>
            </div>

            {/* Main Headline - Problem-Solution Lead */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight animate-fade-up">
              Leaking Roof?
              <span className="block text-copper">I&apos;ll Fix It Properly.</span>
            </h1>

            {/* Subheadline - Address the real concern */}
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed animate-fade-up delay-100">
              After 25 years fixing Kent roofs, I&apos;ve seen every problem going.
              I answer my own phone, turn up when I say I will, and give you a fixed
              price before any work starts. No surprises.
            </p>

            {/* Trust Badges Row - With reason-why */}
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

            {/* Stats Row - Updated with honest metrics */}
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
                <p className="text-2xl md:text-3xl font-bold text-copper">All Kent</p>
                <p className="text-sm text-white/70">Areas Covered</p>
              </div>
            </div>
          </div>

          {/* Right Column - Lead Form */}
          <div className="animate-fade-up delay-500">
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 shadow-2xl">
              {/* Form Header */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-copper/20 border border-copper/30 rounded-full px-3 py-1 mb-3">
                  <FileText className="h-3.5 w-3.5 text-copper" />
                  <span className="text-xs font-semibold text-copper tracking-wide uppercase">
                    Free Quote
                  </span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                  Get Your Free Quote
                </h2>
                <p className="text-white/80 text-sm">
                  Tell me about your roofing needs and I&apos;ll get back to you with an honest assessment.
                </p>
              </div>

              {/* Trust Elements */}
              <div className="space-y-2 mb-6">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-copper/20 flex items-center justify-center mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-copper" />
                  </div>
                  <p className="text-white/70 text-xs">Response within 2 hours during business hours</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-copper/20 flex items-center justify-center mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-copper" />
                  </div>
                  <p className="text-white/70 text-xs">Fixed prices, no hidden charges</p>
                </div>
              </div>

              {/* Tally Form Embed */}
              <div className="rounded-lg">
                <iframe
                  data-tally-src="https://tally.so/embed/npqGpV?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                  loading="lazy"
                  width="100%"
                  height="400"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  title="Get Your Free Roofing Quote"
                  className="rounded-lg"
                ></iframe>
              </div>

              {/* Or call directly */}
              <div className="pt-4 mt-4 border-t border-white/10">
                <p className="text-white/70 text-xs mb-2">Prefer to speak directly?</p>
                <a
                  href="tel:08003162922"
                  className="inline-flex items-center gap-2 text-copper hover:text-copper-400 transition-colors font-semibold text-sm group"
                >
                  <Phone className="h-4 w-4 group-hover:animate-bounce" />
                  0800 316 2922
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
