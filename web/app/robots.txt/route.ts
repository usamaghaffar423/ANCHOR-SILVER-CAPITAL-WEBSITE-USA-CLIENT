import { robotsTxt } from "@/lib/crawl";
import { SITE } from "@/lib/site";

/**
 * robots.txt for anchorsilvercapital.com, built by the same function as the two price sites
 * (lib/crawl.ts) so all three files have the same shape: everyone may crawl except /api/, the AI
 * search agents are named, GPTBot/ClaudeBot are neither listed nor disallowed (Ron has not decided).
 * The price sites' hosts are rewritten to their own robots.txt routes and never reach this one.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(robotsTxt(SITE.origin), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
