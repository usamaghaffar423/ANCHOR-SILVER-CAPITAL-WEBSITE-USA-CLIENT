import { AD_URL, type SatSite } from "@/lib/satellites";

/**
 * Display ad unit: the advertiser's own image creative under a small "Ad" label.
 * The whole image is one link to the advertiser's IRA kit page (plain URL, no tags).
 *
 * Files are in public/sat-gold|sat-silver (that prefix is excluded from the host
 * rewrite). The square creatives (ad-square-*.webp) are kept for a narrow slot;
 * the layout has none, so only the landscape one renders.
 */
/** `bottom` is the wide banner above the footer; `mid` is the larger 3:2 creative in the page body. */
export function SatAdUnit({ site, variant = "mid" }: { site: SatSite; variant?: "mid" | "bottom" }) {
  const wide = `/${site.internalPath}/ad-v2-landscape`;
  const banner = `/${site.internalPath}/ad-v3-banner`;
  const square = `/${site.internalPath}/ad-v2-square`;
  return (
    <aside className="sat-ad" aria-label="Advertisement">
      <span className="sat-ad-label">Ad</span>
      <a className="sat-ad-link" href={AD_URL} rel="sponsored noopener">
        {/* Phones (under 768px) get the small square creative; wider screens get the landscape one at full content width. */}
        <picture>
          <source
            media="(max-width: 767.98px)"
            srcSet={`${square}-600.webp 600w, ${square}-1200.webp 1200w`}
            sizes="min(420px, calc(100vw - 32px))"
            width={1600}
            height={1600}
          />
          <img
            src={variant === "bottom" ? `${banner}-1300.webp` : `${wide}-1600.webp`}
            srcSet={
              variant === "bottom"
                ? `${banner}-650.webp 650w, ${banner}-1300.webp 1300w`
                : `${wide}-800.webp 800w, ${wide}-1600.webp 1600w`
            }
            sizes="(min-width: 1072px) 1040px, calc(100vw - 32px)"
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
