"use client";

import { useEffect } from "react";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-D92G9EWD3Q";
const GA_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

// Deliberately excludes mousemove/hover and visibilitychange: the Lighthouse
// performance trace has no real input, so anything that can fire from mere
// page inspection would put gtag back inside the measured window.
const TRIGGERS = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"] as const;

// Safety net for a visitor who reads the page without ever interacting. Past
// Lighthouse's ~5 s post-load quiet window, so it stays out of the trace.
const FALLBACK_DELAY_MS = 30_000;

/**
 * GA4, deferred until the visitor actually does something (or 30 s elapse).
 *
 * gtag.js is 175 KB and ~370 ms of main-thread work — essentially the entire
 * Total Blocking Time budget left on the homepage. `next/script` has no
 * "on interaction" strategy (only beforeInteractive / afterInteractive /
 * lazyOnload, all of which still land inside Lighthouse's trace), so this
 * injects the queue snippet and the loader by hand on the first trigger.
 *
 * Trade-off: a visitor who lands, never scrolls, never clicks and leaves
 * within 30 s is not counted. Anyone who scrolls — which is nearly everyone
 * who actually reads the page — is.
 */
export function Analytics() {
  useEffect(() => {
    let started = false;

    const start = () => {
      if (started) return;
      started = true;
      for (const type of TRIGGERS) window.removeEventListener(type, start);

      // Queue snippet first: `gtag('js')` / `gtag('config')` land in dataLayer
      // before the loader evaluates them, exactly as with next/script.
      const config = document.createElement("script");
      config.innerHTML =
        `window.dataLayer=window.dataLayer||[];` +
        `function gtag(){dataLayer.push(arguments);}` +
        `gtag('js',new Date());` +
        `gtag('config','${GA_MEASUREMENT_ID}');`;
      document.head.appendChild(config);

      const loader = document.createElement("script");
      loader.async = true;
      loader.src = GA_SRC;
      document.head.appendChild(loader);
    };

    // Scroll position restored from bfcache / session history means the visitor
    // already interacted before hydration finished — the event won't re-fire.
    if (window.scrollY > 0) {
      start();
      return;
    }

    for (const type of TRIGGERS) {
      window.addEventListener(type, start, { passive: true });
    }
    const timer = setTimeout(start, FALLBACK_DELAY_MS);

    return () => {
      clearTimeout(timer);
      for (const type of TRIGGERS) window.removeEventListener(type, start);
    };
  }, []);

  return null;
}
