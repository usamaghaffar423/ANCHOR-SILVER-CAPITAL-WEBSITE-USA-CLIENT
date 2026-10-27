import { AD_URL, type SatSite } from "@/lib/satellites";

/**
 * Display ad unit: the advertiser's own image creative under a small "Ad" label.
 * The whole image is one link to the advertiser's IRA kit page (plain URL, no tags).
 *
 * Files are in public/sat-gold|sat-silver (that prefix is excluded from the host
 * rewrite). The square creatives (ad-square-*.webp) are kept for a narrow slot;
 * phones get the square (mid slot) and landscape (bottom slot); larger screens get landscape (mid) and the wide banner (bottom), full-bleed.
 */
/** `bottom` is the wide banner above the footer; `mid` is the larger 3:2 creative in the page body. */
export function SatAdUnit({ site, variant = "mid" }: { site: SatSite; variant?: "mid" | "bottom" }) {
  const wide = `/${site.internalPath}/ad-v2-landscape`;
  const banner = `/${site.internalPath}/ad-v3-banner`;
  const square = `/${site.internalPath}/ad-v2-square`;
  // mid: square on phones, 3:2 landscape on larger screens.
  // bottom: 3:2 landscape on phones (the 13:2.5 banner is unreadable that small), wide banner on larger screens.
  const phone = variant === "bottom" ? wide : square;
  const phoneDims = variant === "bottom" ? { w: 1600, h: 1066 } : { w: 1600, h: 1600 };
  const phoneSizes = variant === "bottom" ? "calc(100vw - 32px)" : "min(560px, calc(100vw - 32px))";
  return (
    <aside className={`sat-ad sat-ad-${variant}`} aria-label="Advertisement">
      <span className="sat-ad-label">Ad</span>
      <a className="sat-ad-link" href={AD_URL} rel="sponsored noopener">
        <picture>
          <source
            media="(max-width: 767.98px)"
            srcSet={`${phone}-${variant === "bottom" ? 800 : 600}.webp ${variant === "bottom" ? 800 : 600}w, ${phone}-${variant === "bottom" ? 1600 : 1200}.webp ${variant === "bottom" ? 1600 : 1200}w`}
            sizes={phoneSizes}
            width={phoneDims.w}
            height={phoneDims.h}
          />
          <img
            src={variant === "bottom" ? `${banner}-1300.webp` : `${wide}-1600.webp`}
            srcSet={
              variant === "bottom"
                ? `${banner}-650.webp 650w, ${banner}-1300.webp 1300w`
                : `${wide}-800.webp 800w, ${wide}-1600.webp 1600w`
            }
            sizes={variant === "bottom" ? "min(100vw, 1600px)" : "min(100vw, 1600px, 135vh)"}
            width={variant === "bottom" ? 1300 : 1600}
            height={variant === "bottom" ? 250 : 1066}
            alt="Advertisement: Anchor Silver Capital free Precious Metals IRA Handbook. Get your free copy at anchorsilvercapital.com."
            loading="lazy"
            decoding="async"
          />
        </picture>
      </a>
    </aside>
  );
}
