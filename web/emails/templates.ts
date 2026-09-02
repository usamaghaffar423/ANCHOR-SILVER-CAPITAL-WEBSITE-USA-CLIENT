import { SITE } from "@/lib/site";
import type { LeadRecord } from "@/lib/leads";

/**
 * Plain-HTML transactional templates (kept dependency-free on purpose).
 * If richer templates are wanted later, swap these for React Email components
 * and pass `react:` to `resend.emails.send`.
 */

const wrap = (inner: string) => `<!doctype html>
<html>
  <body style="margin:0;background:#f8f7f4;font-family:Inter,Arial,sans-serif;color:#2a2a2a">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px">
      <div style="font:600 14px/1 Georgia,serif;letter-spacing:.18em;text-transform:uppercase;color:#2c3e2d">
        Anchor Silver Capital
      </div>
      <div style="height:1px;background:#e3e1db;margin:16px 0 24px"></div>
      ${inner}
      <div style="height:1px;background:#e3e1db;margin:28px 0 16px"></div>
      <p style="font-size:12px;line-height:1.6;color:#6b6b6b;margin:0">
        ${SITE.legal} · ${SITE.street}, ${SITE.city}, ${SITE.state} ${SITE.zip} ·
        <a href="${SITE.phoneHref}" style="color:#2c3e2d">${SITE.phone}</a>
      </p>
      <p style="font-size:11px;line-height:1.6;color:#9a9a9a;margin:8px 0 0">
        ${SITE.legal} is a precious metals dealer, not a registered investment advisor. Precious
        metals involve risk. Past performance does not guarantee future results. You are receiving
        this because you requested information from anchorsilvercapital.com.
      </p>
    </div>
  </body>
</html>`;

export function brochureEmailHtml({
  firstName,
  brochureLabel,
}: {
  firstName?: string;
  brochureLabel?: string;
}): string {
  const hi = firstName ? `Hi ${escapeHtml(firstName)},` : "Hi,";
  const doc = brochureLabel ? escapeHtml(brochureLabel) : "requested guide";
  return wrap(`
    <p style="font-size:16px;margin:0 0 16px">${hi}</p>
    <p style="font-size:15px;line-height:1.7;margin:0 0 16px">
      Thank you for your interest in physical silver. Your <strong>${doc}</strong> is attached to
      this email as a PDF.
    </p>
    <p style="font-size:15px;line-height:1.7;margin:0 0 16px">
      A specialist will also reach out at the time you selected to answer any questions — no
      pressure, no hard sell. If you would rather talk now, call
      <a href="${SITE.phoneHref}" style="color:#2c3e2d;font-weight:600">${SITE.phone}</a>.
    </p>
    <p style="font-size:15px;line-height:1.7;margin:0">— The Anchor Silver Capital team</p>
  `);
}

export function ownerNotifyHtml(lead: LeadRecord): string {
  const row = (k: string, v?: string) =>
    v
      ? `<tr><td style="padding:6px 12px 6px 0;color:#6b6b6b;font-size:13px;vertical-align:top">${k}</td>
         <td style="padding:6px 0;font-size:13px">${escapeHtml(v)}</td></tr>`
      : "";
  return wrap(`
    <p style="font-size:16px;margin:0 0 16px">New lead from the ${escapeHtml(lead.sourceForm)} form</p>
    <table style="border-collapse:collapse;width:100%">
      ${row("Name", lead.fullName)}
      ${row("Email", lead.email)}
      ${row("Phone", lead.phone)}
      ${row("Best time", lead.bestTimeToCall)}
      ${row("Amount", lead.amountBracket)}
      ${row("Interest", lead.interest)}
      ${row("Product", lead.product)}
      ${row("How heard", lead.howHeard)}
      ${row("Message", lead.message)}
      ${row("Page", lead.sourcePage)}
      ${row("UTM source", lead.utmSource)}
      ${row("UTM campaign", lead.utmCampaign)}
      ${row("Lead ID", lead.id)}
    </table>
  `);
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}
