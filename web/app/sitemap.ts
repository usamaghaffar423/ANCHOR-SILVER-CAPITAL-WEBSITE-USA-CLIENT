import type { MetadataRoute } from "next";
import { feesReady, FEES, liveQuestionPages } from "@/content/aeo";
import { lastmodFor } from "@/lib/crawl";
import { PAGES, SITE } from "@/lib/site";

/**
 * Every public route in PAGES ships with its own crawl directives. Editorial
 * frequency reflects how often the page actually changes: the home page and the
 * market feed move daily, the sales/education pages weekly, the legal pages
 * never change outside of a policy revision.
 *
 * `/home-v1` (archived, noindex) is not in PAGES, so it stays out of the index.
 */
const DIRECTIVE: Record<string, { changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = {
  "/": { changeFrequency: "daily", priority: 1.0 },
  "/silver-ira": { changeFrequency: "weekly", priority: 0.9 },
  "/physical-silver": { changeFrequency: "weekly", priority: 0.9 },
  "/why-silver": { changeFrequency: "weekly", priority: 0.8 },
  "/faq": { changeFrequency: "weekly", priority: 0.8 },
  "/get-started": { changeFrequency: "weekly", priority: 0.8 },
  "/buyinggoldandsilver": { changeFrequency: "weekly", priority: 0.7 },
  "/silver-supply": { changeFrequency: "weekly", priority: 0.7 },
  "/silver-price-per-ounce": { changeFrequency: "daily", priority: 0.8 },
  "/gold-price-per-ounce": { changeFrequency: "daily", priority: 0.8 },
  "/market-update": { changeFrequency: "daily", priority: 0.7 },
  "/about": { changeFrequency: "monthly", priority: 0.7 },
  "/contact": { changeFrequency: "monthly", priority: 0.6 },
  "/disclaimer": { changeFrequency: "monthly", priority: 0.5 },
  "/riskdisclosure": { changeFrequency: "monthly", priority: 0.5 },
  "/guide-success": { changeFrequency: "monthly", priority: 0.3 },
  "/terms": { changeFrequency: "monthly", priority: 0.4 },
  "/privacy": { changeFrequency: "monthly", priority: 0.4 },
  "/privacy-choices": { changeFrequency: "yearly", priority: 0.3 },
  "/sms-consent": { changeFrequency: "yearly", priority: 0.3 },
};

/**
 * Public routes that must never be listed: confirmation / thank-you pages (they are also noindex),
 * and anything flagged off until its content is approved (fees, the AEO question pages). Add a
 * route here, or leave it out of PAGES, until it is live.
 */
const NOT_LISTED = new Set<string>(["/guide-success"]);

const FALLBACK = { changeFrequency: "monthly" as const, priority: 0.7 };

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = PAGES.filter((path) => !NOT_LISTED.has(path)).map((path) => {
    const lastModified = lastmodFor("anchor", path);
    return {
      url: `${SITE.origin}${path}`,
      // Real source date (scripts/gen-lastmod.mjs), never "now": omitted if no date is known.
      ...(lastModified ? { lastModified } : {}),
      ...(DIRECTIVE[path] ?? FALLBACK),
    };
  });

  // Flagged-off AEO pages join the sitemap only once they are live (content/aeo.ts), dated by their own "last updated".
  const live: MetadataRoute.Sitemap = [
    ...(feesReady() ? [{ url: `${SITE.origin}/fees`, lastModified: parseUpdated(FEES.lastUpdated), changeFrequency: "monthly" as const, priority: 0.7 }] : []),
    ...liveQuestionPages().map((p) => ({
      url: `${SITE.origin}/${p.slug}`,
      lastModified: parseUpdated(p.lastUpdated),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
  return [...pages, ...live];
}

/** "November 2026" / "November 12, 2026" -> ISO date for <lastmod>; undefined when it cannot be read. */
function parseUpdated(text: string | null): string | undefined {
  if (!text) return undefined;
  const d = new Date(text);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}
