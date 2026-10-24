"use client";

import { useMemo } from "react";
import { useMetals } from "@/components/site/market";

const usd = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/**
 * The embeddable price widget shown inside other sites' iframes: live spot (the
 * shared 60s /api/market poll), change vs. the open 24 hours ago, and a 30-day
 * sparkline of daily closes. Everything is real data; missing pieces show "—".
 */
export function SatEmbed({
  symbol,
  metal,
  host,
  initialSpot,
  openPrice,
  closes,
}: {
  symbol: "XAU" | "XAG";
  metal: string;
  host: string;
  initialSpot: number | null;
  openPrice: number | null;
  closes: number[];
}) {
  const live = useMetals();
  const liveSpot = symbol === "XAU" ? live.gold : live.silver;
  const spot = liveSpot ?? initialSpot;

  const change = useMemo(() => {
    if (spot == null || openPrice == null) return null;
    const abs = spot - openPrice;
    return { abs, pct: (abs / openPrice) * 100 };
  }, [spot, openPrice]);
  const dir = change && Math.abs(change.abs) >= 0.005 ? (change.abs > 0 ? "up" : "down") : null;

  const path = useMemo(() => {
    if (closes.length < 2) return null;
    const lo = Math.min(...closes);
    const hi = Math.max(...closes);
    const span = hi - lo || 1;
    return closes
      .map((c, i) => `${i ? "L" : "M"}${((i / (closes.length - 1)) * 300).toFixed(1)},${(70 - ((c - lo) / span) * 64 - 3).toFixed(1)}`)
      .join("");
  }, [closes]);

  return (
    <div className="sat-embed">
      <h1>{metal} spot · USD per troy ounce</h1>
      <div className="sat-embed-price">{spot != null ? usd(spot) : "—"}</div>
      <div className={`sat-embed-change ${dir ?? ""}`}>
        {change ? (
          <>
            <span aria-hidden="true">{dir === "up" ? "▲" : dir === "down" ? "▼" : "■"}</span>{" "}
            {dir === "up" ? "+" : dir === "down" ? "−" : ""}
            {usd(Math.abs(change.abs))} ({dir === "up" ? "+" : dir === "down" ? "−" : ""}
            {Math.abs(change.pct).toFixed(2)}%) <span style={{ fontWeight: 400 }}>24h</span>
          </>
        ) : (
          "—"
        )}
      </div>
      {path ? (
        <svg viewBox="0 0 300 70" preserveAspectRatio="none" role="img" aria-label={`${metal} daily closes, last ${closes.length} trading days`}>
          <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      ) : null}
      <div className="sat-embed-foot">
        Indicative spot, not a quote.{" "}
        <a href={`https://${host}/`} target="_blank" rel="noopener">
          {host}
        </a>
      </div>
    </div>
  );
}
