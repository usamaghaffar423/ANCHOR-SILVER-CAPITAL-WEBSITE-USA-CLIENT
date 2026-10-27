"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useMetals } from "@/components/site/market";

/**
 * Interactive block for the standalone price sites: live spot with a 24h range
 * gauge, daily candlesticks (7/30/90 days), unit conversions and a melt-value /
 * premium calculator. Deliberately a different layout and chart type from the
 * line chart on anchorsilvercapital.com (components/site/PriceChart.tsx), but
 * the same data: spot via the shared /api/market poll, OHLC and candles from the
 * server-cached paid gold-api.com endpoints. Missing data renders "—".
 */

export type SatCandle = { t: number; o: number; h: number; l: number; c: number };
export type SatOhlc = { open: number; high: number; low: number; close: number };

const DASH = "—";
const usd = (n: number, d = 2) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d })}`;

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

/* ------------------------------ candlesticks ------------------------------ */

const DAYS = [7, 30, 90] as const;
const M = { top: 12, right: 64, bottom: 24, left: 6 };

function CandleChart({
  metal,
  symbol,
  initial,
  note,
  embedCode,
}: {
  metal: string;
  symbol: string;
  initial: SatCandle[] | null;
  note: string;
  embedCode: string;
}) {
  const [days, setDays] = useState<(typeof DAYS)[number]>(30);
  const [data, setData] = useState<SatCandle[] | null>(initial);
  const [failed, setFailed] = useState(!initial);
  const [hover, setHover] = useState<number | null>(null);
  const [hoverY, setHoverY] = useState(0);
  const [kind, setKind] = useState<"candles" | "line">("candles");
  const wrap = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLElement>(null);
  const [w, setW] = useState(0);
  const [fs, setFs] = useState(false);
  const [fsH, setFsH] = useState(0);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  // false on the server and during hydration, then the browser's real answer.
  const canFullscreen = useSyncExternalStore(
    () => () => {},
    () => Boolean(document.fullscreenEnabled),
    () => false,
  );

  useEffect(() => {
    const onChange = () => {
      const on = document.fullscreenElement === card.current;
      setFs(on);
      setFsH(on ? Math.max(320, window.innerHeight - 200) : 0);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function toggleFullscreen() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void card.current?.requestFullscreen();
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the text is selectable in the box */
    }
  }

  useEffect(() => {
    if (initial) return;
    let cancelled = false;
    fetch(`/api/candles?symbol=${symbol}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j: { candles?: SatCandle[] }) => {
        if (cancelled) return;
        if (Array.isArray(j.candles) && j.candles.length > 1) {
          setData(j.candles);
          setFailed(false);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [initial, symbol]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.floor(e.contentRect.width)));
    ro.observe(el);
    setW(Math.floor(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);

  const shown = useMemo(() => {
    if (!data) return null;
    const last = data[data.length - 1].t;
    const cut = last - days * 86_400_000;
    const s = data.filter((c) => c.t > cut);
    return s.length >= 2 ? s : data.slice(-Math.min(data.length, days));
  }, [data, days]);

  const h = fs && fsH ? fsH : w < 480 ? 250 : 340;
  const geo = useMemo(() => {
    if (!shown || w < 60) return null;
    const lo = Math.min(...shown.map((c) => c.l));
    const hi = Math.max(...shown.map((c) => c.h));
    const pad = (hi - lo || hi * 0.01) * 0.06;
    const y0 = lo - pad;
    const y1 = hi + pad;
    const iw = w - M.left - M.right;
    const ih = h - M.top - M.bottom;
    const slot = iw / shown.length;
    const x = (i: number) => M.left + slot * (i + 0.5);
    const y = (p: number) => M.top + (1 - (p - y0) / (y1 - y0)) * ih;
    const bw = Math.max(2, Math.min(18, slot * 0.62));
    const nTicks = h < 300 ? 5 : 7;
    const yTicks = Array.from({ length: nTicks }, (_, i) => y0 + ((y1 - y0) * (i + 0.5)) / nTicks);
    const step = Math.max(1, Math.round(shown.length / (w < 480 ? 3 : 7)));
    // 7-period simple moving average of closes, over the full history so the line starts at the left edge.
    const all = data ?? shown;
    const offset = all.length - shown.length;
    const ma = shown.map((_, i) => {
      const end = offset + i;
      if (end < 6) return null;
      let s = 0;
      for (let k = end - 6; k <= end; k++) s += all[k].c;
      return s / 7;
    });
    return { x, y, bw, yTicks, step, ih, slot, ma, y0, y1 };
  }, [shown, data, w, h]);

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!geo || !shown) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left - M.left;
    setHover(Math.min(shown.length - 1, Math.max(0, Math.floor(px / geo.slot))));
    setHoverY(Math.min(h - M.bottom, Math.max(M.top, e.clientY - r.top)));
  }

  const lastC = shown ? shown[shown.length - 1] : null;
  // Legend shows the hovered candle, or the latest one when the pointer is away.
  const hc = hover != null && shown ? shown[hover] : lastC;
  const hcIdx = hover != null ? hover : shown ? shown.length - 1 : 0;
  const prevClose = shown && hcIdx > 0 ? shown[hcIdx - 1].c : hc ? hc.o : 0;
  const hcChg = hc ? hc.c - prevClose : 0;
  const hcPct = prevClose ? (hcChg / prevClose) * 100 : 0;
  const hcMa = geo ? geo.ma[hcIdx] : null;
  const fmtDay = (t: number) =>
    new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

  return (
    <section ref={card} className="sat-card sat-chartcard sat-tv" aria-label={`${metal} daily candlestick chart`}>
      <div className="sat-chart-head">
        <h2>{metal} · USD/oz · 1D</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div className="sat-seg" role="group" aria-label="Chart type">
            <button type="button" aria-pressed={kind === "candles"} onClick={() => setKind("candles")}>
              Candles
            </button>
            <button type="button" aria-pressed={kind === "line"} onClick={() => setKind("line")}>
              Area
            </button>
          </div>
          <div className="sat-seg" role="group" aria-label="Chart range">
            {DAYS.map((d) => (
              <button key={d} type="button" aria-pressed={days === d} onClick={() => setDays(d)}>
                {d}D
              </button>
            ))}
          </div>
        </div>
      </div>
      {hc && (
        <div className="sat-tv-legend" aria-hidden="true">
          <b>{fmtDay(hc.t)}</b>
          <span>O <i className={hcChg >= 0 ? "up" : "down"}>{usd(hc.o)}</i></span>
          <span>H <i className={hcChg >= 0 ? "up" : "down"}>{usd(hc.h)}</i></span>
          <span>L <i className={hcChg >= 0 ? "up" : "down"}>{usd(hc.l)}</i></span>
          <span>C <i className={hcChg >= 0 ? "up" : "down"}>{usd(hc.c)}</i></span>
          <i className={hcChg >= 0 ? "up" : "down"}>
            {hcChg >= 0 ? "+" : "−"}{usd(Math.abs(hcChg))} ({hcChg >= 0 ? "+" : "−"}{Math.abs(hcPct).toFixed(2)}%)
          </i>
          {hcMa != null && <span className="ma">MA 7 {usd(hcMa)}</span>}
        </div>
      )}
      <div className="sat-chart-tools">
        {canFullscreen && (
          <button type="button" onClick={toggleFullscreen}>
            {fs ? "Exit full screen" : "Full screen"}
          </button>
        )}
        <button type="button" aria-expanded={embedOpen} onClick={() => setEmbedOpen((v) => !v)}>
          Add to site
        </button>
      </div>
      {embedOpen && (
        <div className="sat-embed-panel">
          <p>
            Show the live {metal.toLowerCase()} price on your own page. Paste this code where you want it;
            the link underneath credits the source, so please keep it.
          </p>
          <textarea
            readOnly
            rows={5}
            value={embedCode}
            onFocus={(e) => e.currentTarget.select()}
            aria-label="Embed code"
          />
          <button type="button" className="sat-btn sat-btn-sm" onClick={() => void copyCode()}>
            {copied ? "Copied" : "Copy code"}
          </button>
        </div>
      )}
      <div className="sat-chart" ref={wrap} style={{ height: h }}>
        {shown && geo ? (
          <>
            <svg
              width={w}
              height={h}
              role="img"
              aria-label={`${metal} daily candles for the last ${days} days: low ${usd(Math.min(...shown.map((c) => c.l)))}, high ${usd(Math.max(...shown.map((c) => c.h)))}, latest close ${usd(shown[shown.length - 1].c)}.`}
              onPointerMove={onMove}
              onPointerDown={onMove}
              onPointerLeave={() => setHover(null)}
            >
              <defs>
                <linearGradient id={`tvfill-${symbol}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2962ff" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#2962ff" stopOpacity="0" />
                </linearGradient>
              </defs>
              {geo.yTicks.map((v) => (
                <g key={v}>
                  <line x1={M.left} x2={w - M.right} y1={geo.y(v)} y2={geo.y(v)} stroke="#2a2e39" strokeOpacity="0.7" />
                  <text x={w - M.right + 6} y={geo.y(v) + 4} fontSize="11.5" fill="#787b86" fontFamily="ui-monospace, Consolas, monospace">
                    {usd(v, 0)}
                  </text>
                </g>
              ))}
              {shown.map((c, i) =>
                i % geo.step === 0 ? (
                  <g key={c.t}>
                    <line x1={geo.x(i)} x2={geo.x(i)} y1={M.top} y2={h - M.bottom} stroke="#2a2e39" strokeOpacity="0.45" />
                    <text
                      x={geo.x(i) < M.left + 24 ? M.left : geo.x(i) > w - M.right - 24 ? w - M.right : geo.x(i)}
                      y={h - 7}
                      fontSize="11.5"
                      fill="#787b86"
                      textAnchor={geo.x(i) < M.left + 24 ? "start" : geo.x(i) > w - M.right - 24 ? "end" : "middle"}
                    >
                      {fmtDay(c.t)}
                    </text>
                  </g>
                ) : null,
              )}
              {kind === "line" && (
                <>
                  <path
                    d={`M${geo.x(0)},${h - M.bottom} ${shown.map((c, i) => `L${geo.x(i)},${geo.y(c.c)}`).join(" ")} L${geo.x(shown.length - 1)},${h - M.bottom} Z`}
                    fill={`url(#tvfill-${symbol})`}
                  />
                  <polyline
                    points={shown.map((c, i) => `${geo.x(i)},${geo.y(c.c)}`).join(" ")}
                    fill="none"
                    stroke="#2962ff"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </>
              )}
              {kind === "candles" &&
                shown.map((c, i) => {
                  const col = c.c >= c.o ? "#26a69a" : "#ef5350";
                  const top = geo.y(Math.max(c.o, c.c));
                  const bot = geo.y(Math.min(c.o, c.c));
                  return (
                    <g key={c.t}>
                      <line x1={geo.x(i)} x2={geo.x(i)} y1={geo.y(c.h)} y2={geo.y(c.l)} stroke={col} strokeWidth="1" />
                      <rect
                        x={geo.x(i) - geo.bw / 2}
                        y={top}
                        width={geo.bw}
                        height={Math.max(1, bot - top)}
                        fill={col}
                      />
                    </g>
                  );
                })}
              <polyline
                points={shown.flatMap((_, i) => (geo.ma[i] != null ? [`${geo.x(i)},${geo.y(geo.ma[i] as number)}`] : [])).join(" ")}
                fill="none"
                stroke="#f5a623"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              {lastC && (
                <g>
                  <line
                    x1={M.left}
                    x2={w - M.right}
                    y1={geo.y(lastC.c)}
                    y2={geo.y(lastC.c)}
                    stroke={lastC.c >= lastC.o ? "#26a69a" : "#ef5350"}
                    strokeDasharray="2 3"
                    strokeOpacity="0.9"
                  />
                  <rect x={w - M.right} y={geo.y(lastC.c) - 9} width={M.right} height={18} fill={lastC.c >= lastC.o ? "#26a69a" : "#ef5350"} rx="2" />
                  <text x={w - M.right + 5} y={geo.y(lastC.c) + 4} fontSize="11.5" fill="#fff" fontWeight="600" fontFamily="ui-monospace, Consolas, monospace">
                    {usd(lastC.c, 2)}
                  </text>
                </g>
              )}
              {hover != null && hc && (
                <g pointerEvents="none">
                  <line x1={geo.x(hover)} x2={geo.x(hover)} y1={M.top} y2={h - M.bottom} stroke="#787b86" strokeDasharray="4 4" />
                  <line x1={M.left} x2={w - M.right} y1={hoverY} y2={hoverY} stroke="#787b86" strokeDasharray="4 4" />
                  <rect x={w - M.right} y={hoverY - 9} width={M.right} height={18} fill="#363a45" rx="2" />
                  <text x={w - M.right + 5} y={hoverY + 4} fontSize="11.5" fill="#fff" fontFamily="ui-monospace, Consolas, monospace">
                    {usd(geo.y1 - ((hoverY - M.top) / geo.ih) * (geo.y1 - geo.y0), 2)}
                  </text>
                  <rect
                    x={Math.min(Math.max(geo.x(hover) - 32, M.left), w - M.right - 64)}
                    y={h - M.bottom + 2}
                    width={64}
                    height={18}
                    fill="#363a45"
                    rx="2"
                  />
                  <text
                    x={Math.min(Math.max(geo.x(hover), M.left + 32), w - M.right - 32)}
                    y={h - M.bottom + 15}
                    fontSize="11.5"
                    fill="#fff"
                    textAnchor="middle"
                  >
                    {fmtDay(hc.t)}
                  </text>
                </g>
              )}
            </svg>
          </>
        ) : (
          <div className="sat-empty" role="status">
            {failed ? "Daily candles are temporarily unavailable." : "Loading…"}
          </div>
        )}
      </div>
      <p className="sat-note">{note}</p>
    </section>
  );
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
