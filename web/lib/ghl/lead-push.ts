/**
 * Site-specific lead → GHL bridge, called from /api/lead's fan-out.
 *
 * Behavior:
 *   - upsert (never duplicate) by email/phone
 *   - tags: website + source form + interest + amount bracket
 *   - custom fields: driven by GHL_FIELD_MAP `{"interest":"<customFieldId>",…}`
 *   - optional workflow enrollment via GHL_WORKFLOW_ID
 *
 * Throws on failure so `Promise.allSettled` in the route keeps it non-fatal —
 * the lead is already in Turso by the time this runs. Unconfigured = skip.
 */

import { ghlRequest } from "./client";
import { getGhlConfig, isGhlConfigured } from "./config";
import { upsertContact } from "./contacts";
import type { GhlContactCreatePayload, GhlCustomField, GhlContact } from "./types";

export type GhlLead = {
  fullName: string;
  email: string;
  phone: string;
  interest: string;
  amountBracket?: string | null;
  bestTimeToCall?: string | null;
  sourceForm: string;
  sourcePage?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  message?: string | null;
  howHeard?: string | null;
  consentTcpa: boolean;
};

/** Pure mapping — covered by scripts/ghl/mapping.test.ts. */
export function leadToContactPayload(
  lead: GhlLead,
  fieldMap: Record<string, string>,
): Partial<GhlContactCreatePayload> & { email: string; phone: string } {
  const [firstName, ...rest] = lead.fullName.trim().split(/\s+/);
  const lastName = rest.join(" ");

  const tags = [
    "website",
    "anchorsilvercapital",
    lead.sourceForm,
    lead.interest,
    ...(lead.amountBracket ? [lead.amountBracket] : []),
  ];

  const customFields: GhlCustomField[] = [];
  for (const [leadField, customFieldId] of Object.entries(fieldMap)) {
    const value = (lead as Record<string, unknown>)[leadField];
    if (value === undefined || value === null || value === "") continue;
    customFields.push({ id: customFieldId, value: String(value) });
  }

  return {
    firstName,
    ...(lastName ? { lastName } : {}),
    name: lead.fullName,
    email: lead.email,
    phone: lead.phone,
    source: `anchorsilvercapital.com (${lead.sourceForm})`,
    tags,
    ...(customFields.length ? { customFields } : {}),
  };
}

async function enrollInWorkflow(contactId: string, workflowId: string): Promise<void> {
  await ghlRequest<unknown>(
    "POST",
    `/contacts/${contactId}/workflow/${workflowId}`,
    { body: { eventStartTime: new Date().toISOString() }, retryOn5xx: false },
  );
}

export async function pushLeadToGhl(lead: GhlLead): Promise<void> {
  if (!isGhlConfigured()) return; // not configured yet — skip

  const cfg = getGhlConfig();
  const payload = leadToContactPayload(lead, cfg.fieldMap);
  const contact: GhlContact = await upsertContact(payload);

  if (cfg.workflowId && contact.id) {
    await enrollInWorkflow(contact.id, cfg.workflowId);
  }
}
