"use client";

import { useEffect } from "react";
import { Phone, FileText, Clock, Shield } from "lucide-react";

export function QuoteFormSection() {
  useEffect(() => {
    // Load Tally embeds after component mounts
    if (typeof window !== "undefined" && (window as any).Tally) {
      (window as any).Tally.loadEmbeds();
    }
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-copper/10 border border-copper/20 rounded-full px-4 py-2 mb-4">
              <FileText className="h-4 w-4 text-copper" />
              <span className="text-sm font-semibold text-copper tracking-wide uppercase">
                Free Quote
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Ready to Get Your Roof Sorted?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Tell me about your roofing needs and I&apos;ll get back to you with an honest assessment and a fixed price.
            </p>
          </div>

          {/* Trust Signals Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm border border-slate-100">
              <div className="p-2 bg-copper/10 rounded-lg">
                <Clock className="h-5 w-5 text-copper" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Quick Response</p>
                <p className="text-xs text-slate-600">Within 2 hours</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm border border-slate-100">
              <div className="p-2 bg-copper/10 rounded-lg">
                <Shield className="h-5 w-5 text-copper" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Fixed Pricing</p>
                <p className="text-xs text-slate-600">No hidden charges</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm border border-slate-100">
              <div className="p-2 bg-copper/10 rounded-lg">
                <Phone className="h-5 w-5 text-copper" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Direct Contact</p>
                <p className="text-xs text-slate-600">I answer my phone</p>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8">
            {/* Tally Form Embed */}
            <div className="rounded-lg">
              <iframe
                data-tally-src="https://tally.so/embed/npqGpV?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                loading="lazy"
                width="100%"
                height="450"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title="Get Your Free Roofing Quote"
                className="rounded-lg"
              ></iframe>
            </div>

            {/* Or call directly */}
            <div className="pt-6 mt-6 border-t border-slate-200">
              <p className="text-slate-600 text-sm mb-3 text-center">Prefer to speak directly?</p>
              <div className="flex justify-center">
                <a
                  href="tel:08003162922"
                  className="inline-flex items-center gap-2 text-copper hover:text-copper-600 transition-colors font-semibold text-lg group"
                >
                  <Phone className="h-5 w-5 group-hover:animate-bounce" />
                  0800 316 2922
                </a>
              </div>
            </div>

            {/* Checkatrade Badge */}
            <div className="pt-6 mt-6 border-t border-slate-200">
              <div className="flex justify-center">
                <a
                  href="https://www.checkatrade.com/trades/nobleroofingandgutterrepairs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 group hover:opacity-80 transition-opacity"
                >
                  <div className="flex -space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                  </div>
                  <span className="text-slate-700 text-sm">
                    <span className="font-semibold text-slate-900">10/10</span> on Checkatrade
                    <span className="text-slate-500 ml-1">(58 reviews)</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
