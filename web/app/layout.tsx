import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";
import { SITE, localBusinessSchema } from "@/lib/site";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-D92G9EWD3Q";

const OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/bb0d26bede5054ac2c25a7dd6db0cf3b/id-preview-a8032d31--d12d1c21-bb52-4208-81f4-e081d110f3a3.lovable.app-1786907128021.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.origin),
  title: {
    default: SITE.name,
    template: "%s",
  },
  description:
    "Anchor Silver Capital offers Silver IRA rollovers and direct physical silver purchases.",
  authors: [{ name: SITE.legal }],
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
    apple: "/favicon.svg",
  },
  openGraph: {
    siteName: SITE.name,
    type: "website",
    title: SITE.name,
    description:
      "Anchor Silver Capital offers Silver IRA rollovers and direct physical silver purchases.",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description:
      "Anchor Silver Capital offers Silver IRA rollovers and direct physical silver purchases.",
    images: [OG_IMAGE],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
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
