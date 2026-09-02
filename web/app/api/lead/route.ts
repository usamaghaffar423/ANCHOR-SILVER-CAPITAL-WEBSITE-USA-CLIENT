import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation";
import { verifyTurnstile } from "@/lib/turnstile";
import {
  buildLeadRecord,
  persistLead,
  updateLeadStatuses,
  isDuplicate,
} from "@/lib/leads";
import { sendBrochureEmail, notifyOwner } from "@/lib/email";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 16 * 1024;

// Very small per-IP rate limit (per lambda instance — good enough as a first
// layer alongside Turnstile + honeypot).
const hits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = req.headers.get("user-agent") ?? undefined;

  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "payload_too_large" }, { status: 413 });
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }
  const lead = parsed.data;

  // Honeypot — a filled `company` field means a bot. Accept silently.
  if (lead.company) {
    return NextResponse.json({ ok: true, id: "ignored" });
  }

  if (!(await verifyTurnstile(lead.turnstileToken, ip === "unknown" ? undefined : ip))) {
    return NextResponse.json({ ok: false, error: "turnstile" }, { status: 403 });
  }

  if (isDuplicate(lead.email)) {
    // Idempotent: treat a rapid re-submit as success without re-sending.
    return NextResponse.json({ ok: true, id: "duplicate" });
  }

  // DB write precedes every external call (lead is never lost). Turso is
  // deferred; `persistLead` currently writes the structured log.
  const record = buildLeadRecord(lead, { ip, userAgent });
  try {
    await persistLead(record);
  } catch (err) {
    console.error(JSON.stringify({ tag: "lead.persist.error", id: record.id, err: String(err) }));
    return NextResponse.json({ ok: false, error: "persist_failed" }, { status: 500 });
  }

  const [brochure, owner] = await Promise.allSettled([
    sendBrochureEmail(record),
    notifyOwner(record),
  ]);

  const legStatus = (r: PromiseSettledResult<{ status: string }>) =>
    r.status === "fulfilled"
      ? (r.value.status as "sent" | "skipped" | "failed")
      : ("failed" as const);

  const emailStatus = legStatus(brochure);
  const notifyStatus = legStatus(owner);
  await updateLeadStatuses(record.id, { emailStatus, notifyStatus, ghlStatus: "skipped" });

  if (brochure.status === "rejected") {
    console.error(JSON.stringify({ tag: "lead.brochure.error", id: record.id, err: String(brochure.reason) }));
  }
  if (owner.status === "rejected") {
    console.error(JSON.stringify({ tag: "lead.notify.error", id: record.id, err: String(owner.reason) }));
  }

  // Success as soon as the lead is captured — a failed/skipped email leg is a
  // retryable follow-up, not an error for the visitor.
  return NextResponse.json({ ok: true, id: record.id, emailStatus });
}
