/**
 * Metals data — thin provider adapters. **Server-only** (reads GOLD_API_KEY /
 * METALS_API_KEY); never import this from a client component.
 *
 * Two concerns:
 *   1. Current spot prices — keyless (api.gold-api.com `/price/{SYMBOL}`), used
 *      by /api/market. Cached for 60s. A failed read falls back to the last
 *      reading gold-api actually returned (marked `live: false`) so an outage
 *      shows a stale-but-real, as-of-stamped rate instead of blanking the page;
 *      before any reading exists it still returns `null`, never an invented
 *      figure.
 *   2. Historical silver lookups used by the five-year engine — see
 *      lib/five-year.ts.
 *
 * Supported historical providers: gold-api.com /history (GOLD_API_KEY) and
 * metalpriceapi.com (METALS_API_KEY). Add another by writing a
 * `HistoricalLookup` and registering it in HISTORICAL_PROVIDERS.
 */

export type SpotPrices = {
  silver: number;
  gold: number;
  /** False when this is the cached last-good reading rather than a fresh read. */
  live: boolean;
  /** Provider's own snapshot timestamp (ISO), or null if it didn't send one. */
  updatedAt: string | null;
};

const GOLD_API = "https://api.gold-api.com/price";
const GOLD_API_HISTORY = "https://api.gold-api.com/history";

/** Server-side cache window for the live spot pair (gold-api.com is keyless). */
const SPOT_REVALIDATE_SECONDS = 60;

/**
 * Last spot pair gold-api.com actually returned. Kept in module scope purely as
 * the outage fallback: a provider failure degrades to this rate (still stamped
 * with its own `updatedAt`, `live: false`) instead of removing every figure.
 * It is never a guessed number — only a value the provider sent.
 */
let lastGoodSpot: SpotPrices | null = null;

function lastGoodSpotOrNull(): SpotPrices | null {
  return lastGoodSpot ? { ...lastGoodSpot, live: false } : null;
}

/** Current silver + gold spot (USD/oz), or null when no reading exists yet. */
export async function getSpotPrices(): Promise<SpotPrices | null> {
  try {
    const [xag, xau] = await Promise.all([
      fetch(`${GOLD_API}/XAG`, { next: { revalidate: SPOT_REVALIDATE_SECONDS } }),
      fetch(`${GOLD_API}/XAU`, { next: { revalidate: SPOT_REVALIDATE_SECONDS } }),
    ]);
    if (!xag.ok || !xau.ok) return lastGoodSpotOrNull();
    const silverJson = (await xag.json()) as {
      price?: unknown;
      updatedAt?: unknown;
    };
    const goldJson = (await xau.json()) as { price?: unknown };
    const silver = Number(silverJson?.price);
    const gold = Number(goldJson?.price);
    if (!(silver > 0) || !(gold > 0)) return lastGoodSpotOrNull();
    const updatedAt =
      typeof silverJson?.updatedAt === "string" ? silverJson.updatedAt : null;
    const spot: SpotPrices = { silver, gold, live: true, updatedAt };
    lastGoodSpot = spot;
    return spot;
  } catch {
    return lastGoodSpotOrNull();
  }
}

/* ----------------------------- pricing rule ------------------------------ */

/**
 * Our premium ceiling: spot × 1.15, i.e. a maximum 15% over spot. Matches the
 * "capped at 15%" rule published on the home page and in the risk disclosure
 * ("Our premium does not exceed 15% over spot on any product, all in").
 */
export const MAX_PREMIUM_MULTIPLIER = 1.15;

/**
 * Maximum retail cap for a metal (USD/oz): `Spot Price * 1.15`.
 * Returns null for missing/non-positive input so callers render a placeholder
 * rather than a fabricated price.
 */
export function maxRetailCap(spot: number | null | undefined): number | null {
  if (spot == null || !Number.isFinite(spot) || spot <= 0) return null;
  return spot * MAX_PREMIUM_MULTIPLIER;
}

/**
 * Average silver USD/oz over `[start, end]` from gold-api.com `/history`.
 *
 * Requires `GOLD_API_KEY` (free tier, 10 requests/hour — this result is cached
 * for a day by lib/five-year.ts, so it is never called per request). Returns
 * `null` on a missing key, a non-OK response, or an unusable payload.
 */
