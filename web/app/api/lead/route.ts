import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { leads } from "@/lib/db/schema";
import { leadSchema } from "@/lib/validation";
import { sendBrochure, notifyOwner } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // 1. Parse
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  // 2. Validate
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // 3. Honeypot — silent reject
  if (data.honeypot) {
    return NextResponse.json({ ok: true, id: "bot" });
  }

  // 4. Pick brochure variant
  const brochureVariant = data.interest === "silver_ira" ? "ira_handbook" : "prospectus";

  // 5. Write to DB FIRST — the lead is never lost
  const id = randomUUID();
  const now = Date.now();

  try {
    await db.insert(leads).values({
      id,
      createdAt: now,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      bestTimeToCall: data.bestTimeToCall ?? null,
      amountBracket: data.amountBracket ?? null,
      interest: data.interest,
      message: data.message ?? null,
      howHeard: data.howHeard ?? null,
      sourceForm: data.sourceForm,
      sourcePage: data.sourcePage ?? null,
      utmSource: data.utmSource || null,
      utmMedium: data.utmMedium || null,
      utmCampaign: data.utmCampaign || null,
      consentTcpa: data.consentTcpa,
      brochureVariant,
      emailStatus: "pending",
      notifyStatus: "pending",
      ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      userAgent: req.headers.get("user-agent") ?? null,
    });
  } catch (err) {
    console.error("[lead] DB insert failed:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to save. Please try again." },
      { status: 500 },
    );
  }

  // 6. Fan out — independently retryable
  const [brochureResult, notifyResult] = await Promise.allSettled([
    sendBrochure({
      email: data.email,
      fullName: data.fullName,
      interest: data.interest,
    }),
    notifyOwner({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      interest: data.interest,
      amountBracket: data.amountBracket ?? null,
      bestTimeToCall: data.bestTimeToCall ?? null,
      sourcePage: data.sourcePage ?? null,
      message: data.message ?? null,
    }),
  ]);

  // 7. Update status columns
  const emailStatus = brochureResult.status === "fulfilled" ? "sent" : "failed";
  const notifyStatus = notifyResult.status === "fulfilled" ? "sent" : "failed";

  if (brochureResult.status === "rejected") {
    console.error("[lead] brochure email failed, id:", id, brochureResult.reason);
  }
  if (notifyResult.status === "rejected") {
    console.error("[lead] owner notify failed, id:", id, notifyResult.reason);
  }

  try {
    await db.update(leads).set({ emailStatus, notifyStatus }).where(eq(leads.id, id));
  } catch (err) {
    console.error("[lead] status update failed:", err);
    // Non-fatal — the lead is already saved
  }

  // 8. Always return ok if the lead was saved
  return NextResponse.json({ ok: true, id });
}
