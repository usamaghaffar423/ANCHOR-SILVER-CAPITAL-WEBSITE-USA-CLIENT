/**
 * Authentication for GHL — two modes, resolved in this order:
 *
 *   1. OAuth 2.0 access token (stored in `ghl_tokens`, auto-refreshed ~60 s
 *      before expiry, single-flight so parallel leads can't burn the rotating
 *      refresh token). Started via GET /api/ghl/oauth.
 *   2. Long-lived Private Integration token (GHL_API_KEY) — zero setup,
 *      perfect for the single sub-account this site targets.
 *
 * Throws GhlAuthError only when a token exists but refresh/exchange fails;
 * "nothing configured" resolves to null and callers skip.
 */

import { GHL_BASE_URL, getGhlConfig, requireGhlOAuthConfig } from "./config";
import { GhlAuthError } from "./errors";
import { getStoredToken, saveStoredToken } from "./token-store";
import type { GhlStoredToken, GhlTokenResponse, GhlUserType } from "./types";

const EXPIRY_SKEW_MS = 60_000;

async function postToken(payload: Record<string, string>): Promise<GhlTokenResponse> {
  const res = await fetch(`${GHL_BASE_URL}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15_000),
  });
  const text = await res.text().catch(() => "");
  if (!res.ok) {
    throw new GhlAuthError(`GHL token endpoint ${res.status}: ${text.slice(0, 300)}`);
  }
  try {
    return JSON.parse(text) as GhlTokenResponse;
  } catch {
    throw new GhlAuthError("GHL token endpoint returned non-JSON body");
  }
}

function toStored(t: GhlTokenResponse, id: string): GhlStoredToken {
  const now = Date.now();
  return {
    id,
    locationId: t.locationId ?? null,
    companyId: t.companyId ?? null,
    userId: t.userId ?? null,
    accessToken: t.access_token,
    refreshToken: t.refresh_token,
    tokenType: t.token_type || "Bearer",
    scope: t.scope ?? null,
    expiresAt: now + (t.expires_in ?? 86400) * 1000,
    updatedAt: now,
  };
}

/** Step 5 of the GHL OAuth flow — exchange the redirect `code` for tokens. */
export async function exchangeAuthorizationCode(code: string): Promise<GhlStoredToken> {
  const { clientId, redirectUri } = requireGhlOAuthConfig();
  const cfg = getGhlConfig();
  const t = await postToken({
    client_id: clientId,
    client_secret: cfg.clientSecret!,
    grant_type: "authorization_code",
    code,
    user_type: cfg.userType,
    redirect_uri: redirectUri,
  });
  const stored = toStored(t, t.locationId ?? "default");
  await saveStoredToken(stored);
  return stored;
}

/** Refresh tokens rotate: the new refresh_token MUST be persisted or the next refresh 401s. */
async function refreshStoredToken(token: GhlStoredToken): Promise<GhlStoredToken> {
  const { clientId, redirectUri } = requireGhlOAuthConfig();
  const cfg = getGhlConfig();
  const t = await postToken({
    client_id: clientId,
    client_secret: cfg.clientSecret!,
    grant_type: "refresh_token",
    refresh_token: token.refreshToken,
    user_type: cfg.userType,
    redirect_uri: redirectUri,
  });
  const stored = toStored(t, t.locationId ?? token.id);
  await saveStoredToken(stored);
  return stored;
}

let refreshLock: Promise<GhlStoredToken> | null = null;

async function getFreshAccessToken(): Promise<string | null> {
  let token: GhlStoredToken | null = null;
  try {
    token = await getStoredToken();
  } catch {
    return null; // ghl_tokens migration not applied yet → caller falls back to API key
  }
  if (!token) return null;

  if (token.expiresAt - Date.now() > EXPIRY_SKEW_MS) return token.accessToken;

  if (!refreshLock) {
    refreshLock = refreshStoredToken(token).finally(() => {
      refreshLock = null;
    });
  }
  try {
    return (await refreshLock).accessToken;
  } catch (err) {
    throw new GhlAuthError(
      `GHL access token refresh failed: ${err instanceof Error ? err.message : String(err)}`,
      err,
    );
  }
}

/** Bearer header for ghlRequest — OAuth first, static API key second, null if unconfigured. */
export async function getGhlAuthHeader(): Promise<string | null> {
  try {
    const oauth = await getFreshAccessToken();
    if (oauth) return `Bearer ${oauth}`;
  } catch (err) {
    // OAuth path broken (expired refresh, revoked app) — degrade to API key if present.
    console.error("[ghl] OAuth token unavailable, falling back to API key:", err);
  }

  const cfg = getGhlConfig();
  if (cfg.apiKey) return `Bearer ${cfg.apiKey}`;
  return null;
}

/** Build the URL the browser must visit to grant access (Marketplace install link). */
export function buildAuthorizeUrl(): string {
  const cfg = getGhlConfig();
  if (cfg.installUrl) return cfg.installUrl;

  const { clientId, redirectUri } = requireGhlOAuthConfig();
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: cfg.scopes,
    access_type: "offline",
    prompt: "consent",
  });
  return `https://marketplace.gohighlevel.com/oauth/authorize?${params.toString()}`;
}

/** Used by the callback route to label the stored row. */
export function userTypeForFlow(): GhlUserType {
  return getGhlConfig().userType;
}
