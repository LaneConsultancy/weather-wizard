"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone, Menu, X, FileText } from "lucide-react";

interface HeaderProps {
  variant?: "default" | "transparent";
}

export function Header({ variant = "default" }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || variant === "default"
          ? "bg-slate-900/95 backdrop-blur-md shadow-soft-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/weather-wizard-logo-no-bg.webp"
                alt="Weather Wizard Logo"
                width={56}
                height={56}
                className="w-14 h-14 transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl text-copper tracking-wide">
                Weather Wizard
              </span>
              <span className="text-xs text-white/70 italic hidden sm:block">
                We Weather Every Storm
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-copper transition-colors duration-200 text-sm font-medium link-underline"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Area */}
          <div className="flex items-center gap-3">
            {/* Emergency callout - desktop only */}
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-xs text-copper font-semibold tracking-wide uppercase">
                24/7 Emergency
              </span>
              <span className="text-sm text-white/70">0800 316 2922</span>
            </div>

            {/* Get Free Quote Button - desktop only */}
            <Button
              size="default"
              className="hidden md:flex bg-copper/90 hover:bg-copper text-white font-medium shadow-md hover:shadow-copper transition-all duration-300"
              asChild
            >
              <a href="#contact" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Get Free Quote</span>
              </a>
            </Button>

            {/* Call Button */}
            <Button
              size="lg"
              className="bg-copper hover:bg-copper-500 text-white font-semibold shadow-copper hover:shadow-copper-lg transition-all duration-300 btn-shine"
              asChild
            >
              <a href="tel:08003162922" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">Call Now</span>
              </a>
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-copper transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? "max-h-80 pb-6" : "max-h-0"
          }`}
        >
          <nav className="flex flex-col gap-4 pt-4 border-t border-white/10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/80 hover:text-copper transition-colors duration-200 font-medium py-2"
              >
                {link.label}
              </a>
            ))}

            {/* Get Free Quote Button - mobile */}
            <Button
              size="lg"
              className="bg-copper/90 hover:bg-copper text-white font-medium shadow-md hover:shadow-copper transition-all duration-300 mt-2"
              asChild
            >
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2"
              >
                <FileText className="h-4 w-4" />
                <span>Get Free Quote</span>
              </a>
            </Button>

            <div className="pt-2 border-t border-white/10">
              <p className="text-xs text-copper font-semibold tracking-wide uppercase mb-1">
                24/7 Emergency Service
              </p>
              <a
                href="tel:08003162922"
                className="text-lg text-white font-semibold"
              >
                0800 316 2922
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
