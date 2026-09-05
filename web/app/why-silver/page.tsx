import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { JsonLd } from "@/components/site/JsonLd";
import { InlineLeadForm } from "@/components/site/InlineLeadForm";
import { Banner } from "@/components/site/Banner";
import { Disclaimer, H2, Prose, Section } from "@/components/site/ui";
import { breadcrumbSchema, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Why Invest in Silver — Supply Deficit & Real Money | Anchor",
  description:
    "Why silver: five thousand years as real money, six straight years of supply deficit, industrial demand, currency debasement, and the gold to silver ratio explained.",
  path: "/why-silver",
  type: "article",
});

export default function WhySilver() {
  return (
    <>
      <JsonLd data={breadcrumbSchema("/why-silver", "Why Silver")} />
      <PageHero
        eyebrow="Why Silver"
        title="Why Silver? Because It Doesn't Depend on Anyone's Promise."
        subtitle="Every currency in history that wasn't backed by something real has eventually lost most of its value. Silver has been real money for five thousand years — and it's more essential to the modern world than ever."
      />

      <Section>
        <H2>What Silver Actually Is</H2>
        <Prose className="mt-5">
          <p>
            Silver is the most electrically conductive element on earth, the best thermal conductor
            of any metal, and the most reflective. These aren't marketing claims — they're physical
            properties that make silver irreplaceable in the modern economy, from solar panels to
            electronics to medical devices. It has been money for longer than any currency alive
            today, and it doesn't require anyone's promise to hold its value.
          </p>
        </Prose>
      </Section>

      <Section tone="muted">
        <H2>The Supply Deficit</H2>
        <p className="mt-6 font-display text-3xl text-primary md:text-4xl">
          Six consecutive years of global supply deficit
        </p>
        <Prose className="mt-5">
          <p>
            Global silver mines produce roughly 820–850 million ounces annually. Total demand has
            consistently outpaced that. The difference comes from drawing down above-ground
            stockpiles — stockpiles that are finite. When they run low, price is the only mechanism
            left to ration supply.
          </p>
          <p>
            The full picture is on{" "}
            <Link className="font-semibold text-primary underline" href="/silver-supply">
              the silver supply deficit
            </Link>{" "}
            page.
          </p>
        </Prose>
      </Section>

      <Section>
        <H2>The Currency Problem</H2>
        <Prose className="mt-5">
          <p>
            The dollar has lost the vast majority of its purchasing power since 1913. Every year, a
            dollar buys a little less than it did the year before. Physical silver doesn't work that
            way. An ounce is an ounce, regardless of what happens to the currency it's priced in.
          </p>
        </Prose>
      </Section>

      <Section tone="muted">
        <H2>The Gold-Silver Ratio</H2>
        <Prose className="mt-5">
          <p>
            The gold-to-silver ratio measures how many ounces of silver it takes to buy one ounce of
            gold. The long-run historical average sits around 60:1. When the ratio runs meaningfully
            above that, silver has historically been cheap relative to gold — and has closed that
            gap dramatically when it corrects.
          </p>
        </Prose>
        <Disclaimer>
          All figures are historical. Past performance does not guarantee future results.
        </Disclaimer>
      </Section>

      <Banner
        image="/images/silver-cast-landscape.jpg"
        alt="Cast silver bars stacked in a vault."
        focal="right center"
        scrim="side"
        tint
        aspect="aspect-[4/5] sm:aspect-[21/9]"
        contentAlign="left"
      >
        <p className="eyebrow text-brass-light">The Supply Story</p>
        <h2 className="mt-3 font-fraunces text-3xl font-light text-white sm:text-4xl">
          Six Years of Deficit. Stockpiles Drawn Down.
        </h2>
        <Link
          href="/silver-supply"
          className="mt-5 inline-block text-sm font-semibold text-brass-light underline underline-offset-4"
        >
          See the full supply picture →
        </Link>
      </Banner>

      <Section tone="sage">
        <H2 className="text-primary-foreground">Ready to Put Real Weight Behind Your Savings?</H2>
        <div className="mt-8">
          <InlineLeadForm
            interest="just_learning"
            sourcePage="/why-silver"
            subheading="Leave your details and a silver specialist will call — no cost, no obligation."
          />
        </div>
      </Section>
    </>
  );
}
