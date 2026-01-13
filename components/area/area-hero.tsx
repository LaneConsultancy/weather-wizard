import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Shield, Clock, Wrench } from "lucide-react";
import { Area } from "@/lib/areas";

interface AreaHeroProps {
  area: Area;
  heroHeadline: string;
  heroSubheadline: string;
}

export function AreaHero({ area, heroHeadline, heroSubheadline }: AreaHeroProps) {
  const trustBadges = [
    { icon: Wrench, text: "25 Years' Experience" },
    { icon: Shield, text: "Public Liability Insured" },
    { icon: Clock, text: "24/7 Emergency" },
  ];

  return (
    <section className="relative min-h-[650px] flex items-center overflow-hidden">
      {/* Background Image with overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/roof-repairs.png"
          alt={`Professional roofing services in ${area.displayName}`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={85}
        />
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/30" />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 slate-pattern opacity-30" />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-2xl text-white">
          {/* Location badge */}
          <div className="inline-flex items-center gap-2 bg-copper/20 backdrop-blur-sm border border-copper/40 rounded-full px-4 py-2 mb-6 animate-fade-up">
            <MapPin className="h-4 w-4 text-copper" />
            <span className="text-sm font-semibold text-copper">{area.displayName}</span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-up" style={{ animationDelay: "100ms" }}>
            {heroHeadline}
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed animate-fade-up" style={{ animationDelay: "200ms" }}>
            {heroSubheadline}
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-3 mb-8 animate-fade-up" style={{ animationDelay: "300ms" }}>
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 hover:bg-white/15 transition-colors"
                >
                  <Icon className="h-4 w-4 text-copper" />
                  <span className="text-sm font-medium text-white">{badge.text}</span>
                </div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-up" style={{ animationDelay: "400ms" }}>
            <Button
              size="lg"
              className="bg-copper hover:bg-copper-500 text-white font-semibold text-lg px-8 py-7 shadow-copper hover:shadow-copper-lg transition-all duration-300 btn-shine"
              asChild
            >
              <a href="tel:08003162922" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Call 0800 316 2922
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 font-semibold text-lg px-8 py-7 backdrop-blur-sm transition-all duration-300"
              asChild
            >
              <a href="#contact">Get Free Quote</a>
            </Button>
          </div>

          {/* Location line */}
          <p className="text-white/70 animate-fade-up flex items-center gap-2" style={{ animationDelay: "500ms" }}>
            <MapPin className="h-4 w-4 text-copper" />
            Based in Maidstone, covering {area.displayName} and all of Kent
            <span className="mx-2 text-white/30">|</span>
            <Clock className="h-4 w-4 text-copper" />
            I answer 24/7
          </p>
        </div>
      </div>
    </section>
  );
}
