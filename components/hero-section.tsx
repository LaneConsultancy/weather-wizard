"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Shield, Clock, Wrench } from "lucide-react";

export function HeroSection() {
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
          <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed animate-fade-up delay-100">
            After 25 years fixing Kent roofs, I&apos;ve seen every problem going.
            I answer my own phone, turn up when I say I will, and give you a fixed
            price before any work starts. No surprises.
          </p>

          {/* Trust Badges Row - With reason-why */}
          <div className="flex flex-wrap gap-4 mb-10 animate-fade-up delay-200">
            <div className="flex items-center gap-2 text-white/90">
              <div className="p-1.5 bg-copper/20 rounded-md">
                <Wrench className="h-4 w-4 text-copper" />
              </div>
              <span className="text-sm font-medium">25 Years&apos; Experience</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <div className="p-1.5 bg-copper/20 rounded-md">
                <Shield className="h-4 w-4 text-copper" />
              </div>
              <span className="text-sm font-medium">Public Liability Insured</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
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
              <p className="text-sm text-white/60">Years in the Trade</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-copper">Maidstone</p>
              <p className="text-sm text-white/60">Based Locally</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-copper">All Kent</p>
              <p className="text-sm text-white/60">Areas Covered</p>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
