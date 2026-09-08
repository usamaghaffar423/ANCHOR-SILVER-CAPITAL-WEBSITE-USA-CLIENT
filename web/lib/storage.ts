/**
 * Brochure PDF resolution. The PDFs live in Vercel Blob as public-read objects;
 * their direct public URLs are stored as env vars. No signed-URL step at this
 * stage — the email just links out.
 *
 * If a PDF isn't uploaded yet, point the env var at a placeholder — the email
 * still sends, it just links to the placeholder. The pipeline never blocks on a
 * missing brochure.
 */

const BROCHURE_MAP = {
  silver_ira: process.env.BLOB_URL_IRA_HANDBOOK,
  physical_silver: process.env.BLOB_URL_PROSPECTUS,
  just_learning: process.env.BLOB_URL_PROSPECTUS,
} as const;

const FALLBACK_URL = "https://anchorsilvercapital.com/";

export function getBrochureUrl(interest: string): string {
  return (
    BROCHURE_MAP[interest as keyof typeof BROCHURE_MAP] ??
    BROCHURE_MAP.just_learning ??
    FALLBACK_URL
  );
}
