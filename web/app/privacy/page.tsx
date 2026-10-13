import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Prose, Section } from "@/components/site/ui";
import { SITE, pageMeta, policyEffectiveDate } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy",
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
            <strong>Program name:</strong> Anchor Silver Capital SMS Program, operated by Anchor
            Silver Capital LLC, 475 Washington Blvd, Marina del Rey, CA 90292.
          </p>
          <p>
            <strong>How you opt in:</strong>
          </p>
          <p>
            (1) Website form: by checking the separate, optional text-message box on our contact
            form and submitting it, you provide your express written consent to receive recurring
            automated marketing and promotional text messages, and appointment and service
            messages, from Anchor Silver Capital LLC at the mobile number you provide, including
            messages sent using an automated system.
          </p>
          <p>
            (2) By phone: during a call with a representative, you may agree verbally. We record
            your answer with a date and time before any text is sent.
          </p>
          <p>
            Consent is not a condition of any purchase, and not agreeing does not affect your
            inquiry.
          </p>
          <p>
            <strong>Message types:</strong> educational content about precious metals and IRA
            rollovers, offers and promotions, appointment confirmations, scheduling follow-ups, and
            materials you requested.
          </p>
          <p>
            <strong>Message frequency:</strong> up to 6 marketing messages per month, plus
            appointment and service messages.
          </p>
          <p>Message and data rates may apply.</p>
          <p>
            <strong>Opt-out:</strong> Reply <strong>STOP</strong> at any time to cancel. Reply{" "}
            <strong>HELP</strong> for help. You may also opt out by calling (866) 818-7243 or
            emailing info@anchorsilvercapital.com. Carriers are not liable for delayed or
            undelivered messages.
          </p>
          <p>
            <strong>Telephone calls and email:</strong> by checking the contact box on our form,
            you agree that Anchor Silver Capital LLC may call or email you about your inquiry,
            including by automated dialing systems. You may revoke this consent at any time by
            contacting us.
          </p>
          <p>
            We do not share, sell, rent, or lease mobile numbers or SMS consent data to third
            parties for marketing purposes.
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
