import type { Metadata } from "next";

export const SITE = {
  name: "Anchor Silver Capital",
  legal: "Anchor Silver Capital LLC",
  tagline: "Steady Ground. Rising Value.",
  phone: "(866) 818-7243",
  phoneHref: "tel:+18668187243",
  email: "info@anchorsilvercapital.com",
  street: "2450 Colorado Avenue, Suite 300",
  city: "Santa Monica",
  state: "CA",
  zip: "90404",
  origin: "https://anchorsilvercapital.com",
  hours: "Monday–Friday 8am–6pm Pacific",
} as const;

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
  "/get-started",
  "/faq",
  "/market-update",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
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
  geo: { "@type": "GeoCoordinates", latitude: 34.0195, longitude: -118.4695 },
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
