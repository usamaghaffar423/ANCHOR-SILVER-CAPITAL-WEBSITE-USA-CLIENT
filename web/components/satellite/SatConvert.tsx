import { SAT_CONTENT } from "@/lib/satellite-content";
import { PHONE, PHONE_HREF, kitUrl, type Placement, type SatSite } from "@/lib/satellites";

/** Hero CTA row: one benefit sentence, the primary button and the click-to-call link. */
export function SatHeroCta({ site }: { site: SatSite }) {
  const c = SAT_CONTENT[site.key];
  return (
    <div className="sat-herocta">
      <p>{c.benefit}</p>
      <div className="sat-actions">
        <a className="sat-btn" href={kitUrl(site, "hero")} rel="sponsored noopener">
          Get Your Free IRA Kit
        </a>
        <a className="sat-btn sat-btn-ghost" href={PHONE_HREF}>
          Talk to a Specialist · {PHONE}
        </a>
      </div>
    </div>
  );
}

/** Trust bar. Every marker is taken from copy already published on anchorsilvercapital.com. */
export function SatTrust({ site }: { site: SatSite }) {
  const c = SAT_CONTENT[site.key];
  return (
    <ul className="sat-trust" aria-label="About the sponsor">
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
 * The sponsor module. The SPONSORED label and the disclosure sentence are
 * unchanged from the original placement; bullets and buttons were added.
 */
export function SatSponsorModule({
  site,
  placement,
}: {
  site: SatSite;
  placement: Extract<Placement, "module" | "footer-module">;
}) {
  const c = SAT_CONTENT[site.key];
  return (
    <aside className="sat-sponsor" aria-label="Sponsored">
      <span className="sat-badge">Sponsored</span>
      <h2>{c.sponsor.headline}</h2>
      <p>
        <strong>Sponsored by Anchor Silver Capital</strong>, the publisher of this site.{" "}
        {c.sponsor.text}
      </p>
      <ul className="sat-bullets">
        {c.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <div className="sat-actions">
        <a className="sat-btn" href={kitUrl(site, placement)} rel="sponsored noopener">
          Get Your Free IRA Kit
        </a>
        <a className="sat-btn sat-btn-ghost" href={PHONE_HREF}>
          Talk to a Specialist · {PHONE}
        </a>
      </div>
    </aside>
  );
}
