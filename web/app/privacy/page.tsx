import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Prose, Section } from "@/components/site/ui";
import { SITE, pageMeta, policyEffectiveDate } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy — Anchor Silver Capital",
  description:
    "Anchor Silver Capital LLC's privacy policy explains how we collect, use, and protect your personal information, including SMS consent data and call recordings.",
  path: "/privacy",
});

export default function Privacy() {
  return (
    <>
      <PageHero
        eyebrow="Privacy Policy"
        title="How We Handle Your Information"
        subtitle="We collect only what we need, keep it secure, and never sell your personal data."
      />

      <Section>
        <Prose>
          <p>
            <strong>Effective Date:</strong> {policyEffectiveDate}
          </p>
          <p>
            {SITE.legal} (“we,” “us,” or “our”) respects your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when you visit our website,
            call us, text us, or engage with our services.
          </p>

          <h3>1. Information We Collect</h3>
          <p>
            We may collect personal information you voluntarily provide, such as your name, email
            address, phone number, mailing address, and information about your precious metals
            interests. When you opt in to text messaging, we also collect your mobile number and the
            record of your consent (including the date, time, and the wording of the consent you
            accepted). We collect audio recordings of telephone calls as described in Section 4. We
            also collect standard technical data automatically, including IP address, browser type,
            device information, and pages visited.
          </p>

          <h3>2. How We Use Your Information</h3>
          <p>
            We use your information to respond to inquiries, process transactions, provide customer
            support, improve our website, and send you information you have requested or that we
            believe may be relevant to you. We do not sell your personal information to third
            parties.
          </p>

          <h3>3. Text Messaging, Telephone Calls, and TCPA Consent</h3>
          <p>
            <strong>Program name:</strong> Anchor Silver Capital SMS Program.
          </p>
          <p>
            By submitting your phone number through any form on this website, you give {SITE.legal}{" "}
            <strong>express written consent</strong> under the Telephone Consumer Protection Act
            (TCPA), 47 U.S.C. § 227, and related federal and state laws, to contact you at the
            number provided using autodialed or prerecorded voice calls, artificial or prerecorded
            voice messages, and text (SMS) messages.
          </p>
          <p>
            <strong>Message frequency:</strong> Message frequency varies. You may receive messages
            about your inquiry, appointment reminders, follow-ups on a consultation you requested,
            and information about precious metals products and services.
          </p>
          <p>
            <strong>Message and data rates may apply.</strong> Check with your mobile carrier for
            details. Consent is not a condition of any purchase.
          </p>
          <p>
            <strong>Opt-out instructions:</strong> Reply <strong>STOP</strong> to cancel, reply{" "}
            <strong>HELP</strong> for help, at any time. After you send STOP, we will send a
            confirmation message and cease further texts to that number. You may also opt out or
            revoke consent by calling {SITE.phone} or emailing{" "}
            <a href={`mailto:${SITE.email}`} className="text-primary underline underline-offset-4">
              {SITE.email}
            </a>
            . Carriers are not liable for delayed or undelivered messages.
          </p>
          <p>
            You represent that you are the subscriber or customary user of the phone number you
            provide, and that you are authorized to grant this consent. You agree to notify us
            promptly if your number changes or is reassigned. This consent remains in effect until
            you revoke it, and revocation does not affect prior lawful messages or any separate
            consent you have given for calls or emails that are not covered by this section.
          </p>

          <h3>4. Call Recording</h3>
          <p>
            We collect audio recordings of telephone calls placed to or received by Anchor Silver
            Capital LLC for quality assurance, training, and compliance purposes.
          </p>
          <p>
            Calls may be monitored or recorded when you contact us or when we contact you at the
            number you provide. Where required by law, we disclose that calls are recorded. Recordings
            are retained only as long as needed for these purposes and are accessible only to
            personnel and service providers who need them to perform their work.
          </p>

          <h3>5. Cookies and Tracking</h3>
          <p>
            Our website may use cookies and similar technologies to enhance user experience and
            analyze traffic. You can control cookie preferences through your browser settings.
          </p>

          <h3>6. Information Sharing</h3>
          <p>
            We may share information with trusted service providers who help us operate our business
            (such as custodians, depositories, and payment processors), and when required by law or
            to protect our rights. We require these providers to keep your information confidential.
            We do not share, sell, rent, or lease your mobile number or SMS opt-in consent data for
            third-party marketing purposes.
          </p>

          <h3>7. Data Security</h3>
          <p>
            We use commercially reasonable security measures to protect your information. However, no
            method of transmission over the internet or electronic storage is completely secure.
          </p>

          <h3>8. Your Choices</h3>
          <p>
            You may opt out of receiving marketing communications at any time by following the
            unsubscribe link in an email, replying <strong>STOP</strong> to any text message, or
            contacting us directly. You may also request access to or deletion of your personal
            information by contacting us. We will honor verified requests subject to any retention
            obligations imposed on us by law.
          </p>

          <h3>9. Changes to This Policy</h3>
          <p>
            We may update this Privacy Policy from time to time. The most current version will always
            be posted on this page with its effective date. Continued use of our website or services
            after changes are posted constitutes your acceptance of the revised policy.
          </p>

          <h3>10. Contact Us</h3>
          <p>
            If you have questions about this Privacy Policy, please contact us at{" "}
            <a href={`mailto:${SITE.email}`} className="text-primary underline underline-offset-4">
              {SITE.email}
            </a>{" "}
            or by phone at{" "}
            <a href={SITE.phoneHref} className="text-primary underline underline-offset-4">
              {SITE.phone}
            </a>
            .
          </p>
          <address className="not-italic text-sm leading-relaxed text-muted-foreground">
            {SITE.legal}
            <br />
            {SITE.street}
            <br />
            {SITE.city}, {SITE.state} {SITE.zip}
          </address>
        </Prose>
      </Section>
    </>
  );
}
