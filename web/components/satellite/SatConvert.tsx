import { SatAdLink } from "@/components/satellite/SatAdLink";
import { AD_URL, SAT_PHONE, type SatSite } from "@/lib/satellites";

const ALT =
  "Thinking about adding Gold and Silver to your IRA? Get our free Precious Metals IRA Handbook at anchorsilvercapital.com or call (866) 818-7243. Metals can lose value and are not FDIC insured. Not tax or investment advice.";

/**
 * Display ad unit: Anchor's banner under a small "Ad" label. The whole image is one link to the
 * plain homepage URL (no UTM). Files are in public/sat-gold|sat-silver (that prefix is
 * excluded from the host rewrite): the wide 3:1 banner for tablets and desktops (>= 768px), the 3:2
 * banner for phones, which also get a tappable phone link (the number in the image is not tappable).
 * `bottom` is above the footer; `mid` is in the page body. Both are below the fold, so lazy-loaded.
 */
export function SatAdUnit({ site, variant = "mid" }: { site: SatSite; variant?: "mid" | "bottom" }) {
  const base = `/${site.internalPath}/banner`;
  return (
    <aside className={`sat-ad sat-ad-${variant}`} aria-label="Advertisement">
      <span className="sat-ad-label">Ad</span>
      <SatAdLink href={AD_URL} site={site.key}>
        <picture>
          <source
            media="(max-width: 767.98px)"
            type="image/avif"
            srcSet={`${base}-mobile-768.avif 768w, ${base}-mobile-1200.avif 1200w`}
            sizes="calc(100vw - 32px)"
          />
          <source
            media="(max-width: 767.98px)"
            type="image/webp"
            srcSet={`${base}-mobile-768.webp 768w, ${base}-mobile-1200.webp 1200w`}
            sizes="calc(100vw - 32px)"
          />
          <source type="image/avif" srcSet={`${base}-wide-800.avif 800w, ${base}-wide-1600.avif 1600w`} sizes="min(100vw, 1600px)" />
          <source type="image/webp" srcSet={`${base}-wide-800.webp 800w, ${base}-wide-1600.webp 1600w`} sizes="min(100vw, 1600px)" />
          <img src={`${base}-wide-1600.webp`} width={1600} height={534} alt={ALT} loading="lazy" decoding="async" />
        </picture>
      </SatAdLink>
      <a className="sat-ad-call" href={`tel:${SAT_PHONE.tel}`}>
        Call {SAT_PHONE.display}
      </a>
    </aside>
  );
}
