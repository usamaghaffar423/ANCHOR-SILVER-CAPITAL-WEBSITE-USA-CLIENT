"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Routes that draw their own header and footer (the site's are not rendered there). */
const OWN_CHROME = new Set(["/thank-you-handbook"]);

export function ChromeGate({ children }: { children: ReactNode }) {
  const path = usePathname();
  return OWN_CHROME.has(path.replace(/\/$/, "") || "/") ? null : <>{children}</>;
}
