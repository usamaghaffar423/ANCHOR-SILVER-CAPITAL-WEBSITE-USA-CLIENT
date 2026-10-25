import { SatAdvertiseForm } from "@/components/satellite/SatAdvertise";
import { SatShell } from "@/components/satellite/SatShell";
import { assertSatelliteHost, type SatSite } from "@/lib/satellites";

/** Advertising inquiries: the only form on the site. No rates, traffic figures or availability are promised. */
export async function SatAdvertisePage({ site }: { site: SatSite }) {
  await assertSatelliteHost(site);
  return (
    <SatShell site={site}>
      <article className="sat-legal">
        <h1>Advertising inquiries</h1>
        <p>
          Interested in advertising on {site.host}? Tell us about your business and what you would like to
          promote. Inquiries are reviewed by the site&apos;s owner, and we reply by email.
        </p>
        <SatAdvertiseForm source={site.source} />
        <p className="sat-note">
          We use the details you enter only to reply to your inquiry; see the privacy policy.
        </p>
      </article>
    </SatShell>
  );
}
