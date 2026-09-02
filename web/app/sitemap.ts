import type { MetadataRoute } from "next";
import { PAGES, SITE } from "@/lib/site";

const LASTMOD = "2026-08-16";

const PRIORITY: Record<string, number> = {
  "/": 1.0,
  "/silver-ira": 0.9,
  "/physical-silver": 0.9,
  "/why-silver": 0.8,
  "/get-started": 0.8,
};

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((path) => ({
    url: `${SITE.origin}${path === "/" ? "/" : path}`,
    lastModified: LASTMOD,
    changeFrequency: path === "/market-update" ? "weekly" : "monthly",
    priority: PRIORITY[path] ?? 0.7,
  }));
}
