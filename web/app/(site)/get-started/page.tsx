import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { HeroForm, HeroHeading, HeroPhoto, HomeProvider } from "@/components/home/HomeClient";
import { JsonLd } from "@/components/site/JsonLd";
import { H2, Section } from "@/components/site/ui";
import { HERO } from "@/lib/home-content";
import { SITE, breadcrumbSchema, pageMeta } from "@/lib/site";
import "../home.css";
import "./get-started.css";

export const metadata: Metadata = pageMeta({
  title: "Get Started — Free Gold & Silver IRA Handbook",
  description:
    "Answer one question and get the free Gold and Silver IRA handbook, then talk it through with a specialist. No pressure, no hard sell. Marina del Rey, CA. (866) 818-7243.",
  path: "/get-started",
});

const expectations = [
  "A specialist calls you at the time you choose",
  "They ask a few simple questions about your situation: cash savings or retirement account",
  "They explain honestly whether and how silver fits",
  "If it makes sense, they walk you through next steps",
  "If it doesn't, they tell you that too",
];

function Check() {
  return (
    <svg className="hp-tick" aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function Stars({ size = 22 }: { size?: number }) {
  return (
    <span className="hp-stars" role="img" aria-label="Five stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
          <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9Z" />
        </svg>
      ))}
    </span>
  );
}

/**
 * Get Started: the same two-step quiz and handbook form as the homepage hero (one question,
 * then name / email / phone), reused as-is so it submits the same way (GHL webhook, UET,
 * redirect to /thank-you-handbook). The "what to expect" content stays below it.
 */
export default function GetStarted() {
  return (
    <>
      <JsonLd data={breadcrumbSchema("/get-started", "Get Started")} />

      <div className="hp gs">
        <HomeProvider>
          <section className="hp-hero gs-hero" aria-labelledby="gs-title">
            <div className="hp-wrap hp-hero-grid">
              <div className="hp-hero-text">
                <p className="hp-pill">{HERO.pill}</p>
                <div id="gs-title">
                  <HeroHeading />
                </div>
                <p className="hp-sub">
                  <span className="hp-sub-desk">
                    {HERO.subLead}
                    <strong>{HERO.subBold}</strong>
                  </span>
                  <strong className="hp-sub-mob">{HERO.subMobile}</strong>
                </p>
                <ul className="hp-checks hp-below">
                  {HERO.checks.map((c) => (
                    <li key={c}>
                      <Check />
                      {c}
                    </li>
                  ))}
                </ul>
                <div className="hp-proof hp-below">
                  <Stars size={28} />
                  <span className="hp-dealer">
                    <ShieldCheck aria-hidden="true" size={18} />
                    {HERO.dealer}
                  </span>
                </div>
              </div>

              <div className="hp-hero-form">
                <HeroPhoto />
                <HeroForm />
                <div className="hp-mob-below">
                  <ul className="hp-checks">
                    {HERO.checks.map((c) => (
                      <li key={c}>
                        <Check />
                        {c}
                      </li>
                    ))}
                  </ul>
                  <div className="hp-proof">
                    <Stars />
                    <span className="hp-dealer">
                      <ShieldCheck aria-hidden="true" size={18} />
                      {HERO.dealer}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </HomeProvider>
      </div>

      <Section>
        <div className="mx-auto max-w-3xl">
          <H2>What to Expect</H2>
          <p className="mt-5 text-base text-muted-foreground">When you reach out, here&apos;s what happens:</p>
          <ol className="mt-4 space-y-3">
            {expectations.map((e, i) => (
              <li key={e} className="flex gap-4 text-base leading-relaxed">
                <span className="font-mono text-sm text-primary">{i + 1}</span>
                <span>{e}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
            Our minimum for IRA rollovers is $25,000. Our minimum for physical delivery is $5,000. If you don&apos;t qualify,
            we&apos;ll tell you immediately and point you in the right direction.
          </p>
          <p className="mt-8 text-sm">
            Or call us directly:{" "}
            <a className="font-mono text-lg text-primary underline underline-offset-4" href={SITE.phoneHref}>
              {SITE.phone}
            </a>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Hours: {SITE.hours}</p>
          <p className="mt-8 text-xs uppercase tracking-wider text-muted-foreground">
            American Estate &amp; Trust (AET) · IDS of Delaware
          </p>
        </div>
      </Section>
    </>
  );
}
