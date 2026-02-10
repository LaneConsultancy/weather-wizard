"use client";

import { Phone } from "lucide-react";
import { PhoneLink } from "@/components/phone-link";
import { useEffect, useState } from "react";

export function StickyCallBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 200px
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Mobile sticky call bar - only visible on scroll */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <PhoneLink
          className="flex items-center justify-center gap-3 bg-copper text-white py-4 px-6 font-semibold text-lg shadow-lg"
          label="sticky_mobile_phone"
        >
          <Phone className="h-5 w-5 animate-pulse" />
          <span>Call Now - 0800 316 2922</span>
        </PhoneLink>
      </div>

      {/* Desktop sticky header bar - shows on scroll */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 hidden lg:block transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-3">
              {/* Left - Logo/Name */}
              <div className="text-white font-semibold">
                Weather Wizard Roofing
              </div>

              {/* Center - Urgency Message */}
              <div className="text-copper text-sm font-medium">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Available Today - Fast Response
              </div>

              {/* Right - Phone CTA */}
              <PhoneLink
                className="flex items-center gap-2 bg-copper hover:bg-copper/90 text-white px-5 py-2 rounded-lg font-semibold transition-colors"
                label="sticky_desktop_phone"
              >
                <Phone className="h-4 w-4" />
                0800 316 2922
              </PhoneLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
