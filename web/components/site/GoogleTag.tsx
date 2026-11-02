import Script from "next/script";
import { OPT_OUT_INLINE_CHECK } from "@/lib/consent-inline";

/**
 * The ONE Google tag for anchorsilvercapital.com: a single gtag.js that configures GA4 and Google Ads. It is
 * rendered by every root layout that serves the domain (the main site, which includes the thank-you and
 * confirmation pages, and the landing-page layout), and it loads on page load (afterInteractive, i.e. right
 * after hydration) so every page view is counted whether or not the visitor interacts.
 *
 * Consent mode: a visitor who has opted out (Decline, Your Privacy Choices or Global Privacy Control) starts
 * with analytics and ad storage DENIED, and lib/consent-state.ts keeps it in sync after the page loads.
 *
 * IDs come from env (inlined at build): NEXT_PUBLIC_GA_ID (GA4) and NEXT_PUBLIC_GOOGLE_ADS_ID (Ads); the
 * defaults are the current properties so a build without the variables still ships the tags.
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-D92G9EWD3Q";
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-18499251240";

export function GoogleTag() {
  return (
    <>
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html:
            `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}` +
            `if(${OPT_OUT_INLINE_CHECK})gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});` +
            `gtag('js',new Date());gtag('config',${JSON.stringify(GA_MEASUREMENT_ID)});gtag('config',${JSON.stringify(GOOGLE_ADS_ID)});`,
        }}
      />
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
    </>
  );
}
