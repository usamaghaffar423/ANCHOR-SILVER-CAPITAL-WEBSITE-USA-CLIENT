/**
 * Homepage event pushes. Goes to the GA4 data layer (gtag-style, so events queue until
 * gtag.js loads on first interaction). The Microsoft UET `lead` conversion is fired by the
 * form itself via lib/lead.ts, only after the webhook accepts the submission.
 */
export type HomeEvent =
  | "form_step1"
  | "form_submit"
  | "click_to_call"
  | "cta_click"
  | "faq_open"
  | "scroll_50";

export function trackHome(name: HomeEvent, params: Record<string, string> = {}) {
  try {
    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    // gtag() pushes the `arguments` object, not an array; gtag.js only reads that shape.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (function (..._a: unknown[]) {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments);
    })("event", name, { page: "home", ...params });
  } catch {
    /* tracking must never break the page */
  }
}

const CLICK_IDS = ["gclid", "msclkid", "fbclid"] as const;
const UTMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

/** UTMs and click ids from the URL, falling back to what this session saw on its first page. */
export function readAttribution(): Record<(typeof UTMS)[number] | (typeof CLICK_IDS)[number], string> {
  const out = {} as Record<(typeof UTMS)[number] | (typeof CLICK_IDS)[number], string>;
  let saved: Record<string, string> = {};
  try {
    saved = JSON.parse(sessionStorage.getItem("hp_attr") || "{}");
  } catch {
    /* ignore */
  }
  const q = new URLSearchParams(location.search);
  let changed = false;
  for (const k of [...UTMS, ...CLICK_IDS]) {
    const v = q.get(k) || saved[k] || "";
    if (q.get(k) && q.get(k) !== saved[k]) changed = true;
    out[k] = v;
  }
  if (changed) {
    try {
      sessionStorage.setItem("hp_attr", JSON.stringify(out));
    } catch {
      /* ignore */
    }
  }
  return out;
}
