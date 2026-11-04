"use client";

import type { ReactNode } from "react";

/** The whole banner is one link; a click is counted as cta_click in this site's own GA4 property. */
export function SatAdLink({ href, site, children }: { href: string; site: "silver" | "gold"; children: ReactNode }) {
  return (
    <a
      className="sat-ad-link"
      href={href}
      rel="sponsored noopener"
      onClick={() => {
        try {
          const w = window as unknown as { gtag?: (...a: unknown[]) => void; dataLayer?: unknown[] };
          const params = { location: "price_site_banner", site, transport_type: "beacon" };
          if (w.gtag) w.gtag("event", "cta_click", params);
          else (w.dataLayer = w.dataLayer || []).push(["event", "cta_click", params]);
        } catch {}
      }}
    >
      {children}
    </a>
  );
}
