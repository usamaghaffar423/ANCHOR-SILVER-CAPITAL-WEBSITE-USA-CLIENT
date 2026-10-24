import Script from "next/script";

/**
 * Microsoft Advertising (UET) base tag. Rendered in <head> of both root
 * layouts; the tag ID comes from NEXT_PUBLIC_MS_UET_TAG_ID (inlined at build
 * time) and the tag is skipped entirely when it is unset.
 */
export function UetTag() {
  const tagId = process.env.NEXT_PUBLIC_MS_UET_TAG_ID;
  if (!tagId) return null;
  return (
    <Script
      id="ms-uet"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html:
          `(function(w,d,t,u,o){w[u]=w[u]||[],o.ts=(new Date).getTime();var n=d.createElement(t);n.src="https://bat.bing.net/bat.js?ti="+o.ti+("uetq"!=u?"&q="+u:"");n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&"loaded"!==s&&"complete"!==s||(o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad"),n.onload=n.onreadystatechange=null)};var i=d.getElementsByTagName(t)[0];i.parentNode.insertBefore(n,i);})(window,document,"script","uetq",{ti:${JSON.stringify(tagId)},enableAutoSpaTracking:true});`,
      }}
    />
  );
}
