import Link from "next/link";
import { InlineLeadForm } from "@/components/forms/InlineLeadForm";
import { Accordion, type QA } from "@/components/site/Accordion";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/site/PageHero";
import { PriceChart } from "@/components/site/PriceChart";
import { ButtonLink, Card, Disclaimer, H2, PhoneLink, Prose, Section } from "@/components/site/ui";
import { getOhlc24h, getPriceHistory, getSpotPrices, type PriceSymbol } from "@/lib/metals";
import { OG_IMAGE, SITE, breadcrumbSchema } from "@/lib/site";

/**
 * Shared template for /silver-price-per-ounce and /gold-price-per-ounce.
 * Server component: spot (the same getSpotPrices() the home-page widgets use),
 * the 24h OHLC and the default 30-day history are fetched here, so the numbers
 * are in the first HTML for crawlers. Paid-API calls are cached by
 * lib/edge-cache.ts; the page itself renders per request (`force-dynamic` on
 * the route files) because this Worker has no ISR cache to revalidate from.
 */

export type PriceContent = {
  symbol: PriceSymbol;
  slug: string;
  metal: "Silver" | "Gold";
  lineVar: string;
  eyebrow: string;
  h1: string;
  /** Static framing paragraph — a question, never a prediction. */
  framing: string;
  articleHeadline: string;
  description: string;
  sections: { id: string; h2: string; body: string[] }[];
  faq: QA[];
  ira: { href: string; label: string };
  other: { href: string; label: string };
  cta: { heading: string; sub: string; button: string };
};

const usd = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** One neutral, data-derived sentence. Null unless both inputs are real. */
function trendSentence(
  metal: string,
  spot: number | null,
  pts: { t: number; p: number }[] | null,
): string | null {
  if (spot == null) return null;
  if (!pts || pts.length < 2) {
    return `${metal} is trading near ${usd(spot)} per ounce. Figures are indicative spot data, not a quote.`;
  }
  const prices = pts.map((d) => d.p);
  const lo = Math.min(...prices);
  const hi = Math.max(...prices);
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const rel = spot > avg * 1.02 ? "above" : spot < avg * 0.98 ? "below" : "close to";
  return `${metal} is trading near ${usd(spot)} per ounce. Over the past 30 days it has ranged from ${usd(lo)} to ${usd(hi)}, and today's price sits ${rel} the 30-day average of ${usd(avg)}. Figures are indicative spot data, not a quote.`;
}

export async function PricePage({ c }: { c: PriceContent }) {
  const [spotPair, ohlc, history] = await Promise.all([
    getSpotPrices(),
    getOhlc24h(c.symbol),
    getPriceHistory(c.symbol, "1M"),
  ]);
  const spot = spotPair ? (c.symbol === "XAG" ? spotPair.silver : spotPair.gold) : null;
  const trend = trendSentence(c.metal, spot, history);
  const path = `/${c.slug}`;
  const url = `${SITE.origin}${path}`;
  const modified = new Date().toISOString();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.articleHeadline,
    description: c.description,
    image: [OG_IMAGE],
    datePublished: "2026-10-25",
    dateModified: modified,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: SITE.name, url: SITE.origin },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.origin },
    about: { "@type": "Thing", name: `${c.metal} spot price per ounce` },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema(path, c.h1)} />

      <PageHero eyebrow={c.eyebrow} title={c.h1} subtitle={c.framing}>
        {trend && <p className="max-w-3xl text-base leading-relaxed text-silver">{trend}</p>}
      </PageHero>

      <Section>
          <PriceChart
            symbol={c.symbol}
            metal={c.metal}
            lineVar={c.lineVar}
            initialSpot={spot}
            initialUpdatedAt={spotPair?.updatedAt ?? null}
            ohlc={ohlc}
            initialRange="1M"
            initialPoints={history}
          />
      </Section>

      {c.sections.map((s, i) => (
        <div key={s.id}>
          <Section tone={i % 2 === 0 ? "light" : "muted"} id={s.id}>
            <H2>{s.h2}</H2>
            <Prose className="mt-6">
              {s.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Prose>
          </Section>
          {i === 1 && (
            <Section tone="sage">
              <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div className="max-w-2xl">
                  <h2 className="text-2xl md:text-3xl">{c.cta.heading}</h2>
                  <p className="mt-2 text-primary-foreground/80">{c.cta.sub}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <ButtonLink to="#lead" variant="silver">
                    {c.cta.button}
                  </ButtonLink>
                  <PhoneLink variant="outlineLight" />
                </div>
              </div>
            </Section>
          )}
        </div>
      ))}

      <Section id="faq">
        <H2>{c.metal} price questions</H2>
        <div className="mt-8 max-w-3xl">
          <Accordion items={c.faq} />
        </div>
      </Section>

      <Section tone="muted">
        <H2>Keep reading</H2>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { href: c.ira.href, t: c.ira.label, d: "Fees, eligibility and the rollover process, spelled out." },
            { href: "/faq", t: "FAQ", d: "Straight answers on fees, storage, rollovers and premiums." },
            {
              href: "/precious-metals-ira-handbook.pdf",
              t: "Free Precious Metals IRA Handbook (PDF)",
              d: "A plain-English guide to holding gold and silver in a retirement account.",
            },
            { href: c.other.href, t: c.other.label, d: "Live spot price, chart and daily range." },
            { href: "/market-update", t: "Market update", d: "Gold and silver spot with the gold-to-silver ratio." },
          ].map((l) => (
            <Card as="li" key={l.href} className="h-full">
              <Link href={l.href} className="text-lg font-semibold text-primary underline-offset-2 hover:underline">
                {l.t}
              </Link>
              <p className="mt-2 text-sm text-muted-foreground">{l.d}</p>
            </Card>
          ))}
        </ul>
      </Section>

      <Section id="lead">
        <InlineLeadForm
          heading={c.cta.heading}
          subheading={c.cta.sub}
          submitLabel={c.cta.button}
        />
        <Disclaimer>
          Prices on this page are indicative spot prices from gold-api.com, not quotes; dealable
          prices are confirmed with a specialist at the time of transaction. Precious metals are
          volatile, pay no interest or dividends, and can lose value. Past performance does not
          guarantee future results. This page is general information, not investment, tax or legal
          advice.
        </Disclaimer>
      </Section>
    </>
  );
}
