import { NextResponse } from "next/server";
import { robotsTxt } from "@/lib/crawl";
import { SAT_SITES, isSatelliteHost } from "@/lib/satellites";

export const dynamic = "force-dynamic";
const site = SAT_SITES.silver;

/** Served only on this site's own host (the Worker rewrites /robots.txt here). Same rules as every other host. */
export function GET(req: Request) {
  if (!isSatelliteHost(site, req.headers.get("host"))) {
    return new NextResponse("Not found", { status: 404 });
  }
  return new NextResponse(robotsTxt(site.origin), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
