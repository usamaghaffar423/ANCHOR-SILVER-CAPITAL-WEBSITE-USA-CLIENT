"use client";

import { PLACEHOLDER, spotLabel, useMarket } from "@/components/site/market";

/**
 * Hero market card (home-v1). Shows the live silver and gold spot figures with
 * the full mandatory label (as-of time, "not a quote", source). While the feed
 * is loading or blocked every figure is "—" — there are no fallback prices, and
 * the card keeps its shape so nothing shifts.
 */
export function HeroMarketCard() {
  const m = useMarket();

  const silverText = m.silver != null ? `$${m.silver.toFixed(2)}` : PLACEHOLDER;
  const goldText = m.gold != null ? `$${Math.round(m.gold).toLocaleString("en-US")}` : PLACEHOLDER;
  const ratioText = m.ratio != null ? `${m.ratio.toFixed(1)}:1` : PLACEHOLDER;

  return (
    <div className="rounded-xl border border-white/15 bg-white/[0.04] p-4 backdrop-blur-sm sm:p-6">
      <div className="flex items-center justify-between">
        <span className="font-plex text-[0.65rem] uppercase tracking-[0.12em] text-silver-deep sm:text-[0.7rem]">
          Silver · USD / oz
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-fraunces text-3xl font-light leading-none text-white sm:text-4xl lg:text-[2.6rem]">
          {silverText}
        </span>
      </div>

      <p className="mt-2 font-plex text-[0.62rem] leading-relaxed text-silver-deep sm:text-[0.68rem]">
        {spotLabel("Silver", m.silver, m.updatedAt)}
      </p>

      <div className="mt-3 flex border-t border-white/15 pt-3 sm:mt-4 sm:pt-3.5">
        {[
          { v: goldText, l: "Gold / oz" },
          { v: ratioText, l: "G/S Ratio" },
          { v: "6 yrs", l: "Supply deficit" },
        ].map((s, i) => (
          <div
            key={s.l}
            className={`flex-1 text-center ${i ? "border-l border-white/15" : ""}`}
          >
            <div className="font-fraunces text-[0.9rem] text-white sm:text-[1.05rem]">{s.v}</div>
            <div className="mt-0.5 font-plex text-[0.55rem] uppercase tracking-[0.05em] text-silver-deep sm:text-[0.6rem]">
              {s.l}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-2 font-plex text-[0.58rem] leading-relaxed text-silver-deep/85 sm:mt-3 sm:text-[0.62rem]">
        {spotLabel("Gold", m.gold, m.updatedAt)}
      </p>
      <p className="mt-2 font-plex text-[0.58rem] leading-relaxed text-silver-deep/85 sm:mt-3 sm:text-[0.62rem]">
        Prices update during market hours. Past performance does not guarantee future results.
      </p>
    </div>
  );
}
