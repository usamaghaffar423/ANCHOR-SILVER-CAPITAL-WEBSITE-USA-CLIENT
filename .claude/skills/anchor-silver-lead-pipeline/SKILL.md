---
name: anchor-silver-lead-pipeline
description: Wire and extend lead-capture on the Anchor Silver Capital Next.js site — the /api/lead route handler that validates, stores, emails the brochure, and pushes to GHL, plus the forms that feed it and the market widget. Use for any task touching a form, the brochure email, the CRM push, Turnstile/consent, or the spot-price widget on this project.
---

# Anchor Silver — Lead Pipeline Skill

## When to use
Any task on this repo that touches lead capture: wiring `CallbackForm`, adding a new form or landing page, changing the brochure email, the GHL push, Turnstile/consent, or the market widget.

## Non-negotiable architecture
```
Form (client) → POST /api/lead (route handler)
  → validate (zod) · verify Turnstile · honeypot
  → INSERT into Turso FIRST (status: pending)         ← lead is never lost
  → Promise.allSettled([
        sendBrochure(),                                 (Resend + signed PDF URL)
        notifyOwner(),                                  (Resend → OWNER_NOTIFY_EMAIL)
        GHL_ENABLED ? pushGHL() : mark "skipped"
     ])
  → update status columns → return { ok: true, id }
```
The DB write precedes every external call so a downstream failure becomes a retryable row, not a lost lead. The user sees success as soon as the lead is persisted.

## Wiring a form — steps
1. **Client.** Use react-hook-form with a zod schema shared with the server. Fields: `fullName`, `email`, `phone`, `interest`, plus per-variant fields (`full`: interest checkboxes + how-heard; `quote`: product select; `simple`: name/phone/email only). Add:
   - a **required TCPA consent checkbox** near the phone field (store the boolean),
   - a hidden **honeypot** input,
   - the **Turnstile** widget (site key from `NEXT_PUBLIC_TURNSTILE_SITE_KEY`).
   Show optimistic disabled state, inline zod errors, and a "check your inbox" success panel.
2. **Route handler `app/api/lead/route.ts`.**
   - Re-parse and validate with the same zod schema — never trust the client.
   - Reject if the honeypot is filled; verify the Turnstile token against `TURNSTILE_SECRET_KEY`.
   - Insert the lead into Turso (uuid `id`, `createdAt`, statuses `pending`).
   - `Promise.allSettled([...])` the three legs; update `emailStatus` / `ghlStatus` / `notifyStatus` from results.
   - Return `{ ok: true, id }`; log failures keyed by `id`; rate-limit per IP.
3. **Brochure.** Pick the PDF by interest — `silver_ira → IRA Handbook`, otherwise `Prospectus`. Fetch a short-lived signed URL (R2 via S3 API, or Vercel Blob) and send via a Resend React Email template. **Link the PDF, don't attach it.**
4. **GHL adapter (`lib/ghl.ts`), behind `GHL_ENABLED`.** When on: upsert contact via the v2 API, map `interest → tag/workflow`, attach UTM fields, store `ghlContactId`. When off: no-op, mark `skipped`. Enabling is a config change, not a code change.

## Conventions
- Secrets are server-only, read inside the route handler. Client vars use `NEXT_PUBLIC_`. Never hardcode keys; never place a secret in a `NEXT_PUBLIC_` var.
- Reuse existing shadcn/ui primitives and the current `CallbackForm` styling; do not introduce new form UI.
- Idempotency: dedupe on `email` within a short time window.
- Capture UTM params from the URL and store them on the lead for attribution.

## Market widget
Move the spot-price fetch into a cached handler `app/api/market/route.ts` (`revalidate: 60`); render server-side with a graceful fallback. Keep any provider key server-side. **Fix the percentage baseline** so the headline change traces to a real trailing-12-month reference — do not display a change computed from a hardcoded constant. Keep the past-performance disclaimer.

## Compliance guardrails (must hold)
- TCPA consent is **required** on any phone-collecting form and stored on the lead.
- Keep testimonials labelled **"illustrative"**; keep the **not-investment-advice / past-performance** disclaimers on pages that cite figures.
- Never fabricate or overstate metrics; every displayed number must trace to a real source.
