"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PLACEHOLDER, spotBasis, useMetals } from "@/components/site/market";

/**
 * Live price block for /silver-price-per-ounce and /gold-price-per-ounce:
 * spot with daily change, an interactive history chart with a range selector,
 * and the trailing-24h open/high/low/close. Everything is real provider data:
 *   • spot  — server-rendered first paint, then the shared 60s /api/market
 *             poll (useMetals), the same feed as the home-page widgets
 *   • OHLC  — server-fetched (paid gold-api.com), cached 5 min
 *   • chart — server-fetched for the default range, then /api/price-history
 * When a piece is unavailable it says so; nothing is ever filled in.
 */

type Range = "1D" | "1W" | "1M" | "1Y" | "5Y";
type Point = { t: number; p: number };
export type OhlcData = {
  open: number;
  high: number;
  low: number;
  close: number;
  startTimestamp: number;
  endTimestamp: number;
};

const RANGES: Range[] = ["1D", "1W", "1M", "1Y", "5Y"];
const RANGE_LABEL: Record<Range, string> = {
  "1D": "Last 24 hours",
  "1W": "Last 7 days",
  "1M": "Last 30 days",
  "1Y": "Last 12 months",
  "5Y": "Last 5 years",
};

const usd = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function fmtTick(t: number, range: Range): string {
  const d = new Date(t);
  if (range === "1D") return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (range === "1W")
    return d.toLocaleDateString("en-US", { weekday: "short", hour: "numeric" });
  if (range === "1M") return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function fmtFull(t: number, range: Range): string {
  const d = new Date(t);
  return range === "1D" || range === "1W"
    ? d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Deterministic across server and browser (this text is in the server-rendered HTML). */
function fmtUtc(t: number): string {
  return new Date(t).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });
}

