/**
 * The one consent module. Everything that can sell or share personal information
 * (Microsoft UET, Microsoft Clarity, Google Analytics / Ads) is switched here, and
 * every entry point calls it: the Your Privacy Choices toggle, the cookie banner's
 * Decline, Global Privacy Control, and the early inline default in the UET / Google tags.
 *
 * State: a first-party cookie (`asc_privacy_optout`, 12 months) plus the browser's
 * Global Privacy Control signal. Opt-out wins if either says so. Client-side only.
 * This file has no React hooks, so lib/lead.ts (also imported by server components) can use it;
 * the hooks live in lib/consent.ts.
 */
import { OPT_OUT_COOKIE } from "@/lib/consent-inline";

export { OPT_OUT_COOKIE, OPT_OUT_INLINE_CHECK } from "@/lib/consent-inline";
export const CONSENT_CHANGE_EVENT = "asc-consent-change";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function gpcEnabled(): boolean {
  return (
    typeof navigator !== "undefined" &&
    (navigator as unknown as { globalPrivacyControl?: boolean }).globalPrivacyControl === true
  );
}

function cookieValue(): "1" | "0" | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${OPT_OUT_COOKIE}=([01])`));
  return m ? (m[1] as "1" | "0") : null;
}

/** True when the visitor has opted out (toggle, banner Decline) or sends Global Privacy Control. */
export function isOptedOut(): boolean {
  return gpcEnabled() || cookieValue() === "1";
}

/** Push the current state to every tool. Safe to call repeatedly and before the tools load (they queue). */
export function applyConsent(): void {
  if (typeof window === "undefined") return;
  const state = isOptedOut() ? "denied" : "granted";
  try {
    const w = window as unknown as {
      uetq?: unknown[];
      clarity?: (...a: unknown[]) => void;
      dataLayer?: unknown[];
    };
    w.uetq = w.uetq || [];
    w.uetq.push("consent", "update", { ad_storage: state });

    if (typeof w.clarity === "function") w.clarity("consent", state === "granted");

    w.dataLayer = w.dataLayer || [];
    // gtag.js only understands the `arguments` object, not an array.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (function (..._a: unknown[]) {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments);
    })("consent", "update", { ad_storage: state, ad_user_data: state, ad_personalization: state });
  } catch {
    /* consent must never break the page */
  }
}

/** Save the visitor's choice (12-month cookie), apply it everywhere, and notify listeners. */
export function setOptOut(on: boolean): void {
  if (typeof document === "undefined") return;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${OPT_OUT_COOKIE}=${on ? "1" : "0"}; max-age=${MAX_AGE_SECONDS}; path=/; SameSite=Lax${secure}`;
  applyConsent();
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}
