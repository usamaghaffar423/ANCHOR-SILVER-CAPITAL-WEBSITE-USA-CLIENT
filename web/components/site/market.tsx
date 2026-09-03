"use client";

import { useEffect, useState } from "react";

/**
 * Documented ~12-month-ago reference prices (USD/oz). Used only as the fallback
 * when the server can't resolve a real historical price — see
 * `lib/silver-history.ts`, whose SEED matches `BASELINE.silver`.
 */
export const BASELINE = { silver: 37.37, gold: 2480 };

/** Conservative fallbacks rendered on the server so there is no layout shift. */
const FALLBACK: Metals = {
  silver: 65.4,
  gold: 3320,
  live: false,
  changePct: null,
  refPrice: null,
  asOf: null,
};

export type Metals = {
  silver: number;
  gold: number;
  live: boolean;
  /** Server-computed trailing-12-month silver change (%), or null if unknown. */
  changePct: number | null;
  /** The real silver price ~12 months ago the change is measured from, or null. */
  refPrice: number | null;
  /** ISO timestamp the server snapshot was taken, or null on the fallback. */
  asOf: string | null;
};

function pct(now: number, base: number) {
  return ((now - base) / base) * 100;
}

/** Whole-number, sign-aware trailing-12-month move: "up 78%" / "down 4%" / "flat". */
export function yearMove(changePct: number): string {
  const r = Math.round(changePct);
  if (r === 0) return "flat";
  return `${r > 0 ? "up" : "down"} ${Math.abs(r)}%`;
}

/** Hero headline verb phrase: "has climbed 78%" / "has slipped 4%" / "has held flat". */
export function yearHeadline(changePct: number): string {
  const r = Math.round(changePct);
  if (r === 0) return "has held roughly flat";
  return `has ${r > 0 ? "climbed" : "slipped"} ${Math.abs(r)}%`;
}

export function useMetals(): Metals {
  const [data, setData] = useState<Metals>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        // Cached, server-side snapshot: spot prices + trailing-12-month change.
        const res = await fetch("/api/market");
        if (!res.ok) return;
        const j = await res.json();
        const s = Number(j?.silver);
        const g = Number(j?.gold);
        if (!cancelled && s > 0 && g > 0) {
          setData({
            silver: s,
            gold: g,
            live: Boolean(j?.live),
            changePct: j?.changePct == null ? null : Number(j.changePct),
            refPrice: Number(j?.refPrice) > 0 ? Number(j.refPrice) : null,
            asOf: typeof j?.asOf === "string" ? j.asOf : null,
          });
        }
      } catch {
        /* keep fallback figures */
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

export function useMarket() {
  const m = useMetals();
  // One source of truth for the trailing-12-month silver move: the real price
  // ~12 months ago when the server resolved one, else the documented BASELINE.
  // Every consumer (hero headline, hero card badge, announcement bar, market
  // widgets) derives its % from this same reference so they never disagree.
  const silverRef = m.refPrice && m.refPrice > 0 ? m.refPrice : BASELINE.silver;
  return {
    ...m,
    ratio: m.gold / m.silver,
    silverRef,
    silverYear: pct(m.silver, silverRef),
    goldYear: pct(m.gold, BASELINE.gold),
  };
}

export function DataCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-h-[92px] rounded-sm border border-silver/20 bg-ink/40 px-5 py-4">
      <p className="font-mono text-2xl leading-none text-background tabular-nums md:text-[1.75rem]">
        {value}
      </p>
      <p className="eyebrow mt-3 text-silver-deep">{label}</p>
    </div>
  );
}


export function MarketBar() {
  const m = useMarket();
  return (
    <div className="bg-accent px-5 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row lg:items-center">
        <p className="eyebrow shrink-0 text-secondary lg:w-40">Live Market Data</p>
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <DataCard label="Gold (USD / oz)" value={`$${m.gold.toFixed(2)}`} />
          <DataCard label="Silver (USD / oz)" value={`$${m.silver.toFixed(2)}`} />
          <DataCard label="Gold / Silver Ratio" value={`${m.ratio.toFixed(1)}:1`} />
          <DataCard
            label="Silver — Past 12 Months"
            value={`${m.silverYear >= 0 ? "+" : ""}${m.silverYear.toFixed(1)}%`}
          />
        </div>
      </div>

      <p className="mx-auto mt-4 w-full max-w-6xl text-xs italic text-silver-deep">
        Prices update in real time during market hours. Past performance does not guarantee future
        results.
      </p>
    </div>
  );
}
