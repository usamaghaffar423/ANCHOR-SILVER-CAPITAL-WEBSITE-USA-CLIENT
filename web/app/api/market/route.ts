import { NextResponse } from "next/server";
import { getSpotPrices, maxRetailCap } from "@/lib/metals";
import { fiveYearChangePct, getFiveYearSilverRef } from "@/lib/five-year";

/**
 * Cached market snapshot for the client market widgets (components/site/market.tsx).
 *
 * Everything here is resolved **server-side**: the provider keys in
 * lib/metals.ts and lib/five-year.ts never reach the browser — only this JSON
 * does. Spot comes from gold-api.com (keyless) and, if that feed is down, from
 * the last reading it returned; with no reading at all the figures are `null`
 * (there are no hard-coded prices anywhere in the codebase).
 *
 * Caching: this response and the underlying spot fetch both revalidate every
 * 60s so the widgets poll once a minute; the five-year reference refreshes
 * every 6h behind its own cache. The response is served from cache so widgets
 * render instantly without a client-side waterfall.
 */
export const dynamic = "force-static";
export const revalidate = 60;

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
    // Business rule: our maximum retail price is spot × 1.15 (15% cap).
    maxSilver: maxRetailCap(spot?.silver),
    maxGold: maxRetailCap(spot?.gold),
  });
}
