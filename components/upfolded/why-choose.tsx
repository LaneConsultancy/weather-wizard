import Image from "next/image";
import {
  Hammer,
  Phone,
  BadgePoundSterling,
  Receipt,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  heading: string;
  body: string;
}

const features: Feature[] = [
  {
    icon: Hammer,
    heading: "25 Years’ Experience",
    body: "Pitched, flat, tiled, slate. There isn’t a Kent roof I haven’t fixed in two and a half decades.",
  },
  {
    icon: Phone,
    heading: "Jon Answers Personally",
    body: "Call the number and you get me, not a call centre. Same number, every job, every time.",
  },
  {
    icon: BadgePoundSterling,
    heading: "No Call-Out Fee",
    body: "I’ll come out, look at the job, and quote you a fixed price. No fee for the visit, no obligation to book.",
  },
  {
    icon: Receipt,
    heading: "Fixed Price Guarantee",
    body: "Written quote up front. The number you agree is the number you pay. No surprise extras halfway through the job.",
  },
  {
    icon: ShieldCheck,
    heading: "Fully Insured",
    body: "Full public liability cover. If anything goes wrong (it won’t), you’re protected. Paperwork on request.",
  },
  {
    icon: MapPin,
    heading: "Local to Kent",
    body: "Based in Maidstone. Half an hour to most of Kent. I’m not going anywhere, so you’ll find me when you need me.",
  },
];

export function WhyChoose() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section header — photo + text two-column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center mb-14 md:mb-20">
          {/* Photo column */}
          <div className="relative aspect-[4/5] w-full max-w-md mx-auto md:max-w-none rounded-3xl overflow-hidden bg-slate-100 ring-1 ring-slate-200">
            <Image
              src="/images/hero-roofer.webp"
              alt="Jon, Weather Wizard"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>

          {/* Text column */}
          <div className="text-center md:text-left">
            <span className="inline-block bg-copper-50 text-copper-700 font-semibold text-xs uppercase tracking-widest rounded-full px-4 py-1.5 mb-5">
              Why us
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-5 text-balance tracking-tight">
              Why Choose Weather Wizard
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Straight talk, fixed prices, and a roofer who picks up the phone.
            </p>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.heading}
              className="rounded-2xl border border-slate-200 p-6 bg-white transition-all duration-200 hover:border-copper/30 hover:shadow-soft-lg"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-copper-50 rounded-xl flex items-center justify-center mb-4 flex-shrink-0">
                <feature.icon className="h-6 w-6 text-copper-600" aria-hidden="true" />
              </div>

              {/* Text */}
              <h3 className="font-semibold text-lg text-slate-900 mb-2 leading-snug">
                {feature.heading}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
