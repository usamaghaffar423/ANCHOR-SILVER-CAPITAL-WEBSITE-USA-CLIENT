import type { MetadataRoute } from "next";
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
  "/market-update": { changeFrequency: "daily", priority: 0.7 },
  "/about": { changeFrequency: "monthly", priority: 0.7 },
  "/contact": { changeFrequency: "monthly", priority: 0.6 },
  "/disclaimer": { changeFrequency: "monthly", priority: 0.5 },
  "/riskdisclosure": { changeFrequency: "monthly", priority: 0.5 },
  "/guide-success": { changeFrequency: "monthly", priority: 0.3 },
  "/terms": { changeFrequency: "monthly", priority: 0.4 },
  "/privacy": { changeFrequency: "monthly", priority: 0.4 },
};

const FALLBACK = { changeFrequency: "monthly" as const, priority: 0.7 };

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PAGES.map((path) => ({
    url: `${SITE.origin}${path}`,
    lastModified,
    ...(DIRECTIVE[path] ?? FALLBACK),
  }));
}
