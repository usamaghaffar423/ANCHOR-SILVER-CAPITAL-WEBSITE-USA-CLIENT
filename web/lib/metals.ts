/**
 * Metals data — thin provider adapters. **Server-only** (reads GOLD_API_KEY /
 * METALS_API_KEY); never import this from a client component.
 *
 * Two concerns:
 *   1. Current spot prices — keyless (api.gold-api.com), used by /api/market.
 *      Returns `null` on any failure: there are no hard-coded fallback prices,
 *      so a failed feed renders as "no price" instead of an invented figure.
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
  live: boolean;
  /** Provider's own snapshot timestamp (ISO), or null if it didn't send one. */
  updatedAt: string | null;
};

const GOLD_API = "https://api.gold-api.com/price";
const GOLD_API_HISTORY = "https://api.gold-api.com/history";

/** Current silver + gold spot (USD/oz). `null` whenever the feed can't be read. */
export async function getSpotPrices(): Promise<SpotPrices | null> {
  try {
    const [xag, xau] = await Promise.all([
      fetch(`${GOLD_API}/XAG`, { next: { revalidate: 3600 } }),
      fetch(`${GOLD_API}/XAU`, { next: { revalidate: 3600 } }),
    ]);
    if (!xag.ok || !xau.ok) return null;
    const silverJson = (await xag.json()) as {
      price?: unknown;
      updatedAt?: unknown;
    };
    const goldJson = (await xau.json()) as { price?: unknown };
    const silver = Number(silverJson?.price);
    const gold = Number(goldJson?.price);
    if (!(silver > 0) || !(gold > 0)) return null;
    const updatedAt =
      typeof silverJson?.updatedAt === "string" ? silverJson.updatedAt : null;
    return { silver, gold, live: true, updatedAt };
  } catch {
    return null;
  }
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
