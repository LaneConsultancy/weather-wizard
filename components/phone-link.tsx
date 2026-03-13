"use client";

import { trackPhoneClickConversion } from "@/components/google-ads";
import { trackPhoneClick } from "@/components/microsoft-uet";
import { getStoredGclid, getStoredMsclkid } from "@/lib/gclid-store";

interface PhoneLinkProps {
  children: React.ReactNode;
  className?: string;
  phoneNumber?: string;
  label?: string;
}

// Google Ads conversion label for phone clicks.
const PHONE_CLICK_CONVERSION_LABEL = "e9c-CLC-7fYbEIz3ucdA";

export function PhoneLink({
  children,
  className,
  phoneNumber = "08003162922",
  label = "phone",
}: PhoneLinkProps) {
  // Strip anything that isn't a digit from the phone number for the tel: href
  const normalizedNumber = phoneNumber.replace(/\D/g, "");

  const handleClick = () => {
    // --- Existing real-time conversion pings (gtag / UET) ---
    try {
      trackPhoneClickConversion(PHONE_CLICK_CONVERSION_LABEL, phoneNumber);
    } catch (error) {
      console.warn("[PhoneLink] Google Ads tracking failed:", error);
    }

    try {
      trackPhoneClick(label);
    } catch (error) {
      console.warn("[PhoneLink] Microsoft UET tracking failed:", error);
    }

    // --- Offline click conversion capture ---
    // If we have a gclid or msclkid from this session we fire a beacon to
    // our API so the click can later be matched against Twilio call logs
    // and uploaded to Google Ads as an offline click conversion.
    //
    // navigator.sendBeacon() is fire-and-forget and survives the browser
    // switching to the phone dialler immediately after the user taps the
    // tel: link. Falls back to a standard fetch() when unavailable.
    const gclid = getStoredGclid();
    const msclkid = getStoredMsclkid();

    if (gclid || msclkid) {
      const payload: Record<string, string> = {
        timestamp: new Date().toISOString(),
        page: typeof window !== "undefined" ? window.location.pathname : "/",
      };
      if (gclid) payload.gclid = gclid;
      if (msclkid) payload.msclkid = msclkid;

      const body = JSON.stringify(payload);

      // Phone click events go directly to the Cloudflare Worker, which stores
      // them in KV for later matching against Twilio call logs. This avoids
      // Vercel's ephemeral filesystem and keeps storage server-side.
      const CLICK_ENDPOINT =
        "https://ww-conversion-importer.georgejlane.workers.dev/phone-click";

      try {
        if (navigator.sendBeacon) {
          // sendBeacon requires a Blob when sending JSON so the Content-Type
          // header is set correctly for the server to parse it.
          const blob = new Blob([body], { type: "application/json" });
          navigator.sendBeacon(CLICK_ENDPOINT, blob);
        } else {
          // Fallback for environments without sendBeacon (rare in 2025, but
          // some desktop browsers in kiosk/restricted modes may lack it).
          fetch(CLICK_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
            // keepalive ensures the request completes even if the page unloads
            keepalive: true,
          }).catch(() => {
            // Fire-and-forget — ignore errors silently
          });
        }
      } catch (error) {
        console.warn("[PhoneLink] Click capture beacon failed:", error);
      }
    }
  };

  return (
    <a
      href={`tel:${normalizedNumber}`}
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
