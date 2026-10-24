import type { ReactNode } from "react";
import "@/components/satellite/sat.css";

/** Root layout for goldcurrentprice.com — independent of the Anchor Silver Capital site chrome. */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="sat-gold">{children}</body>
    </html>
  );
}
