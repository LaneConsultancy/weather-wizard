"use client";

import { useEffect, useState } from "react";
import { Check, Phone, Star } from "lucide-react";
import { PhoneLink } from "@/components/phone-link";
import type { ServiceContent } from "@/lib/content/services";
import { useMetaLeadTracking } from "@/lib/use-meta-lead-tracking";

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
): string {
  const kw = keyword.toLowerCase();

  if (kw.includes("emergency") || kw.includes("urgent") || kw.includes("leak")) {
    return `${formatKeyword(keyword)}? We’ll Fix It Before It Gets Worse`;
  }

  if (kw.includes("repair") || kw.includes("fix") || kw.includes("replacement")) {
    return `${formatKeyword(keyword)}. Fixed Price. Guaranteed.`;
  }

  if (
    kw.includes("gutter") ||
    kw.includes("pigeon") ||
    kw.includes("bird") ||
    kw.includes("paint") ||
    kw.includes("fascia") ||
    kw.includes("soffit")
  ) {
    return `Need ${formatKeyword(keyword)}? Fixed Prices, No Call-Out Fee`;
  }

  if (locationName && locationName !== "Kent") {
    return service.areaHeroHeadline.replace("{area}", locationName);
  }

  return service.heroHeadline;
}

interface ServiceHeroProps {
  service: ServiceContent;
  locationName?: string;
}

export function ServiceHero({
  service,
  locationName = "Kent",
}: ServiceHeroProps) {
  useMetaLeadTracking();

  const defaultMain =
    locationName && locationName !== "Kent"
      ? service.areaHeroHeadline.replace("{area}", locationName)
      : service.heroHeadline;

  const [headlineMain, setHeadlineMain] = useState(defaultMain);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawKeyword = params.get("keyword");
    if (rawKeyword) {
      setHeadlineMain(buildServiceHeadline(rawKeyword, service, locationName));
    }
  }, [service, locationName]);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Tally) {
      (window as any).Tally.loadEmbeds();
    }

    const gclid = document.cookie.match(/(?:^|; )ww_gclid_js=([^;]*)/)?.[1];
    const msclkid = document.cookie.match(
      /(?:^|; )ww_msclkid_js=([^;]*)/
    )?.[1];
    const fbclid = document.cookie.match(/(?:^|; )ww_fbclid_js=([^;]*)/)?.[1];

    const tallyFrames = document.querySelectorAll<HTMLIFrameElement>(
      "iframe[data-tally-src]"
    );

    tallyFrames.forEach((frame) => {
      const src = frame.getAttribute("data-tally-src");
      if (!src) return;
      const url = new URL(src);
      if (gclid) url.searchParams.set("gclid", decodeURIComponent(gclid));
      if (msclkid) url.searchParams.set("msclkid", decodeURIComponent(msclkid));
      if (fbclid) url.searchParams.set("fbclid", decodeURIComponent(fbclid));
      frame.setAttribute("data-tally-src", url.toString());
    });

    if ((gclid || msclkid || fbclid) && (window as any).Tally) {
      (window as any).Tally.loadEmbeds();
    }
  }, []);

  const bullets = [
    "No call-out fee",
    "Fixed price guarantee",
    "25 years’ experience",
  ];

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 lg:pt-9 pb-5 sm:pb-7 lg:pb-9">
        <div className="bg-copper-500 rounded-3xl">
          <div className="px-6 py-14 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-12 lg:gap-16 items-start">
              {/* Left column — copy */}
              <div>
                {/* Slate chip with white pulse */}
                <div className="inline-flex items-center gap-2 bg-slate-900 rounded-full px-3.5 py-1.5 mb-8">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  <span className="text-xs font-semibold tracking-wider uppercase text-white">
                    Available today
                  </span>
                </div>

                {/* H1 */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-7 text-slate-900 text-balance">
                  {headlineMain}
                </h1>

                {/* Pull-quote testimonial */}
                <figure className="mb-10 max-w-md">
                  <div
                    className="flex items-center gap-0.5 mb-3"
                    aria-hidden="true"
                  >
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-slate-900 text-slate-900"
                      />
                    ))}
                  </div>
                  <blockquote className="text-lg sm:text-xl text-slate-900 leading-relaxed font-medium">
                    &ldquo;Polite, respectful, on time, tidy and a good price.
                    Fitted us in for an urgent repair.&rdquo;
                  </blockquote>
                  <figcaption className="mt-3 text-xs font-semibold text-slate-900/70 uppercase tracking-wider">
                    Verified Reviewer &middot; Checkatrade
                  </figcaption>
                </figure>

                {/* Bullets */}
                <ul className="space-y-4 mb-10" role="list">
                  {bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-3">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center">
                        <Check
                          className="h-3 w-3 text-white"
                          strokeWidth={3}
                        />
                      </span>
                      <span className="text-slate-900 font-medium">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Phone CTA */}
                <div className="flex flex-col gap-1.5 items-start">
                  <PhoneLink
                    className="inline-flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base sm:text-lg px-6 py-3.5 rounded-full transition-all"
                    label="service_hero_phone"
                  >
                    <Phone className="h-4 w-4" />
                    Call Jon on 0800 316 2922
                  </PhoneLink>
                  <p className="text-slate-900/70 text-xs ml-2">
                    Jon answers personally
                  </p>
                </div>
              </div>

              {/* Right column — quote form card */}
              <div id="quote-form" className="scroll-mt-20">
                <div className="bg-white rounded-2xl p-7 sm:p-8 shadow-soft-xl">
                  <h2 className="text-slate-900 font-bold text-2xl mb-1.5">
                    Get Your Free Quote
                  </h2>
                  <p className="text-slate-500 text-sm mb-6">
                    Under 30 seconds &middot; No spam &middot; No obligation
                  </p>

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

                  <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500">
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
      </div>
    </section>
  );
}
