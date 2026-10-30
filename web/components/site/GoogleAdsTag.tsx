/**
 * Google Ads tag (gtag.js, AW-…) as a literal inline script in the server HTML
 * <head>, so Google's tag check sees it without running JavaScript. Used by the
 * landing-page layout, which has no other Google tag. The main site layout adds
 * the same ID to its single deferred gtag.js instead (components/site/Analytics.tsx),
 * so no page loads gtag.js twice.
 *
 * ID: NEXT_PUBLIC_GOOGLE_ADS_ID (inlined at build time); falls back to the
 * current account so a build without the variable still ships the tag.
 */
import { OPT_OUT_INLINE_CHECK } from "@/lib/consent-inline";

export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-18499251240";

export function GoogleAdsTag() {
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`} />
      <script
        id="google-ads"
        dangerouslySetInnerHTML={{
          // Opt-out is declared before gtag('config') so Google ads features start denied (lib/consent.ts).
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}if(${OPT_OUT_INLINE_CHECK})gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});gtag('js',new Date());gtag('config',${JSON.stringify(GOOGLE_ADS_ID)});`,
        }}
      />
    </>
  );
}
