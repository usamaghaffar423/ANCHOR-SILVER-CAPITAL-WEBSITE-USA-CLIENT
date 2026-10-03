import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Optional signed/expiring download links for /api/download-handbook.
 *
 * Enabled by setting HANDBOOK_DOWNLOAD_SECRET (32+ random chars). When unset,
 * verification is disabled and the endpoint serves the PDF without a token.
 * When set, a valid, unexpired `?token=<exp>.<sig>` is required (403 otherwise),
 * and the thank-you page signs its links automatically.
 *
 * Token format: `<unix-expiry>.<base64url HMAC-SHA256 of "handbook:<exp>">`
 */

const TOKEN_TTL_SECONDS = 60 * 60 * 24; // 24 hours

export function handbookDownloadSecret(): string | null {
  const secret = process.env.HANDBOOK_DOWNLOAD_SECRET;
  if (!secret || secret.trim().length < 16) return null;
  return secret;
}

function signature(secret: string, exp: number): string {
  return createHmac("sha256", secret).update(`handbook:${exp}`).digest("base64url");
}

/** Returns a `token` query value, or null when verification is disabled. */
export function signHandbookToken(ttlSeconds: number = TOKEN_TTL_SECONDS): string | null {
  const secret = handbookDownloadSecret();
  if (!secret) return null;
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  return `${exp}.${signature(secret, exp)}`;
}

/**
 * True when verification is disabled, or the token is present, correctly
 * signed, and unexpired. Missing/malformed/forged/expired tokens → false.
 */
export function isHandbookTokenValid(token: string | null): boolean {
  const secret = handbookDownloadSecret();
  if (!secret) return true;
  if (!token) return false;

  const [expRaw, provided] = token.split(".");
  const exp = Number(expRaw);
  if (!Number.isSafeInteger(exp) || exp <= 0 || !provided) return false;
  if (exp * 1000 < Date.now()) return false;

  const expected = Buffer.from(signature(secret, exp), "utf8");
  const actual = Buffer.from(provided, "utf8");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
