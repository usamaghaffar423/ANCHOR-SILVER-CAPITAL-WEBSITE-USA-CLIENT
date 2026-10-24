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
          Indicative spot as of {asOf(updatedAt)}. Not a quote. Source: gold-api.com. The marker is now; the
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
    const yTicks = Array.from({ length: 4 }, (_, i) => y0 + ((y1 - y0) * (i + 0.5)) / 4);
    const step = Math.max(1, Math.round(shown.length / (w < 480 ? 3 : 6)));
    return { x, y, bw, yTicks, step, ih, slot };
  }, [shown, w, h]);

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!geo || !shown) return;
    const px = e.clientX - e.currentTarget.getBoundingClientRect().left - M.left;
    setHover(Math.min(shown.length - 1, Math.max(0, Math.floor(px / geo.slot))));
  }

  const hc = hover != null && shown ? shown[hover] : null;
  const fmtDay = (t: number) =>
    new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

  return (
    <section ref={card} className="sat-card sat-chartcard" aria-label={`${metal} daily candlestick chart`}>
      <div className="sat-chart-head">
        <h2>{metal} daily candles</h2>
        <div className="sat-seg" role="group" aria-label="Chart range">
          {DAYS.map((d) => (
            <button key={d} type="button" aria-pressed={days === d} onClick={() => setDays(d)}>
              {d}D
            </button>
          ))}
        </div>
      </div>
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
              {geo.yTicks.map((v) => (
                <g key={v}>
                  <line x1={M.left} x2={w - M.right} y1={geo.y(v)} y2={geo.y(v)} stroke="var(--line)" />
                  <text x={w - M.right + 6} y={geo.y(v) + 4} fontSize="11" fill="var(--muted)" fontFamily="ui-monospace, Consolas, monospace">
                    {usd(v, 0)}
                  </text>
                </g>
              ))}
              {shown.map((c, i) =>
                i % geo.step === 0 ? (
                  <text key={c.t} x={geo.x(i)} y={h - 6} fontSize="11" fill="var(--muted)" textAnchor="middle">
                    {fmtDay(c.t)}
                  </text>
                ) : null,
              )}
              {shown.map((c, i) => {
                const up = c.c >= c.o;
                const col = up ? "var(--up)" : "var(--down)";
                const top = geo.y(Math.max(c.o, c.c));
                const bot = geo.y(Math.min(c.o, c.c));
                return (
                  <g key={c.t} opacity={hover == null || hover === i ? 1 : 0.55}>
                    <line x1={geo.x(i)} x2={geo.x(i)} y1={geo.y(c.h)} y2={geo.y(c.l)} stroke={col} strokeWidth="1.5" />
                    <rect
                      x={geo.x(i) - geo.bw / 2}
                      y={top}
                      width={geo.bw}
                      height={Math.max(2, bot - top)}
                      fill={up ? "var(--panel)" : col}
                      stroke={col}
                      strokeWidth="1.5"
                      rx="1"
                    />
                  </g>
                );
              })}
            </svg>
            {hc && hover != null && (
              <div
                className="sat-tip"
                style={{ left: Math.min(Math.max(geo.x(hover) - 80, 4), w - 160) }}
              >
                <b>{fmtDay(hc.t)}</b>
                <div><span>Open</span><span>{usd(hc.o)}</span></div>
                <div><span>High</span><span>{usd(hc.h)}</span></div>
                <div><span>Low</span><span>{usd(hc.l)}</span></div>
                <div><span>Close</span><span>{usd(hc.c)}</span></div>
              </div>
            )}
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
