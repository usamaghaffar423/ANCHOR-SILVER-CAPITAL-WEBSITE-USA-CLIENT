"use client";

import { useEffect, useState } from "react";

/**
 * Live market data for the client widgets.
 *
 * Rules of this module (see the site compliance spec):
 *   • **No invented prices.** Until a real snapshot arrives — and any time one
 *     can't be fetched — every figure renders as "—". The server may serve the
 *     last rate gold-api.com actually returned (as-of stamped, `live: false`);
 *     nothing here is ever made up.
 *   • **No 12-month / yearly figures.** There is no baseline, no `silverYear`,
 *     no "past 12 months" chip anywhere in the codebase.
 *   • **Every spot price carries its full label** (as-of time, "not a quote",
 *     source) via `spotLabel()` / `spotBasis()`.
 *   • The five-year headline figure is computed server-side (lib/five-year.ts);
 *     this module only re-checks it before rendering.
 */

export type Metals = {
  silver: number | null;
  gold: number | null;
  live: boolean;
  /** Provider snapshot timestamp (ISO) — drives "as of" text and fail-safes. */
  updatedAt: string | null;
  /** Server-computed five-year silver change (%), or null unless verified. */
  fiveYearPct: number | null;
};

/** Rendered wherever a figure is genuinely unavailable — never an invented number. */
export const PLACEHOLDER = "—";

export const SPOT_SOURCE = "gold-api.com";

/** Hero headline used on the server render and whenever data can't be verified. */
export const NEUTRAL_HEADLINE_LEAD = "Six years of supply deficit, and it";
export const HEADLINE_TAIL = "hasn't closed.";
export const NEUTRAL_HEADLINE = `${NEUTRAL_HEADLINE_LEAD} ${HEADLINE_TAIL}`;

/** Dynamic headline — only ever rendered with a guarded, whole-percent figure. */
export function dynamicFiveYearLead(pct: number): string {
  return `Silver is up approximately ${pct}% over five years, and the supply deficit`;
}

export function dynamicFiveYearHeadline(pct: number): string {
  return `${dynamicFiveYearLead(pct)} ${HEADLINE_TAIL}`;
}

const EMPTY: Metals = {
  silver: null,
  gold: null,
  live: false,
  updatedAt: null,
  fiveYearPct: null,
};

/* ------------------------------- spot labels ------------------------------ */

/** "Oct 7, 2026, 9:13 AM UTC" — deterministic across Node and browsers. */
export function formatAsOf(iso: string | null | undefined): string {
  if (!iso) return "the latest available update";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "the latest available update";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });
}

/**
 * Everything a spot figure must be stamped with, minus the price itself:
 * "indicative", as-of time, "not a quote", and source. Exported so a display
 * that shows the price in a large type of its own (the home page spot ticker)
 * can still carry the complete mandatory label underneath.
 */
export function spotBasis(updatedAt: string | null | undefined): string {
  return `indicative, as of ${formatAsOf(updatedAt)}. Not a quote; dealable prices are confirmed at the time of transaction. Source: ${SPOT_SOURCE}.`;
}

/**
 * The mandatory label for a spot price display. Price `null` (feed blocked,
 * loading, or failed) renders the *same sentence* with the PLACEHOLDER where the
 * figure would be — no number is invented, and the two states are within a few
 * characters of each other so the line count (and therefore the layout) does not
 * change when the feed arrives, stalls, or is blocked in DevTools.
 */
export function spotLabel(
  metal: "Silver" | "Gold",
  price: number | null,
  updatedAt: string | null,
): string {
  const basis = spotBasis(updatedAt);
  if (price == null || !Number.isFinite(price)) {
    return `${metal} spot ${PLACEHOLDER}/oz, ${basis}`;
  }
  return `${metal} spot $${price.toFixed(2)}/oz, ${basis}`;
}

/* ------------------------- shared snapshot loader ------------------------- */

const MARKET_URL = "/api/market";

// Several hooks on one page (`useMarket` + `useFiveYear`) each want the same
// snapshot. Without sharing, a single page load issued seven identical
// requests; on a cold cache they all missed the route's 60 s ISR entry at
// once, each waiting on the upstream spot feed (~2.3 s). One in-flight
// promise plus a short TTL means the whole page now makes one request.
const MARKET_TTL_MS = 15_000;

let marketInflight: Promise<unknown> | null = null;
let marketCache: { at: number; json: unknown } | null = null;

