"use client";

import { Button } from "@/components/ui/button";
import { Phone, Clock, Shield, Wrench } from "lucide-react";

export function CTASection() {
  const trustPoints = [
    { icon: Wrench, text: "25 Years' Experience" },
    { icon: Shield, text: "Public Liability Insured" },
    { icon: Clock, text: "Fast Response" },
  ];

  return (
    <section id="contact" className="relative py-20 md:py-28 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

      {/* Decorative elements */}
      <div className="absolute inset-0 slate-pattern opacity-30" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-copper/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-copper/5 rounded-full blur-3xl translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow */}
          <span className="inline-block text-copper font-semibold text-sm tracking-wider uppercase mb-4">
            Give Me a Call
          </span>

          {/* Headline */}
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Let&apos;s Get Your{" "}
            <span className="text-copper">Roof Sorted</span>
          </h2>

          {/* Subheadline - Explain what happens */}
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            When you call, you&apos;ll speak to me directly — not a call centre.
            Tell me what&apos;s wrong and I&apos;ll give you an honest idea of what to expect.
            Usually I can get out to you within 48 hours.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <Button
              size="lg"
              className="bg-copper hover:bg-copper-500 text-white font-semibold text-lg px-10 py-7 shadow-copper hover:shadow-copper-lg transition-all duration-300 btn-shine"
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
              className="border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 font-semibold text-lg px-10 py-7 backdrop-blur-sm transition-all duration-300"
              asChild
            >
              <a href="#services">View Services</a>
            </Button>
          </div>

          {/* Emergency callout */}
          <div className="inline-flex items-center gap-2 bg-rust/20 border border-rust/30 text-rust-200 rounded-full px-5 py-2.5 mb-10">
            <Clock className="h-4 w-4 text-rust-300" />
            <span className="text-sm font-medium">
              Emergency? I answer 24/7
            </span>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {trustPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 text-white/70"
                >
                  <div className="p-1.5 rounded-md bg-copper/20">
                    <Icon className="h-4 w-4 text-copper" />
                  </div>
                  <span className="text-sm font-medium">{point.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
