import { SAT_SITES } from "@/lib/satellites";

/**
 * `/favicon.ico` answers per host. Cloudflare's static-asset layer would otherwise
 * serve one shared file for every domain on this Worker, which showed Anchor Silver
 * Capital's icon on the standalone price sites. Each host is sent to its own icon.
 */
export const dynamic = "force-dynamic";

export function GET(req: Request) {
  const host = (req.headers.get("host") ?? "").toLowerCase().replace(/:\d+$/, "").replace(/^www\./, "");
  const site = Object.values(SAT_SITES).find((s) => s.host === host);
  const location = site ? `/${site.internalPath}/favicon.ico` : "/images/favicon-anchor.ico";
  return new Response(null, {
    status: 301,
    headers: { Location: location, "Cache-Control": "public, max-age=86400" },
  });
}
