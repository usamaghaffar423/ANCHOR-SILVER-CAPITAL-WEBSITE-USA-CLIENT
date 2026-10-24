import { SatShell } from "@/components/satellite/SatShell";
import { PUBLISHER, assertSatelliteHost, type SatSite } from "@/lib/satellites";

const UPDATED = "October 25, 2026";

/** Minimal privacy / terms pages so each price site stands on its own. */
export async function SatLegal({ site, kind }: { site: SatSite; kind: "privacy" | "terms" }) {
  await assertSatelliteHost(site);
  return (
    <SatShell site={site}>
      <article className="sat-legal">
        {kind === "privacy" ? (
          <>
            <h1>Privacy</h1>
            <p>Last updated {UPDATED}.</p>
            <h2>Who publishes this site</h2>
            <p>
              {site.host} is published by {PUBLISHER}, 475 Washington Blvd, Marina del Rey, CA 90292.
              Questions: info@anchorsilvercapital.com.
            </p>
            <h2>What we collect</h2>
            <p>
              This site has no accounts, advertising trackers or analytics scripts, and it sets no
              cookies of its own. The calculator runs entirely in your browser; what you type is never
              sent to us.
            </p>
            <p>
              Like any website, requests are processed by our hosting and security provider
              (Cloudflare), which handles technical data such as your IP address and browser type to
              deliver the page and protect it from abuse.
            </p>
            <h2>Price-alert email signup</h2>
            <p>
              If you sign up for the daily price email, we collect your email address, your IP
              address, the page you signed up from and any campaign tags in the link. They are sent to{" "}
              the customer-management system (GoHighLevel) of {PUBLISHER} and used to send the email you
              asked for. You can unsubscribe at any time using the link in any email.
            </p>
            <h2>Price data</h2>
            <p>
              Prices are fetched by our servers from gold-api.com; your browser does not contact that
              provider.
            </p>
            <h2>Sponsored links</h2>
            <p>
              The sponsored placement links to anchorsilvercapital.com. The link carries tags that
              identify this site as the referrer. Once you leave this site, the privacy policy of
              anchorsilvercapital.com applies.
            </p>
          </>
        ) : (
          <>
            <h1>Terms of use</h1>
            <p>Last updated {UPDATED}.</p>
            <h2>Information only</h2>
            <p>
              {site.host} shows indicative spot prices and educational material. It is not a quote, an
              offer to buy or sell, or investment, tax or legal advice. Dealable prices are set by the
              seller at the time of a transaction.
            </p>
            <h2>No warranty</h2>
            <p>
              Data is provided as is and may be delayed, incomplete or wrong. We do not guarantee its
              accuracy or availability, and we are not liable for decisions made using it. Past prices
              do not indicate future prices, and precious metals can lose value.
            </p>
            <h2>Sponsorship and ownership</h2>
            <p>
              {site.host} is published by {PUBLISHER}, which also sponsors the advertisement shown on
              the site. The sponsored placement is labeled and is a paid advertisement by the
              publisher, not an independent recommendation.
            </p>
            <h2>Use of the site</h2>
            <p>
              Do not scrape, overload or attempt to disrupt the site. Content may not be republished
              without permission. We may change or remove the site at any time.
            </p>
          </>
        )}
      </article>
    </SatShell>
  );
}
