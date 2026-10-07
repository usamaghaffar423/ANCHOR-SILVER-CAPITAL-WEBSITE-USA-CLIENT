import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Search engines get the whole site minus the JSON/API surface. Generative
 * engines (OpenAI, Anthropic, Perplexity crawlers) are allowed explicitly so
 * answer engines can cite anchorsilvercapital.com directly — that explicit
 * group is more specific than the `*` rule, so it is the one those agents match.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot"],
        allow: "/",
      },
    ],
    sitemap: `${SITE.origin}/sitemap.xml`,
  };
}
