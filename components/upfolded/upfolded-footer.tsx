import Image from "next/image";
import Link from "next/link";
import { Phone, Clock, MapPin } from "lucide-react";
import { PhoneLink } from "@/components/phone-link";
import { getAllAreas } from "@/lib/areas";
import {
  SITE_NAME,
  CONTACT_PHONE_DISPLAY,
  BUSINESS_LOCATION,
} from "@/lib/config";

const SERVICES = [
  { label: "Guttering", href: "/guttering" },
  { label: "Exterior Painting", href: "/exterior-painting" },
  { label: "Bird Proofing", href: "/bird-proofing" },
] as const;

export function UpfoldedFooter() {
  const areas = getAllAreas();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-white/10">
      {/* Main footer grid */}
      <div className="container mx-auto px-4 max-w-7xl py-12 md:py-16 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Column 1: Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/weather-wizard-logo-no-bg.png"
                alt={`${SITE_NAME} logo`}
                width={48}
                height={48}
                className="h-12 w-auto"
              />
              <span className="text-white font-semibold text-lg leading-tight">
                {SITE_NAME}
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Trusted Kent roofers. 25 years&rsquo; experience, no call-out
              fee, fixed prices.
            </p>
          </div>

          {/* Column 2: Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Contact
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <PhoneLink
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm min-h-[44px]"
                  label="upfolded_footer_phone"
                >
                  <Phone className="h-4 w-4 flex-shrink-0 text-white/50" />
                  {CONTACT_PHONE_DISPLAY}
                </PhoneLink>
              </li>
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <Clock className="h-4 w-4 flex-shrink-0 text-white/50" />
                Mon–Sat 8am–6pm
              </li>
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <MapPin className="h-4 w-4 flex-shrink-0 text-white/50" />
                Based in {BUSINESS_LOCATION.locality}, {BUSINESS_LOCATION.region}
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Services
            </h3>
            <ul className="flex flex-col gap-2">
              {SERVICES.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/70 hover:text-white transition-colors text-sm min-h-[44px] inline-flex items-center"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Areas */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
              Areas We Cover
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
              {areas.map((area) => (
                <li key={area.slug}>
                  <Link
                    href={`/${area.slug}`}
                    className="text-white/70 hover:text-white transition-colors text-xs min-h-[44px] inline-flex items-center"
                  >
                    {area.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-xs text-center sm:text-left">
            &copy; {currentYear} {SITE_NAME} Roofing &amp; Guttering. All
            rights reserved.
          </p>
          <nav
            aria-label="Legal"
            className="flex items-center gap-1 flex-wrap justify-center sm:justify-end"
          >
            <Link
              href="/privacy"
              className="text-white/50 hover:text-white transition-colors text-xs min-h-[44px] inline-flex items-center px-2"
            >
              Privacy Policy
            </Link>
            <span className="text-white/30 text-xs" aria-hidden="true">
              &middot;
            </span>
            <Link
              href="/cookies"
              className="text-white/50 hover:text-white transition-colors text-xs min-h-[44px] inline-flex items-center px-2"
            >
              Cookie Policy
            </Link>
            <span className="text-white/30 text-xs" aria-hidden="true">
              &middot;
            </span>
            <Link
              href="/contact"
              className="text-white/50 hover:text-white transition-colors text-xs min-h-[44px] inline-flex items-center px-2"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
