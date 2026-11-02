import type { Metadata } from "next";

/**
 * Minimum purchase amounts, in dollars: the ONE place to change them. Every page, FAQ answer, meta
 * description and FAQPage schema reads these.
 *  - iraRollover: 24,000 per Ron; he may confirm 25,000 instead (a one-line change here).
 *  - physicalDelivered: physical silver delivered to your door. There is no held-in-storage purchase option.
 */
export const MINIMUMS = {
  iraRollover: 24_000,
  physicalDelivered: 10_000,
} as const;

/** "$24,000" */
export const usd0 = (n: number) => "$" + n.toLocaleString("en-US");

export const SITE = {
  name: "Anchor Silver Capital",
  legal: "Anchor Silver Capital LLC",
  tagline: "Steady Ground. Rising Value.",
  phone: "(866) 818-7243",
  phoneHref: "tel:+18668187243",
  email: "info@anchorsilvercapital.com",
  street: "475 Washington Blvd",
  city: "Marina del Rey",
  state: "CA",
  zip: "90292",
  origin: "https://anchorsilvercapital.com",
  hours: "Monday–Friday 8am–6pm Pacific",
} as const;

/**
 * Effective date for the Privacy Policy / Terms — derived at build time so the
 * legal pages always carry the current date (currently October 2026) without a
 * manual edit on every deploy.
 */
export const policyEffectiveDate = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

/**
 * Gate for using Scottsdale Mint/Silver-branded imagery (lion crest, "Scottsdale"
 * wordmark visible) as a prominent/centerpiece shot. While false, every branded
 * image is treated as a background/texture ONLY — always behind a scrim, never a
 * centerpiece product shot. Flip to true only once the client confirms they
 * actually carry Scottsdale product; that promotes those placements.
 */
export const ALLOW_BRANDED_PROMINENT = false;

export const NAV = [
  { to: "/why-silver", label: "Why Silver" },
  { to: "/silver-ira", label: "Silver IRA" },
  { to: "/physical-silver", label: "Physical Silver" },
  { to: "/silver-price-per-ounce", label: "Silver Price" },
  { to: "/gold-price-per-ounce", label: "Gold Price" },
  { to: "/about", label: "About" },
] as const;

export const PAGES = [
  "/",
  "/why-silver",
  "/silver-ira",
  "/physical-silver",
  "/silver-supply",
  "/about",
  "/buyinggoldandsilver",
  "/get-started",
  "/faq",
  "/market-update",
  "/silver-price-per-ounce",
  "/gold-price-per-ounce",
  "/contact",
  "/privacy",
  "/privacy-choices",
  "/terms",
  "/sms-consent",
  "/disclaimer",
  "/riskdisclosure",
  "/guide-success",
] as const;

export function breadcrumbSchema(path: string, label: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.origin}/` },
      { "@type": "ListItem", position: 2, name: label, item: `${SITE.origin}${path}` },
    ],
  };
}

const ORGANIZATION_ID = `${SITE.origin}/#org`;

/**
 * Details Ron has not supplied yet. Leave a field undefined and it is OMITTED from the schema; fill it in
 * and it switches on everywhere. Nothing here is guessed.
 */
export const ORG_OPTIONAL: {
  email?: string;
  streetAddress?: string;
  postalCode?: string;
  founder?: string;
  sameAs?: string[];
} = {};

/** Description of the business, from Ron's AEO worksheet. */
const ORG_DESCRIPTION = "California-registered precious metals dealer specializing in physical silver and gold IRAs.";

/**
 * YMYL entity graph injected into <head> on every route: who we are (Organization + FinancialService,
 * one node, @id /#org), the site (WebSite), and what the product costs (FinancialProduct), in machine-readable
 * form for search engines and for answer engines that cite the site directly.
 *
 * Only known-true fields are emitted; see ORG_OPTIONAL for what is held back until Ron confirms it.
 *
 * The fee strings in the product node are the published schedule: AET $50 setup + $200/year,
 * IDS of Delaware $12/month ($144/year), dealer premium capped at 15% over spot. Change them here and
 * on the Silver IRA / FAQ pages together.
 *
 * Nodes carry no `@context` so all of them can sit inside a single `@graph`.
 */
const organizationNode = {
  "@type": ["Organization", "FinancialService"],
  "@id": ORGANIZATION_ID,
  name: SITE.legal,
  url: SITE.origin,
  logo: `${SITE.origin}/images/logo-122.png`,
  telephone: "+1-866-818-7243",
  description: ORG_DESCRIPTION,
  areaServed: { "@type": "Country", name: "US" },
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.city,
    addressRegion: SITE.state,
    addressCountry: "US",
    ...(ORG_OPTIONAL.streetAddress ? { streetAddress: ORG_OPTIONAL.streetAddress } : {}),
    ...(ORG_OPTIONAL.postalCode ? { postalCode: ORG_OPTIONAL.postalCode } : {}),
  },
  ...(ORG_OPTIONAL.email ? { email: ORG_OPTIONAL.email } : {}),
  ...(ORG_OPTIONAL.founder ? { founder: { "@type": "Person", name: ORG_OPTIONAL.founder } } : {}),
  ...(ORG_OPTIONAL.sameAs?.length ? { sameAs: ORG_OPTIONAL.sameAs } : {}),
};

const webSiteNode = {
  "@type": "WebSite",
  "@id": `${SITE.origin}/#website`,
  url: SITE.origin,
  name: SITE.name,
  inLanguage: "en-US",
  publisher: { "@id": ORGANIZATION_ID },
};

const financialProductNode = {
  "@type": "FinancialProduct",
  "@id": `${SITE.origin}/#silver-ira`,
  name: "Self-Directed Silver IRA",
  provider: { "@id": ORGANIZATION_ID },
  feesAndCommissionsSpecification:
    "AET Custodian Fee: $50 setup, then $200/year flat. IDS of Delaware Storage: $12/month ($144/year flat). Dealer premium: maximum 15% over spot.",
  description:
    "IRS-approved physical Silver IRA backed by secured vaults at IDS of Delaware with American Estate & Trust (AET) as custodian.",
};

export const rootSchemaGraph = {
  "@context": "https://schema.org",
  "@graph": [organizationNode, webSiteNode, financialProductNode],
};

/**
 * Social card image, shared by the root metadata and every route's pageMeta.
 *
 * Hosted on our own origin (public/images/og-default.png, 1200×630) so link
 * unfurlers never depend on a third-party preview bucket, and so the asset is
 * covered by the same `_headers` rules as the rest of the site.
 */
export const OG_IMAGE = `${SITE.origin}/images/og-default.png`;

type OgType = "website" | "article";

/**
 * Standard metadata helper so every route ships unique, self-referencing tags.
 *
 * `title` is returned bare — the root layout's `title.template` appends
 * "| Anchor Silver Capital", so page titles must never repeat the brand
 * themselves. Social titles are branded here explicitly because a child
 * route's `openGraph` object *replaces* the root one rather than merging
 * into it (verified on the live site), so `siteName`, `locale`, the card
 * style and the image all have to be set per route.
 */
export function pageMeta({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: OgType;
}): Metadata {
  const socialTitle = `${title} | ${SITE.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle,
      description,
      type,
      url: `${SITE.origin}${path}`,
      siteName: SITE.name,
      locale: "en_US",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [OG_IMAGE],
    },
  };
}
