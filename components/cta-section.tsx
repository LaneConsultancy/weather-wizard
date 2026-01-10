import { Button } from "@/components/ui/button";
import { Phone, Clock } from "lucide-react";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["700"] });

export function CTASection() {
  return (
    <section className="bg-navy py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className={`${cinzel.className} text-4xl md:text-5xl font-bold text-white mb-6`}>
          Ready to Protect Your Home?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Get your free, no-obligation quote today. Our expert team is standing by to help with all your roofing needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button size="lg" className="bg-gold hover:bg-gold/90 text-navy font-bold text-xl px-10 py-7" asChild>
            <a href="tel:+44-XXXX-XXXXXX">
              <Phone className="mr-2 h-6 w-6" />
              Call [PHONE] Today
            </a>
          </Button>
          <div className="flex items-center gap-2 text-white">
            <Clock className="h-5 w-5 text-gold" />
            <span className="text-lg">Emergency repairs available 24/7</span>
          </div>
        </div>
        <p className="text-white/70 text-lg">
          Free quotes • Fast response • Guaranteed workmanship
        </p>
      </div>
    </section>
  );
}
