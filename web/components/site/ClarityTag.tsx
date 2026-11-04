import Script from "next/script";
import { OPT_OUT_INLINE_CHECK } from "@/lib/consent-inline";

/**
 * Microsoft Clarity (the Bing Webmaster Tools project), once per page, for every root layout that serves anchorsilvercapital.com.
 * Loaded via next/script after the page is interactive, then at the browser's next idle moment (at most ~3 s),
 * so short visits are still recorded and the tag never competes with first paint.
 *
 * - ID: NEXT_PUBLIC_CLARITY_ID (defaults to z89ewqwp8p when unset). Set it to an EMPTY string to switch
 *   this tag off, for example while the UET-Clarity link in Microsoft Ads is still on, so Clarity is never loaded twice.
 * - Never loaded for a visitor who has opted out (Decline, Your Privacy Choices, Global Privacy Control);
 *   if they opt out later, lib/consent-state.ts calls clarity('consent', false).
 * - Skips itself if Clarity is already on the page when it runs. That is timing-dependent: while the UET-Clarity
 *   link in Microsoft Ads is still on, both tags can load (one clarity.js library, two tag requests). Turn the link
 *   OFF in Microsoft Ads/Clarity, or set the ID empty, so Clarity is recorded once.
 * - Every form carries data-clarity-mask="true", so name, email and phone are never recorded.
 */
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? "z89ewqwp8p";

export function ClarityTag() {
  if (!CLARITY_ID) return null;
  return (
    <Script
      id="clarity-loader"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html:
          `(function(){if(${OPT_OUT_INLINE_CHECK})return;` +
          `function load(){if(window.clarity||document.querySelector('script[src*="clarity.ms/tag/"]'))return;` +
          `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script",${JSON.stringify(CLARITY_ID)})}` +
          `if('requestIdleCallback' in window)requestIdleCallback(load,{timeout:3000});else setTimeout(load,3000)})();`,
      }}
    />
  );
}
