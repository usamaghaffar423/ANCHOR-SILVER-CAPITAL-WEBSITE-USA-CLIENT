import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Prose, Section } from "@/components/site/ui";
import { SITE, pageMeta, policyEffectiveDate } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Terms of Use",
  description:
    "Terms and conditions governing use of the Anchor Silver Capital website, services, and TCPA/SMS messaging consent.",
  path: "/terms",
});

export default function Terms() {
  return (
    <>
      <PageHero
        eyebrow="Terms of Use"
        title="The Rules of Engagement"
        subtitle="Please read these terms carefully before using our website or services."
      />

      <Section>
        <Prose>
          <p>
            <strong>Effective Date:</strong> {policyEffectiveDate}
          </p>
          <p>
            Welcome to the website of {SITE.legal} (“we,” “us,” or “our”). By accessing or using this
            website, you agree to be bound by these Terms of Use. If you do not agree with any part of
            these terms, please do not use our website.
          </p>

          <h3>1. Not Financial Advice</h3>
          <p>
            {SITE.legal} is a precious metals dealer, not a registered investment advisor,
            broker-dealer, or financial planner. Nothing on this website constitutes investment,
            legal, or tax advice. You should consult with a qualified professional before making any
            financial decisions.
          </p>

          <h3>2. Eligibility</h3>
          <p>
            You must be at least 18 years old and legally able to enter into contracts to use our
            services. By using this website, you represent that you meet these requirements.
          </p>

          <h3>3. Precious Metals Transactions</h3>
          <p>
            All precious metals transactions are subject to availability, market pricing, and
            confirmation. Prices fluctuate with market conditions and are not guaranteed until a
            transaction is finalized. We reserve the right to refuse or cancel any order for any
            reason, including pricing errors or suspected fraud.
          </p>

          <h3>4. Storage and Custody</h3>
          <p>
            IRA-held precious metals are stored through our third-party depository partners. Physical
            delivery orders are shipped fully insured to the address you provide. You are responsible
            for providing accurate shipping and account information.
          </p>

          <h3 id="tcpa-consent" className="scroll-mt-28">
            5. Text Messaging, Telephone Calls, and TCPA Consent
          </h3>
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

          <h3>6. Intellectual Property</h3>
          <p>
            All content on this website, including text, graphics, logos, and the Anchor Silver
            Capital mark, is our property or the property of our licensors and is protected by
            applicable intellectual property laws. You may not reproduce, distribute, or create
            derivative works without our written permission.
          </p>

          <h3>7. Limitation of Liability</h3>
          <p>
            To the fullest extent permitted by law, {SITE.legal} is not liable for any indirect,
            incidental, consequential, or punitive damages arising from your use of this website or
            our services, including market losses on precious metals.
          </p>

          <h3>8. Governing Law</h3>
          <p>
            These Terms of Use are governed by the laws of the State of California, without regard to
            its conflict-of-law principles. Any disputes arising under these terms will be resolved
            in the state or federal courts located in Los Angeles County, California.
          </p>

          <h3>9. Changes to These Terms</h3>
          <p>
            We may update these Terms of Use from time to time. The most current version will always
            be posted on this page with the effective date. Continued use of the website after
            changes constitutes your acceptance of the revised terms.
          </p>

          <h3>10. Contact Us</h3>
          <p>
            Questions about these Terms of Use may be directed to{" "}
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
