import type { ReactNode } from "react";
import "./landing.css";
import { UetTag } from "@/components/site/UetTag";
import { GoogleTag } from "@/components/site/GoogleTag";
import { ClarityTag } from "@/components/site/ClarityTag";
import { PrivacyConsent } from "@/components/site/PrivacyConsent";

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
        <link rel="icon" href="/images/favicon-anchor.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        {/* Fonts are self-hosted (landing.css @font-face); the body font loads first so text does not reflow. */}
        <link rel="preload" href="/fonts/landing/public-sans-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        <PrivacyConsent />
        <GoogleTag />
        <ClarityTag />
      </body>
    </html>
  );
}
