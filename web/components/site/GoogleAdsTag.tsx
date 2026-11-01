/**
 * Google Ads tag (gtag.js, AW-…) for the landing-page layout, as a literal inline script in the server
 * HTML <head>: the queue and `gtag('config', AW-…)` run immediately, and the script text names the
 * gtag.js URL, so a tag check that reads the HTML sees the tag without running JavaScript.
 *
 * Only the heavy download is deferred (gtag.js is ~170 KB and ~0.8 s of main-thread work on a phone):
 * it loads on the visitor's first interaction (tap, scroll, key) or 5 s after the page finishes loading,
 * whichever comes first. Everything queued before then is replayed by gtag.js when it arrives.
 *
 * The main site layout adds the same ID to its single deferred gtag.js instead
 * (components/site/Analytics.tsx), so no page loads gtag.js twice.
 *
 * ID: NEXT_PUBLIC_GOOGLE_ADS_ID (inlined at build time); falls back to the current account so a build
 * without the variable still ships the tag.
 */
import { OPT_OUT_INLINE_CHECK } from "@/lib/consent-inline";

export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-18499251240";

export function GoogleAdsTag() {
  const src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
  return (
    <script
      id="google-ads"
      dangerouslySetInnerHTML={{
        // Opt-out is declared before gtag('config') so Google ads features start denied (lib/consent.ts).
        __html:
          `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}` +
          `if(${OPT_OUT_INLINE_CHECK})gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});` +
          `gtag('js',new Date());gtag('config',${JSON.stringify(GOOGLE_ADS_ID)});` +
          `(function(){var loaded=false,ev=['pointerdown','keydown','scroll','touchstart'];` +
          `function load(){if(loaded)return;loaded=true;ev.forEach(function(e){removeEventListener(e,load)});` +
          `var s=document.createElement('script');s.async=true;s.src=${JSON.stringify(src)};document.head.appendChild(s)}` +
          `ev.forEach(function(e){addEventListener(e,load,{once:true,passive:true})});` +
          `function later(){setTimeout(load,5000)}` +
          `if(document.readyState==='complete')later();else addEventListener('load',later)})();`,
      }}
    />
  );
}
