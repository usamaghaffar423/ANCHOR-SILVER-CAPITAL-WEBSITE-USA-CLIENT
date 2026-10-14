import type { ReactNode } from "react";
import "./landing.css";

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
        {/* DEV: paste the Microsoft UET tag here */}
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
