"use client";

import { useEffect } from "react";
import { Phone, FileText } from "lucide-react";
import { PhoneLink } from "@/components/phone-link";

interface TallyFormProps {
  variant?: "default" | "compact";
}

export function TallyForm({ variant = "default" }: TallyFormProps) {
  useEffect(() => {
    // Load Tally embeds after component mounts
    if (typeof window !== "undefined" && (window as any).Tally) {
      (window as any).Tally.loadEmbeds();
    }

    // Read click IDs from client-accessible cookies and append to Tally embed URL
    const gclid = document.cookie.match(/(?:^|; )ww_gclid_js=([^;]*)/)?.[1];
    const msclkid = document.cookie.match(/(?:^|; )ww_msclkid_js=([^;]*)/)?.[1];

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

  const isCompact = variant === "compact";

  return (
    <section className="relative py-8 md:py-12 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Card Container */}
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-copper/20 overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-copper/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-slate-700/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            {/* Content */}
            <div className="relative z-10 p-6 md:p-10">
              <div className="grid md:grid-cols-5 gap-8 items-start">
                {/* Left Side - Headline & Description */}
                <div className="md:col-span-2 space-y-4">
                  <div className="inline-flex items-center gap-2 bg-copper/20 border border-copper/30 rounded-full px-4 py-1.5 mb-2">
                    <FileText className="h-3.5 w-3.5 text-copper" />
                    <span className="text-xs font-semibold text-copper tracking-wide uppercase">
                      Free Quote
                    </span>
                  </div>

                  <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight">
                    Get Your Free,
                    <span className="block text-copper">No-Obligation Quote</span>
                  </h2>

                  <p className="text-white/70 text-base leading-relaxed">
                    Tell me about your roofing needs and I&apos;ll get back to you with an honest assessment and fixed price. No pushy sales tactics, just straight answers.
                  </p>

                  {/* Trust Elements */}
                  <div className="space-y-3 pt-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-copper/20 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-copper" />
                      </div>
                      <p className="text-white/70 text-sm">Response within 2 hours during business hours</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-copper/20 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-copper" />
                      </div>
                      <p className="text-white/70 text-sm">Fixed prices, no hidden charges</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-copper/20 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-copper" />
                      </div>
                      <p className="text-white/70 text-sm">25 years&apos; experience you can trust</p>
                    </div>
                  </div>

                  {/* Or call directly */}
                  <div className="pt-6 mt-6 border-t border-white/10">
                    <p className="text-white/70 text-sm mb-2">Prefer to speak directly?</p>
                    <PhoneLink
                      className="inline-flex items-center gap-2 text-copper hover:text-copper-500 transition-colors font-semibold text-lg group"
                      label="form_phone"
                    >
                      <Phone className="h-5 w-5 group-hover:animate-bounce" />
                      0800 316 2922
                    </PhoneLink>
                  </div>
                </div>

                {/* Right Side - Tally Form */}
                <div className="md:col-span-3">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-1">
                    <iframe
                      data-tally-src="https://tally.so/embed/npqGpV?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                      loading="lazy"
                      width="100%"
                      height="400"
                      frameBorder="0"
                      marginHeight={0}
                      marginWidth={0}
                      title="Get Your Free Roofing Quote"
                      className="rounded-lg"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-copper to-transparent opacity-50" />
          </div>
        </div>
      </div>
    </section>
  );
}
