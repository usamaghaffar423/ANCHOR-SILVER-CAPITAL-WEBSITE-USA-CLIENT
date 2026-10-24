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
  const base = `/${site.internalPath}/ad-landscape`;
  return (
    <aside className="sat-ad" aria-label="Advertisement">
      <span className="sat-ad-label">Ad</span>
      <a className="sat-ad-link" href={AD_URL} rel="sponsored noopener">
        <img
          src={`${base}-1600.webp`}
          srcSet={`${base}-800.webp 800w, ${base}-1600.webp 1600w`}
          sizes="(max-width: 720px) calc(100vw - 32px), 680px"
          width={1600}
          height={1066}
          alt="Advertisement: Anchor Silver Capital free Precious Metals IRA Handbook. Get your free copy at anchorsilvercapital.com."
          loading="lazy"
          decoding="async"
        />
      </a>
    </aside>
  );
}
