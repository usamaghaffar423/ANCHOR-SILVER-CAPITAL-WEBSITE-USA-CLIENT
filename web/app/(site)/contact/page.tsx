import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { GhlFormEmbed } from "@/components/site/GhlFormEmbed";
import { JsonLd } from "@/components/site/JsonLd";
import { Card, H2, Section } from "@/components/site/ui";
import { SITE, breadcrumbSchema, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Contact — Marina del Rey, CA",
  description:
    "Call (866) 818-7243 or email info@anchorsilvercapital.com. Anchor Silver Capital, 475 Washington Blvd., Marina del Rey, CA 90292. Mon-Fri 8am-6pm Pacific.",
  path: "/contact",
});

export default function Contact() {
  return (
    <>
      {/* The FinancialService entity itself lives in the root layout's @graph. */}
      <JsonLd data={breadcrumbSchema("/contact", "Contact")} />
      <PageHero
        eyebrow="Contact"
        title="Get in Touch"
        subtitle="Reach a specialist by phone, email, or callback request. We answer plainly and we don't push."
      />

      <Section>
        <div className="grid gap-5 md:grid-cols-3">
          <Card>
            <h2 className="text-lg">Phone</h2>
            <a href={SITE.phoneHref} className="mt-2 block font-mono text-xl text-primary">
              {SITE.phone}
            </a>
            <p className="mt-2 text-sm text-muted-foreground">{SITE.hours}</p>
          </Card>
          <Card>
            <h2 className="text-lg">Email</h2>
            <a href={`mailto:${SITE.email}`} className="mt-2 block text-primary underline break-all">
              {SITE.email}
            </a>
            <p className="mt-2 text-sm text-muted-foreground">We respond within one business day</p>
          </Card>
          <Card>
            <h2 className="text-lg">Address</h2>
            <address className="mt-2 text-sm not-italic leading-relaxed text-muted-foreground">
              {SITE.legal}
              <br />
              {SITE.street}
              <br />
              {SITE.city}, {SITE.state} {SITE.zip}
            </address>
          </Card>
        </div>
      </Section>

      <Section tone="muted">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <H2>Send Us a Note</H2>
            <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
              Tell us how to reach you and a specialist will follow up. There is no cost and no
              obligation.
            </p>
            <div
              role="img"
              aria-label="Map of 475 Washington Blvd., Marina del Rey, California"
              className="chart-lines mt-8 flex h-64 items-center justify-center rounded-sm border border-border bg-card text-sm text-muted-foreground"
            >
              Map — Marina del Rey, CA 90292
            </div>
          </div>
          <div className="rounded-md bg-card p-6 shadow-[var(--shadow-card)]">
            <GhlFormEmbed
              formId="Mdko5iPIZ5nyZmvORTsp"
              formName="Silver IRA Onboarding Form"
              height={824}
            />
          </div>
        </div>
      </Section>
    </>
  );
}
