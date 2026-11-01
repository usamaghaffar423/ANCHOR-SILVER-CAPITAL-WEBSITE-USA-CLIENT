"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * The cookie banner and the scroll-to-top helper are not needed for first paint, so they load (their code and
 * their effects) once the browser is idle, instead of competing with hydration. The head script in the root
 * layout marks <html data-cookie-banner> up front when no choice is stored, so the homepage's sticky bar is
 * hidden from the first paint and nothing jumps when the banner arrives.
 */
const CookieBanner = dynamic(() => import("@/components/site/CookieBanner").then((m) => m.CookieBanner), { ssr: false });
const ScrollToTop = dynamic(() => import("@/components/site/ScrollToTop").then((m) => m.ScrollToTop), { ssr: false });

export function DeferredChrome() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const go = () => setReady(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(go, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(go, 1200);
    return () => window.clearTimeout(id);
  }, []);
  if (!ready) return null;
  return (
    <>
      <CookieBanner />
      <ScrollToTop />
    </>
  );
}
