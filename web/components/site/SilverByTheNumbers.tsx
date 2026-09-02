"use client";

import { useMarket } from "@/components/site/market";
import { H2, Section } from "@/components/site/ui";
import { CountUp } from "@/components/site/Reveal";

/**
 * Home "Silver by the Numbers" band. Extracted from the source route file
 * because it reads live market data via the `useMarket` client hook, and the
 * home route itself is a server component that exports metadata.
 */
export function SilverByTheNumbers() {
  const m = useMarket();
  return (
    <Section tone="sage" className="md:py-24">
      <H2 className="text-primary-foreground">Silver by the Numbers</H2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            v: <CountUp value={Math.max(m.silverYear, 0)} decimals={1} suffix="%" />,
            l: "12-month gain",
          },
          { v: <CountUp value={6} />, l: "Years of supply deficit" },
          { v: <CountUp value={681} suffix="M oz" />, l: "2024 industrial demand" },
          { v: <CountUp value={m.ratio} decimals={1} suffix=":1" />, l: "Gold-to-silver ratio" },
        ].map((s, i) => (
          <div key={i} className="rounded-sm border border-primary-foreground/25 p-6">
            <p className="font-mono text-4xl leading-none text-primary-foreground md:text-5xl">
              {s.v}
            </p>
            <p className="eyebrow mt-4 text-primary-foreground/75">{s.l}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs italic text-primary-foreground/80">
        Historical performance does not guarantee future results.
      </p>
    </Section>
  );
}
