import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone, Shield, Award, Zap, Users } from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { TrustSignals } from "@/components/trust-signals";
import { ServicesSection } from "@/components/services-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { getAllAreas } from "@/lib/areas";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["700"] });

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-navy text-white py-4 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image
                src="/weather-wizard-logo-no-bg.png"
                alt="Weather Wizard Logo"
                width={80}
                height={80}
                className="w-20 h-20"
              />
              <div className="flex flex-col">
                <span className={`${cinzel.className} text-2xl text-gold tracking-wide`}>
                  Weather Wizard
                </span>
                <span className="text-xs text-white/80 italic">
                  We Weather Every Storm
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#services" className="text-white/90 hover:text-gold transition-colors">Services</a>
              <a href="#about" className="text-white/90 hover:text-gold transition-colors">About</a>
              <a href="#testimonials" className="text-white/90 hover:text-gold transition-colors">Reviews</a>
              <a href="#contact" className="text-white/90 hover:text-gold transition-colors">Contact</a>
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex flex-col items-end mr-2">
                <span className="text-xs text-teal font-semibold">24/7 Emergency Response</span>
                <span className="text-sm text-white/80">Call: 01622 123456</span>
              </div>
              <Button size="lg" className="bg-gold hover:bg-gold/90 text-navy font-bold" asChild>
                <a href="tel:01622123456">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Trust Signals Bar */}
      <TrustSignals />

      {/* Services Section */}
      <ServicesSection />

      {/* Why Choose Weather Wizard Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-navy to-navy-700 text-white relative overflow-hidden">
        {/* Subtle roof tile texture overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(255, 255, 255, 0.1) 12px, rgba(255, 255, 255, 0.1) 13px), repeating-linear-gradient(-45deg, transparent, transparent 12px, rgba(255, 255, 255, 0.1) 12px, rgba(255, 255, 255, 0.1) 13px)'}} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className={`${cinzel.className} text-4xl md:text-5xl font-bold mb-4`}>
              Why Choose Weather Wizard?
            </h2>
            <p className="text-xl text-white/90 mb-2">
              We Weather Every Storm
            </p>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Your trusted wizards of weatherproofing, protecting Kent homes for over 25 years
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gold/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-gold" />
              </div>
              <h3 className={`${cinzel.className} font-bold text-xl mb-3`}>Quality Workmanship</h3>
              <p className="text-white/80">
                Every job completed to the highest standards with premium materials and expert craftsmanship.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gold/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-gold" />
              </div>
              <h3 className={`${cinzel.className} font-bold text-xl mb-3`}>Guaranteed Results</h3>
              <p className="text-white/80">
                Comprehensive guarantees on all work. We stand behind our service with full insurance and certification.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gold/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-gold" />
              </div>
              <h3 className={`${cinzel.className} font-bold text-xl mb-3`}>Local Expertise</h3>
              <p className="text-white/80">
                Family-run Kent business with deep local knowledge. We understand Kent weather and Kent homes.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gold/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-10 h-10 text-gold" />
              </div>
              <h3 className={`${cinzel.className} font-bold text-xl mb-3`}>Emergency Service</h3>
              <p className="text-white/80">
                24/7 emergency repairs available. When disaster strikes, we respond fast to protect your property.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Service Areas Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`${cinzel.className} text-4xl md:text-5xl font-bold text-navy mb-4`}>
              Proudly Serving Kent
            </h2>
            <p className="text-xl text-navy/70">
              Your local roofing experts across Kent and surrounding areas
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
              {getAllAreas().slice(0, 15).map((area) => (
                <Link
                  key={area.slug}
                  href={`/${area.slug}`}
                  className="bg-navy-50 rounded-lg py-4 px-3 hover:bg-gold/10 hover:shadow-md transition-all block"
                >
                  <p className="font-semibold text-navy">{area.name}</p>
                </Link>
              ))}
            </div>
            <p className="text-center mt-8 text-navy/60">
              ...and many more areas across Kent. Click an area to learn more about our services in your location.
            </p>
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
