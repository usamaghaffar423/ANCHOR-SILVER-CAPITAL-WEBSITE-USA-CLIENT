"use client";

import { useEffect, useState } from "react";
import { trackUet } from "@/lib/lead";

/**
 * Calendly inline embed that sizes itself to the calendar: Calendly posts
 * `calendly.page_height` as its content grows or shrinks (month view, time list,
 * confirmation), and the iframe follows it, so the frame never shows its own
 * scrollbar. The header details panel is hidden to keep the card compact.
 *
 * Also reports a confirmed booking (`calendly.event_scheduled`, never on load or
 * refresh) once: a Microsoft UET `booking_scheduled` event and a dataLayer event
 * for GA4 / Google Ads.
 *
 * The iframe is added after mount because Calendly needs the page's hostname
 * (`embed_domain`) to send those messages.
 */
const MIN_HEIGHT = 480;

export function CalendlyEmbed({ url, title }: { url: string; title: string }) {
  const [src, setSrc] = useState("");
  const [height, setHeight] = useState(MIN_HEIGHT);

  useEffect(() => {
    const q = new URLSearchParams({
      hide_gdpr_banner: "1",
      hide_event_type_details: "1",
      background_color: "fbfaf6",
      text_color: "092619",
      primary_color: "9a7b34",
      embed_domain: window.location.hostname,
      embed_type: "Inline",
    });
    setSrc(`${url}?${q.toString()}`);

    let fired = false;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com") return;
      const data = e.data as { event?: string; payload?: { height?: string } } | null;
      if (!data || typeof data.event !== "string") return;
      if (data.event === "calendly.page_height") {
        const h = parseInt(data.payload?.height ?? "", 10);
        if (Number.isFinite(h) && h > 200) setHeight(Math.min(h, 1400));
      } else if (data.event === "calendly.event_scheduled" && !fired) {
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
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [url]);

  return (
    <div className="ty-cal" style={{ height }}>
      {src && <iframe src={src} title={title} scrolling="no" />}
    </div>
  );
}
