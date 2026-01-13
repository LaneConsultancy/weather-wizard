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
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Banner */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-copper/20 rounded-lg">
              <Cookie className="h-5 w-5 text-copper" />
            </div>
            <h2 className="text-white font-semibold text-lg">Cookie Preferences</h2>
          </div>
          <button
            onClick={() => rejectAll()}
            className="text-white/60 hover:text-white transition-colors p-1"
            aria-label="Close and reject non-essential cookies"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {!showSettings ? (
            /* Simple View */
            <>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                We use cookies to improve your experience and for marketing purposes (including Microsoft Bing Ads).
                You can choose which cookies to accept. Essential cookies are always enabled as they are necessary
                for the website to function.
              </p>
              <p className="text-slate-500 text-xs mb-6">
                For more information, please read our{" "}
                <Link href="/privacy" className="text-copper hover:underline">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/cookies" className="text-copper hover:underline">
                  Cookie Policy
                </Link>
                .
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={acceptAll}
                  className="flex-1 bg-copper hover:bg-copper/90 text-white font-medium"
                >
                  Accept All
                </Button>
                <Button
                  onClick={rejectAll}
                  variant="outline"
                  className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Reject Non-Essential
                </Button>
                <Button
                  onClick={() => {
                    setTempConsent(consent);
                    setShowSettings(true);
                  }}
                  variant="ghost"
                  className="flex-1 text-slate-600 hover:text-slate-900"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </div>
            </>
          ) : (
            /* Settings View */
            <>
              <p className="text-slate-600 text-sm mb-6">
                Customise your cookie preferences below. Essential cookies cannot be disabled.
              </p>

              <div className="space-y-4 mb-6">
                {/* Essential Cookies - Always On */}
                <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1 pr-4">
                    <h3 className="font-medium text-slate-900 text-sm">Essential Cookies</h3>
                    <p className="text-slate-500 text-xs mt-1">
                      Required for the website to function. These cannot be disabled.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-6 bg-copper rounded-full flex items-center justify-end px-1 cursor-not-allowed opacity-60">
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1 pr-4">
                    <h3 className="font-medium text-slate-900 text-sm">Analytics Cookies</h3>
                    <p className="text-slate-500 text-xs mt-1">
                      Help us understand how visitors interact with our website.
                    </p>
                  </div>
                  <button
                    onClick={() => setTempConsent((prev) => ({ ...prev, analytics: !prev.analytics }))}
                    className="flex items-center"
                    role="switch"
                    aria-checked={tempConsent.analytics}
                  >
                    <div
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        tempConsent.analytics ? "bg-copper justify-end" : "bg-slate-300 justify-start"
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </button>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex-1 pr-4">
                    <h3 className="font-medium text-slate-900 text-sm">Marketing Cookies</h3>
                    <p className="text-slate-500 text-xs mt-1">
                      Used for advertising purposes, including Microsoft Bing Ads. These help us measure
                      ad effectiveness and show relevant ads.
                    </p>
                  </div>
                  <button
                    onClick={() => setTempConsent((prev) => ({ ...prev, marketing: !prev.marketing }))}
                    className="flex items-center"
                    role="switch"
                    aria-checked={tempConsent.marketing}
                  >
                    <div
                      className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                        tempConsent.marketing ? "bg-copper justify-end" : "bg-slate-300 justify-start"
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSavePreferences}
                  className="flex-1 bg-copper hover:bg-copper/90 text-white font-medium"
                >
                  Save Preferences
                </Button>
                <Button
                  onClick={() => setShowSettings(false)}
                  variant="outline"
                  className="border-slate-300"
                >
                  Back
                </Button>
              </div>
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
      className="text-white/50 hover:text-copper transition-colors text-sm flex items-center gap-1"
      aria-label="Manage cookie preferences"
    >
      <Cookie className="h-3 w-3" />
      Cookie Settings
    </button>
  );
}
