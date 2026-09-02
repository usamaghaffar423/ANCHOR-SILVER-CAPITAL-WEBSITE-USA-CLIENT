/**
 * Cloudflare Turnstile server-side verification.
 * Reads TURNSTILE_SECRET_KEY (server-only). When the key is absent — i.e. spam
 * protection is not configured yet — verification is skipped with a warning so
 * the pipeline still works in development. Configure the key before launch.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function turnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn("[turnstile] TURNSTILE_SECRET_KEY not set — skipping verification");
    return true;
  }
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };
    if (!data.success) {
      console.warn("[turnstile] verification failed", data["error-codes"]);
    }
    return data.success === true;
  } catch (err) {
    console.error("[turnstile] verification error", err);
    return false;
  }
}
