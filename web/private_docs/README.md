# private_docs/ — private lead-magnet assets

Lead-magnet PDFs live here, **outside `/public`**, so no static URL
(`https://anchorsilvercapital.com/docs/...`) can ever serve them.

| PDF (drop it here)                                | Generated module                | Public endpoint                    |
| ------------------------------------------------- | ------------------------------- | ---------------------------------- |
| `Precious-Metals-IRA-Handbook.pdf`            | `lib/generated/handbook-pdf.ts` | `GET /api/download-handbook`       |

The file is served as `Anchor-Precious-Metals-IRA-Handbook.pdf` so the
downloaded name matches the current handbook. It is the SAME file as public/precious-metals-ira-handbook.pdf:
replace both together.

This is the only lead magnet: every thank-you page (including
`/thank-you-critical-minerals`, which the Critical Minerals Report form
redirects to) delivers it.

Delivery path:

1. `pnpm build` runs `scripts/embed-handbook.mjs`, which inlines each PDF into
   its `lib/generated/*.ts` module so it ships inside the Cloudflare Worker
   bundle (Workers cannot read project files from disk at runtime).
2. Each endpoint serves its file with `no-store` / `nosniff` /
   `X-Frame-Options: DENY` headers and optional signed, expiring `?token=`
   verification (`HANDBOOK_DOWNLOAD_SECRET`, one secret for all lead magnets,
   scope-bound per endpoint).

A PDF that is missing is a warning at build time, not a failure: the generated
module exports `null` and the endpoint returns 404 until the file is added.

Policy: these PDFs are intentionally committed to git — Cloudflare builds clone
the repo fresh and need them at build time. Replace a file here (never add a
copy under `public/`), then run `pnpm handbook:embed` if you want the
generated modules refreshed locally (CI regenerates them on every build
anyway).
