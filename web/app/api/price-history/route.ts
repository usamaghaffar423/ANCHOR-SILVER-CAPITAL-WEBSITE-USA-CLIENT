import { NextResponse, type NextRequest } from "next/server";
import {
  getPriceHistory,
  goldApiKeyConfigured,
  historyTtlSeconds,
  isHistoryRange,
  isPriceSymbol,
} from "@/lib/metals";

/**
 * Chart history for /silver-price-per-ounce and /gold-price-per-ounce when the
 * visitor switches range. Server-side only: GOLD_API_KEY never reaches the
 * browser, and lib/metals.ts caches per symbol + range so repeated hits (or a
 * flood of them — the inputs are whitelisted, so there are only 10 distinct
 * keys) never multiply into paid-API calls.
 */
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  const range = req.nextUrl.searchParams.get("range");
  if (!isPriceSymbol(symbol) || !isHistoryRange(range)) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (!goldApiKeyConfigured()) {
    return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  }
  const points = await getPriceHistory(symbol, range);
  if (!points) return NextResponse.json({ error: "unavailable" }, { status: 502 });

  const ttl = historyTtlSeconds(range);
  return NextResponse.json(
    { symbol, range, points, source: "gold-api.com" },
    { headers: { "Cache-Control": `public, s-maxage=${ttl}, stale-while-revalidate=${ttl}` } },
  );
}
