"use client";

import { useMemo, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { usd, type SatCandle } from "@/components/satellite/sat-format";
import { useMetals } from "@/components/site/market";

/**
 * Interactive block for the standalone price sites: live spot with a 24h range
 * gauge, daily candlesticks (7/30/90 days), unit conversions and a melt-value /
 * premium calculator. Deliberately a different layout and chart type from the
 * line chart on anchorsilvercapital.com (components/site/PriceChart.tsx), but
 * the same data: spot via the shared /api/market poll, OHLC and candles from the
 * server-cached paid gold-api.com endpoints. Missing data renders "—".
 */

export type SatOhlc = { open: number; high: number; low: number; close: number };

/** Chart code loads in its own chunk after hydration; the card reserves its height so nothing shifts. */
const CandleChart = dynamic(() => import("@/components/satellite/SatCandleChart").then((m) => m.CandleChart), {
  ssr: false,
  loading: () => <section className="sat-card sat-chartcard sat-tv" aria-busy="true" style={{ minHeight: 480 }} />,
});

const DASH = "—";
export function SatTool({
  symbol,
  metal,
  initialSpot,
  initialUpdatedAt,
  ohlc,
  candles,
  units,
  purities,
  chartNote,
  afterSpot,
  embedCode,
}: {
  symbol: "XAU" | "XAG";
  metal: string;
  initialSpot: number | null;
  initialUpdatedAt: string | null;
  ohlc: SatOhlc | null;
  candles: SatCandle[] | null;
  units: { label: string; perOz: number }[];
  purities: { label: string; fineness: number }[];
  chartNote: string;
  /** Server-rendered content (hero CTA, trust bar) placed between the price card and the chart. */
  afterSpot?: ReactNode;
  /** HTML snippet shown in the "Add to site" panel. */
  embedCode: string;
}) {
  const live = useMetals();
  const liveSpot = symbol === "XAU" ? live.gold : live.silver;
  const spot = liveSpot ?? initialSpot;
  const updatedAt = liveSpot != null ? live.updatedAt : initialUpdatedAt;

  const change = useMemo(() => {
    if (spot == null || !ohlc) return null;
    const abs = spot - ohlc.open;
    return { abs, pct: (abs / ohlc.open) * 100 };
  }, [spot, ohlc]);
  // Under half a cent rounds to $0.00, so it reads as unchanged rather than up/down.
  const dir = change && Math.abs(change.abs) >= 0.005 ? (change.abs > 0 ? "up" : "down") : null;

  // gauge position of spot within the 24h low..high (clamped)
  const gauge = useMemo(() => {
    if (spot == null || !ohlc || !(ohlc.high > ohlc.low)) return null;
    const pos = (v: number) => Math.min(100, Math.max(0, ((v - ohlc.low) / (ohlc.high - ohlc.low)) * 100));
    return { spot: pos(spot), open: pos(ohlc.open) };
  }, [spot, ohlc]);

  return (
    <div className="sat-tool">
      <section className="sat-card" aria-label={`${metal} spot price`}>
        <h2>{metal} spot · USD per troy ounce</h2>
        <div className="sat-price-row">
          <div>
            <div className="sat-price">{spot != null ? usd(spot) : DASH}</div>
            <div className="sat-unit">per troy ounce</div>
          </div>
          <div>
            {change ? (
              <div className={`sat-change ${dir ?? ""}`}>
                <span aria-hidden="true">{dir === "up" ? "▲" : dir === "down" ? "▼" : "■"}</span>{" "}
                <span className="sr-only">{dir === "up" ? "Up" : dir === "down" ? "Down" : "Unchanged"} </span>
                {dir === "up" ? "+" : dir === "down" ? "−" : ""}
                {usd(Math.abs(change.abs))} ({dir === "up" ? "+" : dir === "down" ? "−" : ""}
                {Math.abs(change.pct).toFixed(2)}%)
              </div>
            ) : (
              <div className="sat-change">{DASH}</div>
            )}
            <div className="sat-unit">vs. 24 hours ago</div>
          </div>
        </div>

        <div className="sat-gauge">
          <div className="sat-gauge-track" role="img" aria-label={
            gauge && ohlc ? `24-hour range from ${usd(ohlc.low)} to ${usd(ohlc.high)}` : "24-hour range unavailable"
          }>
            {gauge && (
              <>
                <span className="sat-gauge-open" style={{ left: `${gauge.open}%` }} title="24h open" />
                <span className="sat-gauge-pin" style={{ left: `${gauge.spot}%` }} title="Now" />
              </>
            )}
          </div>
          <div className="sat-gauge-labels">
            <span>
              24h low <b>{ohlc ? usd(ohlc.low) : DASH}</b>
            </span>
            <span>
              24h high <b>{ohlc ? usd(ohlc.high) : DASH}</b>
            </span>
          </div>
        </div>
        <p className="sat-asof">
          Indicative spot as of {asOf(updatedAt)}. Not a quote. The marker is now; the
          grey tick is the open 24 hours ago.
        </p>
      </section>

      {afterSpot}

      <CandleChart metal={metal} symbol={symbol} initial={candles} note={chartNote} embedCode={embedCode} />

      <div className="sat-grid-2">
        <section className="sat-card" aria-label="Price by unit">
          <h2>{metal} price by unit</h2>
          <table className="sat-table">
            <thead>
              <tr>
                <th scope="col">Unit</th>
                <th scope="col">USD</th>
              </tr>
            </thead>
            <tbody>
              {units.map((u) => (
                <tr key={u.label}>
                  <th scope="row" style={{ fontWeight: 400 }}>
                    {u.label}
                  </th>
                  <td>{spot != null ? usd(spot * u.perOz, u.perOz < 0.5 ? 2 : 2) : DASH}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <Calculator metal={metal} spot={spot} purities={purities} />
      </div>
    </div>
  );
}

function asOf(iso: string | null): string {
  if (!iso) return "the latest update";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "the latest update";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });
}

/* ------------------------------- calculator ------------------------------- */

const UNITS = [
  { label: "grams", toOz: 1 / 31.1034768 },
  { label: "troy ounces", toOz: 1 },
  { label: "pennyweight", toOz: 1 / 20 },
] as const;

function Calculator({
  metal,
  spot,
  purities,
}: {
  metal: string;
  spot: number | null;
  purities: { label: string; fineness: number }[];
}) {
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState(0);
  const [pur, setPur] = useState(0);
  const [quote, setQuote] = useState("");

  const w = parseFloat(weight);
  const q = parseFloat(quote);
  const fineOz = w > 0 ? w * UNITS[unit].toOz * purities[pur].fineness : null;
  const melt = fineOz != null && spot != null ? fineOz * spot : null;
  const prem = melt != null && q > 0 ? { abs: q - melt, pct: ((q - melt) / melt) * 100 } : null;

  return (
    <section className="sat-card" aria-label="Melt value calculator">
      <h2>Melt value &amp; premium</h2>
      <form className="sat-form" onSubmit={(e) => e.preventDefault()}>
        <div className="sat-row">
          <label>
            Weight
            <input className="sat-input" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 31.1" />
          </label>
          <label>
            Unit
            <select className="sat-input" value={unit} onChange={(e) => setUnit(Number(e.target.value))}>
              {UNITS.map((u, i) => (
                <option key={u.label} value={i}>{u.label}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Purity
          <select className="sat-input" value={pur} onChange={(e) => setPur(Number(e.target.value))}>
            {purities.map((p, i) => (
              <option key={p.label} value={i}>{p.label}</option>
            ))}
          </select>
        </label>
        <label>
          Price you were quoted (optional, USD)
          <input className="sat-input" inputMode="decimal" value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="e.g. 2500" />
        </label>
      </form>
      <div className="sat-result" aria-live="polite">
        <div>
          <span>Pure {metal.toLowerCase()} content</span>
          <b>{fineOz != null ? `${fineOz.toFixed(4)} oz` : DASH}</b>
        </div>
        <div>
          <span>Melt value at spot</span>
          <b>{melt != null ? usd(melt) : DASH}</b>
        </div>
        <div>
          <span>Quote vs. melt</span>
          <b>
            {prem ? `${prem.abs >= 0 ? "+" : "−"}${usd(Math.abs(prem.abs))} (${prem.pct >= 0 ? "+" : "−"}${Math.abs(prem.pct).toFixed(1)}%)` : DASH}
          </b>
        </div>
      </div>
      <p className="sat-note">Melt value is a reference, not an offer. A buyer will deduct refining and handling costs.</p>
    </section>
  );
}
