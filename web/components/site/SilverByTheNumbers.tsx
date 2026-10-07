"use client";

import { PLACEHOLDER, useFiveYear, useMarket } from "@/components/site/market";
import { H2, Section } from "@/components/site/ui";
import { CountUp } from "@/components/site/Reveal";

/**
 * Home "Silver by the Numbers" band. Extracted from the source route file
 * because it reads live market data via the `useMarket` client hook, and the
 * home route itself is a server component that exports metadata.
 *
 * No 12-month figure: the only performance stat is the server-computed,
 * guarded five-year change, which renders as "—" until it is verified.
 */
export function SilverByTheNumbers() {
  const m = useMarket();
  const fiveYear = useFiveYear();

  return (
    <Section tone="sage" className="md:py-24">
      <H2 className="text-primary-foreground">Silver by the Numbers</H2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            v:
              fiveYear != null ? (
                <CountUp value={fiveYear} suffix="%" />
              ) : (
                PLACEHOLDER
              ),
            l: "Silver over five years (approx.)",
            c: "Calculated server-side from verified historical data and hidden until verified. Source: gold-api.com",
          },
          {
            v: <CountUp value={6} />,
            l: "Years of supply deficit",
            c: "Every year since 2021 the world has used more silver than it mined",
          },
          {
            v: <CountUp value={681} suffix="M oz" />,
            l: "2024 industrial demand",
            c: "Solar, EVs, AI infrastructure — demand that doesn't wait for a dip in price",
          },
          {
            v:
              m.ratio != null ? (
                <CountUp value={m.ratio} decimals={1} suffix=":1" />
              ) : (
                PLACEHOLDER
              ),
            l: "Gold-to-silver ratio",
            c: "Above the 60:1 long-run mean — silver historically cheap relative to gold",
          },
        ].map((s, i) => (
          <div key={i} className="rounded-sm border border-primary-foreground/25 p-6">
            <p className="font-mono text-4xl leading-none text-primary-foreground md:text-5xl">
              {s.v}
            </p>
            <p className="eyebrow mt-4 text-primary-foreground/75">{s.l}</p>
            <p className="mt-3 border-t border-primary-foreground/15 pt-3 text-[0.78rem] leading-relaxed text-primary-foreground/60">
              {s.c}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs italic text-primary-foreground/80">
        Historical performance does not guarantee future results.
      </p>
    </Section>
  );
}
