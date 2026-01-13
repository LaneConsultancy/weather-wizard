"use client";

import { Shield, Wrench, MapPin, Phone } from "lucide-react";

export function TrustSignals() {
  const signals = [
    {
      icon: Wrench,
      stat: "25+",
      title: "Years in the Trade",
      description: "I've fixed every type of roof Kent has",
    },
    {
      icon: Shield,
      stat: "Fully",
      title: "Insured",
      description: "Public liability — you're covered",
    },
    {
      icon: MapPin,
      stat: "Kent",
      title: "Based in Maidstone",
      description: "Local roofer, not a call centre",
    },
    {
      icon: Phone,
      stat: "24/7",
      title: "I Answer",
      description: "Call any time — I pick up",
    },
  ];

  return (
    <section className="relative bg-cream py-16 md:py-20 overflow-hidden">
      {/* Top gradient for smooth transition from hero */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-900/40 to-transparent" />

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 via-transparent to-copper-50/30" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block text-copper font-semibold text-sm tracking-wider uppercase mb-3">
            Why Call Me
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            A Roofer You Can Actually Reach
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            25 years in the trade. Based in Maidstone. I answer my own phone,
            turn up when I say I will, and give you a fixed price before any work starts.
          </p>
        </div>

        {/* Trust signal cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {signals.map((signal, index) => {
            const Icon = signal.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 border border-slate-100"
              >
                {/* Icon container with gradient background */}
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-copper/10 to-copper/5 group-hover:from-copper/20 group-hover:to-copper/10 transition-colors duration-300">
                    <Icon className="w-7 h-7 text-copper" />
                  </div>
                </div>

                {/* Stat number */}
                <div className="mb-2">
                  <span className="text-3xl font-bold text-slate-900 tracking-tight">
                    {signal.stat}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-lg text-slate-800 mb-2">
                  {signal.title}
                </h3>

                {/* Description */}
                <p className="text-slate-500 text-sm leading-relaxed">
                  {signal.description}
                </p>

                {/* Decorative accent line */}
                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-copper/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
