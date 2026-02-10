"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, Clock, ChevronRight, Cookie } from "lucide-react";
import { PhoneLink } from "@/components/phone-link";
import { getAllAreas } from "@/lib/areas";
import { CookieSettingsButton } from "@/components/cookie-consent-banner";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const areas = getAllAreas();

  // Show first 12 areas, then link to see all
  const displayedAreas = areas.slice(0, 12);
  const hasMoreAreas = areas.length > 12;

  const services = [
    { name: "Roof Repairs", href: "#services" },
    { name: "Guttering Repairs", href: "#services" },
    { name: "Chimney Repairs", href: "#services" },
    { name: "Flat Roofing", href: "#services" },
    { name: "Fascias & Soffits", href: "#services" },
    { name: "Emergency Repairs", href: "#services" },
  ];

  const quickLinks = [
    { name: "About Us", href: "#about" },
    { name: "Our Services", href: "#services" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact Us", href: "#contact" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Cookie Policy", href: "/cookies" },
  ];

  return (
    <footer className="relative bg-slate-950 text-white overflow-hidden">
      {/* Subtle top border accent */}
      <div className="h-1 bg-gradient-to-r from-transparent via-copper to-transparent" />

      {/* Background pattern */}
      <div className="absolute inset-0 slate-pattern opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 py-16">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <Image
                src="/weather-wizard-logo-no-bg.webp"
                alt="Weather Wizard Logo"
                width={56}
                height={56}
                className="w-14 h-14 transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-display text-xl text-copper tracking-wide">
                  Weather Wizard
                </span>
                <span className="text-xs text-white/60 italic">
                  We Weather Every Storm
                </span>
              </div>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Kent&apos;s trusted roofing specialists for over 25 years. Expert
              repairs, installations, and emergency services for homes across the
              county.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <PhoneLink
                className="flex items-center gap-3 text-white/80 hover:text-copper transition-colors group"
                label="footer_phone"
              >
                <div className="p-2 rounded-lg bg-copper/10 group-hover:bg-copper/20 transition-colors">
                  <Phone className="h-4 w-4 text-copper" />
                </div>
                <div>
                  <p className="font-semibold text-white">0800 316 2922</p>
                  <p className="text-xs text-white/65">Call anytime</p>
                </div>
              </PhoneLink>
              <div className="flex items-center gap-3 text-white/70">
                <div className="p-2 rounded-lg bg-copper/10">
                  <Clock className="h-4 w-4 text-copper" />
                </div>
                <div>
                  <p className="text-sm">24/7 Emergency Service</p>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-white flex items-center gap-2">
              <span className="w-8 h-0.5 bg-copper rounded-full" />
              Our Services
            </h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href={service.href}
                    className="flex items-center gap-2 text-white/70 hover:text-copper transition-colors text-sm group"
                  >
                    <ChevronRight className="h-3 w-3 text-copper/50 group-hover:text-copper transition-colors" />
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-white flex items-center gap-2">
              <span className="w-8 h-0.5 bg-copper rounded-full" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 text-white/70 hover:text-copper transition-colors text-sm group"
                  >
                    <ChevronRight className="h-3 w-3 text-copper/50 group-hover:text-copper transition-colors" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-white flex items-center gap-2">
              <span className="w-8 h-0.5 bg-copper rounded-full" />
              <MapPin className="h-4 w-4 text-copper" />
              Service Areas
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {displayedAreas.map((area) => (
                <Link
                  key={area.slug}
                  href={`/${area.slug}`}
                  className="text-sm text-white/60 hover:text-copper transition-colors truncate"
                >
                  {area.name}
                </Link>
              ))}
            </div>
            {hasMoreAreas && (
              <p className="text-xs text-white/65 mt-3">
                + {areas.length - 12} more areas across Kent
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/65 text-sm">
              © {currentYear} Weather Wizard Roofing & Guttering. All rights
              reserved.
            </p>
            <div className="flex items-center gap-6 flex-wrap justify-center">
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-white/65 hover:text-copper transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
              <CookieSettingsButton />
              <span className="text-white/65 text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Fully Insured & Certified
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