export function PriceChart({
  symbol,
  metal,
  lineVar,
  initialSpot,
  initialUpdatedAt,
  ohlc,
  initialRange,
  initialPoints,
}: {
  symbol: "XAG" | "XAU";
  metal: "Silver" | "Gold";
  /** CSS variable (e.g. "--silver") used for the line; lives on the ink panel. */
  lineVar: string;
  initialSpot: number | null;
  initialUpdatedAt: string | null;
  ohlc: OhlcData | null;
  initialRange: Range;
  initialPoints: Point[] | null;
}) {
  const live = useMetals();
  const liveSpot = symbol === "XAG" ? live.silver : live.gold;
  const spot = liveSpot ?? initialSpot;
  const updatedAt = liveSpot != null ? live.updatedAt : initialUpdatedAt;

  const [range, setRange] = useState<Range>(initialRange);
  const [points, setPoints] = useState<Point[] | null>(initialPoints);
  const [status, setStatus] = useState<"ok" | "loading" | "error">(
    initialPoints ? "ok" : "error",
  );
  const cache = useRef<Partial<Record<Range, Point[]>>>(
    initialPoints ? { [initialRange]: initialPoints } : {},
  );

  const pick = useCallback(
    async (next: Range) => {
      setRange(next);
      const hit = cache.current[next];
      if (hit) {
        setPoints(hit);
        setStatus("ok");
        return;
      }
      setStatus("loading");
      try {
        const res = await fetch(`/api/price-history?symbol=${symbol}&range=${next}`);
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as { points?: Point[] };
        if (!Array.isArray(json.points) || json.points.length < 2) throw new Error("empty");
        cache.current[next] = json.points;
        setPoints(json.points);
        setStatus("ok");
      } catch {
        setPoints(null);
        setStatus("error");
      }
    },
    [symbol],
  );

  // Daily change: live spot against the 24h window's open.
  const change = useMemo(() => {
    if (spot == null || !ohlc) return null;
    const abs = spot - ohlc.open;
    return { abs, pct: (abs / ohlc.open) * 100 };
  }, [spot, ohlc]);
  const dir = change ? (change.abs > 0 ? "up" : change.abs < 0 ? "down" : "flat") : null;

  return (
    <div className="rounded-md border border-white/10 bg-ink p-5 text-silver shadow-[var(--shadow-lift)] md:p-8">
      {/* spot + daily change */}
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <div>
          <p className="eyebrow text-secondary">{metal} spot · USD per troy ounce</p>
          <p className="mt-2 font-mono text-4xl font-medium tabular-nums text-background md:text-6xl">
            {spot != null ? usd(spot) : PLACEHOLDER}
          </p>
        </div>
        <div className="text-right">
          {change && dir ? (
            <p
              className="font-mono text-lg tabular-nums md:text-xl"
              style={{ color: dir === "up" ? "var(--gain)" : dir === "down" ? "var(--loss)" : undefined }}
            >
              <span aria-hidden="true">{dir === "up" ? "▲" : dir === "down" ? "▼" : "■"}</span>{" "}
              <span className="sr-only">{dir === "up" ? "Up" : dir === "down" ? "Down" : "Unchanged"} </span>
              {change.abs >= 0 ? "+" : "−"}
              {usd(Math.abs(change.abs))} ({change.pct >= 0 ? "+" : "−"}
              {Math.abs(change.pct).toFixed(2)}%)
            </p>
          ) : (
            <p className="font-mono text-lg text-silver/60">{PLACEHOLDER}</p>
          )}
          <p className="mt-1 text-xs text-silver/70">Change vs. the open 24 hours ago</p>
        </div>
      </div>

      {/* range selector */}
      <div className="mt-8 flex flex-wrap items-center gap-2" role="group" aria-label="Chart time range">
        {RANGES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => void pick(r)}
            aria-pressed={range === r}
            className={`min-h-10 min-w-12 rounded-sm border px-3 text-sm font-semibold tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
              range === r
                ? "border-secondary bg-secondary text-accent"
                : "border-white/20 text-silver hover:border-secondary hover:text-background"
            }`}
          >
            {r}
          </button>
        ))}
        <span className="ml-auto text-xs text-silver/70">{RANGE_LABEL[range]}</span>
      </div>

      <HistoryChart
        metal={metal}
        range={range}
        points={points}
        status={status}
        lineVar={lineVar}
        onRetry={() => void pick(range)}
      />

      {/* OHLC */}
      <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 md:grid-cols-4">
        {(
          [
            ["Open", ohlc?.open],
            ["High", ohlc?.high],
            ["Low", ohlc?.low],
            ["Close", ohlc?.close],
          ] as const
        ).map(([label, v]) => (
          <div key={label} className="bg-ink p-4">
            <dt className="eyebrow text-silver/70">{label}</dt>
            <dd className="mt-1 font-mono text-xl tabular-nums text-background">
              {v != null ? usd(v) : PLACEHOLDER}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-xs text-silver/70">
        Open / high / low / close for the trailing 24 hours
        {ohlc ? ` to ${fmtUtc(ohlc.endTimestamp * 1000)}` : ""}.
      </p>

      <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-relaxed text-silver/70">
        {metal} spot {spot != null ? usd(spot) : PLACEHOLDER}/oz, {spotBasis(updatedAt, false)} Chart shows
        average prices per interval. Past performance does not guarantee future results.
      </p>
    </div>
  );
}

/* --------------------------------- chart ---------------------------------- */

const M = { top: 14, right: 62, bottom: 26, left: 8 };

function HistoryChart({
  metal,
  range,
  points,
  status,
  lineVar,
  onRetry,
}: {
  metal: string;
  range: Range;
  points: Point[] | null;
  status: "ok" | "loading" | "error";
  lineVar: string;
  onRetry: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.floor(e.contentRect.width)));
    ro.observe(el);
    setWidth(Math.floor(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);

  const height = width < 480 ? 230 : 320;
  const geo = useMemo(() => {
    if (!points || points.length < 2 || width < 50) return null;
    const ps = points.map((d) => d.p);
    const lo = Math.min(...ps);
    const hi = Math.max(...ps);
    const pad = (hi - lo || hi * 0.01) * 0.08;
    const y0 = lo - pad;
    const y1 = hi + pad;
    const t0 = points[0].t;
    const t1 = points[points.length - 1].t;
    const iw = width - M.left - M.right;
    const ih = height - M.top - M.bottom;
    const x = (t: number) => M.left + ((t - t0) / (t1 - t0 || 1)) * iw;
    const y = (p: number) => M.top + (1 - (p - y0) / (y1 - y0)) * ih;
    const line = points.map((d, i) => `${i ? "L" : "M"}${x(d.t).toFixed(1)},${y(d.p).toFixed(1)}`).join("");
    const area = `${line}L${x(t1).toFixed(1)},${M.top + ih}L${x(t0).toFixed(1)},${M.top + ih}Z`;
    const yTicks = Array.from({ length: 4 }, (_, i) => y0 + ((y1 - y0) * (i + 0.5)) / 4);
    const nx = width < 480 ? 3 : 5;
    const xTicks = Array.from({ length: nx }, (_, i) => t0 + ((t1 - t0) * i) / (nx - 1));
    return { x, y, line, area, yTicks, xTicks, ih, t0, t1 };
  }, [points, width, height]);

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!geo || !points) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < points.length; i++) {
      const d = Math.abs(geo.x(points[i].t) - px);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    setHover(best);
  }

  const hp = hover != null && points ? points[Math.min(hover, points.length - 1)] : null;
  const color = `var(${lineVar})`;
  const gid = `fill-${metal}`;

  const tableRows = useMemo(() => {
    if (!points) return [];
    const n = Math.min(12, points.length);
    return Array.from({ length: n }, (_, i) => points[Math.round((i * (points.length - 1)) / (n - 1))]);
  }, [points]);

  return (
    <div className="mt-4">
      <div ref={wrapRef} className="relative w-full" style={{ height }}>
        {status === "ok" && !geo ? null : status === "ok" && geo && points ? (
          <>
            <svg
              width={width}
              height={height}
              role="img"
              aria-label={`${metal} price, ${RANGE_LABEL[range].toLowerCase()}: from ${usd(points[0].p)} to ${usd(points[points.length - 1].p)}, low ${usd(Math.min(...points.map((d) => d.p)))}, high ${usd(Math.max(...points.map((d) => d.p)))}. A table view follows.`}
              className="touch-pan-y select-none"
              onPointerMove={onMove}
              onPointerDown={onMove}
              onPointerLeave={() => setHover(null)}
            >
              <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="0.28" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
              </defs>
              {geo.yTicks.map((v) => (
                <g key={v}>
                  <line x1={M.left} x2={width - M.right} y1={geo.y(v)} y2={geo.y(v)} stroke="white" strokeOpacity="0.1" />
                  <text x={width - M.right + 8} y={geo.y(v) + 4} fontSize="11" fill="white" fillOpacity="0.65" className="font-mono">
                    {usd(v).replace(/\.00$/, "")}
                  </text>
                </g>
              ))}
              {geo.xTicks.map((t, i, a) => (
                <text
                  key={t}
                  x={geo.x(t)}
                  y={height - 6}
                  fontSize="11"
                  fill="white"
                  fillOpacity="0.65"
                  textAnchor={i === 0 ? "start" : i === a.length - 1 ? "end" : "middle"}
                >
                  {fmtTick(t, range)}
                </text>
              ))}
              <path d={geo.area} fill={`url(#${gid})`} />
              <path d={geo.line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              {hp ? (
                <g>
                  <line x1={geo.x(hp.t)} x2={geo.x(hp.t)} y1={M.top} y2={M.top + geo.ih} stroke="white" strokeOpacity="0.35" strokeDasharray="3 3" />
                  <circle cx={geo.x(hp.t)} cy={geo.y(hp.p)} r="5" fill={color} stroke="var(--ink)" strokeWidth="2" />
                </g>
              ) : (
                <circle
                  cx={geo.x(points[points.length - 1].t)}
                  cy={geo.y(points[points.length - 1].p)}
                  r="4"
                  fill={color}
                  stroke="var(--ink)"
                  strokeWidth="2"
                />
              )}
            </svg>
            {hp && (
              <div
                className="pointer-events-none absolute top-2 z-10 rounded-sm border border-white/15 bg-ink/95 px-3 py-2 text-xs shadow-[var(--shadow-card)]"
                style={{
                  left: Math.min(Math.max(geo.x(hp.t) - 70, 4), width - 150),
                }}
              >
                <p className="font-mono text-base tabular-nums text-background">{usd(hp.p)}</p>
                <p className="text-silver/80">{fmtFull(hp.t, range)}</p>
              </div>
            )}
          </>
        ) : (
          <div
            className="flex h-full flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-white/20 px-6 text-center text-sm text-silver/80"
            role={status === "error" ? "alert" : "status"}
          >
            {status === "loading" ? (
              <span>Loading {RANGE_LABEL[range].toLowerCase()}…</span>
            ) : (
              <>
                <span>Price history for this range is temporarily unavailable.</span>
                <button
                  type="button"
                  onClick={onRetry}
                  className="rounded-sm border border-secondary px-3 py-1.5 font-semibold text-secondary hover:bg-secondary hover:text-accent"
                >
                  Try again
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {status === "ok" && tableRows.length > 0 && (
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer text-silver/80 underline-offset-2 hover:underline">
            View chart data as a table
          </summary>
          <table className="mt-2 w-full text-left font-mono text-xs tabular-nums">
            <caption className="sr-only">
              {metal} price, {RANGE_LABEL[range].toLowerCase()}, sampled
            </caption>
            <thead>
              <tr className="text-silver/70">
                <th scope="col" className="py-1 font-normal">Time</th>
                <th scope="col" className="py-1 text-right font-normal">USD / oz</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((r) => (
                <tr key={r.t} className="border-t border-white/10">
                  <td className="py-1">{fmtFull(r.t, range)}</td>
                  <td className="py-1 text-right text-background">{usd(r.p)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}
    </div>
  );
}
