/**
 * California privacy content. Counsel approves the legal text in this file.
 *
 * `CCPA_POLICY_APPROVED` controls the "California Privacy Rights" section on /privacy.
 * It stays `false` until counsel signs off; while false, /privacy shows the current
 * policy unchanged and none of `CCPA_SECTIONS` is published. Everything else here (the
 * notice-at-collection line, the contact details, the Your Privacy Choices page copy)
 * is short operational text, not the policy.
 *
 * Third parties below are the ones actually present in the code today. Microsoft
 * Clarity is listed under `PENDING_THIRD_PARTIES`: move it into `THIRD_PARTIES` when the
 * Clarity tag ships. JustCall is not referenced anywhere in this codebase (calls and
 * texts run through GoHighLevel), so it is not listed.
 */

export const CCPA_POLICY_APPROVED = false;

export const PRIVACY_CONTACT = {
  email: "privacy@anchorsilvercapital.com",
  tollFree: "(866) 818-7243",
  tollFreeHref: "tel:+18668187243",
};

/** Small line shown under the consent text of every lead form. */
export const NOTICE_AT_COLLECTION =
  "We collect your name, email, phone and answers to send your handbook and contact you about your inquiry.";
export const NOTICE_AT_COLLECTION_LINK_TEXT = "See our California privacy notice.";
export const NOTICE_AT_COLLECTION_HREF = "/privacy#california-privacy-rights";

export const PRIVACY_CHOICES_PAGE = {
  title: "Your Privacy Choices",
  intro:
    "You can opt out of the sale or sharing of your personal information, and ask us to tell you what we hold, correct it, or delete it.",
  toggleLabel: "Do not sell or share my personal information",
  toggleHelp:
    "Turns off advertising and cross-site measurement on this browser. It takes effect immediately and is remembered for 12 months.",
  gpcHonored: "Opt-out signal detected and honored",
  gpcExplain:
    "Your browser is sending a Global Privacy Control signal. We treat it as a request to opt out of sale and sharing on every page.",
  requestHeading: "Make a privacy request",
  requestIntro:
    "Use this form to ask us to tell you what personal information we hold about you, delete it, correct it, or opt you out.",
  requestSuccess:
    "Thank you. We received your request and will respond within 45 days. We may contact you to verify your identity.",
  requestUnavailable:
    "The request form is temporarily unavailable. Please email or call us using the details above and we will handle your request.",
};

export const REQUEST_TYPES = [
  { value: "know", label: "Know what personal information you hold about me" },
  { value: "delete", label: "Delete my personal information" },
  { value: "correct", label: "Correct my personal information" },
  { value: "opt_out", label: "Opt me out of sale or sharing" },
] as const;

export const THIRD_PARTIES = [
  {
    name: "GoHighLevel (LeadConnector)",
    purpose: "Receives form submissions; stores contacts; sends our emails and texts; places and records calls.",
  },
  {
    name: "Microsoft Advertising (UET)",
    purpose: "Measures how our ads perform and matches conversions to ad clicks.",
  },
  {
    name: "Google Analytics and Google Ads",
    purpose: "Measures site usage and ad performance.",
  },
  {
    name: "Calendly",
    purpose: "Schedules calls with our specialists.",
  },
  {
    name: "Cloudflare",
    purpose: "Hosts and secures the website and delivers it quickly.",
  },
  {
    name: "Google Fonts",
    purpose: "Delivers the typefaces used on the site (your IP address is visible to Google when they load).",
  },
] as const;

export const PENDING_THIRD_PARTIES = [
  { name: "Microsoft Clarity", purpose: "Session replay and heatmaps to improve the site (form fields are masked)." },
] as const;

export const CCPA_LAST_UPDATED = "October 31, 2026";

/** DRAFT policy text for counsel. Not published until CCPA_POLICY_APPROVED is true. */
export const CCPA_SECTIONS: { heading: string; paragraphs?: string[]; bullets?: string[] }[] = [
  {
    heading: "Categories of personal information we collect",
    bullets: [
      "Identifiers: name, email address, phone number, IP address, and online identifiers such as cookie and ad-click IDs.",
      "Information you give us: the type of retirement account you hold, an approximate balance range, and anything you write to us or tell us on a call.",
      "Commercial information: the products and services you ask about.",
      "Internet and device activity: pages viewed, links clicked, referring site, browser and device type, and campaign (UTM) parameters.",
      "Audio recordings: recordings of calls with our specialists, where permitted by law.",
    ],
  },
  {
    heading: "Where it comes from",
    bullets: [
      "You, when you fill in a form, call, text or email us, or book a time.",
      "Your browser or device, through cookies and similar technologies.",
      "Our service providers and advertising partners.",
    ],
  },
  {
    heading: "Why we use it",
    bullets: [
      "To send you the handbook and contact you about your inquiry.",
      "To schedule and hold calls, answer questions, and provide our services.",
      "To operate, secure and improve the website.",
      "To measure and improve our advertising.",
      "To comply with the law and protect our rights.",
    ],
  },
  {
    heading: "Who we disclose it to",
    paragraphs: [
      "We disclose personal information to the service providers and advertising and analytics partners listed below. We do not sell personal information in exchange for money.",
    ],
  },
  {
    heading: "Sale and sharing",
    paragraphs: [
      "Some advertising and analytics tools can be a “sale” or “sharing” of personal information for cross-context behavioral advertising under California law. You can opt out at any time on our Your Privacy Choices page. We also honor the Global Privacy Control signal.",
      "We do not knowingly sell or share the personal information of consumers under 16.",
    ],
  },
  {
    heading: "How long we keep it",
    paragraphs: [
      "We keep personal information for as long as we need it for the purposes above, and as long as the law requires.",
    ],
  },
  {
    heading: "Sensitive personal information",
    paragraphs: [
      "We do not ask for account numbers, passwords or Social Security numbers on this website, and we do not use or disclose sensitive personal information for purposes beyond those the law allows.",
    ],
  },
  {
    heading: "Your California rights",
    bullets: [
      "Know: ask what personal information we collect, use, disclose and sell or share, and get a copy.",
      "Delete: ask us to delete the personal information we collected from you, with some exceptions.",
      "Correct: ask us to correct inaccurate personal information.",
      "Opt out: tell us not to sell or share your personal information.",
      "Limit: ask us to limit the use of sensitive personal information.",
      "Non-discrimination: we will not treat you differently for using these rights.",
    ],
  },
  {
    heading: "How to make a request",
    paragraphs: [
      "Use the form on our Your Privacy Choices page, email privacy@anchorsilvercapital.com, or call toll-free. We may need to verify your identity before we act on a request, and we aim to respond within 45 days.",
      "An authorized agent may make a request for you. We may ask for proof that you gave the agent permission, and may ask you to verify your identity directly.",
    ],
  },
];
