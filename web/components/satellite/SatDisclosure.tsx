import Link from "next/link";
import { SatShell } from "@/components/satellite/SatShell";
import { PUBLISHER, assertSatelliteHost, type SatSite } from "@/lib/satellites";

/**
 * Ownership and advertising disclosure. Plain statement of who owns the site and
 * who the advertiser is; linked from the footer of every page.
 */
export async function SatDisclosure({ site }: { site: SatSite }) {
  await assertSatelliteHost(site);
  return (
    <SatShell site={site}>
      <article className="sat-legal">
        <h1>Ownership and advertising disclosure</h1>
        <p>
          {site.host} is owned and operated by {PUBLISHER}, a dealer of physical gold and silver that
          also helps savers set up self-directed precious metals IRAs.
        </p>
        <p>
          The advertisements on this site promote{" "}
          {PUBLISHER}&apos;s own products and services and lead to its website. They are
          advertising by the site&apos;s owner, not independent recommendations or reviews.
        </p>
        <p>
          Prices are shown as received from gold-api.com, are indicative only, and are not quotes or
          offers to buy or sell. See the <Link href="/terms">terms of use</Link> and the{" "}
          <Link href="/privacy">privacy policy</Link>. To reach us, use the{" "}
          <Link href="/contact">contact page</Link>.
        </p>
      </article>
    </SatShell>
  );
}
