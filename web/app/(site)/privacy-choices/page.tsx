import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { PrivacyChoicesPanel } from "@/components/site/PrivacyChoicesPanel";
import { PrivacyRequestForm } from "@/components/site/PrivacyRequestForm";
import { H2, Prose, Section } from "@/components/site/ui";
import { PRIVACY_CHOICES_PAGE, PRIVACY_CONTACT } from "@/content/privacy-ccpa";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: PRIVACY_CHOICES_PAGE.title,
  description:
    "Opt out of the sale or sharing of your personal information, or ask Anchor Silver Capital to tell you what it holds, correct it, or delete it.",
  path: "/privacy-choices",
});

export default function PrivacyChoicesPage() {
  return (
    <>
      <PageHero eyebrow="Privacy" title={PRIVACY_CHOICES_PAGE.title} subtitle={PRIVACY_CHOICES_PAGE.intro} />

      <Section>
        <div className="mx-auto grid w-full max-w-3xl gap-10">
          <PrivacyChoicesPanel />

          <div>
            <H2>{PRIVACY_CHOICES_PAGE.requestHeading}</H2>
            <Prose className="mt-3">
              <p>{PRIVACY_CHOICES_PAGE.requestIntro}</p>
              <p>
                You can also email{" "}
                <a href={`mailto:${PRIVACY_CONTACT.email}`} className="text-primary underline underline-offset-4">
                  {PRIVACY_CONTACT.email}
                </a>{" "}
                or call toll-free{" "}
                <a href={PRIVACY_CONTACT.tollFreeHref} className="text-primary underline underline-offset-4">
                  {PRIVACY_CONTACT.tollFree}
                </a>
                .
              </p>
            </Prose>
            <div className="mt-6">
              <PrivacyRequestForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
