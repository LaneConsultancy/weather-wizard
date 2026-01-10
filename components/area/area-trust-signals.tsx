import { Clock, Shield, Award, CheckCircle2, Home } from "lucide-react";
import { Area } from "@/lib/areas";

interface AreaTrustSignalsProps {
  area: Area;
  homesProtected: string;
}

export function AreaTrustSignals({ area, homesProtected }: AreaTrustSignalsProps) {
  const signals = [
    {
      icon: Home,
      title: homesProtected,
      description: `Homes protected in ${area.name}`
    },
    {
      icon: Award,
      title: "25+ Years Experience",
      description: "Trusted local experts"
    },
    {
      icon: Shield,
      title: "Fully Insured & Certified",
      description: "Complete peace of mind"
    },
    {
      icon: CheckCircle2,
      title: "Free No-Obligation Quotes",
      description: "Transparent pricing"
    }
  ];

  return (
    <section className="bg-navy-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {signals.map((signal, index) => {
            const Icon = signal.icon;
            return (
              <div key={index} className="text-center">
                <Icon className="w-12 h-12 mx-auto mb-4 text-gold" />
                <h3 className="font-bold text-lg mb-2 text-navy">{signal.title}</h3>
                <p className="text-navy/70">{signal.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
