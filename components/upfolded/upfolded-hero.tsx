import { Check, Clock } from "lucide-react";
import { PhoneLink } from "@/components/phone-link";
import Image from "next/image";

interface UpfoldedHeroProps {
  locationName?: string;
}

export function UpfoldedHero({ locationName = "Kent" }: UpfoldedHeroProps) {
  const bullets = [
    "No call-out fee",
    "Fixed price guarantee",
    "25 years\u2019 experience",
  ];

  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch max-w-6xl mx-auto">
            {/* Left column - copy */}
            <div>
              {/* Hero image - mobile/tablet only */}
              <Image
                src="/images/hero-roofer.webp"
                alt="Professional roofer working on a roof"
                width={600}
                height={400}
                className="lg:hidden rounded-xl shadow-soft max-h-56 sm:max-h-64 w-full object-cover object-[center_20%] mb-5"
                priority
              />

              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                {/* Urgency badge */}
                <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-medium text-green-700">Available today</span>
                </div>

                {/* Eyebrow keyword badge for Google Ads quality score */}
                <span className="inline-flex items-center gap-2 bg-copper-50 border border-copper-200 text-copper-700 text-sm font-semibold px-4 py-1.5 rounded-full">
                  Trusted Roofers in {locationName}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-slate-900">
                Don&apos;t Let a Small Leak Become a{" "}
                <span className="text-copper">&pound;5,000 Problem</span>
              </h1>

              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Get a free, no-obligation quote from a local {locationName} roofer
                with 25 years&apos; experience
              </p>

              <ul className="space-y-4 mb-8" role="list">
                {bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-copper-50 flex items-center justify-center">
                      <Check className="h-4 w-4 text-copper" />
                    </span>
                    <span className="text-slate-700 font-medium">{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* Speed promise */}
              <div className="flex items-center gap-3 bg-slate-100 border border-slate-200 rounded-xl px-5 py-4 mb-6">
                <Clock className="h-5 w-5 text-copper flex-shrink-0" />
                <p className="text-slate-700 text-sm font-medium">
                  Get your quote in under 30 seconds
                </p>
              </div>

              {/* Primary CTA */}
              <a
                href="#quote-form"
                className="inline-flex items-center gap-2 bg-[#c2410c] hover:bg-[#c2410c]/90 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-copper transition-all btn-shine"
              >
                Get Your Free Quote
              </a>

              {/* Phone fallback */}
              <p className="text-slate-500 text-sm mt-3">
                or call{" "}
                <PhoneLink
                  className="text-orange-800 hover:text-orange-900 transition-colors font-semibold inline-flex items-center min-h-[44px]"
                  label="upfolded_hero_phone"
                >
                  0800 316 2922
                </PhoneLink>
              </p>
            </div>

            {/* Right column - hero image (desktop only) */}
            <div className="hidden lg:flex flex-col">
              <Image
                src="/images/hero-roofer.webp"
                alt="Professional roofer working on a roof"
                width={600}
                height={500}
                className="rounded-xl shadow-soft w-full h-full object-cover object-[center_20%]"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
