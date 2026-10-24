import type { NextConfig } from "next";
import { SAT_SITES } from "./lib/satellite-hosts";

/** Host as a regex fragment (dots escaped) for `has` matchers. */
const hostRegex = (host: string) => host.replace(/\./g, "\\.");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Matches the site's real breakpoints (max content width 1152px / max-w-6xl,
    // plus full-bleed banners up to ~2400px on large desktops) so mobile never
    // downloads a source built for a 4000px+ landscape shot.
    deviceSizes: [400, 640, 750, 828, 1080, 1200, 1536, 1920, 2400],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Next 16 only serves qualities in this allowlist (default [75]) — every
    // <Image quality={78}> in components/site/{Banner,ImageFrame,Gallery}.tsx
    // would otherwise be silently coerced back down to 75.
    qualities: [75, 78],
  },
  // GHL/ads still reference the bare `/thank-you` path from older campaigns.
  // `statusCode: 301` (not `permanent: true`) so the status is a true 301.
  async redirects() {
    return [
      // Standalone price sites: force https (the zones do not have Always Use HTTPS
      // on) and fold www into the apex. Same site — not a redirect to anchorsilvercapital.com.
      // `:path` (not `:path*`) because OpenNext does not expand the `*` modifier in an
      // absolute destination. cf-visitor is the header Cloudflare sets on every request.
      ...SAT_SITES.flatMap((s) =>
        // "/" has its own rule: an empty :path does not compile in OpenNext (500).
        [{ source: "/", path: "" }, { source: "/:path(.+)", path: "/:path" }].flatMap((r) => [
          {
            source: r.source,
            has: [
              { type: "host" as const, value: `(www\\.)?${hostRegex(s.host)}` },
              { type: "header" as const, key: "cf-visitor", value: '"scheme":"http"\\}' },
            ],
            destination: `https://${s.host}${r.path || "/"}`,
            statusCode: 301,
          },
          {
            source: r.source,
            has: [{ type: "host" as const, value: `www\\.${hostRegex(s.host)}` }],
            destination: `https://${s.host}${r.path || "/"}`,
            statusCode: 301,
          },
        ]),
      ),
      {
        source: "/thank-you",
        destination: "/thank-you-handbook",
        statusCode: 301,
      },
    ];
  },
  // goldcurrentprice.com / silvercurrentprice.com are separate sites served by this
  // same app: each host is rewritten (not redirected) to its own route tree with its
  // own root layout. /api and /_next stay shared. Unknown paths fall through to the
  // tree and 404 there, so no anchorsilvercapital.com page is ever served on them.
  async rewrites() {
    return {
      beforeFiles: SAT_SITES.flatMap((s) => [
        {
          source: "/",
          has: [{ type: "host" as const, value: s.host }],
          destination: `/${s.internalPath}`,
        },
        {
          // Rules chain, so the already-rewritten internal prefixes must not match again.
          source: "/:path((?!api/|_next/|sat-gold|sat-silver|favicon\\.ico$).+)",
          has: [{ type: "host" as const, value: s.host }],
          destination: `/${s.internalPath}/:path`,
        },
      ]),
      afterFiles: [],
      fallback: [],
    };
  },

  // Applied by OpenNext (`getNextConfigHeaders` in the routing handler) to every
  // SSR/HTML route. Static files under public/ are served by the ASSETS binding
  // and get the same values from public/_headers instead — keep the two in sync.
  // X-Frame-Options: DENY is safe here: no route frames its own origin (the
  // /guide-success PDF iframe points at a path that is served by ASSETS, which
  // _headers leaves unframed).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
      // Clickjacking protection everywhere EXCEPT the embeddable price widget (/embed on the
      // standalone price sites), which exists to be framed by other sites. The optional
      // sat-xxx/ prefix covers matching after the host rewrite.
      {
        source: "/((?!(?:sat-[a-z]+/)?embed$).*)",
        headers: [{ key: "X-Frame-Options", value: "DENY" }],
      },
      // HTML must never be served from a stale cache. Left alone, Next's own
      // prerender header (`s-maxage=31536000`) lets any intermediary keep one
      // snapshot for a year with no revalidation path — which is how a post-
      // deploy change keeps being served to Bing/Googlebot long after it
      // shipped. Everything that is NOT a rendered document is excluded so it
      // keeps its own lifetime:
      //   _next/static/*  content-hashed bundles -> immutable (public/_headers)
      //   _next/image     optimizer -> a year + SWR (rule below)
      //   api/*           Next's own s-maxage (e.g. /api/market revalidates 60s)
      //   images|assets|favicon.svg|_headers -> static, see public/_headers
      {
        source:
          "/((?!_next/static|_next/image|api/|images/|assets/|favicon\\.svg|_headers).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      // Optimized images had no cache lifetime at all (`must-revalidate`), so
      // every repeat visit re-downloaded them. Source files under public/images
      // are immutable-ish content, so a year + revalidate is safe.
      {
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
