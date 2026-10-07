"use client";

import { useMarket } from "@/components/site/market";

/**
 * Hero disclaimer — required to sit directly below the hero body copy and to be
 * visible on mobile (no responsive hiding).
 *
 * The date is the market snapshot's own `updatedAt` when one has arrived, and
 * the page's render date (`today`, passed in from the server component) until
 * then — so the string is present in the server-rendered HTML and never pops in
 * after a blocked or slow API call.
 */
export function HeroDisclaimer({ today }: { today?: string | null }) {
  const { updatedAt } = useMarket();
  const date = shortDate(updatedAt) ?? shortDate(today);

  return (
    <p className="mt-3 max-w-[52ch] text-[0.72rem] leading-relaxed text-silver-deep sm:text-xs">
      Historical performance as of {date ?? "—"}, source: gold-api.com. Indicative spot data, not
      a quote. Past performance does not guarantee future results. Silver is volatile and can
      decline in value.
    </p>
  );
}

function shortDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
