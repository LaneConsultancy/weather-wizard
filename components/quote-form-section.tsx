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
    <section id="contact" className="py-16 md:py-24 bg-gradient-to-b from-[#1a2e42] to-[#0f1c2a]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-copper/20 border border-copper/30 rounded-full px-4 py-2 mb-4">
              <FileText className="h-4 w-4 text-copper" />
              <span className="text-sm font-semibold text-copper tracking-wide uppercase">
                Free Quote - No Obligation
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Ready to Get Your Roof Sorted?
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-6">
              Tell me about your roofing needs and I&apos;ll get back to you with an honest assessment and a fixed price.
            </p>

            {/* Urgency Badge */}
            <div className="inline-flex items-center gap-2 bg-teal/20 border border-teal/40 rounded-full px-4 py-2 animate-pulse">
              <Clock className="h-4 w-4 text-teal" />
              <span className="text-sm font-semibold text-teal">
                Limited availability this week - Book now
              </span>
            </div>
          </div>

          {/* Enhanced Risk Reversal - Trust Signals */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="p-2 bg-copper/20 rounded-lg flex-shrink-0">
                <Clock className="h-5 w-5 text-copper" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Quote Within 24 Hours</p>
                <p className="text-xs text-white/70">Usually within 2 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="p-2 bg-copper/20 rounded-lg flex-shrink-0">
                <Shield className="h-5 w-5 text-copper" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">No Call-Out Fee</p>
                <p className="text-xs text-white/70">Free site visit</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="p-2 bg-copper/20 rounded-lg flex-shrink-0">
                <FileText className="h-5 w-5 text-copper" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">No Deposit Required</p>
                <p className="text-xs text-white/70">Pay when happy</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="p-2 bg-copper/20 rounded-lg flex-shrink-0">
                <Phone className="h-5 w-5 text-copper" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Fixed Price</p>
                <p className="text-xs text-white/70">No hidden costs</p>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 md:p-8 shadow-2xl">
            {/* Tally Form Embed */}
            <div className="rounded-lg">
              <iframe
                data-tally-src="https://tally.so/embed/npqGpV?hideTitle=1&transparentBackground=1&dynamicHeight=1"
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
            <div className="pt-6 mt-6 border-t border-white/20">
              <p className="text-white/70 text-sm mb-3 text-center">Prefer to speak directly?</p>
              <div className="flex justify-center">
                <a
                  href="tel:08003162922"
                  className="inline-flex items-center gap-2 text-copper hover:text-copper-400 transition-colors font-semibold text-lg group"
                >
                  <Phone className="h-5 w-5 group-hover:animate-bounce" />
                  0800 316 2922
                </a>
              </div>
            </div>

            {/* Prominent Checkatrade Badge */}
            <div className="pt-6 mt-6 border-t border-white/20">
              <div className="flex flex-col items-center gap-3">
                <p className="text-white/60 text-xs uppercase tracking-wide font-semibold">
                  Verified & Trusted
                </p>
                <a
                  href="https://www.checkatrade.com/trades/nobleroofingandgutterrepairs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group hover:scale-105 transition-transform"
                  aria-label="View our Checkatrade profile - 10 out of 10 rating with 58 reviews"
                >
                  <div className="bg-gradient-to-br from-copper/30 to-copper/10 border-2 border-copper/50 rounded-xl px-6 py-4 shadow-lg group-hover:shadow-copper/20 group-hover:shadow-xl transition-all">
                    <div className="flex items-center gap-4">
                      {/* Star Rating */}
                      <div className="flex -space-x-1" aria-hidden="true">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-7 h-7 text-yellow-400 fill-current drop-shadow-md"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      {/* Rating Text */}
                      <div className="text-left">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-white">10/10</span>
                          <span className="text-sm text-white/80">on Checkatrade</span>
                        </div>
                        <p className="text-xs text-white/70 mt-0.5">
                          Based on 58 verified reviews
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
