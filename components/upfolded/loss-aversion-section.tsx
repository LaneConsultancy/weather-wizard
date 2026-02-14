import { AlertTriangle, TrendingUp, XCircle } from "lucide-react";

interface LossAversionSectionProps {
  locationName?: string;
}

const stages = [
  {
    icon: AlertTriangle,
    timeline: "Week 1",
    title: "A Small Leak Starts",
    description:
      "Water finds its way in through a cracked tile or damaged flashing. You might not even notice it yet. A simple repair at this stage costs around \u00a3150\u2013\u00a3300.",
    borderColor: "border-[#5ba8a0]",
    iconBg: "bg-[#5ba8a0]/10",
    iconColor: "text-[#5ba8a0]",
    badgeBg: "bg-[#5ba8a0]/10 text-[#2d6b64]",
    costRange: "\u00a3150\u2013\u00a3300",
  },
  {
    icon: TrendingUp,
    timeline: "Month 1",
    title: "The Rot Sets In",
    description:
      "Water seeps into timbers and insulation. Damp patches appear on your ceiling. The repair bill has already doubled to \u00a3500\u2013\u00a31,500.",
    borderColor: "border-copper",
    iconBg: "bg-copper/10",
    iconColor: "text-copper",
    badgeBg: "bg-copper/10 text-[#9a3412]",
    costRange: "\u00a3500\u2013\u00a31,500",
  },
  {
    icon: XCircle,
    timeline: "Month 6",
    title: "Structural Damage",
    description:
      "Joists weaken. Mould spreads. What started as a \u00a3300 fix is now a \u00a33,000\u2013\u00a35,000 problem. Don\u2019t let it get to this point.",
    borderColor: "border-rust",
    iconBg: "bg-rust/10",
    iconColor: "text-rust",
    badgeBg: "bg-rust/10 text-[#7f1d1d]",
    costRange: "\u00a33,000\u2013\u00a35,000",
  },
];

export function LossAversionSection({ locationName = "Kent" }: LossAversionSectionProps) {
  return (
    <section className="bg-cream py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section heading */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              A Low-Cost Fix Today Saves Thousands Later
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Most roof problems in {locationName} start small and cheap to fix.
              Leave them, and the cost climbs fast. Here&apos;s the real timeline.
            </p>
          </div>

          {/* Timeline cards */}
          <div className="relative">
            {/* Vertical connector line - desktop only */}
            <div
              className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#5ba8a0] via-copper to-rust"
              aria-hidden="true"
            />

            <div className="space-y-6 md:space-y-8">
              {stages.map((stage, index) => (
                <div key={stage.timeline} className="relative">
                  {/* Timeline dot - desktop */}
                  <div
                    className={`hidden md:flex absolute left-1/2 -translate-x-1/2 top-8 w-4 h-4 rounded-full ${stage.iconBg} border-2 ${stage.borderColor} z-10`}
                    aria-hidden="true"
                  />

                  {/* Card */}
                  <div
                    className={`relative bg-white rounded-xl border-l-4 ${stage.borderColor} shadow-soft p-6 md:p-8 md:w-[calc(50%-2rem)] ${
                      index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                    }`}
                  >
                    {/* Timeline badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider rounded-full px-3 py-1 mb-4 ${stage.badgeBg}`}
                    >
                      {stage.timeline}
                    </span>

                    <div className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 p-2.5 rounded-lg ${stage.iconBg}`}
                      >
                        <stage.icon className={`h-6 w-6 ${stage.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                          {stage.title}
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-sm">
                          {stage.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
