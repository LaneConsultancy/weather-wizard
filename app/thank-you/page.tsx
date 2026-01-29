import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Phone, ArrowLeft } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GoogleAdsConversion } from "@/components/google-ads-conversion";

export const metadata: Metadata = {
  title: "Thank You | Weather Wizard",
  description: "Thank you for contacting Weather Wizard. We'll be in touch soon.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function ThankYouPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Google Ads Conversion Tracking */}
      <GoogleAdsConversion
        conversionLabel="Lx0ZCNmdzO4bEIz3ucdA"
        conversionValue={50}
        currency="GBP"
      />

      {/* Header */}
      <Header />

      {/* Thank You Content */}
      <section className="relative flex-1 flex items-center justify-center py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 slate-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-copper/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-copper/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="mb-8 flex justify-center animate-scale-in">
              <div className="relative">
                <div className="absolute inset-0 bg-copper/20 rounded-full blur-xl" />
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-copper/30 to-copper/10 border-2 border-copper/50">
                  <CheckCircle className="w-14 h-14 text-copper" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* Heading */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-up">
              We&apos;ve Got Your Details
            </h1>

            {/* Message */}
            <div className="space-y-4 mb-10 text-lg md:text-xl text-white/80 animate-fade-up [animation-delay:100ms]">
              <p>
                Thanks for getting in touch. I&apos;ll give you a call back within the next <span className="font-semibold text-white">2 hours</span> (during business hours).
              </p>
              <p>
                If you need to speak to me sooner, just give me a ring directly.
              </p>
            </div>

            {/* Phone Number CTA */}
            <div className="mb-12 animate-fade-up [animation-delay:200ms]">
              <a
                href="tel:08003162922"
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-copper to-copper/90 hover:from-copper/90 hover:to-copper text-white font-semibold px-8 py-4 rounded-lg shadow-copper hover:shadow-copper-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <Phone className="w-5 h-5 group-hover:animate-pulse" />
                <span className="text-lg">0800 316 2922</span>
              </a>
            </div>

            {/* Back to Home Link */}
            <div className="animate-fade-up [animation-delay:300ms]">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                <span>Back to Homepage</span>
              </Link>
            </div>

            {/* Decorative accent line */}
            <div className="mt-12 max-w-md mx-auto">
              <div className="h-px bg-gradient-to-r from-transparent via-copper/30 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
