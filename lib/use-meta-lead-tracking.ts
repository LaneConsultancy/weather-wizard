"use client";

import { useEffect, useRef } from "react";

/**
 * Attaches Meta Pixel Lead tracking to the Tally forms rendered by the
 * component that calls this hook.
 *
 * What it does on mount:
 *  1. Generates a stable UUID (event_id) stored in a ref so the same value
 *     is reused for the lifetime of this component instance.
 *  2. Appends `event_id` to every `data-tally-src` iframe URL on the page,
 *     mirroring the existing gclid/fbclid passthrough pattern.
 *  3. Listens for the `Tally.FormSubmitted` postMessage event; on receipt it
 *     calls `fbq('track', 'Lead', ...)` with the same event_id so Meta can
 *     deduplicate against the future server-side CAPI worker that reads the
 *     same event_id from the Tally submission record.
 *
 * Usage: call once at the top of any client component that embeds a Tally form.
 */
export function useMetaLeadTracking(): void {
  // Persist the UUID for the full lifetime of this component mount. Using a
  // ref rather than state avoids triggering a re-render.
  const eventIdRef = useRef<string>("");

  useEffect(() => {
    // Generate once per mount
    if (!eventIdRef.current) {
      eventIdRef.current = crypto.randomUUID();
    }
    const eventId = eventIdRef.current;

    // Append event_id to every Tally embed URL on the page so the value is
    // stored as a hidden field on form submission (Tally persists URL params).
    const tallyFrames = document.querySelectorAll<HTMLIFrameElement>(
      "iframe[data-tally-src]"
    );
    tallyFrames.forEach((frame) => {
      const src = frame.getAttribute("data-tally-src");
      if (!src) return;

      try {
        const url = new URL(src);
        url.searchParams.set("event_id", eventId);
        frame.setAttribute("data-tally-src", url.toString());
      } catch {
        // Malformed URL — skip silently; other tracking will still work
      }
    });

    // Listen for the Tally form submission postMessage event.
    // Tally fires: { type: "Tally.FormSubmitted", payload: { formId, ... } }
    function handleMessage(event: MessageEvent) {
      if (
        typeof event.data !== "object" ||
        event.data === null ||
        event.data.type !== "Tally.FormSubmitted"
      ) {
        return;
      }

      // Guard: fbq may not be present if the pixel script hasn't loaded yet
      // (e.g. network timeout, ad-blocker). Fail silently rather than throw.
      if (typeof window.fbq !== "function") return;

      window.fbq(
        "track",
        "Lead",
        { value: 50, currency: "GBP" },
        { eventID: eventId }
      );
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []); // Empty dep-array: run once on mount, clean up on unmount
}
