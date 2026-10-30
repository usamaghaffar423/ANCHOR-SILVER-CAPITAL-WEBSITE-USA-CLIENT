/**
 * Metals data — thin provider adapters. **Server-only** (reads GOLD_API_KEY /
 * METALS_API_KEY); never import this from a client component.
 *
 * Two concerns:
 *   1. Current spot prices — keyless (api.gold-api.com `/price/{SYMBOL}/USD`), used
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

import { cachedJson } from "@/lib/edge-cache";

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
/** A page render never waits longer than this on a provider; slower calls finish in the background. */
const PROVIDER_MAX_WAIT_MS = 1500;
/** Hard stop for the background provider call itself. */
const PROVIDER_ABORT_MS = 10_000;

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

/** One upstream read of the spot pair; null on any failure (callers fall back, nothing is invented). */
async function loadSpot(): Promise<SpotPrices | null> {
  try {
    const [xag, xau] = await Promise.all([
      fetch(`${GOLD_API}/XAG/USD`, { next: { revalidate: SPOT_REVALIDATE_SECONDS }, signal: AbortSignal.timeout(PROVIDER_ABORT_MS) }),
      fetch(`${GOLD_API}/XAU/USD`, { next: { revalidate: SPOT_REVALIDATE_SECONDS }, signal: AbortSignal.timeout(PROVIDER_ABORT_MS) }),
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
    const spot: SpotPrices = { silver, gold, live: true, updatedAt };
    lastGoodSpot = spot;
    return spot;
  } catch {
    return null;
  }
}

/**
 * Current silver + gold spot (USD/oz), or null when no reading exists yet.
 * Cached for `SPOT_REVALIDATE_SECONDS` through lib/edge-cache.ts: Next's fetch cache does not persist
 * on Cloudflare Workers, so without this every page view waited on two gold-api.com calls.
 */
export async function getSpotPrices(): Promise<SpotPrices | null> {
  const spot = await cachedJson("spot", SPOT_REVALIDATE_SECONDS, loadSpot, 3600, PROVIDER_MAX_WAIT_MS);
  return spot ?? lastGoodSpotOrNull();
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

/* ------------------- paid gold-api.com: OHLC + price history ----------------- */

/**
 * The keyed endpoints behind the /silver-price-per-ounce and
 * /gold-price-per-ounce pages. Both need `GOLD_API_KEY` (x-api-key header) and
 * go through lib/edge-cache.ts so a page view never costs an upstream call:
 * results are cached for the TTLs below and the last good value is served if
 * the provider errors. Spot itself is NOT fetched here — pages reuse
 * `getSpotPrices()` above so there is one spot implementation.
 */

export type PriceSymbol = "XAG" | "XAU";
export type HistoryRange = "1D" | "1W" | "1M" | "1Y" | "5Y";
export const HISTORY_RANGES: HistoryRange[] = ["1D", "1W", "1M", "1Y", "5Y"];

/** One chart point: epoch milliseconds + USD/oz. */
export type PricePoint = { t: number; p: number };

export type Ohlc = {
  open: number;
  high: number;
  low: number;
  close: number;
  /** Provider's open→close change for the window, in percent. */
  openCloseChangePercent: number;
  /** Window bounds, epoch seconds. */
  startTimestamp: number;
  endTimestamp: number;
};

type Grouping = "minute" | "hour" | "day" | "week";

const RANGE_CONFIG: Record<
  HistoryRange,
  { seconds: number; groupBy: Grouping; fallback?: Grouping; ttl: number }
> = {
  "1D": { seconds: 86_400, groupBy: "minute", fallback: "hour", ttl: 300 },
  "1W": { seconds: 7 * 86_400, groupBy: "hour", ttl: 600 },
  "1M": { seconds: 30 * 86_400, groupBy: "day", ttl: 1_800 },
  "1Y": { seconds: 365 * 86_400, groupBy: "day", ttl: 21_600 },
  "5Y": { seconds: 5 * 365 * 86_400, groupBy: "week", ttl: 21_600 },
};

export function isHistoryRange(v: unknown): v is HistoryRange {
  return typeof v === "string" && (HISTORY_RANGES as string[]).includes(v);
}

export function isPriceSymbol(v: unknown): v is PriceSymbol {
  return v === "XAG" || v === "XAU";
}

export function historyTtlSeconds(range: HistoryRange): number {
  return RANGE_CONFIG[range].ttl;
}

export function goldApiKeyConfigured(): boolean {
  return Boolean(process.env.GOLD_API_KEY);
}

async function keyedGet(path: string, params: URLSearchParams): Promise<unknown | null> {
  const key = process.env.GOLD_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(`https://api.gold-api.com${path}?${params.toString()}`, {
      headers: { "x-api-key": key },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`[metals] gold-api ${path} responded ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`[metals] gold-api ${path} failed`, err);
    return null;
  }
}

/** Epoch ms from whatever the provider used for the bucket label, or null. */
function bucketTime(row: Record<string, unknown>): number | null {
  // Verified against the live API: buckets are UTC strings under `date_minute`
  // ("2026-10-24 18:40"), `date_hour` ("2026-10-24 18"), `day` / `week`
  // ("2026-10-24 00:00:00").
  const raw =
    row.date_minute ?? row.date_hour ?? row.day ?? row.week ?? row.month ?? row.year;
  if (typeof raw !== "string") return null;
  let s = raw.trim().replace(" ", "T");
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) s += "T00:00:00";
  else if (/T\d{2}$/.test(s)) s += ":00:00";
  else if (/T\d{2}:\d{2}$/.test(s)) s += ":00";
  const ms = Date.parse(`${s}Z`);
  return Number.isNaN(ms) ? null : ms;
}

/** Keep the chart light: even stride, always keeping the newest point. */
function thin(points: PricePoint[], max: number): PricePoint[] {
  if (points.length <= max) return points;
  const stride = Math.ceil(points.length / max);
  return points.filter((_, i) => (points.length - 1 - i) % stride === 0);
}

async function loadHistory(
  symbol: PriceSymbol,
  range: HistoryRange,
): Promise<PricePoint[] | null> {
  const cfg = RANGE_CONFIG[range];
  const end = Math.floor(Date.now() / 1000 / 300) * 300; // 5-minute steps
  const attempts: Grouping[] = cfg.fallback ? [cfg.groupBy, cfg.fallback] : [cfg.groupBy];

  for (const groupBy of attempts) {
    const json = await keyedGet(
      "/history",
      new URLSearchParams({
        symbol,
        startTimestamp: String(end - cfg.seconds),
        endTimestamp: String(end),
        groupBy,
        aggregation: "avg",
        orderBy: "asc",
      }),
    );
    if (!Array.isArray(json)) continue;

    const points: PricePoint[] = [];
    for (const entry of json) {
      if (!entry || typeof entry !== "object") continue;
      const row = entry as Record<string, unknown>;
      const t = bucketTime(row);
      const p = Number(row.avg_price ?? row.max_price ?? row.price);
      if (t != null && Number.isFinite(p) && p > 0) points.push({ t, p });
    }
    if (points.length >= 2) {
      points.sort((a, b) => a.t - b.t);
      return thin(points, 400);
    }
  }
  return null;
}

/** Price history for the chart, cached per symbol + range. Null = unavailable. */
export function getPriceHistory(
  symbol: PriceSymbol,
  range: HistoryRange,
): Promise<PricePoint[] | null> {
  return cachedJson(`hist:${symbol}:${range}`, RANGE_CONFIG[range].ttl, () =>
    loadHistory(symbol, range),
  );
}

async function loadOhlc24h(symbol: PriceSymbol): Promise<Ohlc | null> {
  const end = Math.floor(Date.now() / 1000 / 60) * 60;
  const start = end - 86_400;
  const json = await keyedGet(
    `/ohlc/${symbol}`,
    new URLSearchParams({ startTimestamp: String(start), endTimestamp: String(end) }),
  );
  if (!json || typeof json !== "object") return null;
  const r = json as Record<string, unknown>;
  const open = Number(r.open);
  const high = Number(r.high);
  const low = Number(r.low);
  const close = Number(r.close);
  if (![open, high, low, close].every((n) => Number.isFinite(n) && n > 0)) return null;
  const pct = Number(r.openCloseChangePercent);
  return {
    open,
    high,
    low,
    close,
    openCloseChangePercent: Number.isFinite(pct) ? pct : (close / open - 1) * 100,
    startTimestamp: start,
    endTimestamp: end,
  };
}

/** Open/high/low/close over the trailing 24 hours (metals trade nearly round the clock). */
export function getOhlc24h(symbol: PriceSymbol): Promise<Ohlc | null> {
  return cachedJson(`ohlc:${symbol}`, 300, () => loadOhlc24h(symbol), 86_400, PROVIDER_MAX_WAIT_MS);
}

/* ------------------------------ daily candles ------------------------------ */

export type Candle = { t: number; o: number; h: number; l: number; c: number };

const DAY_MS = 86_400_000;

/**
 * 90 days of UTC-day candles for the standalone price sites. High/low are the
 * provider's real per-day max/min; open/close are the first/last hourly
 * average of the day (the API has no per-day open/close series), so the chart
 * is captioned accordingly. Days with no range (weekends, closures) are
 * dropped rather than drawn as flat bars.
 */
async function loadCandles(symbol: PriceSymbol): Promise<Candle[] | null> {
  const end = Math.floor(Date.now() / 1000 / 3600) * 3600;
  const base = {
    symbol,
    startTimestamp: String(end - 90 * 86_400),
    endTimestamp: String(end),
    orderBy: "asc",
  };
  const [mx, mn, hr] = await Promise.all([
    keyedGet("/history", new URLSearchParams({ ...base, groupBy: "day", aggregation: "max" })),
    keyedGet("/history", new URLSearchParams({ ...base, groupBy: "day", aggregation: "min" })),
    keyedGet("/history", new URLSearchParams({ ...base, groupBy: "hour", aggregation: "avg" })),
  ]);
  if (!Array.isArray(mx) || !Array.isArray(mn) || !Array.isArray(hr)) return null;

  const dayKey = (ms: number) => new Date(ms).toISOString().slice(0, 10);
  const fold = (rows: unknown[], field: string) => {
    const m = new Map<string, number>();
    for (const r of rows) {
      const row = r as Record<string, unknown>;
      const t = bucketTime(row);
      const v = Number(row[field]);
      if (t != null && Number.isFinite(v) && v > 0) m.set(dayKey(t), v);
    }
    return m;
  };
  const highs = fold(mx, "max_price");
  const lows = fold(mn, "min_price");

  const hours = new Map<string, { o: number; c: number }>();
  for (const r of hr) {
    const row = r as Record<string, unknown>;
    const t = bucketTime(row);
    const p = Number(row.avg_price);
    if (t == null || !(p > 0)) continue;
    const k = dayKey(t);
    const cur = hours.get(k);
    hours.set(k, cur ? { o: cur.o, c: p } : { o: p, c: p });
  }

  const all: Candle[] = [];
  for (const [k, h] of highs) {
    const l = lows.get(k);
    const oc = hours.get(k);
    if (l == null || !oc) continue;
    all.push({
      t: Date.parse(`${k}T00:00:00Z`),
      o: oc.o,
      c: oc.c,
      h: Math.max(h, oc.o, oc.c),
      l: Math.min(l, oc.o, oc.c),
    });
  }
  all.sort((a, b) => a.t - b.t);
  const active = all.filter((c) => c.h > c.l);
  const out = active.length >= 5 ? active : all;
  return out.length >= 2 ? out.filter((c) => c.t >= Date.now() - 91 * DAY_MS) : null;
}

/** Daily candles for the last ~90 days, cached 30 min. Null = unavailable. */
export function getDailyCandles(symbol: PriceSymbol): Promise<Candle[] | null> {
  return cachedJson(`candles:${symbol}`, 1_800, () => loadCandles(symbol), 86_400, PROVIDER_MAX_WAIT_MS);
}
