import { NextResponse } from "next/server";
import { LEAD_WEBHOOK_URL } from "@/lib/lead-webhook";
import { REQUEST_TYPES } from "@/content/privacy-ccpa";

/**
 * Privacy requests (know / delete / correct / opt out) go to their OWN webhook,
 * GHL_PRIVACY_WEBHOOK_URL, with form_name "privacy_request". They never touch the lead
 * webhook, never redirect to the thank-you page, and never fire an ad conversion event.
 * Server-side so the webhook URL stays out of the browser.
 */
export const dynamic = "force-dynamic";

const TYPES = new Set<string>(REQUEST_TYPES.map((t) => t.value));
const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

export async function POST(req: Request) {
  const url = process.env.GHL_PRIVACY_WEBHOOK_URL;
  // Misconfiguration guard: the privacy webhook must exist and must never be the lead webhook.
  if (!url || url === LEAD_WEBHOOK_URL) {
    return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  // Honeypot: pretend success, send nothing.
  if (clip(body.website, 200)) return NextResponse.json({ ok: true });

  const request_type = clip(body.request_type, 20);
  const name = clip(body.name, 120);
  const email = clip(body.email, 160);
  const ca_resident = clip(body.ca_resident, 3);
  if (!TYPES.has(request_type) || !name || !/^\S+@\S+\.\S+$/.test(email) || !["yes", "no"].includes(ca_resident)) {
    return NextResponse.json({ error: "invalid" }, { status: 422 });
  }

  const payload = {
    form_name: "privacy_request",
    request_type,
    name,
    email,
    phone: clip(body.phone, 40),
    ca_resident,
    details: clip(body.details, 2000),
    submitted_at: new Date().toISOString(),
    source: "anchorsilvercapital.com/privacy-choices",
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return NextResponse.json({ error: "upstream" }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
}
