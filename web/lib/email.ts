import { Resend } from "resend";
import { getBrochureUrl } from "./storage";
import BrochureEmail from "@/emails/brochure-email";

/**
 * Transactional email via Resend. Two legs:
 *   sendBrochure  — the guide, to the visitor
 *   notifyOwner   — a plain summary, to OWNER_NOTIFY_EMAIL
 *
 * Both throw on failure so `Promise.allSettled` in the route can record
 * `email_status` / `notify_status` = "failed" without blocking the other leg or
 * the response. The lead is already saved by the time these run.
 *
 * `RESEND_FROM` overrides the default sender — set it to a Resend-verified
 * domain for testing until `anchorsilvercapital.com` is verified.
 */

const FROM = process.env.RESEND_FROM || "Anchor Silver Capital <info@anchorsilvercapital.com>";
const PHONE = "(866) 818-7243";

/** Lazy — `new Resend()` throws with no key, and we don't want that at build time. */
let _resend: Resend | null = null;
function resend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not set");
    _resend = new Resend(key);
  }
  return _resend;
}

export async function sendBrochure(lead: {
  email: string;
  fullName: string;
  interest: string;
}): Promise<void> {
  const firstName = lead.fullName.split(" ")[0] || lead.fullName;
  const brochureUrl = getBrochureUrl(lead.interest);
  const brochureTitle =
    lead.interest === "silver_ira" ? "The Silver IRA Handbook" : "The Silver Prospectus";

  const { error } = await resend().emails.send({
    from: FROM,
    to: lead.email,
    subject: `Your ${brochureTitle} from Anchor Silver Capital`,
    react: BrochureEmail({ firstName, brochureTitle, brochureUrl, phone: PHONE }),
  });

  if (error) throw new Error(`Resend brochure error: ${error.message}`);
}

export async function notifyOwner(lead: {
  fullName: string;
  email: string;
  phone: string;
  interest: string;
  amountBracket?: string | null;
  bestTimeToCall?: string | null;
  sourcePage?: string | null;
  message?: string | null;
}): Promise<void> {
  const to = process.env.OWNER_NOTIFY_EMAIL;
  if (!to) throw new Error("OWNER_NOTIFY_EMAIL is not set");

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 0;color:#5a6a68;width:140px">${label}</td>
      <td style="padding:8px 0;font-weight:600">${escapeHtml(value)}</td>
    </tr>`;

  const { error } = await resend().emails.send({
    from: FROM,
    to,
    subject: `New lead: ${lead.fullName} (${lead.interest})`,
    html: `
      <h2 style="font-family:sans-serif;color:#14312b">New lead — Anchor Silver Capital</h2>
      <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
        ${row("Name", lead.fullName)}
        ${row("Phone", lead.phone)}
        ${row("Email", lead.email)}
        ${row("Interest", lead.interest)}
        ${row("Amount", lead.amountBracket ?? "—")}
        ${row("Best time", lead.bestTimeToCall ?? "—")}
        ${row("Source", lead.sourcePage ?? "—")}
        ${row("Message", lead.message ?? "—")}
      </table>`,
  });

  if (error) throw new Error(`Resend notify error: ${error.message}`);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
