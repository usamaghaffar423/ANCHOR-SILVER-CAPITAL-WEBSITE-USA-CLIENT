import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Accordion, type QA } from "@/components/site/Accordion";
import { JsonLd } from "@/components/site/JsonLd";
import { InlineLeadForm } from "@/components/site/InlineLeadForm";
import { H2, Section } from "@/components/site/ui";
import { breadcrumbSchema, pageMeta } from "@/lib/site";

const groups: { title: string; items: QA[] }[] = [
  {
    title: "Silver IRA Basics",
    items: [
      {
        q: "What is a Silver IRA?",
        a: "A Silver IRA is a self-directed individual retirement account that holds physical silver bullion instead of stocks, bonds, or mutual funds. The metal is held by an IRS-approved depository in your account's name.",
      },
      {
        q: "How is a Silver IRA different from a regular IRA?",
        a: "The tax treatment is identical. The difference is what the account holds: a self-directed IRA permits physical precious metals, which a standard brokerage IRA generally does not.",
      },
      {
        q: "Can I roll over my 401k into a Silver IRA without penalty?",
        a: "Yes. A direct rollover or trustee-to-trustee transfer from a qualified plan into a self-directed Precious Metals IRA is not a taxable event and carries no early withdrawal penalty.",
      },
      {
        q: "Do I qualify for a Silver IRA?",
        a: "A former employer 401k, traditional or Roth IRA, or annuity of $25,000 or more qualifies at any age. A current employer 401k generally requires age 59½ or older for an in-service distribution.",
      },
      {
        q: "How long does the rollover process take?",
        a: "Account setup takes roughly 15-20 minutes online. Funding typically takes 10-21 business days, depending on your existing plan administrator.",
      },
      {
        q: "What silver products are IRA-eligible?",
        a: "Silver must be .999 fine or better. American Silver Eagles, Canadian Silver Maple Leafs, Australian Silver Kangaroos, and .999 fine bars from approved refiners qualify.",
      },
    ],
  },
  {
    title: "Physical Silver Purchase",
    items: [
      {
        q: "What is the minimum purchase?",
        a: "$5,000 for physical silver delivered to your door. $10,000 for a cash purchase held in storage, and $25,000 for an IRA rollover.",
      },
      {
        q: "What products do you sell?",
        a: "American Silver Eagles, Morgan and Peace silver dollars, Canadian Maple Leafs, 10 oz and 100 oz bars, pre-1964 junk silver, and generic .999 rounds.",
      },
      {
        q: "How is silver shipped?",
        a: "Fully insured via Brinks, Loomis, or USPS Registered Mail, in discreet packaging. Signature confirmation is required on orders over $5,000.",
      },
      {
        q: "Can I store my silver at a depository instead of at home?",
        a: "Yes. We can arrange allocated storage at Delaware Depository — your specific bars or coins held in your name, fully insured, with online access.",
      },
      {
        q: "What is a premium over spot?",
        a: "Spot is the price of raw metal. The premium covers minting, distribution, and dealer margin. We quote the all-in price — metal, premium, and shipping — before you commit.",
      },
    ],
  },
  {
    title: "The Silver Market",
    items: [
      {
        q: "Why is silver up so much recently?",
        a: "Historically, the move has been attributed to sustained industrial demand, a multi-year supply deficit, and investor demand for hard assets. We do not predict future prices.",
      },
      {
        q: "What is the gold-to-silver ratio?",
        a: "It is how many ounces of silver it takes to buy one ounce of gold. The long-run historical average sits around 60:1.",
      },
      {
        q: "Why does silver have a supply deficit?",
        a: "Mine output has been roughly flat for a decade while industrial demand climbed. About 70% of silver is a byproduct of copper, zinc, and lead mining, so supply does not respond quickly to silver's price.",
      },
      {
        q: "Is silver a good inflation hedge?",
        a: "Historically, hard assets have tended to retain purchasing power better than currency over long periods. Silver is also more volatile than gold. Past performance does not guarantee future results.",
      },
    ],
  },
  {
    title: "Working With Us",
    items: [
      {
        q: "How do I get started?",
        a: "Request a callback or call (866) 818-7243. A specialist reviews your situation and explains your options in about ten minutes.",
      },
      {
        q: "Do you charge for consultations?",
        a: "No. Consultations are free and carry no obligation.",
      },
      {
        q: "Are you a licensed precious metals dealer?",
        a: "Anchor Silver Capital LLC is a California-registered precious metals dealer. We are not a registered investment advisor or broker-dealer.",
      },
      {
        q: "What are your fees?",
        a: "Equity Trust account fee is $80-100 per year. Delaware Depository storage runs approximately 0.10-0.15% of metal value annually with a $100-150 minimum. Dealer premium varies by product and volume and is always quoted before purchase.",
      },
      {
        q: "What is your buyback policy?",
        a: "We will quote to repurchase metals we sold you at the prevailing market bid, with no buyback fee. You are never obligated to sell back to us.",
      },
    ],
  },
];

export const metadata: Metadata = pageMeta({
  title: "Silver IRA & Physical Silver FAQ | Anchor Silver Capital",
  description:
    "Answers on Silver IRA rollovers, 401k eligibility, IRA-approved products, premiums over spot, insured shipping, depository storage, fees, and our buyback policy.",
  path: "/faq",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: groups.flatMap((g) =>
    g.items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  ),
};

export default function Faq() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema("/faq", "FAQ")} />
      <PageHero
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        subtitle="Plain answers about Silver IRA rollovers, physical silver purchases, the market, and how we work."
      />

      {groups.map((g, i) => (
        <Section key={g.title} tone={i % 2 === 1 ? "muted" : "light"}>
          <H2>{g.title}</H2>
          <div className="mt-8">
            <Accordion items={g.items} />
          </div>
        </Section>
      ))}

      <Section tone="sage">
        <H2 className="text-primary-foreground">Still Have a Question?</H2>
        <div className="mt-8">
          <InlineLeadForm
            interest="just_learning"
            sourcePage="/faq"
            subheading="Leave your details and a silver specialist will get back to you."
          />
        </div>
      </Section>
    </>
  );
}
