"use client";

import { useEffect } from "react";
import { trackHome } from "@/lib/home-track";

/**
 * Homepage tracking that used to live inside client components: faq_open (the 'toggle' event of the native
 * FAQ) and click_to_call (links marked data-hp-call). One delegated listener each, no rendered output.
 * The toggle the browser fires for the FAQ item that is open on load is ignored.
 */
export function HomeTracking() {
  useEffect(() => {
    let ready = false;
    const startId = window.setTimeout(() => {
      ready = true;
    }, 0);
    const onToggle = (e: Event) => {
      const d = e.target as HTMLDetailsElement | null;
      if (!ready || !d || !d.matches?.("details.hp-faq-item") || !d.open) return;
      trackHome("faq_open", { question: d.querySelector("summary h3")?.textContent ?? "" });
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[data-hp-call]");
      if (a) trackHome("click_to_call", { location: a.getAttribute("data-hp-call") ?? "" });
    };
    // 'toggle' does not bubble, so listen in the capture phase on the document.
    document.addEventListener("toggle", onToggle, true);
    document.addEventListener("click", onClick);
    return () => {
      window.clearTimeout(startId);
      document.removeEventListener("toggle", onToggle, true);
      document.removeEventListener("click", onClick);
    };
  }, []);
  return null;
}
