"use client";

import { useState } from "react";
import { LEAD_WEBHOOK_URL, NOTICE_VERSION, fetchVisitorIp } from "@/lib/lead";

/**
 * General contact form (name, email, message). Posts to the existing GHL inbound
 * webhook with the list:satellite-contact tag and form_type=contact so the
 * workflow can route it separately from a sales lead. Success is shown only after
 * the webhook answers OK.
 */
export function SatContactForm({ source }: { source: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (hp) return; // honeypot
    if (!name.trim()) return setErr("Please enter your name.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return setErr("Please enter a valid email address.");
    if (message.trim().length < 3) return setErr("Please enter a message.");
    setErr("");
    setState("sending");
    try {
      const res = await fetch(LEAD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: name.trim(),
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          tags: ["list:satellite-contact"],
          tag: "list:satellite-contact",
          form_type: "contact",
          lead_source: source,
          ip: await fetchVisitorIp(),
          page_url: location.href,
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

  if (state === "done") {
    return (
      <p role="status" className="sat-signup-ok">
        Thank you. Your message has been sent and we will reply by email.
      </p>
    );
  }

  return (
    <form className="sat-form sat-contact" onSubmit={onSubmit} noValidate>
      <label>
        Name
        <input className="sat-input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
      </label>
      <label>
        Email
        <input
          className="sat-input"
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </label>
      <label>
        Message
        <textarea className="sat-input" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>
      <div className="sat-hp" aria-hidden="true">
        <input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} name="website" />
      </div>
      <button className="sat-btn" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Send message"}
      </button>
      {err && (
        <p role="alert" className="sat-signup-err">
          {err}
        </p>
      )}
    </form>
  );
}
