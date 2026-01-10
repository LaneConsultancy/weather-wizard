import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["700"] });

export function HeroSection() {
  return (
    <section className="relative min-h-[600px] flex items-center">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/roof-repairs.png"
          alt="Professional roofing services in Kent"
          fill
          className="object-cover brightness-75"
          priority
          sizes="100vw"
          quality={85}
        />
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-navy/40" />
      </div>
      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-2xl text-white">
          <h1 className={`${cinzel.className} text-5xl md:text-6xl font-bold mb-6 leading-tight`}>
            Expert Roofing Services in Kent
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-white/90">
            Protecting Kent homes for over 25 years. Trusted local specialists in roof repairs, guttering, and all roofing services.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-3 mb-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
              <span className="text-sm font-semibold text-gold">✓ 2,000+ Homes Protected</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
              <span className="text-sm font-semibold text-gold">✓ Fully Insured</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
              <span className="text-sm font-semibold text-gold">✓ 25 Year Guarantee</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
              <span className="text-sm font-semibold text-gold">✓ Free No-Obligation Quotes</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button size="lg" className="bg-gold hover:bg-gold/90 text-navy font-bold text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all" asChild>
              <a href="tel:01622123456">
                <Phone className="mr-2 h-6 w-6" />
                Call 01622 123456 Now
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-navy font-bold text-lg px-8 py-6" asChild>
              <a href="#contact">
                Get Free Quote
              </a>
            </Button>
          </div>
          <p className="text-lg text-white/80">
            <span className="inline-block mr-2">📍</span>
            Serving Kent and surrounding areas • 24/7 Emergency Service Available
          </p>
        </div>
      </div>
    </section>
  );
}
