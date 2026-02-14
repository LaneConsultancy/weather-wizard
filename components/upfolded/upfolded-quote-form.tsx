"use client";

import { useEffect } from "react";
import { Check, Clock, Phone } from "lucide-react";
import { PhoneLink } from "@/components/phone-link";

interface UpfoldedQuoteFormProps {
  locationName?: string;
}

export function UpfoldedQuoteForm({
  locationName = "Kent",
}: UpfoldedQuoteFormProps) {
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

  return (
    <section id="quote-form" className="bg-white py-12 md:py-16 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto">
          {/* Form card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-soft-lg">
            {/* Form heading */}
            <h2 className="text-slate-900 font-semibold text-xl mb-1 text-center">
              Get Your Free Quote
            </h2>
            <p className="text-slate-500 text-sm text-center mb-5">
              Takes 30 seconds. No spam. No obligation.
            </p>

            {/* Tally Form Embed */}
            <div className="rounded-lg">
              <iframe
                data-tally-src="https://tally.so/embed/VL5e5l?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                loading="lazy"
                width="100%"
                height="177"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title="Weather Wizards landing page quote form on a light background."
                className="rounded-lg"
              ></iframe>
            </div>
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

          {/* Speed promise */}
          <div className="flex items-center justify-center gap-3 bg-slate-100 border border-slate-200 rounded-xl px-5 py-4 mt-5">
            <Clock className="h-5 w-5 text-copper flex-shrink-0" />
            <p className="text-slate-700 text-sm font-medium">
              Get your quote in under 30 seconds
            </p>
          </div>

          {/* Phone fallback */}
          <div className="mt-5 text-center">
            <p className="text-slate-500 text-sm mb-1">Prefer to call?</p>
            <PhoneLink
              className="inline-flex items-center gap-2 text-orange-800 hover:text-orange-900 transition-colors font-semibold text-lg min-h-[44px] py-2"
              label="upfolded_form_phone"
            >
              <Phone className="h-5 w-5" />
              0800 316 2922
            </PhoneLink>
          </div>
        </div>
      </div>
    </section>
  );
}
