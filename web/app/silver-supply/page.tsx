import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { JsonLd } from "@/components/site/JsonLd";
import { InlineLeadForm } from "@/components/site/InlineLeadForm";
import { Disclaimer, H2, Prose, Section } from "@/components/site/ui";
import { breadcrumbSchema, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Silver Supply Deficit — Six Straight Years | Anchor Silver",
  description:
    "The world has mined less silver than it uses for six consecutive years. Why byproduct mining can't respond, what industry consumes, and an honest read of the data.",
  path: "/silver-supply",
  type: "article",
});

const sections = [
  {
    h: "The Basic Math",
    p: "Global silver mines produce approximately 820-850 million ounces per year — a number that's been essentially flat for a decade. Total demand has consistently exceeded that. The difference is covered by drawing down above-ground stockpiles built up over previous decades.",
  },
  {
    h: "Why Supply Can't Respond",
    p: "Roughly 70% of silver is mined as a byproduct of copper, zinc, and lead operations. Silver supply doesn't ramp up when silver prices rise — it depends on the economics of other metals entirely. New primary silver mines take 7-15 years to bring online.",
  },
  {
    h: "What's Actually Consuming the Silver",
    p: "Solar panels, electric vehicles, AI data centers, defense electronics, 5G infrastructure. These are not optional purchases — they're contracted, scheduled industrial demand that doesn't wait for a better price.",
  },
  {
    h: "The Honest Picture",
    p: "The annual deficit has narrowed since its 2022-2023 peak, and analyst projections for the years ahead vary. What hasn't changed is the fundamental picture: six straight years of shortfall, a finite stockpile being drawn down, and no clear mechanism for supply to catch up quickly.",
  },
];

export default function SupplyStory() {
  return (
    <>
      <JsonLd data={breadcrumbSchema("/silver-supply", "The Supply Story")} />
      <PageHero
        eyebrow="The Supply Story"
        title="Six Years of Supply Deficit — and No Clear End in Sight"
        subtitle="The world has used more silver than it has mined for six consecutive years. Here's what that actually means."
      />

      {sections.map((s, i) => (
        <Section key={s.h} tone={i % 2 === 1 ? "muted" : "light"}>
          <H2>{s.h}</H2>
          <Prose className="mt-5">
            <p>{s.p}</p>
          </Prose>
          {i === sections.length - 1 && (
            <Disclaimer>
              All figures are historical or represent third-party analyst projections, clearly
              labeled as such. Past performance does not guarantee future results.
            </Disclaimer>
          )}
        </Section>
      ))}

      <Section tone="sage">
        <H2 className="text-primary-foreground">What This Means for Your Savings</H2>
        <p className="mt-5 max-w-3xl leading-relaxed text-primary-foreground/90">
          A specialist can walk you through how the supply picture relates to a{" "}
          <Link className="underline" href="/silver-ira">
            Silver IRA rollover
          </Link>{" "}
          or a physical purchase — plainly, without a sales pitch.
        </p>
        <div className="mt-8">
          <InlineLeadForm
            interest="just_learning"
            sourcePage="/silver-supply"
            subheading="Leave your details and a silver specialist will call — plainly, without a sales pitch."
          />
        </div>
      </Section>
    </>
  );
}
