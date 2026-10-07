"use client";

import { PageHero } from "@/components/site/PageHero";
import { InlineGhlForm } from "@/components/site/InlineGhlForm";
import { PLACEHOLDER, spotLabel, useMarket } from "@/components/site/market";
import { Card, Disclaimer, H2, Section } from "@/components/site/ui";

/**
 * Body of the /market-update route. Extracted from the source route file because
 * it reads live market data via `useMarket` throughout, while the route file
 * itself stays a server component that exports metadata + JSON-LD.
 *
 * Every spot figure is rendered through `spotLabel()` — as-of time, "not a
 * quote", and source — and shows "—" while the feed is loading or blocked.
 * There are no hard-coded performance columns (no 1-week / 1-month / YTD /
 * 1-year percentages).
 */

const drivers = [
  {
    t: "Industrial Demand",
    d: "Solar manufacturing, electric vehicles, AI data center buildout, and defense electronics continue to consume silver on contracted schedules that do not pause for higher prices.",
  },
  {
    t: "Supply Deficit Update",
    d: "Mine output has been roughly flat near 820-850 million ounces per year. The deficit has narrowed from its 2022-2023 peak, but above-ground stockpiles continue to be drawn down.",
  },
  {
    t: "Fed and Macro Context",
    d: "Real interest rates, dollar strength, and federal deficit financing all historically influence hard asset demand. We report these conditions rather than forecast them.",
  },
];

export function MarketUpdateContent() {
  const m = useMarket();

  return (
    <>
      <PageHero
        eyebrow="Market Update"
        title="Silver and Gold Market Update"
        subtitle="Spot prices, the gold-to-silver ratio, and a plain read of what is moving the metals market."
      >
        <div className="space-y-2 font-mono text-xs leading-relaxed text-background sm:text-sm">
          <p>{spotLabel("Gold", m.gold, m.updatedAt)}</p>
          <p>{spotLabel("Silver", m.silver, m.updatedAt)}</p>
          <p>Gold/Silver Ratio: {m.ratio != null ? `${m.ratio.toFixed(1)}:1` : PLACEHOLDER}</p>
        </div>
      </PageHero>

      <Section>
        <H2>Silver Holds Its Range as Industrial Buyers Stay Active</H2>
        <div className="mt-5 max-w-3xl space-y-4 leading-relaxed">
          <p>
            Silver traded in a relatively narrow band recently, with physical demand from
            industrial buyers absorbing available supply. Premiums on retail products remained firm,
            which historically indicates steady retail demand rather than speculative churn.
          </p>
          <p>
            Gold held its ground as well, keeping the gold-to-silver ratio near{" "}
            {m.ratio != null ? Math.round(m.ratio) : PLACEHOLDER}:1 — above the long-run historical
            average of roughly 60:1. Analysts remain divided on whether the ratio narrows from
            here; we make no prediction either way.
          </p>
          <p>
            For long-term holders, the fundamentals we track have not changed: approximately flat
            mine supply, a sixth consecutive year of deficit, and industrial consumption on
            contracted schedules.
          </p>
        </div>
      </Section>

      <Section tone="muted">
        <H2>Key Data</H2>
        <div className="-mx-5 mt-8 overflow-x-auto px-5">
          <table className="w-full min-w-[560px] border-collapse text-left font-mono text-xs sm:text-sm">
            <caption className="sr-only">
              Live gold and silver spot prices with as-of time and source
            </caption>
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th scope="col" className="py-3 pr-4">
                  Metal
                </th>
                <th scope="col" className="py-3">
                  Spot Price
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border align-top">
                <th scope="row" className="py-3 pr-4 font-normal">
                  Gold
                </th>
                <td className="py-3">{spotLabel("Gold", m.gold, m.updatedAt)}</td>
              </tr>
              <tr className="border-b border-border align-top">
                <th scope="row" className="py-3 pr-4 font-normal">
                  Silver
                </th>
                <td className="py-3">{spotLabel("Silver", m.silver, m.updatedAt)}</td>
              </tr>
              <tr className="align-top">
                <th scope="row" className="py-3 pr-4 font-normal">
                  Gold/Silver Ratio
                </th>
                <td className="py-3">
                  {m.ratio != null ? `${m.ratio.toFixed(1)}:1` : PLACEHOLDER}
                  <span className="text-muted-foreground">
                    {" "}
                    — calculated from the spot prices above. Source: gold-api.com.
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Disclaimer>
          Market data is for informational purposes only. Past performance does not guarantee future
          results. This is not investment advice.
        </Disclaimer>
      </Section>

      <Section>
        <H2>Key Drivers</H2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {drivers.map((d) => (
            <Card key={d.t} className="h-full">
              <h3 className="text-xl">{d.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d.d}</p>
            </Card>
          ))}
        </div>
        <div className="mt-10">
          <InlineGhlForm
            heading="Talk to a Specialist About What This Means For You"
            subheading="Leave your details and a silver specialist will call — we report conditions, we don't forecast."
          />
        </div>
      </Section>
    </>
  );
}
