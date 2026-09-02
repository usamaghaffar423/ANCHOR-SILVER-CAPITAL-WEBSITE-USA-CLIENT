"use client";

import { useEffect, useState } from "react";

export const BASELINE = { silver: 37.37, gold: 2480 };

/** Conservative fallbacks rendered on the server so there is no layout shift. */
const FALLBACK = { silver: 65.4, gold: 3320 };

export type Metals = { silver: number; gold: number; live: boolean };

function pct(now: number, base: number) {
  return ((now - base) / base) * 100;
}

export function useMetals(): Metals {
  const [data, setData] = useState<Metals>({ ...FALLBACK, live: false });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("https://api.gold-api.com/price/XAG");
        const res2 = await fetch("https://api.gold-api.com/price/XAU");
        if (!res.ok || !res2.ok) return;
        const silver = await res.json();
        const gold = await res2.json();
        const s = Number(silver?.price);
        const g = Number(gold?.price);
        if (!cancelled && s > 0 && g > 0) setData({ silver: s, gold: g, live: true });
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
  return {
    ...m,
    ratio: m.gold / m.silver,
    silverYear: pct(m.silver, BASELINE.silver),
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
