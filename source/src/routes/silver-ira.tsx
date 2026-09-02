import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Accordion } from "@/components/site/Accordion";
import { CallbackForm } from "@/components/site/CallbackForm";
import { Card, H2, Prose, Section } from "@/components/site/ui";
import { SITE, breadcrumbSchema, pageHead } from "@/lib/site";

export const Route = createFileRoute("/silver-ira")({
  component: SilverIra,
  head: () => ({
    ...pageHead({
      title: "Silver IRA Rollover — Tax-Free 401k to Silver IRA | Anchor",
      description:
        "Roll a 401k, IRA, or annuity into a self-directed Silver IRA tax-free and penalty-free. Equity Trust custodian, Delaware Depository storage, transparent fees.",
      path: "/silver-ira",
      type: "article",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbSchema("/silver-ira", "Silver IRA")),
      },
    ],
  }),
});

const qualify = [
  { t: "Former Employer 401k", d: "$25,000+ — Any age — No restrictions" },
  { t: "Traditional or Roth IRA", d: "$25,000+ — Any age — Simple transfer" },
  { t: "Annuity", d: "$25,000+ — Any age — Rollover from existing annuity" },
  { t: "Current Employer 401k", d: "$25,000+ — Age 59½ or older — In-service distribution" },
  { t: "Cash Purchase", d: "$10,000+ — Any age — No IRA required" },
];

const process = [
  {
    t: "Open Your Equity Trust Account",
    d: "We guide you through opening a self-directed IRA with Equity Trust Company — the largest self-directed IRA custodian in the United States. Takes about 15-20 minutes online.",
  },
  {
    t: "Fund Your Account",
    d: "Equity Trust coordinates a direct rollover or transfer from your existing plan — no taxes, no penalties, no 60-day clock. Typically 10-21 business days.",
  },
  {
    t: "Purchase and Secure Your Silver",
    d: "You direct Equity Trust to purchase silver from us. We ship your metals directly to Delaware Depository — held in your name, fully insured, viewable online.",
  },
];

const faqs = [
  {
    q: "Is a Silver IRA rollover taxable?",
    a: "A direct rollover or trustee-to-trustee transfer from a qualified 401k, IRA, or annuity into a self-directed Precious Metals IRA is not a taxable event and carries no early withdrawal penalty. Your specialist will confirm which method applies to your plan.",
  },
  {
    q: "What is the minimum to open a Silver IRA?",
    a: "$25,000 for an IRA rollover or transfer. Cash purchases outside an IRA start at $10,000, and physical delivery orders start at $5,000.",
  },
  {
    q: "Can I store IRA silver at home?",
    a: "No. IRS rules require IRA-held metals to be held by an approved depository. Your metals are stored at Delaware Depository in your IRA's name.",
  },
  {
    q: "How long does the process take?",
    a: "Account setup takes about 15-20 minutes. Funding typically takes 10-21 business days depending on your current plan administrator.",
  },
  {
    q: "Which silver products are IRA-eligible?",
    a: "Silver must be .999 fine or better. American Silver Eagles, Canadian Silver Maple Leafs, Australian Silver Kangaroos, and .999 fine bars from approved refiners all qualify.",
  },
  {
    q: "Can I take physical possession later?",
    a: "Yes. At distribution you may take an in-kind distribution of the metal itself or liquidate it, subject to the same tax treatment as any IRA distribution.",
  },
];

function SilverIra() {
  return (
    <>
      <PageHero
        eyebrow="Silver IRA"
        title="Your Retirement Account. Anchored in Real Metal."
        subtitle="A Silver IRA is a self-directed IRA that holds physical silver instead of stocks and bonds. Roll over your existing 401k, IRA, or annuity — tax-free and penalty-free — and put something real behind your retirement."
      />

      <Section>
        <H2>Who Qualifies</H2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {qualify.map((c) => (
            <Card key={c.t}>
              <h3 className="text-lg">{c.t}</h3>
              <p className="mt-2 font-mono text-sm text-muted-foreground">{c.d}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <H2>The Three-Step Process</H2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {process.map((s, i) => (
            <li key={s.t}>
              <Card className="h-full">
                <span className="font-mono text-sm text-primary">Step {i + 1}</span>
                <h3 className="mt-3 text-xl">{s.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </Card>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-xs uppercase tracking-wider text-muted-foreground">
          IRA Custodian Partner: Equity Trust Company
        </p>
      </Section>

      <Section>
        <H2>IRS-Approved Silver</H2>
        <Prose className="mt-5">
          <p>
            IRS-approved silver must be .999 fine or better. Products that qualify include American
            Silver Eagles, Canadian Silver Maple Leafs, Australian Silver Kangaroos, and .999 fine
            silver bars from approved refiners.
          </p>
        </Prose>

        <H2 className="mt-14">Storage at Delaware Depository</H2>
        <Prose className="mt-5">
          <p>
            Your IRA-held silver is stored at Delaware Depository Service Company in Wilmington,
            Delaware. You cannot store IRA-held metals at home. Delaware Depository provides fully
            allocated or commingled storage, full insurance coverage, and online account access.
          </p>
        </Prose>

        <H2 className="mt-14">Fees, Stated Plainly</H2>
        <Prose className="mt-5">
          <p>
            Equity Trust account fee: $80-100/year. Delaware Depository storage: approximately
            0.10-0.15% of metal value annually, $100-150 minimum. Dealer premium varies by product
            and volume — your specialist will quote before any purchase. No hidden fees.
          </p>
        </Prose>
      </Section>

      <Section tone="muted">
        <H2>Silver IRA Questions</H2>
        <div className="mt-8">
          <Accordion items={faqs} />
        </div>
      </Section>

      <Section tone="sage">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <H2 className="text-primary-foreground">
              Ready to Anchor Your Retirement in Real Silver?
            </H2>
            <p className="mt-5 leading-relaxed text-primary-foreground/90">
              Speak with a specialist about whether a rollover makes sense for your situation. No
              cost, no obligation.
            </p>
            <a
              href={SITE.phoneHref}
              className="mt-6 inline-block font-mono text-3xl text-primary-foreground underline underline-offset-8"
            >
              {SITE.phone}
            </a>
            <p className="mt-3 text-sm text-primary-foreground/85">{SITE.hours}</p>
          </div>
          <div className="rounded-md bg-card p-6 shadow-[var(--shadow-lift)]">
            <CallbackForm />
          </div>
        </div>
      </Section>
    </>
  );
}
