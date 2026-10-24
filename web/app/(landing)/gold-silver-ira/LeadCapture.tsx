"use client";

import { useEffect, useRef, useState } from "react";
import {
  BOOKING_URL,
  LEAD_WEBHOOK_URL,
  fetchVisitorIp,
  setUetEnhancedConversion,
  trackUet,
} from "@/lib/lead";

export function LeadCapture() {
  const formRef = useRef<HTMLFormElement>(null);
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const q: Record<string, string> = {};
    try {
      location.search
        .replace(/^\?/, "")
        .split("&")
        .forEach((p) => {
          if (!p) return;
          const kv = p.split("=");
          q[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || "").replace(/\+/g, " "));
        });
    } catch {
      /* noop */
    }
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "msclkid"].forEach((k) => {
      const el = document.getElementById(k) as HTMLInputElement | null;
      if (el && q[k]) el.value = q[k];
    });
    try {
      const pu = document.getElementById("page_url") as HTMLInputElement | null;
      if (pu) pu.value = location.href;
    } catch {
      /* noop */
    }

    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t) return;
      if (t.closest("[data-call]")) trackUet("phone_click");
      if (t.closest("[data-download]")) trackUet("handbook_download");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!sent) return;
    try {
      document.getElementById("thanks")?.scrollIntoView({ block: "nearest" });
    } catch {
      /* noop */
    }
  }, [sent]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const form = formRef.current;
    if (!form) return;
    const f = (name: string) =>
      form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null;

    const honeypot = f("website") as HTMLInputElement | null;
    if (honeypot?.value) return;

    const first = f("first_name") as HTMLInputElement | null;
    const phone = f("phone") as HTMLInputElement | null;
    const email = f("email") as HTMLInputElement | null;
    const acct = f("account_type") as HTMLSelectElement | null;
    const bal = f("approx_value") as HTMLSelectElement | null;
    if (!first || !phone || !email || !acct || !bal) return;

    let digits = phone.value.replace(/\D/g, "");
    if (!first.value.trim()) {
      setErr("Please enter your name.");
      first.focus();
      return;
    }
    if (digits.length === 11 && digits[0] === "1") digits = digits.slice(1);
    if (digits.length !== 10) {
      setErr("Please enter a 10-digit phone number.");
      phone.focus();
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) {
      setErr("Please enter a valid email address.");
      email.focus();
      return;
    }
    const data: Record<string, string> = {};
    Array.prototype.forEach.call(form.elements, (el: HTMLInputElement | HTMLSelectElement) => {
      if (el.name && el.name !== "website") data[el.name] = el.value;
    });
    data.phone = "+1" + digits;
    // Both selects are optional: send what the visitor chose, otherwise the same
    // "Not Specified" default the site-wide LeadForm sends to GHL.
    data.account_type = acct.value || "Not Specified";
    data.approx_value = bal.value || "Not Specified";

    function done() {
      // The submitted email and E.164 phone, set right before the lead event.
      setUetEnhancedConversion((data.email ?? "").trim(), data.phone);
      trackUet("lead", { event_category: "lead_form", event_label: "landing_page" });
      setSent(true);
    }

    setSending(true);
    void (async () => {
      data.ip = await fetchVisitorIp();
      console.log("Submitting payload:", data);
      fetch(LEAD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(async (r) => {
          console.log("Response status:", r.status);
          console.info(`[lead-capture] webhook POST ${r.status} ${r.statusText}`);
          if (!r.ok) {
            const detail = await r.text().catch(() => "");
            console.error(`[lead-capture] webhook non-200: ${r.status}`, detail);
            throw new Error(`webhook ${r.status}`);
          }
          done();
        })
        .catch((e) => {
          console.error("[lead-capture] webhook request failed", e);
          setSending(false);
          setErr("Something went wrong. Please try again or call (866) 818-7243.");
        });
    })();
  }

  return (
    <>
      <div id="formView" hidden={sent}>
        <h2>Send me the free handbook</h2>
        <p className="sub">A specialist will also call you shortly to answer your questions.</p>
        <form id="leadForm" ref={formRef} noValidate onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="fname">Name</label>
            <input id="fname" name="first_name" type="text" autoComplete="name" required />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="(555) 555-5555"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="field">
            <label htmlFor="acct">
              Where is your retirement money now? <span className="opt">(optional)</span>
            </label>
            <select id="acct" name="account_type">
              <option value="">Choose one</option>
              <option>401(k) from a former employer</option>
              <option>401(k) with a current employer</option>
              <option>Traditional IRA</option>
              <option>Roth IRA</option>
              <option>403(b), 457(b), or TSP</option>
              <option>Annuity</option>
              <option>SEP or SIMPLE IRA</option>
              <option>Other</option>
              <option>Not sure</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="bal">
              Approximate value <span className="opt">(optional)</span>
            </label>
            <select id="bal" name="approx_value">
              <option value="">Choose one</option>
              <option>Under $25,000</option>
              <option>$25,000 to $99,999</option>
              <option>$100,000 to $249,999</option>
              <option>$250,000 to $499,999</option>
              <option>$500,000 or more</option>
              <option>Prefer not to say</option>
            </select>
          </div>
          <div className="hp" aria-hidden="true">
            <label htmlFor="website">Leave this field empty</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <input type="hidden" name="page_url" id="page_url" />
          <input type="hidden" name="utm_source" id="utm_source" />
          <input type="hidden" name="utm_medium" id="utm_medium" />
          <input type="hidden" name="utm_campaign" id="utm_campaign" />
          <input type="hidden" name="utm_term" id="utm_term" />
          <input type="hidden" name="utm_content" id="utm_content" />
          <input type="hidden" name="msclkid" id="msclkid" />
          <input type="hidden" name="notice_version" defaultValue="v2.0" />
          <div className="err" id="err" role="alert">
            {err}
          </div>
          <button className="go" type="submit" disabled={sending}>
            {sending ? "Sending..." : "Send me the handbook"}
          </button>
          <p className="notice">
            By submitting, you agree Anchor Silver Capital LLC may call, text, or email you about
            your inquiry. Message and data rates may apply. Reply STOP to opt out of texts. See our{" "}
            <a href="/terms">Terms of Use</a> and <a href="/privacy">Privacy Policy</a>.
          </p>
        </form>
      </div>
      <div className={sent ? "thanks on" : "thanks"} id="thanks" aria-live="polite">
        <h2>Thank you. Your handbook is on its way.</h2>
        <p>
          We are emailing it to you now. A specialist will call you shortly. You can also reach us at{" "}
          <span className="num">(866) 818-7243</span>.
        </p>
        {BOOKING_URL ? (
          <a className="dl" href={BOOKING_URL} rel="noopener">
            Pick a time for your call
          </a>
        ) : (
          <>
            <button type="button" className="dl" disabled aria-disabled="true">
              Pick a time for your call
            </button>
            <p className="hint">Online scheduling is coming soon.</p>
          </>
        )}
      </div>
    </>
  );
}
