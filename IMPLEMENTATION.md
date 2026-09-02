# Anchor Silver Capital — Implementation Plan (Next.js)

**Project:** Port the existing Lovable prototype (TanStack Start) to a custom **Next.js App Router** app and ship the lead pipeline + Ron's design changes.
**Owner:** Osama Ghaffar · **Framework:** Next.js (App Router) + TypeScript + Tailwind + shadcn/ui · **Host:** Vercel · **Last updated:** 2026-09-01

---

## 1. Objective & approach

Rebuild the site as a Next.js App Router application, preserving the existing design 1:1. The source is a TanStack Start app (React 19 + Tailwind v4 + shadcn/ui), so this is a **framework port**, not a redesign. Approved design changes are only: improve the home hero, add CTAs to key sections/pages, and polish mobile.

**Golden rule of the port:** achieve faithful parity with the current site *first*, verify it matches, and *only then* apply the hero/CTA/mobile changes. Never mix a migration bug with a design change in the same step.

Definition of done: all pages render as SSG/SSR with correct metadata and fast Core Web Vitals; a lead submitted from any form is persisted, emailed the brochure, and (when enabled) pushed to GHL — no lead ever lost; no secrets in the client bundle; deployed on Vercel with preview environments and a tested rollback.

---

## 2. Stack

| Concern | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js (App Router) + TypeScript | Native on Vercel, no adapter |
| Styling | Tailwind CSS + shadcn/ui (new-york) | Components port from the source 1:1 |
| Forms | react-hook-form + zod | Already used in source |
| Host | Vercel | Hobby for dev/preview; **Pro for commercial production** (Hobby is non-commercial) |
| Lead DB | Turso (libSQL) + Drizzle ORM | SQLite-compatible; keeps the schema simple. (Neon/Postgres is the alternative) |
| File store | Cloudflare R2 (S3 API) or Vercel Blob | Brochure PDFs, signed URLs |
| Spam | Cloudflare Turnstile + honeypot | Works fine from Vercel |
| Email | Resend | Transactional brochure + owner notify |
| CRM | GoHighLevel (deferred) | Behind `GHL_ENABLED` flag; enabled post-launch |
| Market cache | Next route handler + `revalidate` | No external cache needed; key (if any) stays server-side |
| Images | `next/image` | Native optimization on Vercel — no custom loader |
| CI/CD | GitHub → Vercel | Automatic per-branch preview deploys |

---

## 3. Migration mapping (TanStack Start → Next.js App Router)

| Source (TanStack Start) | Target (Next.js) |
| --- | --- |
| `src/routes/*.tsx` (`createFileRoute`) | `app/<route>/page.tsx` |
| `src/routes/__root.tsx` | `app/layout.tsx` (root layout, nav/footer/consent) |
| route `head` / meta | `metadata` export or `generateMetadata()` per page |
| `src/routes/sitemap[.]xml.ts` | `app/sitemap.ts` (+ `app/robots.ts`) |
| server functions / `server.ts` / `start.ts` | `app/api/*/route.ts` route handlers |
| `useMetals` client fetch (`market.tsx`) | `/api/market` cached route handler + client hook (or server fetch w/ revalidate) |
| `CallbackForm` placeholder `onSubmit` | wired to `POST /api/lead` |
| `src/components/ui/*` (shadcn) | copy as-is; fix import aliases (`@/components/ui`) |
| `src/components/site/*`, `brand/*` | port to `components/` |
| `src/assets/*` (imported JPEGs) | `public/` or import through `next/image` |
| `VITE_*` env, Vite config | `NEXT_PUBLIC_*` (client) / server env; `next.config.mjs` |

Copy verbatim, do not rewrite: all `components/ui` shadcn primitives, Tailwind tokens in `styles.css` → `globals.css`, page copy, and image assets.

---

## 4. Repository structure

```
anchor-silver/
├─ app/
│  ├─ layout.tsx                    # root: nav, footer, announcement bar, consent, fonts
│  ├─ page.tsx                      # home (hero, market band, sections)
│  ├─ why-silver/ · silver-ira/ · physical-silver/ · silver-supply/
│  ├─ about/ · faq/ · get-started/ · contact/ · market-update/
│  ├─ (legal)/{privacy,terms,disclaimer}/page.tsx
│  ├─ api/lead/route.ts             # lead pipeline (POST)
│  ├─ api/market/route.ts           # cached spot prices (GET)
│  ├─ sitemap.ts · robots.ts · not-found.tsx
├─ components/
│  ├─ ui/                           # shadcn (ported as-is)
│  ├─ site/                         # Header, Footer, PageHero, CallbackForm, CtaBand, Market, CookieBanner
│  └─ brand/AnchorMark.tsx
├─ lib/
│  ├─ ghl.ts · email.ts · storage.ts · turnstile.ts · validation.ts · site.ts · analytics.ts
│  └─ db/{schema.ts,client.ts}
├─ emails/                          # React Email templates (brochure, owner-notify)
├─ drizzle/                         # migrations
├─ public/                          # assets
├─ next.config.mjs · drizzle.config.ts · .env.example
└─ tests/
```

