import { unstable_cache } from "next/cache";
import { getGoldApiSilverAverage, getHistoricalSilver } from "@/lib/metals";

/**
 * The five-year-ago reference silver price (USD/oz), resolved server-side only.
 *
 * The provider keys (GOLD_API_KEY / METALS_API_KEY) live here and are read only
 * from route handlers — the browser only ever receives the *derived* percentage
 * from /api/market, never a key and never the raw historical fetch.
 *
 * Priority:
 *   a) gold-api.com `/history` (GOLD_API_KEY), averaged over a ±7-day window
 *      around the target date — one call per day at most (free tier: 10/hour)
 *   b) the configured historical provider (METALS_API_KEY + METALS_PROVIDER)
 *      for the exact target date
 *   c) null  → /api/market returns fiveYearPct: null and the hero renders the
 *      neutral headline (see components/site/market.tsx). There is deliberately
 *      no hard-coded seed price: an unverifiable figure is worse than no figure.
 */

const FIVE_YEARS_IN_DAYS = 365 * 5;
const WINDOW_DAYS = 7;
const DAY_MS = 86_400_000;

export type FiveYearRef = {
  price: number;
  /** ISO date (YYYY-MM-DD) the reference price is measured from. */
  date: string;
  source: "gold-api" | "historical-api";
};

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

async function resolveFiveYearRef(): Promise<FiveYearRef | null> {
  const targetIso = isoDaysAgo(FIVE_YEARS_IN_DAYS);
  const targetMs = Date.parse(`${targetIso}T00:00:00Z`);

  // a) gold-api.com /history — average of a small window around the target
  const fromGoldApi = await getGoldApiSilverAverage(
    new Date(targetMs - WINDOW_DAYS * DAY_MS),
    new Date(targetMs + WINDOW_DAYS * DAY_MS),
  );
  if (fromGoldApi && fromGoldApi > 0) {
    return { price: fromGoldApi, date: targetIso, source: "gold-api" };
  }

  // b) exact-date lookup via the configured historical provider
  const fromProvider = await getHistoricalSilver(targetIso);
  if (fromProvider && fromProvider > 0) {
    return { price: fromProvider, date: targetIso, source: "historical-api" };
  }

  // c) nothing verifiable — the caller falls back to the neutral headline
  return null;
}

/**
 * Cached for 6h: the target date moves once a day, and a failure to resolve
 * should not stick for a whole day (that is how long a 24h cache would pin a
 * `null` after, say, adding GOLD_API_KEY).
 */
export const getFiveYearSilverRef = unstable_cache(
  resolveFiveYearRef,
  ["silver-5y-ref"],
  { revalidate: 21_600, tags: ["silver-5y-ref"] },
);

/**
 * Five-year silver change as a percentage: `(spot ÷ fiveYearAgo) - 1`.
 * Rounded DOWN to a whole percent, per the headline spec. Returns null unless
 * both sides of the formula are real, positive numbers.
 */
export function fiveYearChangePct(
  spot: number | null | undefined,
  ref: FiveYearRef | null | undefined,
): number | null {
  if (spot == null || !(spot > 0)) return null;
  if (!ref || !(ref.price > 0)) return null;
  const pct = (spot / ref.price - 1) * 100;
  if (!Number.isFinite(pct) || pct <= 0) return null;
  return Math.floor(pct);
}
