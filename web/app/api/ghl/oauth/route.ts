import { NextResponse } from "next/server";
import { buildAuthorizeUrl } from "@/lib/ghl";
import { GhlConfigError } from "@/lib/ghl";

export const runtime = "nodejs";

/**
 * Start the GHL OAuth 2.0 authorization-code flow:
 *
 *   GET /api/ghl/oauth  →  302 to the Marketplace install/authorize URL
 *
 * GHL then redirects to GHL_REDIRECT_URI with ?code=…, which
 * /api/ghl/oauth/callback exchanges for access + refresh tokens.
 */
export async function GET() {
  try {
    const url = buildAuthorizeUrl();
    return NextResponse.redirect(url, 302);
  } catch (err) {
    const message =
      err instanceof GhlConfigError
        ? err.message
        : "Failed to build the GHL authorize URL";
    console.error("[ghl:oauth] authorize failed:", err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
