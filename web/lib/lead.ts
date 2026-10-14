/**
 * Shared lead-form plumbing: the live GoHighLevel inbound webhook, UET event
 * pushes, UTM/msclkid capture, E.164 phone normalization and visitor-IP lookup.
 * Client-side only (used by the native lead forms that replaced the GHL
 * iframes).
 */

/** Live GHL inbound webhook — Landing dev instructions §1. */
export const LEAD_WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/qW6EG0Ha1uQ0P6n5gugQ/webhook-trigger/JwNEkReQ9vro54FwMPXK";

export const NOTICE_VERSION = "v2.0";

/** Microsoft UET event push — no-ops until the UET tag itself is installed. */
export function trackUet(name: "lead" | "phone_click" | "handbook_download") {
  try {
    const w = window as unknown as { uetq?: unknown[] };
    w.uetq = w.uetq || [];
    w.uetq.push("event", name, {});
  } catch {
    /* noop */
  }
}

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "msclkid",
] as const;

export type UtmFields = Record<(typeof UTM_KEYS)[number], string>;

export function readUtmFields(): UtmFields {
  const q: Record<string, string> = {};
  try {
    location.search
      .replace(/^\?/, "")
      .split("&")
      .forEach((p) => {
        if (!p) return;
        const kv = p.split("=");
        q[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || "").replace(/\+/g, " "));
      });
  } catch {
    /* noop */
  }
  const out = {} as UtmFields;
  for (const k of UTM_KEYS) out[k] = q[k] ?? "";
  return out;
}

/** "+1XXXXXXXXXX" from any user-typed phone, or null when it isn't 10 digits. */
export function toE164(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits[0] === "1") digits = digits.slice(1);
  if (digits.length !== 10) return null;
  return `+1${digits}`;
}

let ipCache: Promise<string> | null = null;

/** Best-effort visitor IP for the webhook payload; empty string on failure. */
export function fetchVisitorIp(): Promise<string> {
  if (!ipCache) {
    ipCache = new Promise<string>((resolve) => {
      const ac = new AbortController();
      const timer = setTimeout(() => ac.abort(), 4000);
      fetch("https://api.ipify.org?format=json", { signal: ac.signal })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error("ip echo failed"))))
        .then((d: { ip?: string }) => resolve(typeof d.ip === "string" ? d.ip : ""))
        .catch(() => resolve(""))
        .finally(() => clearTimeout(timer));
    });
  }
  return ipCache;
}
