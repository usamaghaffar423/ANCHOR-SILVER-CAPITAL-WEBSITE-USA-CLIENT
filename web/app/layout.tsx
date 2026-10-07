import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";
import { ScrollToTop } from "@/components/site/ScrollToTop";
import { SITE, OG_IMAGE, rootSchemaGraph } from "@/lib/site";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-D92G9EWD3Q";

/**
 * Root metadata. Every route that doesn't define its own inherits this; routes
 * that do override `title` (through the template), `description` and
 * `alternates.canonical` via pageMeta(). The root canonical is the home page —
 * so any route without its own canonical would point at `/`, which is why
 * guide-success ships its own metadata too.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.origin),
  title: {
    default: "Anchor Silver Capital | Physical Silver IRA & Precious Metals",
    template: "%s | Anchor Silver Capital",
  },
  description:
    "Protect your retirement with physical Silver IRAs. Transparent fee structure ($50 setup, $200/yr flat AET custodian, $12/mo IDS Delaware storage) and max 15% spot markup.",
  alternates: {
    canonical: "./",
  },
  authors: [{ name: SITE.legal }],
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Anchor Silver Capital | Physical Silver IRA Specialist",
    description:
      "Flat-fee Self-Directed Silver IRAs backed by physical bullion stored at IDS of Delaware.",
    url: SITE.origin,
    siteName: SITE.name,
    locale: "en_US",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anchor Silver Capital",
    description: "Physical Silver IRA Rollovers & Transparent Pricing.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap"
        />
        {/* YMYL entity graph: FinancialService (us) + FinancialProduct (the IRA) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootSchemaGraph) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="overflow-x-clip">
          {children}
        </main>
        <Footer />
        <CookieBanner />
        <ScrollToTop />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
