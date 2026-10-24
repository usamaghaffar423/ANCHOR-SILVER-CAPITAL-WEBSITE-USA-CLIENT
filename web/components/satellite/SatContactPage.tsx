import { SatContactForm } from "@/components/satellite/SatContact";
import { SatShell } from "@/components/satellite/SatShell";
import { assertSatelliteHost, type SatSite } from "@/lib/satellites";

/** General contact page: a simple name / email / message form. */
export async function SatContactPage({ site }: { site: SatSite }) {
  await assertSatelliteHost(site);
  return (
    <SatShell site={site}>
      <article className="sat-legal">
        <h1>Contact</h1>
        <p>Questions, corrections or feedback about {site.host}? Send us a message and we will reply by email.</p>
        <SatContactForm source={site.source} />
        <p className="sat-note">
          We use the details you enter only to reply to your message; see the privacy policy.
        </p>
      </article>
    </SatShell>
  );
}
