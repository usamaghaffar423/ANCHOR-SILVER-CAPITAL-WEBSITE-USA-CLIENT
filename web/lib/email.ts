import { readFile } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";
import { SITE } from "@/lib/site";
import type { LeadRecord } from "@/lib/leads";
import { brochureEmailHtml, ownerNotifyHtml } from "@/emails/templates";

/**
 * Transactional email via Resend. All config is server-only env:
 *   RESEND_API_KEY       — Resend API key
 *   RESEND_FROM          — verified sender, e.g. "Anchor Silver Capital <brochure@mail.anchorsilvercapital.com>"
 *   OWNER_NOTIFY_EMAIL   — internal inbox for new-lead notifications
 *
 * Until RESEND_API_KEY is set, send calls no-op and report "skipped" so the rest
 * of the pipeline (and the site) keeps working. See emails/README.md.
 */

const BROCHURES: Record<LeadRecord["brochureVariant"], { file: string; label: string }> = {
  ira_handbook: { file: "ira-handbook.pdf", label: "Silver IRA Handbook" },
  prospectus: { file: "prospectus.pdf", label: "Precious Metals Prospectus" },
};

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
}

function client(): Resend {
  return new Resend(process.env.RESEND_API_KEY);
}

async function loadBrochure(
  variant: LeadRecord["brochureVariant"],
): Promise<{ filename: string; content: Buffer; label: string } | null> {
  const order = [BROCHURES[variant], BROCHURES[variant === "ira_handbook" ? "prospectus" : "ira_handbook"]];
  for (const b of order) {
    try {
      const content = await readFile(path.join(process.cwd(), "brochures", b.file));
      return { filename: b.file, content, label: b.label };
    } catch {
      // try the fallback brochure
    }
  }
  console.warn("[email] no brochure PDF found in web/brochures/ — sending without attachment");
  return null;
}

export type SendResult =
  | { status: "sent" }
  | { status: "skipped"; reason: string }
  | { status: "failed"; reason: string };

export async function sendBrochureEmail(lead: LeadRecord): Promise<SendResult> {
  if (!emailConfigured()) return { status: "skipped", reason: "RESEND not configured" };

  const brochure = await loadBrochure(lead.brochureVariant);
  try {
    const { error } = await client().emails.send({
      from: process.env.RESEND_FROM!,
      to: lead.email,
      subject: `Your ${brochure?.label ?? "precious metals"} from Anchor Silver Capital`,
      html: brochureEmailHtml({ firstName: lead.fullName.split(" ")[0], brochureLabel: brochure?.label }),
      attachments: brochure
        ? [{ filename: brochure.filename, content: brochure.content }]
        : undefined,
      replyTo: SITE.email,
    });
    if (error) return { status: "failed", reason: error.message };
    return { status: "sent" };
  } catch (err) {
    return { status: "failed", reason: err instanceof Error ? err.message : String(err) };
  }
}

export async function notifyOwner(lead: LeadRecord): Promise<SendResult> {
  const to = process.env.OWNER_NOTIFY_EMAIL;
  if (!emailConfigured() || !to) return { status: "skipped", reason: "RESEND/OWNER_NOTIFY_EMAIL not configured" };

  try {
    const { error } = await client().emails.send({
      from: process.env.RESEND_FROM!,
      to,
      subject: `New lead: ${lead.fullName} (${lead.sourceForm})`,
      html: ownerNotifyHtml(lead),
      replyTo: lead.email,
    });
    if (error) return { status: "failed", reason: error.message };
    return { status: "sent" };
  } catch (err) {
    return { status: "failed", reason: err instanceof Error ? err.message : String(err) };
  }
}
