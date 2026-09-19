import type { Metadata } from "next";
import Link from "next/link";
import { AnchorGlyph } from "@/components/brand/AnchorMark";
import { PageHero } from "@/components/site/PageHero";
import { Section, H2, Card, buttonStyles } from "@/components/site/ui";
import { SITE, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Buying Gold & Silver | Anchor Silver Capital",
  description:
    "Buy physical gold and silver — common bullion and premium products. Transparent pricing, confirmed verbally with a Commodity Specialist before any order is finalized.",
  path: "/buyinggoldandsilver",
});

const steps = [
  {
    n: "01",
    title: "Speak with a Commodity Specialist.",
    body: "Call us to discuss your goals, whether that's a cash purchase or a precious metals IRA rollover.",
  },
  {
    n: "02",
    title: "Review your allocation.",
    body: "We'll walk you through product options and current pricing based on that day's spot price.",
  },
  {
    n: "03",
    title: "Confirm your order.",
    body: "Every order is finalized during a recorded phone confirmation, which includes the price, quantity, and payment terms.",
  },
  {
    n: "04",
    title: "Complete payment.",
    body: "Orders are paid by bank wire or personal check. We do not accept cash, money order, or credit card.",
  },
  {
    n: "05",
    title: "Receive or store your metals.",
    body: "Cash purchases are shipped fully insured. IRA purchases are delivered directly to your custodian's approved depository.",
  },
];

export default function BuyingGoldAndSilver() {
  return (
    <>
      <PageHero
        eyebrow="Buying Gold & Silver"
        title="Physical Precious Metals, Priced Transparently."
        subtitle="Every purchase is confirmed verbally with a Commodity Specialist before it's finalized, so you always know exactly what you're buying and at what price."
      />

      {/* Two Categories of Products */}
      <Section className="md:py-24">
        <H2>Two Categories of Products</H2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          Anchor Silver Capital offers two categories of precious metals products. Pricing is based on
          the live spot price plus a disclosed premium — confirmed with you before any order is
          final.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card className="h-full">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-primary"
            >
              <circle cx="9" cy="9" r="7" />
              <circle cx="15" cy="15" r="7" />
            </svg>
            <h3 className="mt-5 text-2xl">Common Bullion Products</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Government-minted coins and standard bars, valued primarily for their metal content.
              These products are the most liquid and easiest to resell, with the lowest premiums over
              spot price.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              <strong>Examples:</strong> American Silver Eagles, American Gold Eagles, Canadian Silver
              and Gold Maple Leafs, standard silver and gold bars.
            </p>
          </Card>
          <Card className="h-full">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-primary"
            >
              <path d="M6 3h12l4 6-10 13L2 9Z" />
              <path d="M2 9h20" />
            </svg>
            <h3 className="mt-5 text-2xl">Premium Products</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Coins with additional collectible, limited-mintage, or numismatic characteristics. These
              carry a higher premium over spot due to their rarity, condition grading, or limited
              production.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Suited to collectors and long-term holders who value rarity alongside metal content.
            </p>
          </Card>
        </div>
      </Section>

      {/* How Buying Works */}
      <Section tone="muted" className="md:py-24">
        <H2>How Buying Works</H2>
        <ol className="relative mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-[3.4rem] hidden border-t border-dashed border-border lg:block"
          />
          {steps.map((s) => (
            <li key={s.n} className="relative">
              <Card className="h-full">
                <span className="font-mono text-sm text-silver-deep">{s.n}</span>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </Card>
            </li>
          ))}
        </ol>
      </Section>

      {/* Payment Methods + Pricing Transparency */}
      <Section className="md:py-24">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <H2 className="text-2xl md:text-3xl">Payment Methods</H2>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-3">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                >
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 10h20" />
                </svg>
                <span className="text-sm">
                  <strong>Bank wire</strong> — required for all orders over $100,000
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M6 8h.01M10 8h.01M14 8h.01" />
                  <path d="M6 12h12" />
                </svg>
                <span className="text-sm">
                  <strong>Personal check</strong>
                </span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Anchor Silver Capital does not accept cash, money orders, or credit card payments.
            </p>
          </div>
          <div>
            <H2 className="text-2xl md:text-3xl">Pricing Transparency</H2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              All prices are based on the live spot price of gold or silver plus a premium that
              covers sourcing, delivery, and service. Premiums are disclosed to you verbally before
              your order is confirmed. Market prices fluctuate, so pricing is not locked in until
              payment is received and your order is confirmed.
            </p>
          </div>
        </div>
      </Section>

      {/* CTA Band */}
      <section className="bg-hero-from px-5 py-16 text-center md:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl text-white md:text-[2.6rem]">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-silver">
            Speak with a Commodity Specialist to review current pricing and available products.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={SITE.phoneHref}
              className={buttonStyles.primary}
            >
              Call {SITE.phone}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className={buttonStyles.outlineLight}
            >
              {SITE.email}
            </a>
          </div>
          <p className="mt-6 text-xs text-silver-deep">
            No online checkout — orders are confirmed personally, by phone.{" "}
            <Link href="/riskdisclosure" className="underline underline-offset-2 hover:text-white">
              Read our Risk Disclosure.
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
