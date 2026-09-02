import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { CallbackForm } from "@/components/site/CallbackForm";
import { JsonLd } from "@/components/site/JsonLd";
import { Card, H2, Prose, Section } from "@/components/site/ui";
import { breadcrumbSchema, pageMeta } from "@/lib/site";

const silverEagle = "/assets/silver-eagle.jpg";
const morganDollar = "/assets/morgan-dollar.jpg";
const peaceDollar = "/assets/peace-dollar.jpg";
const mapleLeaf = "/assets/maple-leaf.jpg";
const bar10oz = "/assets/bar-10oz.jpg";
const bar100oz = "/assets/bar-100oz.jpg";
const junkSilver = "/assets/junk-silver.jpg";
const silverRounds = "/assets/silver-rounds.jpg";

export const metadata: Metadata = pageMeta({
  title: "Buy Physical Silver — Bars, Rounds & Coins | Anchor Silver",
  description:
    "Buy physical silver rounds, bars, and coins shipped fully insured to your door or stored at Delaware Depository. Minimum order $5,000. All-in pricing before you commit.",
  path: "/physical-silver",
  type: "article",
});

const products = [
  {
    name: "American Silver Eagles",
    detail: "1 oz · .999 fine · IRA eligible",
    img: silverEagle,
    alt: "Polished one ounce silver bullion coin resting on neutral linen",
  },
  {
    name: "Morgan Silver Dollars",
    detail: "Pre-1921 US classic · 90% silver",
    img: morganDollar,
    alt: "Stack of aged silver dollar coins on a dark surface",
  },
  {
    name: "Peace Silver Dollars",
    detail: "1921-1935 US classic · 90% silver",
    img: peaceDollar,
    alt: "Two silver dollar coins leaning together on grey stone",
  },
  {
    name: "Canadian Maple Leafs",
    detail: "1 oz · .9999 fine · IRA eligible",
    img: mapleLeaf,
    alt: "Brilliant one ounce silver coin with reeded edge on white background",
  },
  {
    name: "10 oz Silver Bars",
    detail: ".999 fine · approved refiners",
    img: bar10oz,
    alt: "Three stacked ten ounce poured silver bars with cast texture",
  },
  {
    name: "100 oz Silver Bars",
    detail: ".999 fine · lowest premium per ounce",
    img: bar100oz,
    alt: "Large one hundred ounce cast silver bar on a dark background",
  },
  {
    name: "Junk Silver",
    detail: "Pre-1964 US coins · 90% silver",
    img: junkSilver,
    alt: "Scattered pile of worn small silver coins of mixed sizes",
  },
  {
    name: "Generic Silver Rounds",
    detail: "1 oz · .999 fine · value pricing",
    img: silverRounds,
    alt: "Four polished one ounce silver rounds fanned across a pale surface",
  },
];

export default function PhysicalSilver() {
  return (
    <>
      <JsonLd data={breadcrumbSchema("/physical-silver", "Physical Silver")} />
      <PageHero
        eyebrow="Physical Silver"
        title="Real Metal. Delivered to Your Door."
        subtitle="Skip the paper derivatives and the promises. Own physical silver you can hold — insured, delivered, yours."
      />

      <Section>
        <H2>Products We Offer</H2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Card as="li" key={product.name}>
              <img
                src={product.img}
                alt={product.alt}
                loading="lazy"
                width={800}
                height={600}
                className="h-36 w-full rounded-sm bg-muted object-contain p-2 sm:h-32"
              />
              <h3 className="mt-4 text-base">{product.name}</h3>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{product.detail}</p>
            </Card>
          ))}
        </ul>
        <p className="mt-6 text-xs italic text-muted-foreground">
          Product availability and pricing change with the market. Your specialist confirms both
          before any order.
        </p>
      </Section>

      <Section tone="muted">
        <H2>Understanding Premiums</H2>
        <Prose className="mt-5">
          <p>
            All silver sells at a premium over spot price. We quote you the all-in price — metal
            plus premium plus shipping — before you commit to anything.
          </p>
        </Prose>

        <H2 className="mt-14">Shipping and Security</H2>
        <Prose className="mt-5">
          <p>
            All physical silver orders ship fully insured via Brinks, Loomis, or USPS Registered
            Mail. Signature confirmation required on all orders over $5,000.
          </p>
        </Prose>

        <H2 className="mt-14">Storage Option</H2>
        <Prose className="mt-5">
          <p>
            Prefer not to store silver at home? We can arrange allocated storage at Delaware
            Depository — your specific bars or coins held in your name, fully insured, accessible
            online.
          </p>
          <p className="font-mono text-sm text-primary">Minimum order: $5,000</p>
        </Prose>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <H2>Get a Quote</H2>
            <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
              Tell us roughly what you're considering and a specialist will send an all-in quote —
              metal, premium, and insured shipping — with no obligation.
            </p>
          </div>
          <div className="rounded-md bg-card p-6 shadow-[var(--shadow-card)]">
            <CallbackForm variant="quote" submitLabel="Get a Quote" />
          </div>
        </div>
      </Section>
    </>
  );
}
