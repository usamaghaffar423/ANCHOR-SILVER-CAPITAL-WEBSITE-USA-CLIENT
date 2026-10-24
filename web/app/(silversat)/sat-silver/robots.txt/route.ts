import { NextResponse } from "next/server";
import { SAT_SITES, isSatelliteHost } from "@/lib/satellites";

export const dynamic = "force-dynamic";
const site = SAT_SITES.silver;

export function GET(req: Request) {
  if (!isSatelliteHost(site, req.headers.get("host"))) {
    return new NextResponse("Not found", { status: 404 });
  }
  return new NextResponse(`User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
