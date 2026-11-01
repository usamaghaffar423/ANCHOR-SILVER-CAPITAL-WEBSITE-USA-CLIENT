import { NextResponse } from "next/server";
import { SAT_SITEMAP_ENTRIES, sitemapXml } from "@/lib/crawl";
import { SAT_SITES, isSatelliteHost } from "@/lib/satellites";

export const dynamic = "force-dynamic";
const site = SAT_SITES.silver;

/** This site's own pages only, absolute https URLs on its own domain, real last-modified dates. */
export function GET(req: Request) {
  if (!isSatelliteHost(site, req.headers.get("host"))) {
    return new NextResponse("Not found", { status: 404 });
  }
  return new NextResponse(sitemapXml(site.origin, "silver", SAT_SITEMAP_ENTRIES), {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
}
