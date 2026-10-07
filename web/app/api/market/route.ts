import { NextResponse } from "next/server";
import { getSpotPrices } from "@/lib/metals";
import { fiveYearChangePct, getFiveYearSilverRef } from "@/lib/five-year";

/**
 * Cached market snapshot for the client market widgets (components/site/market.tsx).
 *
 * Everything here is resolved **server-side**: the provider keys in
 * lib/metals.ts and lib/five-year.ts never reach the browser — only this JSON
 * does. Prices are `null` when the feed can't be read (there are no hard-coded
 * fallback prices anywhere in the codebase).
 *
 * Caching: spot prices refresh hourly; the five-year reference refreshes every
 * 6h behind its own cache. The response is served from cache so widgets render
 * instantly without a client-side waterfall.
 */
export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const [spot, ref] = await Promise.all([getSpotPrices(), getFiveYearSilverRef()]);

  // Whole-percent five-year change, rounded DOWN; null unless both inputs are real.
  const fiveYearPct = fiveYearChangePct(spot?.silver, ref);

  return NextResponse.json({
    silver: spot ? spot.silver : null,
    gold: spot ? spot.gold : null,
    live: Boolean(spot?.live),
    // Provider snapshot time — drives the "as of" text and the >4h fail-safe.
    updatedAt: spot ? spot.updatedAt : null,
    fiveYearPct,
  });
}
