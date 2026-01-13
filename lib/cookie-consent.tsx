"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface ConsentState {
  necessary: boolean; // Always true - essential cookies
  analytics: boolean; // Analytics tracking
  marketing: boolean; // Marketing/advertising (Bing Ads)
}

interface ConsentContextType {
  consent: ConsentState;
  hasInteracted: boolean;
  updateConsent: (newConsent: Partial<ConsentState>) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  showBanner: boolean;
  setShowBanner: (show: boolean) => void;
}

const defaultConsent: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
};

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

const CONSENT_COOKIE_NAME = "ww_cookie_consent";
const CONSENT_COOKIE_DAYS = 365;

function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(defaultConsent);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load consent from cookie on mount
  useEffect(() => {
    const savedConsent = getCookie(CONSENT_COOKIE_NAME);
    if (savedConsent) {
      try {
        const parsed = JSON.parse(decodeURIComponent(savedConsent));
        setConsent({ ...defaultConsent, ...parsed });
        setHasInteracted(true);
        setShowBanner(false);
      } catch {
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
    setIsLoaded(true);
  }, []);

  // Save consent to cookie whenever it changes (after initial load)
  useEffect(() => {
    if (isLoaded && hasInteracted) {
      setCookie(CONSENT_COOKIE_NAME, encodeURIComponent(JSON.stringify(consent)), CONSENT_COOKIE_DAYS);

      // Dispatch event for tracking scripts to listen to
      window.dispatchEvent(new CustomEvent("consentUpdated", { detail: consent }));
    }
  }, [consent, hasInteracted, isLoaded]);

  const updateConsent = useCallback((newConsent: Partial<ConsentState>) => {
    setConsent((prev) => ({ ...prev, ...newConsent }));
    setHasInteracted(true);
    setShowBanner(false);
  }, []);

  const acceptAll = useCallback(() => {
    updateConsent({
      analytics: true,
      marketing: true,
    });
  }, [updateConsent]);

  const rejectAll = useCallback(() => {
    updateConsent({
      analytics: false,
      marketing: false,
    });
  }, [updateConsent]);

  return (
    <ConsentContext.Provider
      value={{
        consent,
        hasInteracted,
        updateConsent,
        acceptAll,
        rejectAll,
        showBanner,
        setShowBanner,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return context;
}
