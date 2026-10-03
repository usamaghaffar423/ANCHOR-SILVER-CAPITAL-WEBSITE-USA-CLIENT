import { NextRequest, NextResponse } from "next/server";
import { exchangeAuthorizationCode } from "@/lib/ghl";
import { GhlAuthError, GhlConfigError } from "@/lib/ghl";

export const runtime = "nodejs";

/**
 * OAuth 2.0 callback — GHL redirects here with ?code=… after consent.
 * Exchanges the code for tokens and persists them to `ghl_tokens`
 * (refresh token included — it rotates on every use).
 *
 * Registered as GHL_REDIRECT_URI, e.g.
 *   https://anchorsilvercapital.com/api/ghl/oauth/callback
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const oauthError = req.nextUrl.searchParams.get("error");

  if (oauthError) {
    return NextResponse.json(
      { ok: false, error: req.nextUrl.searchParams.get("error_description") ?? oauthError },
      { status: 400 },
    );
  }
  if (!code) {
    return NextResponse.json({ ok: false, error: "missing ?code=" }, { status: 400 });
  }

  try {
    const token = await exchangeAuthorizationCode(code);
    return NextResponse.json({
      ok: true,
      locationId: token.locationId,
      scope: token.scope,
      expiresAt: new Date(token.expiresAt).toISOString(),
      note: "Tokens stored. GHL is now connected — API calls use this OAuth token.",
    });
  } catch (err) {
    console.error("[ghl:oauth] token exchange failed:", err);
    const status = err instanceof GhlConfigError || err instanceof GhlAuthError ? 400 : 500;
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "token exchange failed" },
      { status },
    );
  }
}
