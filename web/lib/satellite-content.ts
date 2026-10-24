import type { SatKey } from "@/lib/satellites";

/**
 * Copy for the two standalone price sites. Written separately for each domain
 * (different angle, structure and examples) and separately from the
 * anchorsilvercapital.com price pages — nothing here is a reword of those.
 * Educational and generic by design; no sales copy, no forecasts.
 */

export type SatContent = {
  title: string;
  description: string;
  h1: string;
  lede: string;
  keywords: string[];
  sections: { id: string; h2: string; body: string[] }[];
  faq: { q: string; a: string }[];
  /** Per-ounce multipliers for the unit table. */
  units: { label: string; perOz: number }[];
  /** Fineness presets for the melt-value calculator. */
  purities: { label: string; fineness: number }[];
  sponsor: { headline: string; text: string; cta: string };
  /** Plain-language description of what the chart shows. */
  chartNote: string;
  /** One benefit sentence shown beside the hero CTA. */
  benefit: string;
  /** Verifiable trust markers (all taken from the published anchorsilvercapital.com copy). */
  trust: { label: string; value: string }[];
  /** Value-prop bullets for the sponsor module. */
  bullets: string[];
  /** Price-alert email signup copy. */
  alert: { heading: string; text: string };
};

export const SAT_CONTENT: Record<SatKey, SatContent> = {
  gold: {
    title: "Gold Price Today: Live Gold Spot Price Per Ounce",
    description:
      "Current gold price per ounce in USD, refreshed every minute. Daily candles, the 24-hour range, per-gram and per-kilo prices, and a melt-value calculator.",
    h1: "Live Gold Price Today",
    lede: "Gold spot in US dollars per troy ounce, updated every minute, with 90 days of daily candles, per-gram and per-kilo conversions, and a melt-value calculator.",
    keywords: ["gold price today", "current gold price per ounce", "gold spot price", "gold price per gram"],
    chartNote:
      "Each candle is one UTC day. The thin line is the day's high and low; the body runs from the first to the last hourly average. Hollow candles closed up, filled candles closed down.",
    sections: [
      {
        id: "how-spot-is-set",
        h2: "How the spot price of gold is set",
        body: [
          "Gold has no single official price. The spot price is the going rate for immediate delivery of one troy ounce of high-purity gold in the wholesale market, and it is stitched together from several places at once: electronic trading of COMEX futures in New York, over-the-counter dealing centered in London, and exchange trading in Shanghai and elsewhere.",
          "Data providers blend those feeds into one running number, which is why two websites can show slightly different prices at the same moment. London also publishes a benchmark twice each business day, the LBMA Gold Price, set by auction at 10:30 and 15:00 London time; many contracts and funds are priced off it.",
        ],
      },
      {
        id: "premiums",
        h2: "Spot is not the price on a coin or bar",
        body: [
          "A one-ounce coin sells above spot because somebody paid to mint, ship, insure and stock it. That extra amount is the premium. It tends to be highest on small, collectible or newly minted pieces, lowest on large bars, and it widens when demand jumps or supply tightens.",
          "Selling works in reverse: buyers usually bid at or a little below spot, and the gap between what you pay and what you would receive is the spread. If you have a quote in hand, the calculator above shows its premium over melt value in dollars and percent.",
        ],
      },
      {
        id: "purity",
        h2: "Purity, karats and melt value",
        body: [
          "Fine gold is 24 karat. Investment bars and coins are commonly .995 to .9999 fine. Jewelry is alloyed for hardness: 22k is 91.7% gold, 18k is 75%, 14k is 58.3% and 10k is 41.7%.",
          "Melt value is weight × purity × spot. It is a floor for reference, not what a buyer will pay, because refiners and dealers deduct their own costs.",
        ],
      },
    ],
    faq: [
      {
        q: "Why is the gold price different on different websites?",
        a: "Spot gold is assembled from several markets and each provider blends and rounds them differently, so figures can differ by a small amount at any given second. The figure here comes from gold-api.com and is refreshed every minute or so.",
      },
      {
        q: "Can I buy gold at the price shown here?",
        a: "Not usually. The number is a wholesale benchmark. A coin, bar or piece of jewelry is priced off it, then the seller adds its own margin, and the final figure is whatever the seller quotes when you actually buy.",
      },
      {
        q: "Why is gold flat on Saturday and Sunday?",
        a: "The wholesale market takes a break over the weekend, roughly Friday 5 p.m. to Sunday 6 p.m. New York time. Anything displayed in that window is just Friday's last print.",
      },
      {
        q: "How many grams are in a troy ounce?",
        a: "One troy ounce is 31.1035 grams. It is heavier than the everyday ounce of 28.35 grams, which is why precious metals use their own unit.",
      },
    ],
    units: [
      { label: "Troy ounce", perOz: 1 },
      { label: "Gram", perOz: 1 / 31.1034768 },
      { label: "Kilogram", perOz: 32.1507466 },
      { label: "Pennyweight", perOz: 1 / 20 },
      { label: "1/10 troy ounce", perOz: 0.1 },
    ],
    purities: [
      { label: "24k (.999)", fineness: 0.999 },
      { label: "22k (.917)", fineness: 0.917 },
      { label: "18k (.750)", fineness: 0.75 },
      { label: "14k (.583)", fineness: 0.583 },
      { label: "10k (.417)", fineness: 0.417 },
    ],
    benefit:
      "Thinking about gold in a retirement account? The free IRA kit explains the rules, fees and rollover steps in plain English.",
    trust: [
      { label: "IRA custodian", value: "American Estate & Trust (AET)" },
      { label: "Depository", value: "IDS of Delaware, insured" },
      { label: "Metals", value: "IRS-approved bullion only" },
      { label: "Premium", value: "Capped at 15% over spot" },
    ],
    bullets: [
      "Physical gold and silver held at IDS of Delaware, fully insured and viewable online",
      "A 401(k) or IRA rollover that is done correctly is generally not a taxable event",
      "Dealer premium never exceeds 15% over spot, and the fee schedule is published up front",
    ],
    alert: {
      heading: "Get today's gold price by email every morning",
      text: "One short email with the gold spot price. Email only, no phone number needed.",
    },
    sponsor: {
      headline: "Gold in a retirement account?",
      text: "Anchor Silver Capital helps savers hold physical gold and silver in a self-directed IRA, with its fee schedule published up front.",
      cta: "See the Gold & Silver IRA overview",
    },
  },

  silver: {
    title: "Silver Price Today: Live Silver Spot Price Per Ounce",
    description:
      "Current silver price per ounce in USD, updated every minute. Daily candles, the 24-hour range, per-gram and per-kilo prices, and a sterling-silver melt calculator.",
    h1: "Live Silver Price Today",
    lede: "Silver spot in US dollars per troy ounce, refreshed every minute, plus daily candles for the last 90 days, unit conversions and a melt calculator for coins, bars and flatware.",
    keywords: ["silver price today", "current silver price per ounce", "silver spot price", "silver price per gram"],
    chartNote:
      "Each candle is one UTC day. The thin line spans the day's high and low; the body runs from the first to the last hourly average. Hollow candles closed up, filled candles closed down.",
    sections: [
      {
        id: "what-spot-measures",
        h2: "What the silver spot price measures",
        body: [
          "Spot silver is the market rate for one troy ounce of .999 fine silver for immediate delivery, quoted in US dollars. It is pieced together from futures trading on COMEX (where one contract covers 5,000 ounces), over-the-counter dealing in London, and other venues.",
          "London also sets a daily reference, the LBMA Silver Price, by auction at 12:00 noon London time on each business day. Contracts, refiners and funds often use it as a benchmark.",
        ],
      },
      {
        id: "volatility",
        h2: "Why silver swings more than gold",
        body: [
          "The silver market is much smaller than the gold market, so a given amount of buying or selling moves the price further. Silver also straddles two worlds: it is held as a store of value, and it is consumed by industry in electronics, solar cells and other manufacturing.",
          "That mix means silver can respond both to investor sentiment and to the economic cycle. Day-to-day moves are usually larger in percentage terms than gold's, which is worth knowing before reading anything into one candle.",
        ],
      },
      {
        id: "premiums",
        h2: "Why a silver coin costs more than its spot value",
        body: [
          "Making, shipping and insuring a coin costs about the same whether it holds silver or gold, but silver is far cheaper per ounce. A few dollars of fabrication cost is a rounding error on a gold coin and a noticeable slice of a silver one, so premiums on silver are proportionally larger, especially on one-ounce coins and small bars.",
          "Large bars carry the smallest premiums. Whatever the product, compare a quote with its melt value using the calculator above rather than with the headline spot price alone.",
        ],
      },
      {
        id: "fineness",
        h2: "Fineness: .999, sterling and coin silver",
        body: [
          "Bullion is .999 fine. Sterling silver, used for flatware and jewelry, is .925. Older US coins minted before 1965 are .900, and some wartime nickels are .350. Melt value is weight × fineness × spot, and it is a reference point rather than what a dealer will pay.",
        ],
      },
    ],
    faq: [
      {
        q: "What is the current silver price per ounce?",
        a: "The figure at the top of this page is the live spot price of one troy ounce of silver in US dollars, refreshed about once a minute from gold-api.com. It is indicative, not a quote.",
      },
      {
        q: "Is a troy ounce the same as a regular ounce?",
        a: "No. A troy ounce is 31.1035 grams; the everyday ounce is 28.35 grams. Silver is priced per troy ounce.",
      },
      {
        q: "Why doesn't silver change on weekends?",
        a: "Dealers and exchanges close for the weekend, so no new trades set a price until Sunday evening. The chart skips those days for the same reason.",
      },
      {
        q: "What is the gold-to-silver ratio?",
        a: "It is the gold price divided by the silver price, in other words how many ounces of silver equal one ounce of gold. Traders watch it as a rough gauge of how the two metals are priced relative to each other.",
      },
    ],
    units: [
      { label: "Troy ounce", perOz: 1 },
      { label: "Gram", perOz: 1 / 31.1034768 },
      { label: "Kilogram", perOz: 32.1507466 },
      { label: "10 troy ounces", perOz: 10 },
      { label: "100 troy ounces", perOz: 100 },
    ],
    purities: [
      { label: ".999 bullion", fineness: 0.999 },
      { label: ".925 sterling", fineness: 0.925 },
      { label: ".900 pre-1965 US coin", fineness: 0.9 },
      { label: ".800", fineness: 0.8 },
      { label: ".350 wartime nickel", fineness: 0.35 },
    ],
    benefit:
      "Weighing silver for retirement savings? The free IRA kit explains the rules, fees and rollover steps in plain English.",
    trust: [
      { label: "IRA custodian", value: "American Estate & Trust (AET)" },
      { label: "Depository", value: "IDS of Delaware, insured" },
      { label: "Metals", value: "IRS-approved bullion only" },
      { label: "Premium", value: "Capped at 15% over spot" },
    ],
    bullets: [
      "Physical silver held at IDS of Delaware, fully insured and viewable online",
      "Flat $200 per year custodian fee and $12 per month storage, published up front",
      "Dealer premium never exceeds 15% over spot",
    ],
    alert: {
      heading: "Get today's silver price by email every morning",
      text: "One short email with the silver spot price. Email only, no phone number needed.",
    },
    sponsor: {
      headline: "Silver in a retirement account?",
      text: "Anchor Silver Capital sets up self-directed Silver IRAs backed by physical bullion, with a flat custodian fee and storage costs published up front.",
      cta: "See how a Silver IRA works",
    },
  },
};
