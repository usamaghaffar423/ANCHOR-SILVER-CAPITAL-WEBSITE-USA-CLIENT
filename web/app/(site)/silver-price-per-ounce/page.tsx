import type { Metadata } from "next";
import { PricePage, type PriceContent } from "@/components/site/PricePage";
import { pageMeta } from "@/lib/site";

// Rendered per request: this Worker has no ISR cache, and the live figures in the
// first HTML must be current. Upstream calls are cached in lib/edge-cache.ts.
export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMeta({
  title: "Live Silver Price Per Ounce Today",
  description:
    "Live silver price per ounce with an interactive chart, daily open, high, low and close, and plain-English context on what moves silver and how it fits in an IRA.",
  path: "/silver-price-per-ounce",
  type: "article",
});

const content: PriceContent = {
  symbol: "XAG",
  slug: "silver-price-per-ounce",
  metal: "Silver",
  lineVar: "--silver",
  eyebrow: "Live silver spot price",
  h1: "Silver Price Per Ounce Today",
  framing:
    "Is silver poised to break out, or is it consolidating? Nobody can know in advance. What we can do is watch what the price is doing, understand what drives it, and decide how much, if any, belongs in a retirement plan.",
  articleHeadline: "Silver Price Per Ounce Today: Live Chart, History and What Moves It",
  description:
    "Live silver price per ounce with an interactive chart, daily open, high, low and close, and plain-English context on what moves silver and how it fits in an IRA.",
  sections: [
    {
      id: "history",
      h2: "Silver price history: a wide range",
      body: [
        "Silver has traded in an unusually wide range over the past half century. It briefly approached $50 an ounce in January 1980, spent most of the 1990s and early 2000s between roughly $4 and $6, reached the neighborhood of $48 again in April 2011, and fell to about $12 in March 2020 before recovering. These are rounded, nominal (not inflation-adjusted) levels from public market records.",
        "Use the range buttons on the chart above to see how the recent path compares. A long view is useful mainly as context: it shows how far silver can move in either direction, which is why it is usually held as one part of a broader plan rather than the whole of it.",
      ],
    },
    {
      id: "why-it-matters",
      h2: "Why the silver price matters right now",
      body: [
        "Silver is both a monetary metal and an industrial one. Industrial uses such as solar panels, electronics, electric vehicles and medical applications account for roughly half of annual demand, according to the Silver Institute, so the price responds to manufacturing activity as well as to investor demand.",
        "On the supply side, most silver is mined as a by-product of copper, lead, zinc and gold, so output cannot easily be raised just because the price rises. The Silver Institute has reported that demand exceeded mine and recycled supply in several recent years. The U.S. dollar, interest rates and inflation expectations also feed in. None of these guarantees a particular price direction; they are the inputs the market is weighing.",
      ],
    },
    {
      id: "silver-ira",
      h2: "Silver in a self-directed IRA",
      body: [
        "A self-directed IRA can hold physical silver that meets IRS fineness rules, generally .999 fine bullion plus certain coins such as the American Silver Eagle. The metal is not kept at home: it is held by an approved depository, for Anchor Silver Capital clients IDS of Delaware, with American Estate & Trust (AET) as custodian.",
        "Our fees are published: $50 setup, a flat $200 per year custodian fee, and $12 per month for storage, and our premium over spot never exceeds 15%. A rollover from an existing 401(k) or IRA that is done correctly is generally not a taxable event. Silver pays no interest or dividends and can lose value, and it is not right for every portfolio.",
      ],
    },
    {
      id: "spot-vs-retail",
      h2: "Spot price vs. what you pay",
      body: [
        "The spot price above is the benchmark for one troy ounce of silver traded in bulk. Coins and bars sell at spot plus a premium that covers minting, distribution and dealer costs, and it varies by product. At Anchor Silver Capital that premium is capped at 15% over spot, and the exact price is confirmed with a specialist before any order is finalized.",
      ],
    },
  ],
  faq: [
    {
      q: "What is the spot price of silver?",
      a: "The spot price is the current market price for one troy ounce of silver for immediate delivery, quoted in U.S. dollars. It is a wholesale benchmark; coins and bars carry a premium over spot.",
    },
    {
      q: "Why does the silver price change during the day?",
      a: "Silver trades nearly around the clock in global markets, so its price moves with supply and demand, the U.S. dollar, interest-rate expectations and news. The price on this page refreshes about once a minute.",
    },
    {
      q: "Can I hold silver in an IRA?",
      a: "Yes. A self-directed IRA can hold IRS-approved physical silver stored with an approved depository. See our Silver IRA page for the fees and the rollover process.",
    },
    {
      q: "What is a troy ounce?",
      a: "A troy ounce is about 31.1 grams and is the standard unit for pricing precious metals. It is slightly heavier than the everyday ounce of about 28.35 grams.",
    },
  ],
  ira: { href: "/silver-ira", label: "Silver IRA: fees and rollover" },
  other: { href: "/gold-price-per-ounce", label: "Live gold price per ounce" },
  cta: {
    heading: "Talk to a Silver IRA specialist",
    sub: "Leave your details and a specialist will call to answer your questions. We report conditions; we don't forecast.",
    button: "Request a Callback",
  },
};

export default function SilverPricePerOunce() {
  return <PricePage c={content} />;
}
