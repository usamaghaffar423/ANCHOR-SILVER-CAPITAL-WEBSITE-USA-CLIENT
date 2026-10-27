/**
 * All copy for the homepage "IRA Handbook" landing page, kept out of the components so it
 * can be edited without touching layout code. Source: HOMEPAGE_CONTENT_SPEC.md.
 *
 * Anything marked `draft: true` is NOT in Ron's handoff and needs his approval before it
 * is treated as final. Edit the text here; the page picks it up.
 */

export const ACCOUNT_TYPES = ["401(k)", "IRA", "Cash savings", "Other"] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const PHONE = { display: "(866) 818-7243", href: "tel:+18668187243" };

/** H1 variants, chosen with `?h=` (e.g. /?h=silver). Line 3 is the part that changes. */
export const H1_VARIANTS = {
  default: { line3: "both" },
  gold: { line3: "gold" },
  silver: { line3: "silver" },
} as const;
export type H1Variant = keyof typeof H1_VARIANTS;

export const HERO = {
  pill: "FREE HANDBOOK",
  line1: "Secure your retirement",
  line2: "savings with a",
  /** "transfer, it's" is joined with a non-breaking space so it never splits. */
  subLead: "Done as a simple direct transfer, it’s",
  subBold: "usually without tax or penalty.",
  subMobile: "Usually without tax or penalty.",
  checks: ["Fees in writing", "No obligation", "Real specialists"],
  dealer: "California registered dealer",
};

export const FORM = {
  step1Question: "Where is your retirement money now?",
  step2Heading: "Where should we send your free handbook?",
  step2Sub: "Your copy arrives by email in under a minute.",
  phoneHelper: "A specialist will call to answer your questions. No pressure.",
  submit: "Send My Free Handbook",
  secure: "Secure. Never sold.",
  /** Verbatim consent text; also sent to the webhook as `consent_text`. */
  consent:
    "By submitting, you agree Anchor Silver Capital LLC may call, text, or email you about your inquiry. Message and data rates may apply. Reply STOP to opt out of texts.",
};

export const TRUST = [
  { title: "Registered dealer", sub: "State of California" },
  { title: "Independent custodian", sub: "American Estate & Trust" },
  { title: "Independent vault storage", sub: "IDS of Delaware" },
  { title: "Every cost in writing", sub: "Before you commit" },
];

export const LOOK_INSIDE = {
  heading: "Take a look inside",
  items: [
    { name: "handbook-cover", widths: [320, 640] as [number, number], w: 1200, h: 1552, caption: "The handbook", alt: "Cover of The Precious Metals IRA Handbook: Gold and Silver" },
    { name: "handbook-page-03", widths: [300, 600] as [number, number], w: 765, h: 990, caption: "10 short chapters", alt: "Handbook contents page listing the chapters" },
    { name: "handbook-page-15", widths: [300, 600] as [number, number], w: 765, h: 990, caption: "Fees, stated plainly", alt: "Handbook chapter page laying out the fees" },
  ],
};

export const HOW = {
  heading: "How it works",
  steps: [
    {
      title: "Read and ask questions",
      body: "Get the handbook, then talk it through with a specialist. No pressure to move forward.",
    },
    {
      title: "Transfer directly",
      body: "An independent custodian opens your self-directed IRA. Your provider sends funds straight there, never through your hands.",
    },
    {
      title: "Choose your metal",
      body: "Gold, silver, or both, stored at an independent depository. Every cost quoted in writing first.",
    },
  ],
};

/** The specialist card and two reviews in the handoff are placeholders: keep hidden until real content exists. */
export const SHOW_PEOPLE = false;

export const FAQ = {
  heading: "Questions people ask first",
  items: [
    {
      q: "Will I owe tax or a penalty to move my retirement money?",
      a: "Done as a direct trustee-to-trustee transfer between retirement accounts, there is generally no tax and no penalty. Rules have exceptions and depend on your account type and situation, so confirm yours with a qualified tax professional. The handbook explains the difference between a transfer and a rollover.",
      draft: false,
    },
    {
      q: "What does it cost?",
      a: "Every quote shows three numbers in writing before you decide: the spot price, the all-in price you pay, and the difference as a percentage (the premium). Your IRA also has yearly custodian and storage fees, which we list up front. Chapter 15 of the handbook shows them plainly.",
      draft: true,
    },
    {
      q: "Can I keep the metal at home?",
      a: "Not inside an IRA. IRS rules generally require IRA metal to be held by an approved depository. Yours would be stored at International Depository Services of Delaware, in your IRA’s name, with statements sent to you. Metal you buy outside an IRA can be delivered to you.",
      draft: true,
    },
    {
      q: "What if gold and silver prices fall?",
      a: "They can. Gold and silver move up and down, sometimes sharply, and pay no interest or dividends. Many people hold metal as one part of a broader retirement plan rather than all of it. We will never promise returns or predict prices.",
      draft: true,
    },
    {
      q: "Do I have to buy anything?",
      a: "No. The handbook is free and a call with a specialist carries no obligation. You decide if and when to move forward, and every cost is in writing before you approve anything.",
      draft: true,
    },
  ],
};

export const FINAL_CTA = {
  line1: "Have questions?",
  line2: "Start with the free handbook.",
  label: "Where is your retirement money now?",
};

export const COMPLIANCE =
  "Anchor Silver Capital LLC is a precious metals dealer registered in the State of California. It is not a registered investment advisor, broker-dealer, or tax advisor, and nothing on this page is investment or tax advice. Gold and silver are volatile and pay no interest or dividends. Their prices can decline substantially, and you may lose money. Tax treatment depends on your situation: confirm it with a qualified tax professional before moving retirement funds. American Estate & Trust and International Depository Services of Delaware are independent of Anchor Silver Capital.";

export const STICKY = { cta: "Get the Free Handbook", callLabel: "Call (866) 818-7243" };