function loadMarketJson(): Promise<unknown> {
  const now = Date.now();
  if (marketCache && now - marketCache.at < MARKET_TTL_MS) {
    return Promise.resolve(marketCache.json);
  }
  if (marketInflight) return marketInflight;

  marketInflight = (async () => {
    try {
      const res = await fetch(MARKET_URL);
      if (!res.ok) throw new Error(`market snapshot ${res.status}`);
      const json = await res.json();
      marketCache = { at: Date.now(), json };
      return json;
    } finally {
      marketInflight = null;
    }
  })();

  return marketInflight;
}

/* --------------------------------- hooks ---------------------------------- */

export function useMetals(): Metals {
  const [data, setData] = useState<Metals>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        // Cached, server-side snapshot: spot prices + the five-year change.
        const j = (await loadMarketJson()) as {
          silver?: unknown;
          gold?: unknown;
          live?: unknown;
          updatedAt?: unknown;
          fiveYearPct?: unknown;
        } | null;
        if (cancelled) return;
        const silver = Number(j?.silver);
        const gold = Number(j?.gold);
        if (cancelled || !(silver > 0) || !(gold > 0)) return;
        setData({
          silver,
          gold,
          live: Boolean(j?.live),
          updatedAt: typeof j?.updatedAt === "string" ? j.updatedAt : null,
          fiveYearPct:
            j?.fiveYearPct == null || !Number.isFinite(Number(j.fiveYearPct))
              ? null
              : Number(j.fiveYearPct),
        });
      } catch {
        /* feed unreachable — keep whatever was last verified (as-of stamped) */
      }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return data;
}

export function useMarket(): Metals & { ratio: number | null } {
  const m = useMetals();
  const ratio = m.silver != null && m.silver > 0 && m.gold != null ? m.gold / m.silver : null;
  return { ...m, ratio };
}

/* ---------------------- guarded five-year headline figure ------------------ */

const FIVE_YEAR_MAX_AGE_MS = 4 * 60 * 60 * 1000; // >4h old → neutral headline
const FIVE_YEAR_MAX_JUMP = 0.2; // >20% away from the last valid fetch → neutral
const LAST_VALID_STORAGE_KEY = "asc_five_year_last_valid";

function readLastValidFiveYear(): number | null {
  try {
    const raw = window.sessionStorage.getItem(LAST_VALID_STORAGE_KEY);
    const v = raw == null ? NaN : Number(raw);
    return Number.isFinite(v) && v > 0 ? v : null;
  } catch {
    return null;
  }
}

function writeLastValidFiveYear(value: number): void {
  try {
    window.sessionStorage.setItem(LAST_VALID_STORAGE_KEY, String(value));
  } catch {
    /* storage unavailable — the in-memory ref still guards this session */
  }
}

/**
 * Whole-percent five-year change, or null — which is what every consumer must
 * render as the neutral state. Guards, in order:
 *   1. figure missing, non-finite, zero or negative
 *   2. snapshot older than 4 hours by `updatedAt`
 *   3. more than 20% away from the last accepted fetch in this session
 */
export function useFiveYear(): number | null {
  const { fiveYearPct, updatedAt } = useMarket();

  // Seeded once from sessionStorage. `fiveYearPct` is always null on the first
  // (server-matching) render, so the hydrated HTML and the first client render
  // agree — this can never introduce a hydration mismatch.
  const [lastValid, setLastValid] = useState<number | null>(() =>
    typeof window === "undefined" ? null : readLastValidFiveYear(),
  );

  let accepted: number | null = null;
  if (fiveYearPct != null && Number.isFinite(fiveYearPct) && fiveYearPct > 0) {
    const ts = updatedAt ? Date.parse(updatedAt) : NaN;
    const fresh = Number.isFinite(ts) && Date.now() - ts <= FIVE_YEAR_MAX_AGE_MS;
    const noJump =
      lastValid == null ||
      Math.abs((fiveYearPct - lastValid) / Math.abs(lastValid)) <= FIVE_YEAR_MAX_JUMP;
    if (fresh && noJump) accepted = Math.floor(fiveYearPct);
  }

  useEffect(() => {
    if (fiveYearPct != null && accepted != null) {
      setLastValid(fiveYearPct);
      writeLastValidFiveYear(fiveYearPct);
    }
  }, [fiveYearPct, accepted]);

  return accepted;
}
