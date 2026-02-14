"use client";

import { useEffect, useState } from "react";

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
      <button
        onClick={scrollToForm}
        className="w-full flex items-center justify-center gap-2 bg-[#c2410c] text-white py-4 px-6 font-semibold text-lg shadow-lg btn-shine"
        aria-label="Scroll to quote form"
      >
        Get Your Free Quote
      </button>
    </div>
  );
}
