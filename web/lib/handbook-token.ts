import { downloadSecret, isDownloadTokenValid, signDownloadToken } from "./download-token";

/**
 * Scope-bound wrappers for the Silver IRA Handbook download link.
 * The shared implementation (secret handling, TTL, HMAC) lives in
 * `lib/download-token.ts`; this module keeps the original public API used by
 * `/api/download-handbook` and the thank-you-handbook page.
 *
 * Token format and signing message are unchanged (`handbook:<exp>`), so links
 * issued before the refactor still verify.
 */

export function handbookDownloadSecret(): string | null {
  return downloadSecret();
}

/** Returns a `token` query value, or null when verification is disabled. */
export function signHandbookToken(ttlSeconds?: number): string | null {
  return signDownloadToken("handbook", ttlSeconds);
}

export function isHandbookTokenValid(token: string | null): boolean {
  return isDownloadTokenValid("handbook", token);
}
