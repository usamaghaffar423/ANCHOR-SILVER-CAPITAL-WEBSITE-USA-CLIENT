/**
 * Microsoft Advertising (UET) base tag. Rendered in <head> of both root
 * layouts as a plain inline <script> in the server HTML (not next/script), so
 * Microsoft's tag check and Tag Helper see it without running any JavaScript.
 * bat.js itself loads async, so this does not block rendering.
 *
 * The tag ID comes from NEXT_PUBLIC_MS_UET_TAG_ID (inlined at build time); the
 * fallback is the current tag so a build without the variable still ships it.
 * The second script is Microsoft's "set pid" snippet with the values left empty: the real
 * visitor email/phone are pushed by lib/lead.ts from an actual form submission
 * (enhanced conversions), never as placeholders here.
 */
const DEFAULT_TAG_ID = "187283042";

export function UetTag() {
  const tagId = process.env.NEXT_PUBLIC_MS_UET_TAG_ID || DEFAULT_TAG_ID;
  return (
    <>
      <script
        id="ms-uet"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,t,u,o){w[u]=w[u]||[],o.ts=(new Date).getTime();var n=d.createElement(t);n.src="https://bat.bing.net/bat.js?ti="+o.ti+("uetq"!=u?"&q="+u:"");n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&"loaded"!==s&&"complete"!==s||(o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad"),n.onload=n.onreadystatechange=null)};var i=d.getElementsByTagName(t)[0];i.parentNode.insertBefore(n,i);})(window,document,"script","uetq",{ti:${JSON.stringify(tagId)},enableAutoSpaTracking:true});`,
        }}
      />
      <script
        id="ms-uet-pid"
        dangerouslySetInnerHTML={{
          __html: `window.uetq=window.uetq||[];window.uetq.push('set',{'pid':{'em':'','ph':''}});`,
        }}
      />
    </>
  );
}
