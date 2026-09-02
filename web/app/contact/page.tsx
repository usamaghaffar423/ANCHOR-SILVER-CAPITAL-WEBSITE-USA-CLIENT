import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { CallbackForm } from "@/components/site/CallbackForm";
import { JsonLd } from "@/components/site/JsonLd";
import { Card, H2, Section } from "@/components/site/ui";
import { SITE, breadcrumbSchema, localBusinessSchema, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Contact Anchor Silver Capital — Santa Monica, CA",
  description:
    "Call (866) 818-7243 or email info@anchorsilvercapital.com. Anchor Silver Capital, 2450 Colorado Avenue, Suite 300, Santa Monica, CA 90404. Mon-Fri 8am-6pm Pacific.",
  path: "/contact",
});

export default function Contact() {
  return (
    <>
      <JsonLd data={localBusinessSchema} />
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
              aria-label="Map of 2450 Colorado Avenue, Suite 300, Santa Monica, California"
              className="chart-lines mt-8 flex h-64 items-center justify-center rounded-sm border border-border bg-card text-sm text-muted-foreground"
            >
              Map — Santa Monica, CA 90404
            </div>
          </div>
          <div className="rounded-md bg-card p-6 shadow-[var(--shadow-card)]">
            <CallbackForm variant="simple" submitLabel="Send Message" />
          </div>
        </div>
      </Section>
    </>
  );
}
