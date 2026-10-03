/**
 * GoHighLevel (GHL) contact push — runs alongside the Resend legs in
 * `/api/lead`. Creates the contact in the sub-account, then drops it into
 * the nurture workflow so GHL owns SMS/email follow-up.
 *
 * Throws on failure so `Promise.allSettled` in the route keeps it non-fatal —
 * the lead is already in Turso by the time this runs.
 *
 * Env (Cloudflare → Settings → Environment variables):
 *   GHL_API_KEY      — long-lived token: GHL → Settings → API & Webhooks → API Key
 *   GHL_LOCATION_ID  — sub-account (location) ID
 *   GHL_WORKFLOW_ID  — optional; workflow is only triggered when set
 *
 * Unconfigured (no key/location) = silently skipped, so the site keeps
 * working before the env vars are added.
 */

const GHL_API = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

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

function headers(apiKey: string): Record<string, string> {
  return {
    Authorization: `Bearer ${apiKey}`,
    Version: GHL_VERSION,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

export async function pushLeadToGhl(lead: GhlLead): Promise<void> {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) return; // not configured yet — skip

  const [firstName, ...rest] = lead.fullName.trim().split(/\s+/);
  const lastName = rest.join(" ") || undefined;

  const tags = [
    "website",
    "anchorsilvercapital",
    lead.sourceForm,
    lead.interest,
    ...(lead.amountBracket ? [lead.amountBracket] : []),
  ];

  const res = await fetch(`${GHL_API}/contacts/`, {
    method: "POST",
    headers: headers(apiKey),
    body: JSON.stringify({
      locationId,
      firstName,
      lastName,
      name: lead.fullName,
      email: lead.email,
      phone: lead.phone,
      source: `anchorsilvercapital.com (${lead.sourceForm})`,
      tags,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GHL create contact ${res.status}: ${body.slice(0, 300)}`);
  }

  const created = await res.json();
  const contactId: string | undefined = created?.contact?.id ?? created?.id;
  if (!contactId) throw new Error("GHL create contact: no contact id in response");

  // Optional — add to the nurture workflow (skipped when GHL_WORKFLOW_ID unset)
  const workflowId = process.env.GHL_WORKFLOW_ID;
  if (workflowId) {
    const wf = await fetch(`${GHL_API}/contacts/${contactId}/workflow/${workflowId}`, {
      method: "POST",
      headers: headers(apiKey),
      body: JSON.stringify({ eventStartTime: new Date().toISOString() }),
    });
    if (!wf.ok) {
      const body = await wf.text().catch(() => "");
      throw new Error(`GHL add to workflow ${wf.status}: ${body.slice(0, 300)}`);
    }
  }
}
