import type { ReactNode } from "react";
import "./landing.css";
import { UetTag } from "@/components/site/UetTag";

/**
 * Bare root layout for the standalone gold-silver-ira landing page.
 *
 * Deliberately NOT wrapped in the site template: no site Header, Footer,
 * Analytics, or CookieBanner — the landing page keeps its own header/footer
 * so there is no site navigation to lead people away, and no tracking beyond
 * the UET tag (Landing_Page_Dev_Instructions.md §1, §4).
 */
export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <UetTag />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600&family=Public+Sans:wght@400;500;600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
