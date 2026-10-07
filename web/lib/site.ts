import type { Metadata } from "next";

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
  "/contact",
  "/privacy",
  "/terms",
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

const ORGANIZATION_ID = `${SITE.origin}/#organization`;

/**
 * YMYL entity graph injected into <head> on every route: who we are and exactly
 * what the product costs, in machine-readable form for search engines and for
 * answer engines that cite the site directly.
 *
 * The fee strings below are the published schedule — AET $50 setup + $200/year,
 * IDS of Delaware $12/month ($144/year), dealer premium capped at 15% over spot.
 * Change them here and on the Silver IRA / FAQ pages together.
 *
 * Nodes carry no `@context` so both can sit inside a single `@graph`.
 */
const financialServiceNode = {
  "@type": "FinancialService",
  "@id": ORGANIZATION_ID,
  name: SITE.name,
  legalName: SITE.legal,
  alternateName: SITE.legal,
  url: SITE.origin,
  telephone: "+1-866-818-7243",
  email: SITE.email,
  logo: `${SITE.origin}/favicon.svg`,
  image: `${SITE.origin}/favicon.svg`,
  priceRange: "Up to 15% over spot",
  sameAs: [
    "https://www.facebook.com/anchorsilvercapital",
    "https://www.linkedin.com/company/anchorsilvercapital",
    "https://x.com/anchorsilvercap",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.street,
    addressLocality: SITE.city,
    addressRegion: SITE.state,
    postalCode: SITE.zip,
    addressCountry: "US",
  },
  geo: { "@type": "GeoCoordinates", latitude: 33.9803, longitude: -118.4517 },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
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
  "@graph": [financialServiceNode, financialProductNode],
};

/** Social card image, shared by the root metadata and every route's pageMeta. */
export const OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/bb0d26bede5054ac2c25a7dd6db0cf3b/id-preview-a8032d31--d12d1c21-bb52-4208-81f4-e081d110f3a3.lovable.app-1786907128021.png";

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
