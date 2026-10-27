import { Fraunces, Inter } from "next/font/google";

/** Homepage-only fonts (self-hosted by next/font); nothing here touches other pages. */
export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
  variable: "--hp-display",
  fallback: ["Georgia", "serif"],
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--hp-body",
  fallback: ["system-ui", "Arial", "sans-serif"],
});
