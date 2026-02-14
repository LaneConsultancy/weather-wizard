import { Star, MessageSquare, Wrench, Shield } from "lucide-react";

interface TrustBarProps {
  locationName?: string;
}

const stats = [
  {
    icon: Star,
    value: "10/10",
    label: "on Checkatrade",
    showStars: true,
  },
  {
    icon: MessageSquare,
    value: "58",
    label: "Verified Reviews",
    showStars: false,
  },
  {
    icon: Wrench,
    value: "25+",
    label: "Years\u2019 Experience",
    showStars: false,
  },
  {
    icon: Shield,
    value: "Fully",
    label: "Insured",
    showStars: false,
  },
];

export function TrustBar({ locationName = "Kent" }: TrustBarProps) {
  return (
    <section className="bg-slate-800 py-8 md:py-10 border-y border-white/10">
      <div className="container mx-auto px-4">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto mb-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center gap-2"
            >
              <div className="p-3 bg-copper/10 rounded-xl">
                <stat.icon className="h-6 w-6 text-copper" />
              </div>
              <div>
                <p className="text-white font-bold text-2xl md:text-3xl leading-tight">
                  {stat.value}
                </p>
                {stat.showStars && (
                  <div className="flex items-center justify-center gap-0.5 my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-copper fill-copper"
                      />
                    ))}
                  </div>
                )}
                <p className="text-white/60 text-sm font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust line - uses text-copper-200 (NOT text-copper-300 which is undefined) */}
        <p className="text-center text-copper-200 font-semibold text-lg md:text-xl max-w-2xl mx-auto">
          Trusted by homeowners across {locationName} for over 25 years
        </p>
      </div>
    </section>
  );
}