---

## 5. Environment & configuration

No secrets in code or the client bundle. Split by exposure:

**Public (build-time, `NEXT_PUBLIC_*`):**
```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_TURNSTILE_SITE_KEY
NEXT_PUBLIC_GA_ID
NEXT_PUBLIC_META_PIXEL_ID
NEXT_PUBLIC_GOOGLE_ADS_ID
```

**Server secrets (runtime only — read in route handlers, never shipped):**
```
RESEND_API_KEY
TURNSTILE_SECRET_KEY
TURSO_DATABASE_URL · TURSO_AUTH_TOKEN
R2_ACCOUNT_ID · R2_ACCESS_KEY_ID · R2_SECRET_ACCESS_KEY · R2_BUCKET   # or BLOB_READ_WRITE_TOKEN
OWNER_NOTIFY_EMAIL
GHL_ENABLED            # "false" until Ron's account exists
GHL_API_TOKEN · GHL_LOCATION_ID
METALS_API_KEY         # only if switching off keyless gold-api.com
```

Local: `.env.local`. Production: Vercel → Settings → Environment Variables. `.env.example` documents every key with dummy values. Never commit real secrets.

---

## 6. Data model — Turso + Drizzle (`leads`)

```ts
export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),                              // uuid
  createdAt: integer("created_at").notNull(),               // epoch ms
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  bestTimeToCall: text("best_time_to_call"),
  amountBracket: text("amount_bracket"),
  interest: text("interest").notNull(),                     // silver_ira | physical_silver | just_learning
  product: text("product"),                                 // quote-form variant
  message: text("message"),
  howHeard: text("how_heard"),
  sourceForm: text("source_form").notNull(),                // get_started | quote | simple
  sourcePage: text("source_page"),
  utmSource: text("utm_source"), utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"), utmTerm: text("utm_term"), utmContent: text("utm_content"),
  consentTcpa: integer("consent_tcpa", { mode: "boolean" }).notNull(),
  brochureVariant: text("brochure_variant"),                // ira_handbook | prospectus
  emailStatus: text("email_status").default("pending"),     // pending|sent|failed
  ghlStatus: text("ghl_status").default("pending"),         // pending|sent|failed|skipped
  ghlContactId: text("ghl_contact_id"),
  notifyStatus: text("notify_status").default("pending"),
  ip: text("ip"), userAgent: text("user_agent"),
});
```

Managed with `drizzle-kit`; the three status columns make each downstream leg independently retryable.

---

## 7. The lead pipeline — `POST /api/lead`

The source `CallbackForm` (variants `full` / `simple` / `quote`) currently only `console.log`s. Replace with a real pipeline.

**Client:** react-hook-form + a shared zod schema; Cloudflare Turnstile widget; a hidden honeypot field; a **required TCPA consent checkbox** beside the phone field (missing today); optimistic disabled state; inline field errors; a "check your inbox" success state.

**Route handler flow:**
1. Parse JSON; reject oversized/malformed.
2. Re-validate with the same zod schema (never trust the client); reject if honeypot filled.
3. Verify Turnstile token against `TURNSTILE_SECRET_KEY`.
4. **Insert into Turso first**, all statuses `pending` — before any external call.
5. `Promise.allSettled([ sendBrochure(), notifyOwner(), GHL_ENABLED ? pushGHL() : skip ])`.
6. Update status columns from results.
7. Return `{ ok: true, id }`. User sees success once the lead is persisted, even if a leg needs a later retry.

Rules: idempotent on retry (dedupe on email within a short window); structured logs keyed by lead id; per-IP rate limit; no internal errors leaked to the client.

---

## 8. Integrations

- **Resend** — React Email templates in `/emails`. Brochure links a short-lived R2/Blob signed URL (link, not attach). Selection: `silver_ira → IRA Handbook`, else `Prospectus` (confirm with Ron). Requires SPF/DKIM/DMARC on the sending domain — secure DNS access early.
- **GHL adapter** — one module behind `GHL_ENABLED`. On: upsert contact via v2 API, map `interest → tag/workflow`, attach UTMs, store `ghlContactId`. Off: no-op marked `skipped`. Enabling at launch is a config change, not code.
- **Turnstile** — invisible widget both forms; server verify in the handler; honeypot as second layer.
- **Market — `/api/market`** — cached route handler (`revalidate: 60`) fetching spot prices (keyless gold-api.com today; key stays server-side if switched). **Fix the % baseline** so the headline "silver up ~X%" derives from a real trailing-12-month reference, not a hardcoded constant; keep the past-performance disclaimer. Graceful fallback to last-known values.

---

## 9. Frontend, SEO & performance

