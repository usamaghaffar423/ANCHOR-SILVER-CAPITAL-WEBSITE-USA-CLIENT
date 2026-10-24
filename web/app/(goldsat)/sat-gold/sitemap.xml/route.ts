import { NextResponse } from "next/server";
import { SAT_SITES, isSatelliteHost } from "@/lib/satellites";

export const dynamic = "force-dynamic";
const site = SAT_SITES.gold;

export function GET(req: Request) {
  if (!isSatelliteHost(site, req.headers.get("host"))) {
    return new NextResponse("Not found", { status: 404 });
  }
  const now = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${site.origin}/</loc><lastmod>${now}</lastmod><changefreq>hourly</changefreq><priority>1.0</priority></url>
  <url><loc>${site.origin}/contact</loc><lastmod>${now}</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>${site.origin}/disclosure</loc><lastmod>${now}</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
</urlset>
`;
  return new NextResponse(xml, { headers: { "content-type": "application/xml; charset=utf-8" } });
}
