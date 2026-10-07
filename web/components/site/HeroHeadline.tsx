"use client";

import {
  NEUTRAL_HEADLINE_LEAD,
  dynamicFiveYearLead,
  useFiveYear,
} from "@/components/site/market";

/**
 * Home hero headline.
 *
 * Server render (and any time the five-year figure can't be verified) shows the
 * neutral headline — so the HTML that ships contains no prices or percentages.
 * The dynamic "up approximately X% over five years" variant only appears after
 * the server-computed figure has passed every guard in `useFiveYear()`.
 */
export function HeroHeadline() {
  const pct = useFiveYear();
  const lead = pct == null ? NEUTRAL_HEADLINE_LEAD : dynamicFiveYearLead(pct);

  return (
    <h1 className="mt-3 font-fraunces text-[1.4rem] font-light leading-[1.15] tracking-[-0.01em] text-white sm:mt-3.5 sm:text-[1.9rem] lg:text-[3rem] lg:leading-[1.08]">
      {lead}{" "}
      <em className="not-italic text-brass-light">hasn&apos;t&nbsp;closed.</em>
    </h1>
  );
}
