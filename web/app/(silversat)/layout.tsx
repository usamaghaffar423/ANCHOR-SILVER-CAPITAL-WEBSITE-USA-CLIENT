import type { ReactNode } from "react";
import "@/components/satellite/sat.css";

/** Root layout for silvercurrentprice.com — independent of the Anchor Silver Capital site chrome. */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="sat-silver">{children}</body>
    </html>
  );
}