- **Pages:** static (SSG) where possible; per-page `metadata` / `generateMetadata`, `app/sitemap.ts`, `app/robots.ts`, canonical tags, and JSON-LD (`Organization`, `LocalBusiness`, `FAQPage`, breadcrumbs — port the existing schema from `lib/site.ts`).
- **Design changes (after parity):** rebuild the home hero (stronger hierarchy, `silver-stack-mobile.jpg` on small screens, primary + secondary CTA); add a shared `CtaBand` to the end of every key page (why-silver, silver-ira, physical-silver, silver-supply, about, faq, market-update) and after major home sections; mobile polish pass.
- **Performance pass (explicit task):** bundle analysis; prune unused shadcn/Radix primitives and deps the source over-ships; lazy-load heavy client pieces (recharts market chart, carousel); serve `next/image` responsive WebP/AVIF for hero + product photos. Budget: LCP < 2.5s, CLS < 0.1, TBT low.
- **Accessibility:** semantic landmarks, labelled fields, visible focus, `prefers-reduced-motion`, AA contrast.

---

## 10. Security

Secrets server-only; nothing sensitive in `NEXT_PUBLIC_*`. All input validated server-side with zod. Per-IP rate limit + Turnstile + honeypot. Security headers (CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`). PII only in Turso, documented retention. TCPA consent stored per lead. Brochures via expiring signed URLs.

---

## 11. Reliability & observability

DB write precedes external calls (lead-never-lost); failed legs stay visible via status columns. A scheduled retry (Vercel Cron) re-attempts `failed`/`pending` GHL/email legs. Structured logging by lead id; owner-notify still fires if another leg fails; optional Sentry.

---

## 12. Testing

Unit (zod schemas, brochure selection, adapters mocked, Turnstile verify). Integration (`/api/lead` end-to-end against local Turso — row written, statuses set, GHL skipped when flag off). E2E (Playwright: each form → success → lead in DB + brochure dispatched in sandbox). Deliverability (SPF/DKIM/DMARC + inbox test). Performance (Lighthouse/CWV budget gate in CI). Visual parity check against the current live site before design changes.

---

## 13. CI/CD & deployment

GitHub → Vercel; every branch gets a preview URL. `main` → preview → production on approval. Pre-deploy: typecheck, lint, unit + integration, Lighthouse budget. Drizzle migrations run as a deploy step. Rollback = promote previous Vercel deployment (instant).

**Vercel tier:** Hobby (free) is **personal/non-commercial only** — fine for development and preview during the build. Production for this commercial site must be on **Vercel Pro (~$20/mo)**. If avoiding that cost is required, Cloudflare Pages' free tier permits commercial use and also runs Next.js — the free-for-commercial fallback.

---

## 14. Phased delivery

| Phase | Scope | Depends on Ron? | Acceptance |
| --- | --- | --- | --- |
| **0 — Scaffold** | Next.js+TS+Tailwind+shadcn init, port tokens/globals, base layout, connect Vercel + previews | No | Empty app deploys to a preview URL |
| **1 — Port pages (parity)** | All routes → App Router, components/assets/copy ported 1:1, metadata/sitemap/robots/JSON-LD | No | Every page matches the current live site |
| **2 — Data + market** | Turso schema + migrations, `/api/market` cached, baseline fix | No (provider key later) | Widget shows cached prices, key server-side |
| **3 — Lead pipeline** | `/api/lead`: zod, Turnstile, honeypot, DB-first, Resend brochure + owner notify, GHL leg flagged, TCPA consent, both forms wired | Partial (PDFs, from-addr, DNS) | Lead → DB + brochure + notify verified; GHL skipped cleanly |
| **4 — Hero + CTAs + mobile** | Rebuild hero, site-wide CtaBand, mobile polish, performance pass | Direction only | Ron approves; CWV budget met |
| **5 — Tracking + legal** | GA4/Meta/Ads behind consent, UTM→lead, legal pages | Yes (IDs, copy) | Events fire post-consent; UTMs stored |
| **6 — QA + launch** | E2E, deliverability, CWV, staging→prod on Pro, DNS | Yes (DNS, GHL on, Pro) | Pipeline green in prod; rollback tested |

Phases 0–3 start now; the rest slot in as Ron's answers arrive.

---

## 15. Open dependencies from Ron

GHL access + location + tag mapping (and whether it exists at launch); Resend from-address; final brochure PDF(s) + email copy; DNS access for SPF/DKIM/DMARC; live-price provider + key (only if leaving gold-api.com); GA/Meta/Ads IDs; Privacy/Terms/Disclaimer copy; confirmation of the "as seen on" and testimonial claims.

---

## 16. Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Framework port introduces regressions | Parity-first; visual diff vs live site before any design change |
| GHL not ready at launch | Flag-guarded leg; launch on DB + Resend + notify; enable later via config |
| Vercel Hobby is non-commercial | Dev/preview on Hobby; production on Pro, or Cloudflare Pages if free-for-commercial is required |
| Email lands in spam | DNS auth; linked (not attached) PDF; inbox tests |
| Lost lead on downstream failure | DB-first write + status columns + cron retry |
| Over-shipped bundle from source deps | Performance pass: prune + lazy-load + image optimization |
| Unverified "as seen on" / testimonials | Confirm with Ron before launch; keep "illustrative" label |

---

## 17. Post-launch

Handover doc (env keys, runbooks, how to enable GHL, update brochure/prices), retry/monitoring guide, and a backlog for GHL landing pages and nurture sequences once that account is live.
