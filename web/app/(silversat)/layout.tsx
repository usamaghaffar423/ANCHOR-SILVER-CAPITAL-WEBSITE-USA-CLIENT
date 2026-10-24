import type { ReactNode } from "react";
import { Fraunces } from "next/font/google";
import "@/components/satellite/sat.css";

// Self-hosted at build time by next/font, so visitors' browsers make no request to Google.
const display = Fraunces({ subsets: ["latin"], weight: ["500", "600", "700"], display: "swap", variable: "--font-display" });

/** Root layout for silvercurrentprice.com — independent of the Anchor Silver Capital site chrome. */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`sat-silver ${display.variable}`}>{children}</body>
    </html>
  );
}
