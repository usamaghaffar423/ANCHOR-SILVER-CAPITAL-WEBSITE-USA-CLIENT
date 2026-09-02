import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure the brochure PDFs are bundled into the /api/lead serverless function
  // so it can attach them at runtime (they live outside `public/`, which is not
  // traced into function bundles).
  outputFileTracingIncludes: {
    "/api/lead": ["./brochures/**"],
  },
};

export default nextConfig;
