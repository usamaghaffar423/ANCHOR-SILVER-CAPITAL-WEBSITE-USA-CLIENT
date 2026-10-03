# private_docs/ — private lead-magnet assets

`Silver-IRA-Handbook.pdf` lives here, **outside `/public`**, so no static URL
(`https://anchorsilvercapital.com/docs/...`) can ever serve it.

Delivery path:

1. `pnpm build` runs `scripts/embed-handbook.mjs`, which inlines the PDF into
   `lib/generated/handbook-pdf.ts` so it ships inside the Cloudflare Worker
   bundle (Workers cannot read project files from disk at runtime).
2. The only public endpoint is `GET /api/download-handbook`, which serves it
   with `no-store` / `nosniff` / `X-Frame-Options: DENY` headers and optional
   signed, expiring `?token=` verification (`HANDBOOK_DOWNLOAD_SECRET`).

Policy: this PDF is intentionally committed to git — Cloudflare builds clone
the repo fresh and need it at build time. Replace the file here (never add a
copy under `public/`), then run `pnpm handbook:embed` if you want the
generated module refreshed locally (CI regenerates it on every build anyway).
