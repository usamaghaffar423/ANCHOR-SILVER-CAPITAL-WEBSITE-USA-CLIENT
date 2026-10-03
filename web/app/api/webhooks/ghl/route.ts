import { NextRequest, NextResponse } from "next/server";
import { dispatchGhlEvent, parseGhlWebhook, verifyGhlSignature } from "@/lib/ghl";
import type { GhlWebhookEvent } from "@/lib/ghl";

export const runtime = "nodejs";

/**
 * GHL inbound webhook listener.
 *
 * Verification flow (per GHL's Webhook Integration Guide):
 *   1. read the RAW body — the signature covers the exact bytes received
 *   2. verify `X-GHL-Signature` (Ed25519, base64) against GHL's public key
 *   3. only then parse JSON and dispatch
 *
 * Always answers 200 once verified (even if a handler fails) so GHL doesn't
 * retry-storm; rejections (bad/missing signature) return 401.
 *
 * Subscribe to events in the Marketplace app → Advanced Settings → Webhooks
 * and point it at: https://anchorsilvercapital.com/api/webhooks/ghl
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const signature =
    req.headers.get("x-ghl-signature") ?? req.headers.get("X-GHL-Signature") ?? null;

  const result = verifyGhlSignature(rawBody, signature);
  if (!result.valid) {
    console.warn(`[ghl:webhook] rejected: ${result.reason ?? "unknown"}`);
    return NextResponse.json({ ok: false, error: result.reason ?? "invalid signature" }, { status: 401 });
  }

  let event: GhlWebhookEvent;
  try {
    event = parseGhlWebhook(rawBody) as GhlWebhookEvent;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid JSON" }, { status: 400 });
  }

  if (!event || typeof event.type !== "string") {
    return NextResponse.json({ ok: false, error: "missing event type" }, { status: 400 });
  }

  const dispatch = await dispatchGhlEvent(event);
  return NextResponse.json({ ok: true, type: dispatch.type, handled: dispatch.handled });
}

export async function GET() {
  return NextResponse.json(
    { ok: true, service: "ghl-webhook-listener", note: "POST only" },
    { status: 405 },
  );
}
