import { randomUUID } from "node:crypto";
import type { Lead } from "@/lib/validation";
import { resolveInterest, brochureForInterest } from "@/lib/validation";

/**
 * Lead persistence.
 *
 * SPEC: the lead-pipeline spec requires the lead to be written to Turso BEFORE
 * any email is attempted, so a downstream failure becomes a retryable row rather
 * than a lost lead. Turso/Drizzle wiring is deferred until the custom domain is
 * assigned (per the client). Until then every lead is written to the structured
 * log (recoverable from the Vercel log drain) and nothing is silently dropped.
 *
 * To finish the spec later:
 *   1. add `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`
 *   2. implement `lib/db/{client,schema}.ts` (Drizzle + @libsql/client)
 *   3. replace the log calls below with `db.insert(leads)` / `db.update(leads)`
 * The record shape here already matches IMPLEMENTATION.md §6.
 */

export type LegStatus = "pending" | "sent" | "failed" | "skipped";

export interface LeadRecord {
  id: string;
  createdAt: number;
  fullName: string;
  email: string;
  phone: string;
  bestTimeToCall?: string;
  amountBracket?: string;
  interest: string;
  product?: string;
  message?: string;
  howHeard?: string;
  sourceForm: string;
  sourcePage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  consentTcpa: boolean;
  brochureVariant: "ira_handbook" | "prospectus";
  emailStatus: LegStatus;
  notifyStatus: LegStatus;
  ghlStatus: LegStatus;
  ghlContactId?: string;
  ip?: string;
  userAgent?: string;
}

export function buildLeadRecord(
  lead: Lead,
  meta: { ip?: string; userAgent?: string },
): LeadRecord {
  const interest = resolveInterest(lead);
  return {
    id: randomUUID(),
    createdAt: Date.now(),
    fullName: lead.fullName,
    email: lead.email,
    phone: lead.phone,
    bestTimeToCall: lead.bestTimeToCall,
    amountBracket: lead.amountBracket,
    interest,
    product: lead.product,
    message: lead.message,
    howHeard: lead.howHeard,
    sourceForm: lead.sourceForm,
    sourcePage: lead.sourcePage,
    utmSource: lead.utmSource,
    utmMedium: lead.utmMedium,
    utmCampaign: lead.utmCampaign,
    utmTerm: lead.utmTerm,
    utmContent: lead.utmContent,
    consentTcpa: lead.consentTcpa,
    brochureVariant: brochureForInterest(interest),
    emailStatus: "pending",
    notifyStatus: "pending",
    ghlStatus: "skipped",
    ip: meta.ip,
    userAgent: meta.userAgent,
  };
}

export async function persistLead(record: LeadRecord): Promise<void> {
  // TODO(turso): db.insert(leads).values(record)
  console.info(JSON.stringify({ tag: "lead.persist", ...redactForLog(record) }));
}

export async function updateLeadStatuses(
  id: string,
  statuses: Partial<Pick<LeadRecord, "emailStatus" | "notifyStatus" | "ghlStatus" | "ghlContactId">>,
): Promise<void> {
  // TODO(turso): db.update(leads).set(statuses).where(eq(leads.id, id))
  console.info(JSON.stringify({ tag: "lead.status", id, ...statuses }));
}

/** In-memory dedupe so a double-submit within a short window is idempotent. */
const recentByEmail = new Map<string, number>();
const DEDUPE_WINDOW_MS = 60_000;

export function isDuplicate(email: string): boolean {
  const now = Date.now();
  for (const [key, ts] of recentByEmail) {
    if (now - ts > DEDUPE_WINDOW_MS) recentByEmail.delete(key);
  }
  const last = recentByEmail.get(email);
  recentByEmail.set(email, now);
  return last !== undefined && now - last < DEDUPE_WINDOW_MS;
}

function redactForLog(r: LeadRecord) {
  return {
    ...r,
    email: r.email.replace(/(.).*(@.*)/, "$1***$2"),
    phone: r.phone.replace(/.(?=.{2})/g, "*"),
  };
}
