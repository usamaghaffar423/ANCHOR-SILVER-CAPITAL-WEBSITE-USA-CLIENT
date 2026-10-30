import { NextResponse, type NextRequest } from "next/server";
import { getDailyCandles, goldApiKeyConfigured, isPriceSymbol } from "@/lib/metals";

/**
 * Daily candles for the standalone price sites. Whitelisted input, cached
 * server-side (lib/edge-cache.ts) — the paid key never reaches the browser.
 */
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  if (!isPriceSymbol(symbol)) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  if (!goldApiKeyConfigured()) return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  const candles = await getDailyCandles(symbol, 20_000);
  if (!candles) return NextResponse.json({ error: "unavailable" }, { status: 502 });
  return NextResponse.json(
    { symbol, candles, source: "gold-api.com" },
    { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=1800" } },
  );
}
