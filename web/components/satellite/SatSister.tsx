import { SatLogoMark } from "@/components/satellite/SatLogoMark";
import { SAT_SITES, type SatSite } from "@/lib/satellites";

/** Footer cross-promo: the other price site, with its own logo tile. */
export function SatSister({ site }: { site: SatSite }) {
  const other = site.key === "gold" ? SAT_SITES.silver : SAT_SITES.gold;
  const metal = other.metal.toLowerCase();
  return (
    <aside className="sat-sister" aria-label="Our sister site">
      <span className="sat-sister-logo" style={{ background: other.logo.tile }}>
        <SatLogoMark site={other} size={36} />
      </span>
      <div>
        <p className="sat-sister-eyebrow">Our sister site</p>
        <h2>Also tracking {metal}?</h2>
        <p>Check the current price of {metal}, any time.</p>
        <a className="sat-btn sat-btn-sm" href={`https://${other.host}/`}>
          {other.wordmark} →
        </a>
      </div>
    </aside>
  );
}
