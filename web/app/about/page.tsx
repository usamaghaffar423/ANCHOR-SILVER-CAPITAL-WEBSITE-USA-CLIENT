import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { JsonLd } from "@/components/site/JsonLd";
import { Card, H2, Prose, Section, buttonStyles } from "@/components/site/ui";
import { breadcrumbSchema, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "About Anchor Silver Capital — Santa Monica Silver Dealer",
  description:
    "Anchor Silver Capital LLC is a California precious metals dealer and Silver IRA specialist. Our story, our values, our custodian and depository partners.",
  path: "/about",
  type: "article",
});

const values = [
  {
    t: "Steadiness",
    d: "We don't chase excitement or manufacture urgency. We give you the facts, plainly, and let you make an informed decision on your own timeline.",
  },
  {
    t: "Directness",
    d: "If silver isn't right for your situation, we'll tell you that. Every fee is disclosed upfront. Every claim is backed by a source.",
  },
  {
    t: "Security",
    d: "Every transaction is handled with the same care you'd expect from a firm holding something that actually matters to your future.",
  },
];

const partners = [
  ["Equity Trust Company", "IRA Custodian"],
  ["Delaware Depository", "Precious Metals Storage"],
  ["A-Mark Precious Metals", "Wholesale Supplier"],
];

export default function About() {
  return (
    <>
      <JsonLd data={breadcrumbSchema("/about", "About Us")} />
      <PageHero
        eyebrow="About Us"
        title="We Believe in Steady Ground — and Real Upside."
        subtitle="A precious metals dealer built for people who want something real behind their savings."
      />

      <Section>
        <H2>Our Story</H2>
        <Prose className="mt-5">
          <p>
            Anchor Silver Capital exists for one reason: to give people something real, dependable,
            and genuinely poised to grow when everything else feels uncertain.
          </p>
          <p>
            We're not here to sell excitement for its own sake. We're here to help you put real
            weight behind your savings — physical silver, held in your name, backed by a structural
            supply deficit now in its sixth consecutive year, outside the reach of any bank, any
            market crash, any currency devaluation.
          </p>
          <p>
            Silver has been money for five thousand years, and it's more essential to the modern
            economy than it has ever been. It doesn't need anyone's promise to hold its value — and
            the fundamentals behind it right now are the strongest we've seen in decades.
          </p>
        </Prose>
      </Section>

      <Section tone="muted">
        <H2>Our Values</H2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <Card key={v.t} className="h-full">
              <h3 className="text-xl">{v.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.d}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <H2>Our Partners</H2>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {partners.map(([name, role]) => (
            <Card as="li" key={name}>
              <h3 className="text-lg">{name}</h3>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{role}</p>
            </Card>
          ))}
        </ul>
      </Section>

      <Section tone="muted">
        <H2>Compliance</H2>
        <p className="mt-5 max-w-3xl text-sm italic leading-relaxed text-muted-foreground">
          Anchor Silver Capital LLC is a California-registered precious metals dealer. We are not a
          registered investment advisor, broker-dealer, or financial planner. Nothing on this
          website constitutes investment advice. All precious metals transactions involve risk. Past
          performance does not guarantee future results. Please consult a licensed financial advisor
          before making investment decisions.
        </p>
        <div className="mt-8">
          <Link href="/get-started" className={buttonStyles.primary}>
            Get a Free Consultation
          </Link>
        </div>
      </Section>
    </>
  );
}
