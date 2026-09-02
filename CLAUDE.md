# CLAUDE.md — Anchor Silver Capital

Operating guide for Claude Code in this repository. Read this and `IMPLEMENTATION.md` before starting any task.

## What this is
Marketing + lead-generation site for a US precious-metals dealer. We are **porting** the existing Lovable prototype (a TanStack Start app) to **Next.js App Router**. The design is **locked to the current prototype** — do not redesign pages. The only approved design changes are: improve the home hero, add CTAs to key sections/pages, and polish mobile — and those come **after** the port reaches faithful parity.

## Stack
- **Next.js (App Router) + TypeScript**
- **Tailwind CSS + shadcn/ui** (new-york style) — port the source `components/ui` primitives as-is
- **react-hook-form + zod** for forms
- **Turso (libSQL) + Drizzle** for the lead store
- **Resend** (email), **Cloudflare Turnstile** (spam), **R2 or Vercel Blob** (brochure PDFs)
- **GoHighLevel** CRM — behind a `GHL_ENABLED` flag, off until Ron's account exists
- **Host: Vercel** (`next/image` works natively — no custom loader)

## Commands
`pnpm dev` · `pnpm build` · `pnpm lint` · `pnpm typecheck` · `pnpm test` · `pnpm drizzle-kit generate` / `migrate`
(Use whichever package manager the repo is initialized with; keep it consistent.)

## Migration rules (port from TanStack Start)
- Map routes: `src/routes/*.tsx` → `app/<route>/page.tsx`; `__root.tsx` → `app/layout.tsx`; route `head` → `metadata`/`generateMetadata`; `sitemap[.]xml.ts` → `app/sitemap.ts`; server functions → `app/api/*/route.ts`.
- Copy verbatim (do not rewrite): all shadcn `components/ui`, Tailwind tokens (`styles.css` → `globals.css`), page copy, and image assets.
- `VITE_*` → `NEXT_PUBLIC_*` (client) or server env (secrets). Assets → `public/` or imported via `next/image`.
- **Parity first.** Reproduce the current site exactly, verify it matches, then do hero/CTA/mobile. Never mix a port bug with a design change in one commit.

## Conventions
- TypeScript throughout; keep components typed.
- Reuse existing shadcn primitives and design tokens; introduce no new design language.
- Server logic lives in **route handlers** (`app/api/*`). Never call the DB, CRM, or email from the client.
- Secrets are server-only, read inside route handlers. Client vars use `NEXT_PUBLIC_`. Never hardcode a key; never put a secret in a `NEXT_PUBLIC_` var.
- Follow the phase order and task detail in `IMPLEMENTATION.md`.

## Current priority task — wire the lead form
`CallbackForm` (variants `full`/`simple`/`quote`) currently only `console.log`s. Implement per `IMPLEMENTATION.md` §7 and the `anchor-silver-lead-pipeline` skill:
1. Shared zod schema + react-hook-form; add a **required TCPA consent checkbox**, a honeypot field, and the Turnstile widget.
2. `POST /api/lead`: re-validate → verify Turnstile → **insert into Turso first** (status pending) → `Promise.allSettled([sendBrochure, notifyOwner, GHL_ENABLED ? pushGHL : skip])` → update statuses → return `{ ok, id }`.
3. Success + error states; never lose a lead on a downstream failure.

## Then
- Rebuild the home hero (`app/page.tsx` / `PageHero`): stronger hierarchy, `silver-stack-mobile.jpg` on small screens, primary + secondary CTA.
- Add a shared `CtaBand` to the end of every key page (reuse the existing pattern).
- Move the market fetch to a cached `/api/market` handler (`revalidate: 60`); fix the % baseline to a real trailing-12-month reference; keep the disclaimer.
- SEO: unique title/description per route, `sitemap.ts` + `robots.ts`, canonical tags, JSON-LD ported from `lib/site.ts`.
- Performance pass: bundle analysis, prune unused shadcn/Radix/deps, lazy-load recharts + carousel, `next/image` responsive WebP/AVIF. Budget LCP < 2.5s, CLS < 0.1.

## Guardrails — do not remove
- Keep testimonials labelled **"illustrative"**; keep the **not-investment-advice / past-performance** disclaimers.
- Keep the **TCPA consent** line on any form collecting a phone number.
- Do not fabricate metrics — the market % must trace to a real reference.

## Do NOT
- Do not redesign locked pages or change copy without instruction.
- Do not persist leads in `localStorage`/client state — the DB is the source of truth.
- Do not commit secrets.
- Do not deploy commercial **production** to Vercel Hobby (free) — that tier is non-commercial. Production goes to Vercel **Pro**, or Cloudflare Pages if a free-for-commercial host is required. Hobby is fine for dev/preview.
