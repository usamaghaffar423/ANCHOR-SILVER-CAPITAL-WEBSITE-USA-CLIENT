import Script from "next/script";

/**
 * GA4 for one price site (each domain has its own measurement ID, from env). Loads on page load
 * (afterInteractive) so every page view counts without the visitor having to interact first.
 * Renders nothing when `id` (the site's NEXT_PUBLIC_GA_ID_* env var) is unset.
 */
export function GoogleAnalytics({ id }: { id: string | undefined }) {
  if (!id) return null;
  return (
    <>
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(id)});`,
        }}
      />
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
    </>
  );
}
