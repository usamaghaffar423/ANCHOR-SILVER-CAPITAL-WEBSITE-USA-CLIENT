"use client";

import { useEffect } from "react";

/**
 * Loads GA4 once site-wide, kept off the critical path: the (large) gtag.js
 * download and evaluation wait for the first user interaction, or a short idle
 * timeout for visitors who just read. Renders nothing when `id` (the site's
 * NEXT_PUBLIC_GA_ID* env var) is unset.
 */
const EVENTS = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
const FALLBACK_MS = 6000;

export function GoogleAnalytics({ id }: { id: string | undefined }) {
  useEffect(() => {
    if (!id) return;
    let done = false;
    const load = () => {
      if (done) return;
      done = true;
      EVENTS.forEach((e) => window.removeEventListener(e, load));
      clearTimeout(timer);
      const w = window as unknown as { dataLayer: unknown[] };
      w.dataLayer = w.dataLayer || [];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      function gtag(..._args: unknown[]) {
        // gtag.js requires the real `arguments` object, not a rest array.
        // eslint-disable-next-line prefer-rest-params
        w.dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", id);
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      document.head.appendChild(s);
    };
    EVENTS.forEach((e) => window.addEventListener(e, load, { once: true, passive: true }));
    const timer = setTimeout(load, FALLBACK_MS);
    return () => {
      EVENTS.forEach((e) => window.removeEventListener(e, load));
      clearTimeout(timer);
    };
  }, [id]);
  return null;
}
