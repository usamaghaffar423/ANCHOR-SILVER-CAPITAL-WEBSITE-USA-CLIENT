import { SAT_CONTENT } from "@/lib/satellite-content";
import { kitUrl, type Placement, type SatSite } from "@/lib/satellites";

/** Hero CTA row: one benefit sentence and the primary button, directly under the price card. */
export function SatHeroCta({ site }: { site: SatSite }) {
  const c = SAT_CONTENT[site.key];
  return (
    <div className="sat-herocta">
      <p>{c.benefit}</p>
      <div className="sat-actions">
        <a className="sat-btn" href={kitUrl(site, "hero")} rel="sponsored noopener">
          Get Your Free IRA Kit
        </a>
      </div>
    </div>
  );
}

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
 * Plain banner-style ad unit: an "Ad" label and one clickable creative that
 * links through to the advertiser's IRA page. Who runs the site and who the
 * advertiser is are stated on the Disclosure page (linked from every footer).
 */
export function SatAdUnit({
  site,
  placement,
}: {
  site: SatSite;
  placement: Extract<Placement, "module" | "footer-module">;
}) {
  const c = SAT_CONTENT[site.key];
  return (
    <aside className="sat-ad" aria-label="Advertisement">
      <span className="sat-ad-label">Ad</span>
      <a className="sat-ad-link" href={kitUrl(site, placement)} rel="sponsored noopener">
        <span className="sat-ad-text">{c.sponsor.headline}</span>
        <span className="sat-ad-cta">Get the free IRA kit →</span>
      </a>
    </aside>
  );
}
