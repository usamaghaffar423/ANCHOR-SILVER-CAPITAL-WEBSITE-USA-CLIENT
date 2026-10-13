import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { GhlFormEmbed } from "@/components/site/GhlFormEmbed";
import { JsonLd } from "@/components/site/JsonLd";
import { H2, Section } from "@/components/site/ui";
import { SITE, breadcrumbSchema, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Get Started — Free Silver IRA Consultation",
  description:
    "Request a callback from a silver specialist. No pressure, no hard sell — a straight conversation about whether a Silver IRA or physical silver fits your situation.",
  path: "/get-started",
});

const expectations = [
  "A specialist calls you at the time you choose",
  "They ask a few simple questions about your situation — cash savings or retirement account",
  "They explain honestly whether and how silver fits",
  "If it makes sense, they walk you through next steps",
  "If it doesn't, they tell you that too",
];

export default function GetStarted() {
  return (
    <>
      <JsonLd data={breadcrumbSchema("/get-started", "Get Started")} />
      <PageHero
        eyebrow="Get Started"
        title="Let's Talk About Your Situation."
        subtitle="No pressure. No hard sell. Just a straight conversation about whether silver makes sense for you."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <H2>What to Expect</H2>
            <p className="mt-5 text-base text-muted-foreground">When you reach out, here's what happens:</p>
            <ol className="mt-4 space-y-3">
              {expectations.map((e, i) => (
                <li key={e} className="flex gap-4 text-base leading-relaxed">
                  <span className="font-mono text-sm text-primary">{i + 1}</span>
                  <span>{e}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
              Our minimum for IRA rollovers is $25,000. Our minimum for physical delivery is $5,000.
              If you don't qualify, we'll tell you immediately and point you in the right direction.
            </p>
            <p className="mt-8 text-sm">
              Or call us directly:{" "}
              <a className="font-mono text-lg text-primary underline underline-offset-4" href={SITE.phoneHref}>
                {SITE.phone}
              </a>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Hours: {SITE.hours}</p>
            <p className="mt-8 text-xs uppercase tracking-wider text-muted-foreground">
              American Estate & Trust (AET) · IDS of Delaware
            </p>
          </div>

          <div className="rounded-md bg-card p-6 shadow-[var(--shadow-card)]">
            {/* Static consent disclosure — plain server-rendered text, never a
                gate. The phone field, the required contact-consent box, and the
                optional SMS-marketing box all render inside the live form below
                on initial load; this block documents them for compliance
                reviewers who fetch the raw HTML without JavaScript. */}
            <div className="mb-5 space-y-3 border-b border-border pb-4 text-xs leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-foreground">Contact consent (required):</strong> I agree
                to be contacted about my inquiry by phone call or email, including by automated
                dialing systems.
              </p>
              <p>
                <strong className="text-foreground">SMS marketing consent (optional):</strong>{" "}
                By checking the separate, optional text-message box and submitting this form, you
                provide your express written consent to receive recurring automated marketing and
                promotional text messages from Anchor Silver Capital LLC at the mobile number you
                provide. Consent is not a condition of any purchase, and leaving the box unchecked
                does not affect your inquiry. Message frequency: up to 6 marketing messages per
                month. Message and data rates may apply. Reply STOP to cancel, HELP for help.{" "}
                <Link
                  href="/terms#tcpa-consent"
                  className="whitespace-nowrap text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  [View full consent terms]
                </Link>
              </p>
              <p>
                The form includes a required phone field, the required contact-consent checkbox
                above, and the optional SMS-marketing checkbox — all rendered directly on page
                load with no modal and no click-to-open lock.
              </p>
            </div>
            <GhlFormEmbed
              formId="Mdko5iPIZ5nyZmvORTsp"
              formName="Silver IRA Onboarding Form"
              height={824}
              eager
            />
          </div>
        </div>
      </Section>
    </>
  );
}
