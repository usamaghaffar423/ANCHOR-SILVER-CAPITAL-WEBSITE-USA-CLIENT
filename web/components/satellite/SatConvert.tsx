import { SAT_CONTENT } from "@/lib/satellite-content";
import { AD_URL, type SatSite } from "@/lib/satellites";

/** Trust bar. Every marker is taken from copy already published on anchorsilvercapital.com. */
export function SatTrust({ site }: { site: SatSite }) {
  const c = SAT_CONTENT[site.key];
  return (
    <ul className="sat-trust" aria-label="About the advertised service">
      {c.trust.map((t) => (
        <li key={t.label}>
          <span>{t.label}</span>
          <b>{t.value}</b>
        </li>
      ))}
    </ul>
  );
}

/**
 * Display ad unit: the advertiser's own image creative under a small "Ad" label.
 * The whole image is one link to the advertiser's IRA kit page (plain URL, no tags). Who
 * owns the site is on the Disclosure page, linked from every footer.
 *
 * Files are in public/sat-gold|sat-silver (that prefix is excluded from the host
 * rewrite). The square creatives (ad-square-*.webp) are kept for a narrow slot;
 * the layout has none, so only the landscape one renders.
 */
export function SatAdUnit({ site }: { site: SatSite }) {
  const wide = `/${site.internalPath}/ad-v2-landscape`;
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
            src={`${wide}-1600.webp`}
            srcSet={`${wide}-800.webp 800w, ${wide}-1600.webp 1600w`}
            sizes="(min-width: 1072px) 1040px, calc(100vw - 32px)"
            width={1600}
            height={1066}
            alt="Advertisement: Anchor Silver Capital free Precious Metals IRA Handbook. Get your free copy at anchorsilvercapital.com."
            loading="lazy"
            decoding="async"
          />
        </picture>
      </a>
    </aside>
  );
}
