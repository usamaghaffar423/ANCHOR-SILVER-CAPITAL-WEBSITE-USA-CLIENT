"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";

const NO_CHROME = new Set(["/thank-you-handbook"]);

export function SiteHeader() {
  const path = usePathname();
  if (NO_CHROME.has(path)) return null;
  return <Header />;
}

export function SiteFooter() {
  const path = usePathname();
  if (NO_CHROME.has(path)) return null;
  return <Footer />;
}
