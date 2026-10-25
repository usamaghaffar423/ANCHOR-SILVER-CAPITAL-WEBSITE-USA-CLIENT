import type { Viewport } from "next";
import type { ReactNode } from "react";
import { Playfair_Display } from "next/font/google";
import "@/components/satellite/sat.css";

// Self-hosted at build time by next/font, so visitors' browsers make no request to Google.
const display = Playfair_Display({ subsets: ["latin"], weight: ["600", "700"], display: "swap", variable: "--font-display" });

/** Browser UI colour matches the logo background. */
export const viewport: Viewport = { themeColor: "#092619", colorScheme: "dark" };

/** Root layout for goldcurrentprice.com — independent of the Anchor Silver Capital site chrome. */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`sat-gold ${display.variable}`}>{children}</body>
    </html>
  );
}
