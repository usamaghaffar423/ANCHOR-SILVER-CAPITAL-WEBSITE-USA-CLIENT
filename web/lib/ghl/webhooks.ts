/**
 * GHL webhook signature verification.
 *
 * GHL signs the RAW request body (exact bytes) with Ed25519 and sends the
 * base64 signature in `X-GHL-Signature`. The public key is GHL's platform key
 * (same for every integration) — override via GHL_WEBHOOK_PUBLIC_KEY for
 * tests or whitelabel senders.
 *
 * The legacy `X-WH-Signature` (RSA-SHA256) header was deprecated 2026-09-01;
 * if one still arrives it can be verified by passing the RSA PEM explicitly.
 */

import { createPublicKey, verify } from "node:crypto";
import { getGhlConfig } from "./config";

export const GHL_ED25519_PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAi2HR1srL4o18O8BRa7gVJY7G7bupbN3H9AwJrHCDiOg=
-----END PUBLIC KEY-----`;

export interface GhlSignatureResult {
  valid: boolean;
  reason?: string;
}

export interface VerifyGhlSignatureOptions {
  /** PEM used instead of the GHL platform key (tests / custom senders). */
  publicKeyPem?: string;
}

export function verifyGhlSignature(
  rawBody: string,
  signature: string | null | undefined,
  opts: VerifyGhlSignatureOptions = {},
): GhlSignatureResult {
  if (!signature || signature === "N/A") {
    return { valid: false, reason: "signature header missing" };
  }

  const publicKeyPem =
    opts.publicKeyPem ?? getGhlConfig().webhookPublicKeyPem ?? GHL_ED25519_PUBLIC_KEY_PEM;

  try {
    const key = createPublicKey(publicKeyPem);
    const ok = verify(
      null,
      Buffer.from(rawBody, "utf8"),
      key,
      Buffer.from(signature, "base64"),
    );
    return ok ? { valid: true } : { valid: false, reason: "verification failed" };
  } catch (err) {
    return { valid: false, reason: err instanceof Error ? err.message : "verification error" };
  }
}

/** Parse the already-verified raw body into a typed event. Throws on bad JSON. */
export function parseGhlWebhook(rawBody: string): unknown {
  return JSON.parse(rawBody);
}
