"use client";

import { useEffect, useState } from "react";
import { Check, Phone } from "lucide-react";
import { PhoneLink } from "@/components/phone-link";
import Image from "next/image";
import type { ServiceContent } from "@/lib/content/services";

function formatKeyword(raw: string): string {
  return raw
    .replace(/\+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Builds a keyword-aware headline for the service hero.
 * Falls back to the service's own headline when no matching keyword is found.
 */
function buildServiceHeadline(
  keyword: string,
  service: ServiceContent,
  locationName: string
): { main: string; sub: string } {
  const kw = keyword.toLowerCase();

  // Emergency / urgent keywords → urgency + speed
  if (kw.includes("emergency") || kw.includes("urgent") || kw.includes("leak")) {
    return {
      main: `${formatKeyword(keyword)}? We'll Fix It Before It Gets Worse`,
      sub: "Fixed prices. No call-out fee. Same day response.",
    };
  }

  // Repair keywords → problem-solution
  if (kw.includes("repair") || kw.includes("fix") || kw.includes("replacement")) {
    return {
      main: `${formatKeyword(keyword)} \u2014 Done Right, Fixed Price, Guaranteed`,
      sub: "No call-out fee. No hidden costs. 25 years\u2019 experience.",
    };
  }

  // Service-specific keyword matches → use keyword as headline
  if (
    kw.includes("gutter") ||
    kw.includes("pigeon") ||
    kw.includes("bird") ||
    kw.includes("paint") ||
    kw.includes("fascia") ||
    kw.includes("soffit")
  ) {
    return {
      main: `Need ${formatKeyword(keyword)}? Fixed Prices, No Call-Out Fee`,
      sub: "Local experts. Fully insured. Get your free quote in 30 seconds.",
    };
  }

  // Keyword present but no specific match — fall back to service headline with location
  if (locationName && locationName !== "Kent") {
    return {
      main: service.areaHeroHeadline.replace("{area}", locationName),
      sub: service.areaHeroSubheadline.replace("{area}", locationName),
    };
  }

  return {
    main: service.heroHeadline,
    sub: service.heroSubheadline,
  };
}

interface ServiceHeroProps {
  service: ServiceContent;
  locationName?: string;
}

export function ServiceHero({ service, locationName = "Kent" }: ServiceHeroProps) {
  const defaultMain =
    locationName && locationName !== "Kent"
      ? service.areaHeroHeadline.replace("{area}", locationName)
      : service.heroHeadline;

  const defaultSub =
    locationName && locationName !== "Kent"
      ? service.areaHeroSubheadline.replace("{area}", locationName)
      : service.heroSubheadline;

  const [headlineMain, setHeadlineMain] = useState(defaultMain);
  const [headlineSub, setHeadlineSub] = useState(defaultSub);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawKeyword = params.get("keyword");
    if (rawKeyword) {
      const { main, sub } = buildServiceHeadline(rawKeyword, service, locationName);
      setHeadlineMain(main);
      setHeadlineSub(sub);
    }
  }, [service, locationName]);

  useEffect(() => {
    // Load Tally embeds after component mounts
    if (typeof window !== "undefined" && (window as any).Tally) {
      (window as any).Tally.loadEmbeds();
    }

    // Read click IDs from client-accessible cookies and append to Tally embed URL
    const gclid = document.cookie.match(/(?:^|; )ww_gclid_js=([^;]*)/)?.[1];
    const msclkid = document.cookie.match(
      /(?:^|; )ww_msclkid_js=([^;]*)/
    )?.[1];

    const tallyFrames = document.querySelectorAll<HTMLIFrameElement>(
      "iframe[data-tally-src]"
    );

    tallyFrames.forEach((frame) => {
      const src = frame.getAttribute("data-tally-src");
      if (!src) return;

      const url = new URL(src);
      if (gclid) url.searchParams.set("gclid", decodeURIComponent(gclid));
      if (msclkid) url.searchParams.set("msclkid", decodeURIComponent(msclkid));

      frame.setAttribute("data-tally-src", url.toString());
    });

    // Reload Tally embeds to pick up the updated URL
    if ((gclid || msclkid) && (window as any).Tally) {
      (window as any).Tally.loadEmbeds();
    }
  }, []);

  const bullets = [
    "No call-out fee",
    "Fixed price guarantee",
    "25 years\u2019 experience",
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Desktop background image */}
      <Image
        src={service.image}
        alt={`${service.name} services by Weather Wizard`}
        fill
        className="hidden lg:block object-cover object-[center_20%]"
        sizes="100vw"
        priority
      />
      {/* Desktop gradient overlay — navy left, fades to transparent right */}
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#1a2e42] via-[#1a2e42]/90 to-transparent z-[1]" />

      {/* Mobile: cream background for copy area */}
      <div className="lg:hidden absolute inset-0 bg-cream" />

      <div className="relative z-[2] py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start max-w-6xl mx-auto">
            {/* Left column - copy */}
            <div>
              {/* Hero image - mobile/tablet only */}
              <Image
                src={service.image}
                alt={`${service.name} services by Weather Wizard`}
                width={600}
                height={300}
                className="lg:hidden rounded-xl shadow-soft h-56 w-full object-cover object-[center_20%] mb-5"
                priority
              />

              {/* Available today badge */}
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 lg:bg-green-500/20 lg:border-green-500/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-medium text-green-700 lg:text-green-400">Available today</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3 text-slate-900 lg:text-white">
                {headlineMain}
              </h1>
              <p className="text-lg sm:text-xl text-copper font-semibold mb-6">
                {headlineSub}
              </p>

              {/* Bullet points */}
              <ul className="space-y-4 mb-8" role="list">
                {bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-copper-50 flex items-center justify-center lg:bg-copper/20">
                      <Check className="h-4 w-4 text-copper" />
                    </span>
                    <span className="text-slate-700 font-medium lg:text-white/90">{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* Primary CTA - desktop only (form is right column on desktop) */}
              <div className="hidden lg:flex flex-wrap items-center gap-3">
                <a
                  href="#quote-form"
                  className="inline-flex items-center gap-2 bg-[#c2410c] hover:bg-[#c2410c]/90 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-copper transition-all btn-shine"
                >
                  Get Your Free Quote
                </a>
                <div className="flex flex-col gap-0.5">
                  <PhoneLink
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-lg px-6 py-3.5 rounded-xl transition-all"
                    label="service_hero_phone"
                  >
                    <Phone className="h-5 w-5" />
                    Call Jon &mdash; 0800 316 2922
                  </PhoneLink>
                  <p className="text-white/60 text-xs pl-1">Jon answers personally</p>
                </div>
              </div>

              {/* Mobile CTAs */}
              <div className="lg:hidden flex flex-wrap items-center gap-3 mt-2">
                <a
                  href="#quote-form"
                  className="inline-flex items-center gap-2 bg-[#c2410c] hover:bg-[#c2410c]/90 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-copper transition-all btn-shine"
                >
                  Get Your Free Quote
                </a>
                <div className="flex flex-col gap-0.5">
                  <PhoneLink
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-lg px-6 py-3.5 rounded-xl shadow-md transition-all"
                    label="service_hero_phone_mobile"
                  >
                    <Phone className="h-5 w-5" />
                    Call Jon &mdash; 0800 316 2922
                  </PhoneLink>
                  <p className="text-slate-500 text-xs pl-1">Jon answers personally</p>
                </div>
              </div>
            </div>

            {/* Right column - quote form card */}
            <div id="quote-form" className="scroll-mt-20">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft-lg">
                <h2 className="text-slate-900 font-semibold text-xl mb-1 text-center">
                  Get Your Free Quote
                </h2>
                <p className="text-slate-500 text-sm text-center mb-5">
                  Under 30 seconds &middot; No spam &middot; No obligation
                </p>

                {/* Tally Form Embed */}
                <div className="rounded-lg">
                  <iframe
                    data-tally-src="https://tally.so/embed/VL5e5l?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                    loading="eager"
                    width="100%"
                    height="300"
                    style={{ border: 0, margin: 0 }}
                    title="Weather Wizard service page quote form."
                    className="rounded-lg"
                  ></iframe>
                </div>

                {/* Risk reversal checks below form */}
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-5 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-copper" />
                    No obligation
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-copper" />
                    No call-out fee
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-copper" />
                    Fixed price
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
