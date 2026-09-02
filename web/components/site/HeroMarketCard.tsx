"use client";

import { useMemo } from "react";
import { useMarket, BASELINE } from "@/components/site/market";

/**
 * Home hero market card. Live spot prices, the gold/silver ratio and the
 * trailing-12-month change come from `useMarket()`. The trend line is anchored
 * to two real points — the ~12-month-ago reference and the current price — with
 * an illustrative shape between them (labelled as such). Renders with the SSR
 * fallback figures first so there is no layout shift.
 */

// Fraction of the total 12-month climb reached at each monthly step. Shape only;
// the endpoints are the real anchor and the live price.
const TREND_SHAPE = [
  0, 0.07, 0.176, 0.141, 0.282, 0.387, 0.352, 0.528, 0.634, 0.739, 0.845, 0.915, 1,
] as const;

const VB = { w: 480, h: 268 };
const PLOT = { left: 44, right: 440, top: 30, bottom: 220 };

function niceBounds(min: number, max: number) {
  const lo = Math.max(0, Math.floor((min - 3) / 10) * 10);
  const hi = Math.ceil((max + 3) / 10) * 10;
  return { lo, hi: hi <= lo ? lo + 10 : hi };
}

// Relative labels — the page is statically generated, so absolute month names
// would freeze at build time. These stay correct without a redeploy.
const X_LABELS = ["12 mo ago", "6 mo ago", "Now"] as const;

export function HeroMarketCard() {
  const m = useMarket();

  const chart = useMemo(() => {
    const anchor = BASELINE.silver;
    const current = m.silver;
    const prices = TREND_SHAPE.map((s) => anchor + s * (current - anchor));
    const { lo, hi } = niceBounds(Math.min(...prices), Math.max(...prices));

    const x = (i: number) =>
      PLOT.left + (i / (prices.length - 1)) * (PLOT.right - PLOT.left);
    const y = (p: number) =>
      PLOT.top + (1 - (p - lo) / (hi - lo)) * (PLOT.bottom - PLOT.top);

    const pts = prices.map((p, i) => [x(i), y(p)] as const);
    const line = pts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`).join(" ");
    const area = `${line} L${PLOT.right},${PLOT.bottom} L${PLOT.left},${PLOT.bottom} Z`;

    const gridValues: number[] = [];
    for (let v = lo; v <= hi; v += 10) gridValues.push(v);

    return { line, area, last: pts[pts.length - 1], gridValues, y };
  }, [m.silver]);

  const changePct = m.silverYear;
  const changeLabel = `${changePct >= 0 ? "▲" : "▼"} ${changePct >= 0 ? "+" : ""}${changePct.toFixed(0)}% · 12mo`;

  return (
    <div className="rounded-xl border border-white/15 bg-white/[0.04] p-5 backdrop-blur-sm sm:p-6">
      <div className="flex items-center justify-between">
        <span className="font-plex text-[0.7rem] uppercase tracking-[0.12em] text-silver-deep">
          Silver · USD / oz
        </span>
        <span className="flex items-center gap-1.5 font-plex text-[0.7rem] text-gain">
          <span
            className="hero-live-dot inline-block h-[7px] w-[7px] rounded-full bg-gain"
            aria-hidden="true"
          />
          {m.live ? "Live" : "Indicative"}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-fraunces text-4xl font-light leading-none text-white sm:text-[2.6rem]">
          ${m.silver.toFixed(2)}
        </span>
        <span className="rounded font-plex text-[0.8rem] text-gain">
          <span className="rounded bg-gain/15 px-1.5 py-0.5">{changeLabel}</span>
        </span>
      </div>

      <svg
        className="mt-4 block h-auto w-full max-w-full"
        width={VB.w}
        height={VB.h}
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Silver spot price, ${changePct >= 0 ? "up" : "down"} about ${Math.abs(
          changePct,
        ).toFixed(0)} percent over the last 12 months. Illustrative trend.`}
      >
        <defs>
          <linearGradient id="hero-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brass)" stopOpacity="0.32" />
            <stop offset="100%" stopColor="var(--brass)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {chart.gridValues.map((v) => {
          const gy = chart.y(v);
          return (
            <g key={v}>
              <line
                className="hero-chart-grid"
                x1={PLOT.left}
                y1={gy}
                x2={PLOT.right}
                y2={gy}
              />
              <text className="hero-chart-axis" x={8} y={gy + 4}>
                ${v}
              </text>
            </g>
          );
        })}

        <path fill="url(#hero-area)" d={chart.area} />
        <path className="hero-chart-line hero-line-draw" pathLength={1} d={chart.line} />
        <circle
          className="hero-chart-dot"
          cx={chart.last[0]}
          cy={chart.last[1]}
          r={4.5}
        />

        <text className="hero-chart-axis" x={PLOT.left} y={VB.h - 30} textAnchor="start">
          {X_LABELS[0]}
        </text>
        <text className="hero-chart-axis" x={(PLOT.left + PLOT.right) / 2} y={VB.h - 30} textAnchor="middle">
          {X_LABELS[1]}
        </text>
        <text className="hero-chart-axis" x={PLOT.right} y={VB.h - 30} textAnchor="end">
          {X_LABELS[2]}
        </text>
      </svg>

      <div className="mt-4 flex border-t border-white/15 pt-3.5">
        {[
          { v: `$${Math.round(m.gold).toLocaleString("en-US")}`, l: "Gold / oz" },
          { v: `${m.ratio.toFixed(1)}:1`, l: "G/S Ratio" },
          { v: "6 yrs", l: "Supply deficit" },
        ].map((s, i) => (
          <div
            key={s.l}
            className={`flex-1 text-center ${i ? "border-l border-white/15" : ""}`}
          >
            <div className="font-fraunces text-[1.05rem] text-white">{s.v}</div>
            <div className="mt-0.5 font-plex text-[0.6rem] uppercase tracking-[0.05em] text-silver-deep">
              {s.l}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 font-plex text-[0.62rem] leading-relaxed text-silver-deep/85">
        Trend line is illustrative; endpoints reflect the trailing-12-month reference and the
        current price. Prices update during market hours. Past performance does not guarantee
        future results.
      </p>
    </div>
  );
}
