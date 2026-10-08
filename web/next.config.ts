import type { NextConfig } from "next";

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
      {
        source: "/thank-you",
        destination: "/thank-you-handbook",
        statusCode: 301,
      },
    ];
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
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
      // HTML must never be served from a stale cache. Left alone, Next's own
      // prerender header (`s-maxage=31536000`) lets any intermediary keep one
      // snapshot for a year with no revalidation path — which is how a post-
      // deploy change keeps being served to Bing/Googlebot long after it
      // shipped. Hashed `_next/static` bundles are exempt so they stay
      // immutable (see the rule below and public/_headers).
      {
        source: "/((?!_next/static|_next/image).*)",
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
