import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Prose, Section } from "@/components/site/ui";
import { SITE, pageMeta, policyEffectiveDate } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Terms of Use — Anchor Silver Capital",
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

          <h3>5. Text Messaging, Telephone Calls, and TCPA Consent</h3>
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