export async function getGoldApiSilverAverage(
  start: Date,
  end: Date,
): Promise<number | null> {
  const key = process.env.GOLD_API_KEY;
  if (!key) return null;

  const params = new URLSearchParams({
    symbol: "XAG",
    startTimestamp: String(Math.floor(start.getTime() / 1000)),
    endTimestamp: String(Math.floor(end.getTime() / 1000)),
    groupBy: "day",
    aggregation: "avg",
    orderBy: "asc",
  });

  try {
    const res = await fetch(`${GOLD_API_HISTORY}?${params.toString()}`, {
      headers: { "x-api-key": key },
      next: { revalidate: 86_400 },
    });
    if (!res.ok) return null;
    const rows: unknown = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) return null;

    const values: number[] = [];
    for (const entry of rows) {
      if (!entry || typeof entry !== "object") continue;
      const row = entry as Record<string, unknown>;
      const avg = Number(row.avg_price);
      const max = Number(row.max_price);
      const min = Number(row.min_price);
      const price = Number.isFinite(avg) && avg > 0
        ? avg
        : Number.isFinite(max) && Number.isFinite(min) && max > 0 && min > 0
          ? (max + min) / 2
          : Number(row.price);
      if (Number.isFinite(price) && price > 0) values.push(price);
    }
    if (values.length === 0) return null;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return mean > 0 ? mean : null;
  } catch (err) {
    console.error("[metals] gold-api history lookup failed", err);
    return null;
  }
}

/* ------------------------- historical silver price ------------------------ */

/**
 * Keyless five-year reference: COMEX front-month silver futures daily closes
 * from Yahoo Finance. Used only when neither GOLD_API_KEY nor METALS_API_KEY
 * is configured, so the five-year figure can still be computed from real,
 * attributable history instead of being hidden forever. Returns `null` on any
 * failure — the caller then falls through to the neutral headline.
 */
const YAHOO_CHART = "https://query1.finance.yahoo.com/v8/finance/chart/SI=F";
const YAHOO_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export async function getComexSilverAverage(
  start: Date,
  end: Date,
): Promise<number | null> {
  const params = new URLSearchParams({
    period1: String(Math.floor(start.getTime() / 1000)),
    period2: String(Math.floor(end.getTime() / 1000)),
    interval: "1d",
  });

  try {
    const res = await fetch(`${YAHOO_CHART}?${params.toString()}`, {
      headers: { "User-Agent": YAHOO_UA, Accept: "application/json" },
      next: { revalidate: 86_400 },
    });
    if (!res.ok) return null;

    const payload = (await res.json()) as {
      chart?: {
        result?: Array<{
          indicators?: { quote?: Array<{ close?: Array<unknown> }> };
        }>;
      };
    };
    const closes = payload?.chart?.result?.[0]?.indicators?.quote?.[0]?.close;
    if (!Array.isArray(closes)) return null;

    const values: number[] = [];
    for (const entry of closes) {
      const price = Number(entry);
      if (Number.isFinite(price) && price > 0) values.push(price);
    }
    if (values.length === 0) return null;

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return mean > 0 ? mean : null;
  } catch (err) {
    console.error("[metals] COMEX reference lookup failed", err);
    return null;
  }
}

/** Resolve silver USD/oz for an ISO date (YYYY-MM-DD), or null on any failure. */
export type HistoricalLookup = (isoDate: string) => Promise<number | null>;

/**
 * metalpriceapi.com — `GET /v1/{date}?api_key=&base=USD&currencies=XAG`.
 * Response carries `rates.XAG` (troy oz per USD) and the convenience
 * `rates.USDXAG` (USD per troy oz). Prefer the convenience key; fall back to
 * the reciprocal so the adapter is robust to either being returned.
 */
const metalpriceapi: HistoricalLookup = async (isoDate) => {
  const key = process.env.METALS_API_KEY;
  if (!key) return null;
  const url = `https://api.metalpriceapi.com/v1/${isoDate}?api_key=${encodeURIComponent(
    key,
  )}&base=USD&currencies=XAG`;
  const res = await fetch(url, { next: { revalidate: 86_400 } });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    success?: boolean;
    rates?: Record<string, number>;
  };
  if (data.success === false || !data.rates) return null;
  const usdPerOz =
    Number(data.rates.USDXAG) > 0
      ? Number(data.rates.USDXAG)
      : Number(data.rates.XAG) > 0
        ? 1 / Number(data.rates.XAG)
        : NaN;
  return usdPerOz > 0 ? usdPerOz : null;
};

const HISTORICAL_PROVIDERS: Record<string, HistoricalLookup> = {
  metalpriceapi,
};

export function historicalProviderName(): string {
  return process.env.METALS_PROVIDER || "metalpriceapi";
}

export function historicalApiConfigured(): boolean {
  return Boolean(process.env.METALS_API_KEY);
}

/**
 * Silver USD/oz on the given date via the configured provider. Returns null when
 * no key is set, the provider name is unknown, or the call fails.
 */
export async function getHistoricalSilver(isoDate: string): Promise<number | null> {
  const name = historicalProviderName();
  const provider = HISTORICAL_PROVIDERS[name];
  if (!provider) {
    console.warn(`[metals] unknown METALS_PROVIDER "${name}"`);
    return null;
  }
  try {
    return await provider(isoDate);
  } catch (err) {
    console.error("[metals] historical lookup failed", err);
    return null;
  }
}
