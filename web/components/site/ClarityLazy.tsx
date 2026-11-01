"use client";

import { useEffect } from "react";
import { applyConsent, isOptedOut } from "@/lib/consent";

/**
 * Microsoft Clarity, loaded by us and only when it is needed: after the visitor's first interaction (scroll,
 * tap, key) or after ~5 s of idle time, whichever comes first, so it never competes with first paint or the
 * page's own scripts. Behind a flag, OFF by default:
 *
 *   NEXT_PUBLIC_CLARITY_LAZY=1   turn this loader on
 *   NEXT_PUBLIC_CLARITY_ID       the Clarity project id (z5nqaetgt8)
 *
 * IMPORTANT: Clarity is also loaded automatically by the UET-Clarity link in Microsoft Ads. Turn that link OFF
 * before enabling this flag, or Clarity would load twice.
 *
 * Privacy: nothing loads for a visitor who opted out (Decline, Your Privacy Choices, Global Privacy Control).
 * If they opt out later, applyConsent() calls clarity('consent', false). Forms carry data-clarity-mask="true"
 * so name, email and phone are never recorded.
 */
const ENABLED = process.env.NEXT_PUBLIC_CLARITY_LAZY === "1";
const PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "";
const EVENTS = ["pointerdown", "keydown", "scroll", "touchstart"] as const;

export function ClarityLazy() {
  useEffect(() => {
    if (!ENABLED || !PROJECT_ID) return;
    let done = false;
    const load = () => {
      if (done) return;
      done = true;
      EVENTS.forEach((e) => window.removeEventListener(e, load));
      window.clearTimeout(timer);
      if (isOptedOut()) return;
      const w = window as unknown as { clarity?: ((...a: unknown[]) => void) & { q?: unknown[] } };
      if (!w.clarity) {
        w.clarity = function (...args: unknown[]) {
          (w.clarity!.q = w.clarity!.q || []).push(args);
        };
      }
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://www.clarity.ms/tag/" + PROJECT_ID;
      document.head.appendChild(s);
      applyConsent();
    };
    EVENTS.forEach((e) => window.addEventListener(e, load, { once: true, passive: true }));
    const idle = () => (typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(load, { timeout: 2000 }) : load());
    const timer = window.setTimeout(idle, 5000);
    return () => {
      EVENTS.forEach((e) => window.removeEventListener(e, load));
      window.clearTimeout(timer);
    };
  }, []);
  return null;
}
