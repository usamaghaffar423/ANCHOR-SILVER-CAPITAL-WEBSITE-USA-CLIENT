"use client";

import { useMarket, yearHeadline } from "@/components/site/market";

/**
 * Home hero headline. Extracted from the server route so the trailing-12-month
 * silver figure tracks live market data via `useMarket()` instead of a
 * hardcoded "75%". Renders the SSR fallback figure first, so there is no
 * layout shift and the copy stays truthful if the feed is unavailable.
 */
export function HeroHeadline() {
  const { silverYear } = useMarket();
  return (
    <h1 className="mt-3 font-fraunces text-[1.4rem] font-light leading-[1.15] tracking-[-0.01em] text-white sm:mt-3.5 sm:text-[1.9rem] lg:text-[3rem] lg:leading-[1.08]">
      Silver {yearHeadline(silverYear)} in a year — and the supply deficit{" "}
      <em className="not-italic text-brass-light">hasn&apos;t&nbsp;closed.</em>
    </h1>
  );
}
