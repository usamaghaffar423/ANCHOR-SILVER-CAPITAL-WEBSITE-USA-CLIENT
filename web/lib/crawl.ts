/**
 * Shared crawler rules and sitemap helpers for all three sites (anchorsilvercapital.com and the
 * two price sites). Server-safe, no React.
 */
import lastmodData from "@/lib/generated/lastmod.json";

/**
 * AI search / answer agents allowed explicitly (Ron's worksheet). GPTBot and ClaudeBot (training
 * crawlers) are deliberately NOT listed and NOT disallowed: Ron has not decided, so they follow `*`.
 */
export const AI_SEARCH_AGENTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
] as const;

/** robots.txt body for a host: everyone allowed, /api/ off-limits, AI search agents named, sitemap on this host. */
export function robotsTxt(origin: string): string {
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "",
    ...AI_SEARCH_AGENTS.map((a) => `User-agent: ${a}`),
    "Allow: /",
    "Disallow: /api/",
    "",
    `Sitemap: ${origin}/sitemap.xml`,
    "",
  ].join("\n");
}

type Group = "anchor" | "gold" | "silver";
const LASTMOD = lastmodData as Record<Group, Record<string, string>>;

/** Date (YYYY-MM-DD) the page's source last changed, from lib/generated/lastmod.json (built by scripts/gen-lastmod.mjs). */
export function lastmodFor(group: Group, path: string): string | undefined {
  return LASTMOD[group]?.[path];
}

export type SitemapEntry = { path: string; changefreq: string; priority: number };

/** Sitemap XML for one host: absolute https URLs on `origin` only. `lastmod` is omitted when no real date is known. */
export function sitemapXml(origin: string, group: Group, entries: SitemapEntry[]): string {
  const urls = entries
    .map((e) => {
      const last = lastmodFor(group, e.path);
      return `  <url>\n    <loc>${origin}${e.path}</loc>${last ? `\n    <lastmod>${last}</lastmod>` : ""}\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority.toFixed(1)}</priority>\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/** Price-site pages that belong in the sitemap (the embed widget is noindex; /contact redirects). */
export const SAT_SITEMAP_ENTRIES: SitemapEntry[] = [
  { path: "/", changefreq: "hourly", priority: 1.0 },
  { path: "/advertise", changefreq: "yearly", priority: 0.3 },
  { path: "/privacy", changefreq: "yearly", priority: 0.2 },
  { path: "/terms", changefreq: "yearly", priority: 0.2 },
];
