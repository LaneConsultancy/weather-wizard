import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin } from "lucide-react";
import { Cinzel } from "next/font/google";
import { getAllAreas } from "@/lib/areas";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["700"] });

export function Footer() {
  const currentYear = new Date().getFullYear();
  const areas = getAllAreas();

  const services = [
    "Roof Repairs",
    "Guttering Repairs",
    "Chimney Repairs",
    "Flat Roofing",
    "Fascias & Soffits",
    "Emergency Repairs"
  ];

  return (
    <footer id="contact" className="bg-navy text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
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
            <p className="text-white/80 mb-4">
              Kent's trusted roofing specialists for over 25 years. Expert repairs, installations, and emergency services.
            </p>
            <div className="flex items-start gap-2 mb-3">
              <Phone className="h-5 w-5 text-gold mt-1" />
              <div>
                <p className="font-bold text-gold text-lg">[PHONE]</p>
                <p className="text-sm text-white/70">Call us anytime</p>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-xl mb-4 text-gold">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index} className="text-white/80 hover:text-gold transition-colors">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="font-bold text-xl mb-4 text-gold flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Service Areas
            </h3>
            <p className="text-white/80 mb-3">Proudly serving Kent and surrounding areas:</p>
            <div className="grid grid-cols-2 gap-2">
              {areas.map((area) => (
                <Link
                  key={area.slug}
                  href={`/${area.slug}`}
                  className="text-sm text-white/70 hover:text-gold transition-colors"
                >
                  {area.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © {currentYear} Weather Wizard. All rights reserved.
            </p>
            <p className="text-white/60 text-sm">
              Fully insured & certified roofing specialists
            </p>
          </div>
          <p className="text-center text-white/50 text-sm mt-4">
            Contact form coming soon - Call us for immediate assistance
          </p>
        </div>
      </div>
    </footer>
  );
}
