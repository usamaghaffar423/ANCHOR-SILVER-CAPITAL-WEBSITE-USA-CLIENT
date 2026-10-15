"use client";

import { useId, useState } from "react";
import { buttonStyles } from "@/components/site/ui";
import {
  LEAD_WEBHOOK_URL,
  NOTICE_VERSION,
  fetchVisitorIp,
  readUtmFields,
  toE164,
  trackUet,
} from "@/lib/lead";

const ACCOUNT_OPTIONS = [
  "401(k) from a former employer",
  "401(k) with a current employer",
  "Traditional IRA",
  "Roth IRA",
  "403(b), 457(b), or TSP",
  "Annuity",
  "SEP or SIMPLE IRA",
  "Other",
  "Not sure",
];

const VALUE_OPTIONS = [
  "Under $25,000",
  "$25,000 to $99,999",
  "$100,000 to $249,999",
  "$250,000 to $499,999",
  "$500,000 or more",
  "Prefer not to say",
];

const inputCls =
  "h-12 w-full rounded border border-border bg-background px-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1";
const labelCls = "text-sm font-semibold text-foreground";

/**
 * Native replacement for every embedded GHL form. POSTs the universal lead
 * payload (Landing dev instructions §1–2) straight to the GHL inbound
 * webhook — E.164 phone, UTM/msclkid capture, `website` honeypot, visitor IP —
 * then shows the thank-you state with the handbook download and fires the
 * UET `lead` event. No consent checkboxes: the compliance notice renders
 * directly under the submit button on every instance.
 */
export function LeadForm({
  submitLabel = "Request a Callback",
  className = "",
}: {
  submitLabel?: string;
  className?: string;
}) {
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const form = e.currentTarget;
    const val = (n: string) => (form.elements.namedItem(n) as HTMLInputElement | HTMLSelectElement | null)?.value ?? "";

    if (val("website")) return; // honeypot — silently drop

    const first = form.elements.namedItem("first_name") as HTMLInputElement | null;
    const phone = form.elements.namedItem("phone") as HTMLInputElement | null;
    const email = form.elements.namedItem("email") as HTMLInputElement | null;
    const acct = form.elements.namedItem("account_type") as HTMLSelectElement | null;
    const bal = form.elements.namedItem("approx_value") as HTMLSelectElement | null;
    if (!first || !phone || !email || !acct || !bal) return;

    if (!first.value.trim()) {
      setErr("Please enter your first name.");
      first.focus();
      return;
    }
    const e164 = toE164(phone.value);
    if (!e164) {
      setErr("Please enter a 10-digit phone number.");
      phone.focus();
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) {
      setErr("Please enter a valid email address.");
      email.focus();
      return;
    }

    void (async () => {
      const payload = {
        first_name: first.value.trim(),
        phone: e164,
        email: email.value.trim(),
        account_type: acct.value || "Not Specified",
        approx_value: bal.value || "Not Specified",
        ip: await fetchVisitorIp(),
        page_url: location.href,
        ...readUtmFields(),
        notice_version: NOTICE_VERSION,
      };
      setSending(true);
      try {
        const r = await fetch(LEAD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        console.info(`[lead-form] webhook POST ${r.status} ${r.statusText}`);
        if (!r.ok) {
          const detail = await r.text().catch(() => "");
          console.error(`[lead-form] webhook non-200: ${r.status}`, detail);
          throw new Error(`webhook ${r.status}`);
        }
        trackUet("lead");
        setSent(true);
      } catch (e) {
        console.error("[lead-form] webhook request failed", e);
        setSending(false);
        setErr("Something went wrong. Please try again or call (866) 818-7243.");
      }
    })();
  }

  if (sent) {
    return (
      <div className={`py-8 text-center ${className}`} role="status">
        <h3 className="font-display text-xl text-foreground">
          Thank you. Your brochure is on its way, and a specialist will call you shortly.
        </h3>
        <a
          href="/precious-metals-ira-handbook.pdf"
          data-download=""
          className={`${buttonStyles.primary} mt-5 inline-flex`}
        >
          Download the handbook (PDF)
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={`grid gap-4 ${className}`}>
      <div className="grid gap-1.5">
        <label htmlFor={id("fname")} className={labelCls}>
          First name
        </label>
        <input id={id("fname")} name="first_name" type="text" autoComplete="given-name" required className={inputCls} />
      </div>
      <div className="grid gap-1.5">
        <label htmlFor={id("phone")} className={labelCls}>
          Phone
        </label>
        <input
          id={id("phone")}
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="(555) 555-5555"
          required
          className={inputCls}
        />
      </div>
      <div className="grid gap-1.5">
        <label htmlFor={id("email")} className={labelCls}>
          Email
        </label>
        <input id={id("email")} name="email" type="email" autoComplete="email" required className={inputCls} />
      </div>
      <div className="grid gap-1.5">
        <label htmlFor={id("acct")} className={labelCls}>
          Where is your retirement money now?
        </label>
        <select id={id("acct")} name="account_type" className={inputCls}>
          <option value="">Not Specified</option>
          {ACCOUNT_OPTIONS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-1.5">
        <label htmlFor={id("value")} className={labelCls}>
          Approximate value
        </label>
        <select id={id("value")} name="approx_value" className={inputCls}>
          <option value="">Not Specified</option>
          {VALUE_OPTIONS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      {/* Honeypot — never filled by humans, never submitted */}
      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor={id("website")}>Leave this field empty</label>
        <input id={id("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <p role="alert" className="min-h-[1.2em] text-sm text-[#9B3B2E]">
        {err}
      </p>
      <button
        type="submit"
        disabled={sending}
        className={`${buttonStyles.primary} h-12 w-full disabled:opacity-60`}
      >
        {sending ? "Sending..." : submitLabel}
      </button>
      <p className="text-xs leading-relaxed text-muted-foreground">
        By submitting, you agree Anchor Silver Capital LLC may call, text, or email you about your
        inquiry. Message and data rates may apply. Reply STOP to opt out of texts. See our{" "}
        <a href="/terms" className="underline underline-offset-2 hover:text-foreground">
          Terms of Use
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline underline-offset-2 hover:text-foreground">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
