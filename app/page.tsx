import Link from "next/link";
import { Shield, Wrench, MapPin, Phone } from "lucide-react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { TrustSignals } from "@/components/trust-signals";
import { ServicesSection } from "@/components/services-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { getAllAreas } from "@/lib/areas";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero Section with Integrated Form */}
      <HeroSection />

      {/* Trust Signals Bar */}
      <TrustSignals />

      {/* Services Section */}
      <ServicesSection />

      {/* Why Choose Weather Wizard Section */}
      <section id="about" className="relative py-20 md:py-28 bg-slate-900 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 slate-pattern opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-slate-900" />

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-copper/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-slate-700/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block text-copper font-semibold text-sm tracking-wider uppercase mb-3">
              Why Me
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              A Roofer You Can Actually Rely On
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              New company, not new to roofing. I&apos;ve spent 25 years learning what matters —
              and what doesn&apos;t. Here&apos;s what you&apos;re getting.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: Wrench,
                title: "25 Years' Experience",
                description: "I've fixed every type of roof Kent has to offer. Pitched, flat, tiled, slate — there's nothing I haven't seen."
              },
              {
                icon: Shield,
                title: "Public Liability Insured",
                description: "Full public liability insurance. If anything goes wrong (it won't), you're covered. Paperwork provided."
              },
              {
                icon: MapPin,
                title: "Based in Maidstone",
                description: "30 minutes to most of Kent. I'm local, I'm not going anywhere, and I'll be here when you need me."
              },
              {
                icon: Phone,
                title: "I Answer the Phone",
                description: "Call the number and you'll get me. Not a call centre, not a receptionist. Just the bloke who'll fix your roof."
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-copper/30 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Icon */}
                  <div className="mb-5">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-copper/20 to-copper/5 group-hover:from-copper/30 group-hover:to-copper/10 transition-colors duration-300">
                      <Icon className="w-7 h-7 text-copper" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-xl font-bold text-white mb-3 group-hover:text-copper transition-colors duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/60 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Decorative accent */}
                  <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-copper/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Service Areas Section */}
      <section className="relative py-20 md:py-28 bg-cream overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-copper/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-slate-200/50 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section header */}
          <div className="text-center mb-12">
            <span className="inline-block text-copper font-semibold text-sm tracking-wider uppercase mb-3">
              Coverage
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Proudly Serving Kent
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Your local roofing experts across Kent and surrounding areas. Click an area to learn more about our services in your location.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Areas grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {getAllAreas().slice(0, 15).map((area) => (
                <Link
                  key={area.slug}
                  href={`/${area.slug}`}
                  className="group relative bg-white rounded-lg py-4 px-4 shadow-soft hover:shadow-soft-lg border border-slate-100 hover:border-copper/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-copper/60 group-hover:text-copper transition-colors" />
                    <p className="font-semibold text-slate-800 group-hover:text-copper transition-colors text-sm">
                      {area.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* More areas indicator */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-soft border border-slate-100">
                <MapPin className="w-4 h-4 text-copper" />
                <span className="text-slate-600 text-sm">
                  Plus <span className="font-semibold text-slate-900">{getAllAreas().length - 15}+ more areas</span> across Kent
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
