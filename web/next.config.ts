import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure the brochure PDFs are bundled into the /api/lead serverless function
  // so it can attach them at runtime (they live outside `public/`, which is not
  // traced into function bundles).
  outputFileTracingIncludes: {
    "/api/lead": ["./brochures/**"],
  },
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
};

export default nextConfig;
