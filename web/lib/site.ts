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

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: SITE.legal,
  alternateName: SITE.name,
  url: SITE.origin,
  telephone: "+1-866-818-7243",
  email: SITE.email,
  logo: `${SITE.origin}/favicon.svg`,
  image: `${SITE.origin}/favicon.svg`,
  priceRange: "$$$",
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

type OgType = "website" | "article";

/**
 * Standard metadata helper so every route ships unique, self-referencing tags.
 * Ported from the source `pageHead()` head() helper.
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
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type,
      url: `${SITE.origin}${path}`,
    },
    twitter: {
      title,
      description,
    },
  };
}
