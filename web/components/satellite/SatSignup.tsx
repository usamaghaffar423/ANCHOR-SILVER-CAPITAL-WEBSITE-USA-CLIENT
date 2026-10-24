"use client";

import { useState } from "react";
import { LEAD_WEBHOOK_URL, NOTICE_VERSION, fetchVisitorIp, readUtmFields } from "@/lib/lead";

/**
 * Email-only "price by email every morning" signup. Posts to the same GHL
 * inbound webhook as the lead forms, marked with the list tag (and
 * form_type=price_alert) so the GHL workflow can route it separately from a
 * sales lead. The success message shows only after the webhook answers OK.
 */
export function SatSignup({
  heading,
  text,
  tag,
  source,
}: {
  heading: string;
  text: string;
  tag: string;
  source: string;
}) {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (hp) return; // honeypot
    const addr = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(addr)) {
      setErr("Please enter a valid email address.");
      return;
    }
    setErr("");
    setState("sending");
    try {
      const res = await fetch(LEAD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: addr,
          tags: [tag],
          tag,
          form_type: "price_alert",
          lead_source: source,
          ip: await fetchVisitorIp(),
          page_url: location.href,
          ...readUtmFields(),
          notice_version: NOTICE_VERSION,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("done");
    } catch {
      setState("error");
      setErr("Something went wrong. Please try again in a moment.");
    }
  }

  return (
    <section className="sat-signup" aria-label="Daily price email">
      <h2>{heading}</h2>
      <p>{text}</p>
      {state === "done" ? (
        <p role="status" className="sat-signup-ok">
          Thanks, you are on the list. We will email the price each morning.
        </p>
      ) : (
        <form onSubmit={onSubmit} noValidate>
          <label className="sr-only" htmlFor="alert-email">
            Email address
          </label>
          <input
            id="alert-email"
            className="sat-input"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="sat-hp" aria-hidden="true">
            <input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} name="website" />
          </div>
          <button className="sat-btn" type="submit" disabled={state === "sending"}>
            {state === "sending" ? "Sending…" : "Email me the price"}
          </button>
        </form>
      )}
      {err && state !== "done" && (
        <p role="alert" className="sat-signup-err">
          {err}
        </p>
      )}
      <p className="sat-note">
        By subscribing you agree to receive a daily price email from Anchor Silver Capital LLC, the
        publisher of this site. Unsubscribe at any time. See our <a href="/privacy">privacy policy</a>.
      </p>
    </section>
  );
}
