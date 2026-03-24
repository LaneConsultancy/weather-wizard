"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { PhoneLink } from "@/components/phone-link";

export function UpfoldedStickyCta() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToForm = () => {
    document
      .getElementById("quote-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[60] lg:hidden transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-stretch">
        {/* Call button - left half */}
        <PhoneLink
          className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-4 px-4 font-semibold text-base shadow-lg"
          label="upfolded_sticky_phone"
        >
          <Phone className="h-5 w-5 flex-shrink-0" />
          Call Now
        </PhoneLink>

        {/* Quote button - right half */}
        <button
          onClick={scrollToForm}
          className="flex-1 flex items-center justify-center gap-2 bg-[#c2410c] text-white py-4 px-4 font-semibold text-base shadow-lg btn-shine"
          aria-label="Scroll to quote form"
        >
          Get Free Quote
        </button>
      </div>
    </div>
  );
}
