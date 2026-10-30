"use client";

import { useId, useState, type FormEvent } from "react";
import { PRIVACY_CHOICES_PAGE, PRIVACY_CONTACT, REQUEST_TYPES } from "@/content/privacy-ccpa";

const inputCls =
  "h-11 w-full rounded-sm border border-border bg-background px-3 text-base text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary";
const labelCls = "text-sm font-medium text-foreground";

type Status = "idle" | "sending" | "done" | "unavailable" | "invalid";

/**
 * Privacy request form. Posts to /api/privacy-request (server side), which forwards to the
 * dedicated privacy webhook. It never goes to the lead webhook, never redirects to the
 * thank-you page, and never fires an advertising conversion event.
 */
export function PrivacyRequestForm() {
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const f = new FormData(e.currentTarget);
    const payload = {
      request_type: String(f.get("request_type") ?? ""),
      name: String(f.get("name") ?? "").trim(),
      email: String(f.get("email") ?? "").trim(),
      phone: String(f.get("phone") ?? "").trim(),
      ca_resident: String(f.get("ca_resident") ?? ""),
      details: String(f.get("details") ?? "").trim(),
      website: String(f.get("website") ?? ""),
    };
    if (!payload.request_type || !payload.name || !/^\S+@\S+\.\S+$/.test(payload.email) || !payload.ca_resident) {
      setStatus("invalid");
      setErr("Please choose a request type, and enter your name, a valid email, and whether you are a California resident.");
      return;
    }
    setStatus("sending");
    setErr("");
    try {
      const res = await fetch("/api/privacy-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus("done");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("unavailable");
      }
    } catch {
      setStatus("unavailable");
    }
  }

  if (status === "done") {
    return (
      <p role="status" className="rounded-sm border border-primary/30 bg-primary/5 p-4 text-base leading-relaxed text-foreground">
        {PRIVACY_CHOICES_PAGE.requestSuccess}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <div className="grid gap-1.5">
        <label htmlFor={id("type")} className={labelCls}>
          Request type
        </label>
        <select id={id("type")} name="request_type" required defaultValue="" className={inputCls}>
          <option value="" disabled>
            Choose one
          </option>
          {REQUEST_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <label htmlFor={id("name")} className={labelCls}>
            Full name
          </label>
          <input id={id("name")} name="name" type="text" autoComplete="name" required maxLength={120} className={inputCls} />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor={id("email")} className={labelCls}>
            Email
          </label>
          <input id={id("email")} name="email" type="email" autoComplete="email" required maxLength={160} className={inputCls} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <label htmlFor={id("phone")} className={labelCls}>
            Phone <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input id={id("phone")} name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={40} className={inputCls} />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor={id("ca")} className={labelCls}>
            Are you a California resident?
          </label>
          <select id={id("ca")} name="ca_resident" required defaultValue="" className={inputCls}>
            <option value="" disabled>
              Choose one
            </option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>
      <div className="grid gap-1.5">
        <label htmlFor={id("details")} className={labelCls}>
          Details <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea id={id("details")} name="details" rows={4} maxLength={2000} className={`${inputCls} h-auto py-2`} />
      </div>

      {/* Honeypot: never filled by people. */}
      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor={id("website")}>Leave this field empty</label>
        <input id={id("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <p role="alert" className="min-h-[1.2em] text-sm text-[#9B3B2E]">
        {status === "invalid" ? err : ""}
        {status === "unavailable" ? (
          <>
            {PRIVACY_CHOICES_PAGE.requestUnavailable} ({PRIVACY_CONTACT.email}, {PRIVACY_CONTACT.tollFree})
          </>
        ) : null}
      </p>
      <button
        type="submit"
        disabled={status === "sending"}
        className="h-12 rounded-sm bg-primary px-6 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-fit"
      >
        {status === "sending" ? "Sending…" : "Submit request"}
      </button>
    </form>
  );
}
