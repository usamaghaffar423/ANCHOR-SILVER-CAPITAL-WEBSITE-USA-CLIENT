import type { ReactNode } from "react";
import Link from "next/link";
import { SatLogoMark } from "@/components/satellite/SatLogoMark";
import { SatNav } from "@/components/satellite/SatNav";
import { SatSister } from "@/components/satellite/SatSister";
import { SAT_SITES, type SatSite } from "@/lib/satellites";

/** Header + footer for a standalone price site. */
export function SatShell({ site, children }: { site: SatSite; children: ReactNode }) {
  const [first, ...rest] = site.wordmark.split(" ");
  const other = site.key === "gold" ? SAT_SITES.silver : SAT_SITES.gold;
  const otherLabel = `${other.metal} Price`;
  const otherHref = `https://${other.host}/`;
  return (
    <>
      <a className="sat-skip" href="#main">
        Skip to content
      </a>
      <header className="sat-header">
        <div className="sat-wrap">
          <Link className="sat-mark" href="/" aria-label={site.wordmark}>
            <SatLogoMark site={site} />
            <span className="sat-mark-text">
              <b>{first}</b> <span>{rest.join(" ")}</span>
            </span>
          </Link>
          <SatNav
            items={[
              { label: `${site.metal} Price`, href: "/" },
              { label: otherLabel, href: otherHref, external: true },
              { label: "Advertise", href: "/advertise" },
            ]}
          />
        </div>
      </header>
      <main id="main" className="sat-wrap">
        {children}
      </main>
      <footer className="sat-footer">
        <div className="sat-wrap sat-footer-grid">
          <div>
            <p>
              Prices are indicative spot prices from gold-api.com, not quotes or offers. Nothing here is
              investment, tax or legal advice. Past prices do not predict future prices.
            </p>
            <nav aria-label="Footer">
              <a href={otherHref}>{otherLabel}</a>
              <Link href="/advertise">Advertise</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </nav>
            <p style={{ marginTop: 10 }}>
              © {new Date().getFullYear()} {site.wordmark}
            </p>
          </div>
          <SatSister site={site} />
        </div>
      </footer>
    </>
  );
}
