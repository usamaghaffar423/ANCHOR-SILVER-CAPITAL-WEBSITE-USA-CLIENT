import type { Metadata } from "next";
import { SAT_CONTENT } from "@/lib/satellite-content";
import type { SatSite } from "@/lib/satellites";

/** Emblem favicons generated from the supplied logo (public/sat-xxx/). */
const icons = (site: SatSite): Metadata["icons"] => ({
  icon: [
    { url: `/${site.internalPath}/favicon.svg`, type: "image/svg+xml" },
    { url: `/${site.internalPath}/favicon-32.png`, sizes: "32x32", type: "image/png" },
    { url: `/${site.internalPath}/favicon.ico`, sizes: "48x48" },
  ],
  apple: { url: `/${site.internalPath}/apple-touch-icon.png`, sizes: "180x180" },
});

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
    icons: icons(site),
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

type SmallPage = "privacy" | "terms" | "advertise";

const SMALL_TITLES: Record<SmallPage, [string, string]> = {
  privacy: ["Privacy", "Privacy policy"],
  terms: ["Terms of use", "Terms of use"],
  advertise: ["Advertise", "Advertising inquiries"],
};

/** Metadata for the small pages (self-canonical, indexable). */
export function satLegalMeta(site: SatSite, kind: SmallPage): Metadata {
  const [title, label] = SMALL_TITLES[kind];
  return {
    metadataBase: new URL(site.origin),
    title: { absolute: `${title} | ${site.wordmark}` },
    description: `${label} for ${site.host}.`,
    alternates: { canonical: `${site.origin}/${kind}` },
    icons: icons(site),
    robots: { index: true, follow: true },
  };
}
