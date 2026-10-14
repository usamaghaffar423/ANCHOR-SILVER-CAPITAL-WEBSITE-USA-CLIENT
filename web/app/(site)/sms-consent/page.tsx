import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/site/PageHero";
import { Prose, Section } from "@/components/site/ui";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "SMS Consent Documentation",
  description:
    "Public verification record for the Anchor Silver Capital SMS Program: website-form and verbal phone opt-in mechanisms, the live contact-form preview, and the representative's verbal consent script.",
  path: "/sms-consent",
});

/**
 * Static, server-rendered compliance page for Twilio toll-free / A2P 10DLC
 * registration review. Everything here ships in the prerendered HTML — no
 * client component, no modal, readable with JavaScript disabled.
 */
export default function SmsConsent() {
  return (
    <>
      <PageHero
        eyebrow="SMS Consent"
        title="SMS Opt-In Documentation"
        subtitle="Public verification record for the Anchor Silver Capital SMS Program."
      />

      <Section>
        <Prose>
          <p>
            <strong>Version 1.0 — Effective Date: October 13, 2026</strong>
          </p>
          <p>
            Anchor Silver Capital LLC, 475 Washington Blvd, Marina del Rey, CA 90292, operates the
            Anchor Silver Capital SMS Program. This page documents every mechanism by which a
            person can opt in to text messages from Anchor Silver Capital LLC, and is readable
            without JavaScript.
          </p>

          <h3>1. Opt-In Mechanism: Website Form</h3>
          <p>
            Our contact form at{" "}
            <a
              href="https://anchorsilvercapital.com/get-started"
              className="text-primary underline underline-offset-4"
            >
              anchorsilvercapital.com/get-started
            </a>{" "}
            renders the phone field and both consent checkboxes directly in the form on initial
            page load — no modal, no click-to-open gate, and no conditional consent lock:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Phone Number (required)</strong> — the mobile number texts will be sent to.
            </li>
            <li>
              <strong>Box 1 — Calls and email consent (required):</strong> &quot;I agree to be
              contacted about my inquiry by phone call or email, including by automated dialing
              systems.&quot;
            </li>
            <li>
              <strong>Box 2 — SMS marketing consent (optional):</strong> &quot;By checking this
              box and submitting this form, I provide my express written consent to receive
              recurring automated marketing and promotional text messages (such as educational
              content, offers, and follow-ups) and appointment and service messages from Anchor
              Silver Capital LLC at the mobile number provided, including messages sent using an
              automated system. Consent is not a condition of any purchase. Message frequency
              varies, up to 6 marketing messages per month. Message and data rates may apply.
              Reply STOP to cancel, HELP for help.&quot;
            </li>
          </ul>
          <p>
            Box 2 is strictly optional: leaving it unchecked still allows successful form
            submission. Every submission records the consent text version, the consent timestamp,
            and the consent IP address.
          </p>

          <figure className="my-8">
            {/* Uncropped screenshot of the live /get-started form: business name
                in the site header, required phone field, and both consent
                checkboxes in their unchecked default state. */}
            <Image
              src="/images/get-started-form-screenshot.png"
              alt="Uncropped screenshot of the live anchorsilvercapital.com/get-started contact form, showing the Anchor Silver Capital header, the required Phone Number field, the required calls-and-email consent checkbox, and the optional SMS-marketing consent checkbox — both unchecked."
              width={1400}
              height={2300}
              className="w-full rounded-md border border-border shadow-[var(--shadow-card)]"
            />
            <figcaption className="mt-3 text-sm italic text-muted-foreground">
              Screenshot of the live contact form at anchorsilvercapital.com/get-started, showing
              the business name, the required phone field, and both consent checkboxes unchecked.
            </figcaption>
          </figure>

          <h3>2. Opt-In Mechanism: Verbal Consent by Phone</h3>
          <p>
            During a call with a representative, a person may agree verbally. The representative
            reads the following script verbatim, and the answer is recorded with the date and time
            before any text is sent to that number:
          </p>
          <blockquote className="border-l-2 border-primary bg-muted px-5 py-4 text-base leading-relaxed italic">
            &quot;Before we wrap up, I&apos;d like to ask your permission to text you. Anchor
            Silver Capital LLC would send recurring automated text messages to this number,
            including educational and promotional messages about precious metals and IRA rollovers,
            plus appointment confirmations and follow-ups. That&apos;s up to six marketing messages
            per month. Message and data rates may apply. Reply HELP for help or STOP to opt out.
            Consent is not a condition of any purchase. Our Terms of Use and Privacy Policy are at
            anchorsilvercapital.com/terms and anchorsilvercapital.com/privacy. Do you agree to
            receive these text messages at this number?&quot;
          </blockquote>

          <h3>3. Program Details</h3>
          <p>
            Message frequency: up to 6 marketing messages per month, plus appointment and service
            messages. Message and data rates may apply. Reply <strong>STOP</strong> at any time to
            cancel, <strong>HELP</strong> for help, or opt out by calling (866) 818-7243 or
            emailing info@anchorsilvercapital.com. Consent is not a condition of any purchase. The
            full consent terms are published in{" "}
            <a href="/terms#tcpa-consent" className="text-primary underline underline-offset-4">
              Terms of Use §5
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-primary underline underline-offset-4">
              Privacy Policy §3
            </a>
            .
          </p>
        </Prose>
      </Section>
    </>
  );
}
