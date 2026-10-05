import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Signed/expiring links for the private lead-magnet download endpoints.
 *
 * Enabled by setting HANDBOOK_DOWNLOAD_SECRET (32+ random chars). When unset,
 * verification is disabled and the endpoints serve their PDF without a token.
 * When set, a valid, unexpired `?token=<exp>.<sig>` is required (403 otherwise),
 * and each thank-you page signs its own link automatically.
 *
 * One secret covers every lead magnet, but the scope is part of the HMAC
 * message — a handbook token can never be replayed against another endpoint.
 *
 * Token format: `<unix-expiry>.<base64url HMAC-SHA256 of "<scope>:<exp>">`
 */

export type DownloadScope = "handbook" | "critical-minerals";

const TOKEN_TTL_SECONDS = 60 * 60 * 24; // 24 hours

export function downloadSecret(): string | null {
  const secret = process.env.HANDBOOK_DOWNLOAD_SECRET;
  if (!secret || secret.trim().length < 16) return null;
  return secret;
}

function signature(secret: string, scope: DownloadScope, exp: number): string {
  return createHmac("sha256", secret).update(`${scope}:${exp}`).digest("base64url");
}

/** Returns a `token` query value, or null when verification is disabled. */
export function signDownloadToken(
  scope: DownloadScope,
  ttlSeconds: number = TOKEN_TTL_SECONDS,
): string | null {
  const secret = downloadSecret();
  if (!secret) return null;
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  return `${exp}.${signature(secret, scope, exp)}`;
}

/**
 * True when verification is disabled, or the token is present, correctly
 * signed for this scope, and unexpired. Missing/malformed/forged/expired or
 * wrong-scope tokens → false.
 */
export function isDownloadTokenValid(scope: DownloadScope, token: string | null): boolean {
  const secret = downloadSecret();
  if (!secret) return true;
  if (!token) return false;

  const [expRaw, provided] = token.split(".");
  const exp = Number(expRaw);
  if (!Number.isSafeInteger(exp) || exp <= 0 || !provided) return false;
  if (exp * 1000 < Date.now()) return false;

  const expected = Buffer.from(signature(secret, scope, exp), "utf8");
  const actual = Buffer.from(provided, "utf8");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
