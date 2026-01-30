import { Clock, Shield, Wrench, MapPin, Phone } from "lucide-react";
import { Area } from "@/lib/areas";

interface AreaTrustSignalsProps {
  area: Area;
}

export function AreaTrustSignals({ area }: AreaTrustSignalsProps) {
  const signals = [
    {
      icon: Wrench,
      title: "25 Years' Experience",
      description: "I've seen every problem"
    },
    {
      icon: Shield,
      title: "Public Liability Insured",
      description: "You're covered"
    },
    {
      icon: MapPin,
      title: "Based in Maidstone",
      description: `Covering ${area.name}`
    },
    {
      icon: Phone,
      title: "I Answer the Phone",
      description: "Try me — 24/7"
    }
  ];

  return (
    <section className="relative py-12 bg-slate-900 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 slate-pattern opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800/50 to-slate-900" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {signals.map((signal, index) => {
            const Icon = signal.icon;
            return (
              <div
                key={index}
                className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50 hover:border-copper/30 transition-all duration-300 text-center"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-copper/20 to-copper/5 group-hover:from-copper/30 group-hover:to-copper/10 transition-colors duration-300 mb-3">
                  <Icon className="w-6 h-6 text-copper" />
                </div>

                {/* Title */}
                <h3 className="font-display text-xl font-bold text-white mb-1 group-hover:text-copper transition-colors duration-300">
                  {signal.title}
                </h3>

                {/* Description */}
                <p className="text-white/70 text-sm">
                  {signal.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
