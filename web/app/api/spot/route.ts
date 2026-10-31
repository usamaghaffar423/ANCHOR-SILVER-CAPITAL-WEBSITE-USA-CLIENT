import { NextResponse } from "next/server";
import { getSpotPricesNow } from "@/lib/metals";

/**
 * Live spot for the Refresh button on the price sites: gold and silver, straight from the provider
 * (at most one provider read every 10 s, shared). Never cached by the browser or CDN.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const spot = await getSpotPricesNow();
  if (!spot) return NextResponse.json({ error: "unavailable" }, { status: 502, headers: { "Cache-Control": "no-store" } });
  return NextResponse.json(
    { silver: spot.silver, gold: spot.gold, live: spot.live, updatedAt: spot.updatedAt },
    { headers: { "Cache-Control": "no-store" } },
  );
}
