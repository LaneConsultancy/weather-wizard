"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Settings, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConsent } from "@/lib/cookie-consent";

export function CookieConsentBanner() {
  const { consent, acceptAll, rejectAll, updateConsent, showBanner, setShowBanner } = useConsent();
  const [showSettings, setShowSettings] = useState(false);
  const [tempConsent, setTempConsent] = useState(consent);

  if (!showBanner) return null;

  const handleSavePreferences = () => {
    updateConsent(tempConsent);
    setShowSettings(false);
  };

  return (
    <div className="fixed bottom-4 left-4 z-[100] max-w-sm animate-fade-up">
      {/* Compact Banner */}
      <div className="bg-slate-900 rounded-xl shadow-lg overflow-hidden border border-slate-700">
        <div className="p-4">
          {!showSettings ? (
            /* Simple View */
            <>
              <div className="flex items-start gap-3 mb-3">
                <Cookie className="h-4 w-4 text-copper flex-shrink-0 mt-0.5" />
                <p className="text-white/80 text-xs leading-relaxed">
                  We use cookies for analytics and marketing.{" "}
                  <Link href="/privacy" className="text-copper underline hover:no-underline">
                    Learn more
                  </Link>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={acceptAll}
                  size="sm"
                  className="bg-copper hover:bg-copper/90 text-white text-xs px-3 py-1 h-7"
                >
                  Accept
                </Button>
                <Button
                  onClick={rejectAll}
                  size="sm"
                  variant="outline"
                  className="border-slate-600 text-white/70 hover:bg-slate-800 hover:text-white text-xs px-3 py-1 h-7"
                >
                  Reject
                </Button>
                <button
                  onClick={() => {
                    setTempConsent(consent);
                    setShowSettings(true);
                  }}
                  className="text-white/70 hover:text-white text-xs ml-auto"
                  aria-label="Manage cookie settings"
                >
                  <Settings className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          ) : (
            /* Settings View */
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-white text-xs font-medium">Cookie Settings</span>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-white/70 hover:text-white"
                  aria-label="Close cookie settings"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-2 mb-3">
                {/* Essential */}
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-xs">Essential</span>
                  <div className="w-8 h-4 bg-copper rounded-full flex items-center justify-end px-0.5 opacity-60">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>

                {/* Analytics */}
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-xs">Analytics</span>
                  <button
                    onClick={() => setTempConsent((prev) => ({ ...prev, analytics: !prev.analytics }))}
                    role="switch"
                    aria-checked={tempConsent.analytics}
                    aria-label="Toggle analytics cookies"
                  >
                    <div
                      className={`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors ${
                        tempConsent.analytics ? "bg-copper justify-end" : "bg-slate-600 justify-start"
                      }`}
                    >
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                  </button>
                </div>

                {/* Marketing */}
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-xs">Marketing</span>
                  <button
                    onClick={() => setTempConsent((prev) => ({ ...prev, marketing: !prev.marketing }))}
                    role="switch"
                    aria-checked={tempConsent.marketing}
                    aria-label="Toggle marketing cookies"
                  >
                    <div
                      className={`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors ${
                        tempConsent.marketing ? "bg-copper justify-end" : "bg-slate-600 justify-start"
                      }`}
                    >
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                  </button>
                </div>
              </div>

              <Button
                onClick={handleSavePreferences}
                size="sm"
                className="w-full bg-copper hover:bg-copper/90 text-white text-xs h-7"
              >
                Save
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Small button to re-open cookie settings
export function CookieSettingsButton() {
  const { setShowBanner } = useConsent();

  return (
    <button
      onClick={() => setShowBanner(true)}
      className="text-white/70 hover:text-copper transition-colors text-sm flex items-center gap-1"
      aria-label="Manage cookie preferences"
    >
      <Cookie className="h-3 w-3" />
      Cookie Settings
    </button>
  );
}
