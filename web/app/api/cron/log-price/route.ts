import { NextResponse } from "next/server";
import { getSpotPrices } from "@/lib/metals";
import { logTodaySilverPrice } from "@/lib/silver-history";

/**
 * Daily job (Vercel Cron — see vercel.json). Appends today's silver spot price
 * to `silver_price_history` so the DB builds a rolling 12-month history that can
 * eventually replace the paid historical API.
 *
 * Auth: Vercel sends `Authorization: Bearer $CRON_SECRET` when CRON_SECRET is
 * set. Until it is set the endpoint runs unauthenticated (dev only) with a warn.
 */
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    if (req.headers.get("authorization") !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  } else {
    console.warn("[cron/log-price] CRON_SECRET not set — endpoint is unauthenticated");
  }

  const spot = await getSpotPrices();
  if (!spot.live) {
    return NextResponse.json(
      { ok: false, error: "spot_unavailable" },
      { status: 502 },
    );
  }

  const result = await logTodaySilverPrice(spot.silver);
  // "turso_not_configured" is expected until Turso env vars are set — not a 500.
  const status =
    result.ok || result.reason === "turso_not_configured" ? 200 : 500;
  return NextResponse.json({ ...result, price: spot.silver }, { status });
}
