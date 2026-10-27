import Script from "next/script";

/** Loads GA4 once site-wide. Renders nothing when `id` (the site's NEXT_PUBLIC_GA_ID* env var) is unset. */
export function GoogleAnalytics({ id }: { id: string | undefined }) {
  if (!id) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
