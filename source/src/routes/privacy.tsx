import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { Prose, Section } from "@/components/site/ui";
import { SITE, pageHead } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
  head: () =>
    pageHead({
      title: "Privacy Policy — Anchor Silver Capital",
      description:
        "Anchor Silver Capital LLC's privacy policy explains how we collect, use, and protect your personal information.",
      path: "/privacy",
    }),
});

function Privacy() {
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
            <strong>Effective Date:</strong> August 16, 2026
          </p>
          <p>
            {SITE.legal} (“we,” “us,” or “our”) respects your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when you visit our website
            or engage with our services.
          </p>

          <h3>1. Information We Collect</h3>
          <p>
            We may collect personal information you voluntarily provide, such as your name, email
            address, phone number, mailing address, and information about your precious metals
            interests. We also collect standard technical data automatically, including IP address,
            browser type, device information, and pages visited.
          </p>

          <h3>2. How We Use Your Information</h3>
          <p>
            We use your information to respond to inquiries, process transactions, provide
            customer support, improve our website, and send you information you have requested or
            that we believe may be relevant to you. We do not sell your personal information to third
            parties.
          </p>

          <h3>3. Cookies and Tracking</h3>
          <p>
            Our website may use cookies and similar technologies to enhance user experience and
            analyze traffic. You can control cookie preferences through your browser settings.
          </p>

          <h3>4. Information Sharing</h3>
          <p>
            We may share information with trusted service providers who help us operate our business
            (such as custodians, depositories, and payment processors), and when required by law or to
            protect our rights. We require these providers to keep your information confidential.
          </p>

          <h3>5. Data Security</h3>
          <p>
            We use commercially reasonable security measures to protect your information. However, no
            method of transmission over the internet or electronic storage is completely secure.
          </p>

          <h3>6. Your Choices</h3>
          <p>
            You may opt out of receiving marketing communications at any time by following the
            unsubscribe link in an email or contacting us directly. You may also request access to or
            deletion of your personal information by contacting us.
          </p>

          <h3>7. Contact Us</h3>
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
        </Prose>
      </Section>
    </>
  );
}
