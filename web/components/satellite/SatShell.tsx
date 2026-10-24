import type { ReactNode } from "react";
import Link from "next/link";
import { PHONE, PHONE_HREF, PUBLISHER, PUBLISHER_URL, kitUrl, type SatSite } from "@/lib/satellites";

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
          <Link className="sat-mark" href="/">
            {first} <span>{rest.join(" ")}</span>
          </Link>
          <div className="sat-header-actions">
            <a className="sat-phone" href={PHONE_HREF} aria-label={`Call ${PHONE}`}>
              {PHONE}
            </a>
            <a className="sat-btn sat-btn-sm" href={kitUrl(site, "header")} rel="sponsored noopener">
              Free IRA Kit
            </a>
          </div>
        </div>
      </header>
      <main id="main" className="sat-wrap">
        {children}
      </main>
      <footer className="sat-footer">
        <div className="sat-wrap">
          <p>
            <strong>Disclosure:</strong> {site.host} is published by {PUBLISHER}, which also sponsors
            the advertisement on this page. Sponsored placements are labeled as such and are paid for
            by the publisher.
          </p>
          <p>
            Prices are indicative spot prices from gold-api.com, not quotes or offers. Nothing here is
            investment, tax or legal advice. Past prices do not predict future prices.
          </p>
          <nav aria-label="Footer">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <a href={PUBLISHER_URL} rel="noopener">
              {PUBLISHER}
            </a>
          </nav>
          <p style={{ marginTop: 10 }}>
            © {new Date().getFullYear()} {PUBLISHER}
          </p>
        </div>
      </footer>
      <nav className="sat-mbar" aria-label="Quick actions">
        <a href={PHONE_HREF}>Call Now</a>
        <a href={kitUrl(site, "mobile-bar")} rel="sponsored noopener" className="primary">
          Free Kit
        </a>
      </nav>
    </>
  );
}
