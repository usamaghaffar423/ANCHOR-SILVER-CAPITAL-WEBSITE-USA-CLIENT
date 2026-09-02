# Brochure PDFs

Drop the lead-magnet PDFs here. The `/api/lead` route attaches one to the
brochure email based on the visitor's interest:

| File | Sent when |
| --- | --- |
| `ira-handbook.pdf` | interest includes **Silver IRA** |
| `prospectus.pdf` | everything else (physical silver, just learning, quote) |

Notes:
- Exact filenames matter — `ira-handbook.pdf` and `prospectus.pdf` (lowercase).
- If only one file is present, it is used for both cases (with a fallback).
- If neither is present, the email still sends, without an attachment.
- Keep each PDF well under ~4 MB — Resend's total message limit is 40 MB but
  large attachments hurt deliverability. If the brochure is big, switch to a
  hosted download link (Vercel Blob / R2) instead of an attachment.
- These files are committed to the repo and bundled into the function via
  `outputFileTracingIncludes` in `next.config.ts`.
