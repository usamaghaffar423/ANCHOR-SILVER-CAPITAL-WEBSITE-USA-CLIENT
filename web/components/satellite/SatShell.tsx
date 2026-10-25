import type { ReactNode } from "react";
import Link from "next/link";
import { SatLogoMark } from "@/components/satellite/SatLogoMark";
import { SatSister } from "@/components/satellite/SatSister";
import { PUBLISHER, type SatSite } from "@/lib/satellites";

/** Header + footer for a standalone price site, including the visible sponsor/ownership disclosure. */
export function SatShell({ site, children }: { site: SatSite; children: ReactNode }) {
  const [first, ...rest] = site.wordmark.split(" ");
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
              <Link href="/contact">Contact</Link>
              <Link href="/disclosure">Disclosure</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </nav>
            <p style={{ marginTop: 10 }}>
              © {new Date().getFullYear()} {PUBLISHER}
            </p>
          </div>
          <SatSister site={site} />
        </div>
      </footer>
    </>
  );
}
