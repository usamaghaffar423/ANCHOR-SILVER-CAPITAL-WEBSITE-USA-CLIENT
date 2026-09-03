/**
 * Metals data — thin provider adapters. **Server-only** (reads METALS_API_KEY);
 * never import this from a client component.
 *
 * Two concerns:
 *   1. Current spot prices — keyless (api.gold-api.com), used by /api/market.
 *   2. A historical silver price ~365 days ago, for the hero's trailing-12-month
 *      change. This needs a paid provider, so the adapter is isolated here: swap
 *      it with the METALS_PROVIDER env var and nothing else changes.
 *
 * Supported historical provider: "metalpriceapi" (metalpriceapi.com). Add
 * another by writing a `HistoricalLookup` and registering it in
 * HISTORICAL_PROVIDERS.
 */

export type SpotPrices = { silver: number; gold: number; live: boolean };

/** Conservative last-resort figures so /api/market always returns a shape. */
const SPOT_FALLBACK: SpotPrices = { silver: 65.4, gold: 3320, live: false };

const GOLD_API = "https://api.gold-api.com/price";

/** Current silver + gold spot (USD/oz). Falls back to indicative figures. */
export async function getSpotPrices(): Promise<SpotPrices> {
  try {
    const [xag, xau] = await Promise.all([
      fetch(`${GOLD_API}/XAG`, { next: { revalidate: 3600 } }),
      fetch(`${GOLD_API}/XAU`, { next: { revalidate: 3600 } }),
    ]);
    if (!xag.ok || !xau.ok) return SPOT_FALLBACK;
    const silver = Number((await xag.json())?.price);
    const gold = Number((await xau.json())?.price);
    if (!(silver > 0) || !(gold > 0)) return SPOT_FALLBACK;
    return { silver, gold, live: true };
  } catch {
    return SPOT_FALLBACK;
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
 * no key is set, the provider name is unknown, or the call fails — the caller
 * then falls back to the DB history table.
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
