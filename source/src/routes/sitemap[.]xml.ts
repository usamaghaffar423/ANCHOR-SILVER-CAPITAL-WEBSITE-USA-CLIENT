import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { PAGES, SITE } from "@/lib/site";

const LASTMOD = "2026-08-16";

const PRIORITY: Record<string, string> = {
  "/": "1.0",
  "/silver-ira": "0.9",
  "/physical-silver": "0.9",
  "/why-silver": "0.8",
  "/get-started": "0.8",
};

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = PAGES.map((path) =>
          [
            "  <url>",
            `    <loc>${SITE.origin}${path === "/" ? "/" : path}</loc>`,
            `    <lastmod>${LASTMOD}</lastmod>`,
            `    <changefreq>${path === "/market-update" ? "weekly" : "monthly"}</changefreq>`,
            `    <priority>${PRIORITY[path] ?? "0.7"}</priority>`,
            "  </url>",
          ].join("\n"),
        );

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls,
          "</urlset>",
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
