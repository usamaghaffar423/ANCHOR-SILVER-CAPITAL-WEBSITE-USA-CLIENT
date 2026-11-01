/**
 * AEO content, flagged OFF until Ron supplies and approves it. Nothing here is published while a flag is
 * off or a field is empty: the routes return 404 and stay out of the nav, the footer and the sitemap.
 * No placeholder text is ever rendered; an empty (`null`) field just keeps its section hidden.
 *
 * To publish a piece: fill its fields, set its `enabled` to true, deploy.
 */

/* --------------------------------- /fees ---------------------------------- */

export type FeeRow = {
  /** Fee or cost. */
  fee: string;
  /** Who charges it. */
  chargedBy: string;
  /** Amount exactly as quoted to clients, e.g. "$50 one time". `null` until Ron confirms it. */
  amount: string | null;
};

export const FEES = {
  enabled: false,
  /** "Last updated" shown on the page, e.g. "November 2026". `null` until set. */
  lastUpdated: null as string | null,
  /** The rows of the table. The row labels follow the cost types the site already discusses; Ron's worksheet is the source for the final list and amounts. */
  rows: [
    { fee: "Account setup", chargedBy: "American Estate & Trust (custodian)", amount: null },
    { fee: "Annual custodian fee", chargedBy: "American Estate & Trust (custodian)", amount: null },
    { fee: "Storage and insurance", chargedBy: "IDS of Delaware (depository)", amount: null },
    { fee: "Dealer premium when you buy", chargedBy: "Anchor Silver Capital", amount: null },
    { fee: "Cost to sell back", chargedBy: "Anchor Silver Capital", amount: null },
    { fee: "Shipping and insurance for delivered metal", chargedBy: "Anchor Silver Capital", amount: null },
    { fee: "Transfer or wire fees", chargedBy: "Your current provider / custodian", amount: null },
  ] as FeeRow[],
  /** Worked round trip (buy, then sell back). Every line needs its value before the page can go live. */
  example: {
    heading: "A worked example: buying and selling back",
    lines: [
      { label: "You buy", value: null as string | null },
      { label: "Premium over spot", value: null as string | null },
      { label: "Yearly custodian and storage fees", value: null as string | null },
      { label: "You sell back at the quoted buy-back price", value: null as string | null },
      { label: "Total cost of the round trip", value: null as string | null },
    ],
  },
};

/** /fees goes live only when it is enabled AND every amount, every example line and the date are filled. */
export function feesReady(): boolean {
  return (
    FEES.enabled &&
    !!FEES.lastUpdated &&
    FEES.rows.every((r) => !!r.amount) &&
    FEES.example.lines.every((l) => !!l.value)
  );
}

/* --------------------------------- /about --------------------------------- */

/**
 * Additions to the existing /about page. Each part shows only when its own field is filled; the whole
 * block shows only when `enabled` is true. The CA registration number is added only once issued.
 */
export const ABOUT_EXTRA = {
  enabled: false,
  lastUpdated: null as string | null,
  founder: null as { name: string; bio: string; photo: string | null } | null,
  address: null as string | null,
  email: null as string | null,
  /** California registration number, only once issued (never "pending"). */
  caRegistration: null as string | null,
  /** Partners with outbound links. Add `url` when Ron supplies it; a partner without a url is not linked. */
  partners: [
    { name: "American Estate & Trust", role: "IRA custodian", url: null as string | null },
    { name: "IDS of Delaware", role: "Depository", url: null as string | null },
  ],
  howItWorks: {
    heading: "How it works",
    steps: [
      "Open your account",
      "Transfer funds",
      "Buy metal",
      "Vault storage",
      "Selling later",
    ],
  },
};

/* ---------------------------- six question pages --------------------------- */

export type QuestionPageContent = {
  slug: string;
  enabled: boolean;
  /** <title> (the site template adds the brand). */
  title: string;
  /** Meta description. */
  description: string;
  /** The question: this is the page's <h1>. */
  question: string;
  /** Direct answer shown right under the H1: 40 to 60 words. `null` until written and approved. */
  answer: string | null;
  /** Sections; each heading is phrased as a question. */
  sections: { heading: string; paragraphs: string[] }[];
  /** 2 to 4 related FAQs (HTML and FAQPage schema). */
  faqs: { q: string; a: string }[];
  /** "Last updated" date text. `null` until set. */
  lastUpdated: string | null;
};

const empty = (slug: string, title: string, question: string): QuestionPageContent => ({
  slug,
  enabled: false,
  title,
  description: "",
  question,
  answer: null,
  sections: [],
  faqs: [],
  lastUpdated: null,
});

/** Copy is written or approved by Ron; these entries only reserve the six routes. */
export const QUESTION_PAGES: QuestionPageContent[] = [
  empty("silver-ira-fees", "Silver IRA Fees", "What are the fees for a silver IRA?"),
  empty("rollover-401k-to-silver-ira", "Roll a 401(k) Into a Silver IRA", "How do I roll over a 401(k) into a silver IRA?"),
  empty("sell-silver-from-ira", "Selling Silver From Your IRA", "How do I sell silver from my IRA?"),
  empty("ira-approved-silver", "IRA-Approved Silver", "What silver is approved for an IRA?"),
  empty("silver-ira-vs-gold-ira", "Silver IRA vs Gold IRA", "What is the difference between a silver IRA and a gold IRA?"),
  empty("store-silver-ira-at-home", "Storing Silver IRA Metal at Home", "Can I store my silver IRA metal at home?"),
];

const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

/** A question page is live only when enabled AND complete (answer 40 to 60 words, sections, 2 to 4 FAQs, description, date). */
export function questionPageLive(p: QuestionPageContent): boolean {
  if (!p.enabled || !p.answer || !p.description || !p.lastUpdated) return false;
  const words = wordCount(p.answer);
  return words >= 40 && words <= 60 && p.sections.length > 0 && p.faqs.length >= 2 && p.faqs.length <= 4;
}

export const liveQuestionPages = () => QUESTION_PAGES.filter(questionPageLive);
