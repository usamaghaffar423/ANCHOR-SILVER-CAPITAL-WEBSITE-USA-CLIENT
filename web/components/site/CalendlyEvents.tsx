"use client";

import { useEffect } from "react";
import { trackUet } from "@/lib/lead";

/**
 * Reports a completed Calendly booking. Calendly's inline embed posts
 * `calendly.event_scheduled` to the parent window once the visitor confirms a
 * time (never on load or refresh), so it fires exactly once per real booking:
 * a Microsoft UET `booking_scheduled` event and a GA4/Google Ads dataLayer event.
 */
export function CalendlyEvents() {
  useEffect(() => {
    let fired = false;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com") return;
      const data = e.data as { event?: string } | null;
      if (!data || data.event !== "calendly.event_scheduled" || fired) return;
      fired = true;
      trackUet("booking_scheduled", { event_category: "lead", event_label: "calendly_thank_you" });
      try {
        const w = window as unknown as { dataLayer?: unknown[] };
        w.dataLayer = w.dataLayer || [];
        // gtag.js only understands the `arguments` object, not an array.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (function (..._a: unknown[]) {
          // eslint-disable-next-line prefer-rest-params
          w.dataLayer!.push(arguments);
        })("event", "booking_scheduled", { page: "thank-you-handbook" });
      } catch {
        /* tracking must never break the page */
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  return null;
}
