import { NextResponse } from "next/server";
import { getSpotPrices } from "@/lib/metals";
import { getTwelveMonthSilverRef } from "@/lib/silver-history";

/**
 * Cached market snapshot for the home hero (and other market widgets).
 *
 * Caching: spot prices refresh ~hourly (this segment + the underlying fetches);
 * the trailing-12-month reference refreshes daily behind its own 24h cache. The
 * whole response is served from cache so the hero renders instantly.
 */
export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const [spot, ref] = await Promise.all([
    getSpotPrices(),
    getTwelveMonthSilverRef(),
  ]);

  // changePct = ((silverNow - silver12moAgo) / silver12moAgo) * 100, or null
  // when the 12-months-ago price can't be resolved.
  const changePct =
    ref && ref.price > 0
      ? ((spot.silver - ref.price) / ref.price) * 100
      : null;

  return NextResponse.json({
    silver: spot.silver,
    gold: spot.gold,
    ratio: spot.gold / spot.silver,
    changePct,
    asOf: new Date().toISOString(),
    live: spot.live,
  });
}
