import type { Metadata } from "next";
import { PricePage, type PriceContent } from "@/components/site/PricePage";
import { pageMeta } from "@/lib/site";

// Rendered per request: this Worker has no ISR cache, and the live figures in the
// first HTML must be current. Upstream calls are cached in lib/edge-cache.ts.
export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMeta({
  title: "Live Gold Price Per Ounce Today",
  description:
    "Live gold price per ounce with an interactive chart, daily open, high, low and close, and plain-English context on what moves gold and how it fits in an IRA.",
  path: "/gold-price-per-ounce",
  type: "article",
});

const content: PriceContent = {
  symbol: "XAU",
  slug: "gold-price-per-ounce",
  metal: "Gold",
  lineVar: "--brass-light",
  eyebrow: "Live gold spot price",
  h1: "Gold Price Per Ounce Today",
  framing:
    "Is gold holding its ground, or is it running out of room? Nobody can know in advance. What we can do is watch what the price is doing, understand what drives it, and decide how much, if any, belongs in a retirement plan.",
  articleHeadline: "Gold Price Per Ounce Today: Live Chart, History and What Moves It",
  description:
    "Live gold price per ounce with an interactive chart, daily open, high, low and close, and plain-English context on what moves gold and how it fits in an IRA.",
  sections: [
    {
      id: "history",
      h2: "Gold price history: from fixed to floating",
      body: [
        "Until 1971 the U.S. dollar price of gold was set by government policy, at $35 an ounce for much of the postwar era. Once that link ended the price floated: it rose to roughly $850 in January 1980, drifted down to about $250 around 1999, climbed to roughly $1,900 in September 2011, and passed $2,000 in August 2020. These are rounded, nominal (not inflation-adjusted) levels from public market records.",
        "Use the range buttons on the chart above to see how the recent path compares. A long view is useful mainly as context: it shows that gold can go through long stretches of decline as well as long stretches of gains, which is why it is usually held as one part of a broader plan.",
      ],
    },
    {
      id: "why-it-matters",
      h2: "Why the gold price matters right now",
      body: [
        "Gold pays no interest, so it is often weighed against what cash and bonds yield after inflation. When those real yields fall, holding gold costs less in forgone income; when they rise, the comparison shifts the other way.",
        "The World Gold Council has reported that central banks have bought gold in large volumes in recent years, a source of demand that is less sensitive to price. The U.S. dollar, inflation expectations and geopolitical stress also feed in. None of these guarantees a particular price direction; they are the inputs the market is weighing.",
      ],
    },
    {
      id: "gold-ira",
      h2: "Gold in a self-directed IRA",
      body: [
        "A self-directed IRA can hold physical gold that meets IRS rules: generally bullion that is at least .995 fine, plus certain coins such as the American Gold Eagle, which qualifies by statute. The metal is not kept at home; it is held by an approved depository with a custodian, and a gold IRA follows the same tax rules as any other IRA.",
        "Our published fee schedule is on the Silver IRA page, and a specialist confirms what applies to a gold or mixed gold-and-silver account. Gold pays no interest or dividends and can lose value, and it is not right for every portfolio.",
      ],
    },
    {
      id: "spot-vs-retail",
      h2: "Spot price vs. what you pay",
      body: [
        "The spot price above is the benchmark for one troy ounce of gold traded in bulk. Coins and bars sell at spot plus a premium that covers minting, distribution and dealer costs, and it varies by product. At Anchor Silver Capital that premium is capped at 15% over spot, and the exact price is confirmed with a specialist before any order is finalized.",
      ],
    },
  ],
  faq: [
    {
      q: "What is the spot price of gold?",
      a: "The spot price is the current market price for one troy ounce of gold for immediate delivery, quoted in U.S. dollars. It is a wholesale benchmark; coins and bars carry a premium over spot.",
    },
    {
      q: "Why does the gold price change during the day?",
      a: "Gold trades nearly around the clock in global markets, so its price moves with supply and demand, the U.S. dollar, interest-rate expectations and news. The price on this page refreshes about once a minute.",
    },
    {
      q: "Can I hold gold in an IRA?",
      a: "Yes. A self-directed IRA can hold IRS-approved physical gold stored with an approved depository, alone or alongside silver. Our precious metals IRA handbook explains the rules.",
    },
    {
      q: "Is the price on this page what I would pay for gold?",
      a: "No. It is the indicative spot price. Products sell at spot plus a premium, and the exact price is confirmed with a specialist at the time of the transaction.",
    },
  ],
  ira: { href: "/gold-silver-ira", label: "Gold & silver IRA overview" },
  other: { href: "/silver-price-per-ounce", label: "Live silver price per ounce" },
  cta: {
    heading: "Talk to a Gold IRA specialist",
    sub: "Leave your details and a specialist will call to answer your questions. We report conditions; we don't forecast.",
    button: "Request a Callback",
  },
};

export default function GoldPricePerOunce() {
  return <PricePage c={content} />;
}
