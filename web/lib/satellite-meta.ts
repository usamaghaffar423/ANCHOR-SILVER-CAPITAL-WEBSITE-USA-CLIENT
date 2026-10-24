import type { Metadata } from "next";
import { SAT_CONTENT } from "@/lib/satellite-content";
import type { SatSite } from "@/lib/satellites";

const favicon = (color: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="${color}"/></svg>`,
  )}`;

const accent = (site: SatSite) => (site.key === "gold" ? "#e3b341" : "#475562");

/** Metadata for a price site's home page; canonical points at ITSELF. */
export function satHomeMeta(site: SatSite): Metadata {
  const c = SAT_CONTENT[site.key];
  // Static, branded 1200x630 image in public/<internalPath>/og.png (excluded from the host rewrite).
  const og = `${site.origin}/${site.internalPath}/og.png`;
  return {
    metadataBase: new URL(site.origin),
    title: { absolute: c.title },
    description: c.description,
    keywords: c.keywords,
    alternates: { canonical: `${site.origin}/` },
    icons: { icon: favicon(accent(site)) },
    openGraph: {
      type: "website",
      url: `${site.origin}/`,
      siteName: site.wordmark,
      title: c.title,
      description: c.description,
      locale: "en_US",
      images: [{ url: og, width: 1200, height: 630, alt: c.h1 }],
    },
    twitter: { card: "summary_large_image", title: c.title, description: c.description, images: [og] },
    robots: { index: true, follow: true },
  };
}

/** Metadata for the small legal pages (self-canonical, kept out of the index). */
export function satLegalMeta(site: SatSite, kind: "privacy" | "terms"): Metadata {
  const title = kind === "privacy" ? `Privacy | ${site.wordmark}` : `Terms of use | ${site.wordmark}`;
  return {
    metadataBase: new URL(site.origin),
    title: { absolute: title },
    description: `${kind === "privacy" ? "Privacy policy" : "Terms of use"} for ${site.host}.`,
    alternates: { canonical: `${site.origin}/${kind}` },
    icons: { icon: favicon(accent(site)) },
    robots: { index: false, follow: true },
  };
}
