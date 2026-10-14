"use client";

import { useEffect } from "react";
import { trackUet } from "@/lib/lead";

/**
 * Site-wide Microsoft UET click tracking. Delegated on the document so it
 * covers every phone link (`a[href^="tel:"]` or `[data-call]`) and every
 * handbook download (`a[href*="handbook.pdf"]` or `[data-download]`) without
 * touching the markup of each page. No-ops until the UET tag is installed
 * (the `window.uetq` queue simply accumulates).
 */
export function UetEvents() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t || typeof t.closest !== "function") return;
      if (t.closest('a[href^="tel:"]') || t.closest("[data-call]")) trackUet("phone_click");
      if (t.closest('a[href*="handbook.pdf"]') || t.closest("[data-download]"))
        trackUet("handbook_download");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
