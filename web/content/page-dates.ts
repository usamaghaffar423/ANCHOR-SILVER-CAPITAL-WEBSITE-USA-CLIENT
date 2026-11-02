/**
 * Sitemap <lastmod> dates, one explicit date per page (YYYY-MM-DD).
 *
 * RULE (Ron): a page's lastmod is the date its PRIMARY CONTENT last changed: the copy, facts and figures a
 * reader sees in the main body. Layout, navigation, the footer, meta tags (title, description, og), alt
 * text, schema, tracking, performance work, builds and deploys do NOT count.
 *
 * Update a date here ONLY when that page's main content changes. Nothing in this file is computed: no
 * `new Date()`, no build timestamps, no file modification times (they change on every deploy).
 */

export const PAGE_DATES = {
  /** anchorsilvercapital.com */
  anchor: {
    "/": "2026-10-27", // handbook landing-style homepage; later changes were meta, FAQ markup, performance
    "/why-silver": "2026-10-15",
    "/silver-ira": "2026-11-02", // minimum amounts corrected (IRA rollover and physical delivery)
    "/physical-silver": "2026-11-02", // $10,000 minimum; storage option removed
    "/silver-supply": "2026-10-15",
    "/about": "2026-10-15",
    "/buyinggoldandsilver": "2026-10-15",
    "/get-started": "2026-11-02", // minimum amounts corrected (quiz form added 2026-10-31)
    "/faq": "2026-11-02", // minimum-purchase answers corrected, storage question removed
    "/market-update": "2026-10-15",
    "/silver-price-per-ounce": "2026-10-25",
    "/gold-price-per-ounce": "2026-10-25",
    "/contact": "2026-10-15",
    "/privacy": "2026-10-15",
    "/privacy-choices": "2026-10-31", // page created
    "/terms": "2026-10-15",
    "/sms-consent": "2026-10-15",
    "/disclaimer": "2026-10-15",
    "/riskdisclosure": "2026-10-15",
  },
  /** goldcurrentprice.com */
  gold: {
    "/": "2026-10-31", // refresh button added
    "/advertise": "2026-10-25",
    "/privacy": "2026-10-28",
    "/terms": "2026-10-28",
  },
  /** silvercurrentprice.com */
  silver: {
    "/": "2026-10-31", // refresh button added
    "/advertise": "2026-10-25",
    "/privacy": "2026-10-28",
    "/terms": "2026-10-28",
  },
} as const satisfies Record<string, Record<string, string>>;
