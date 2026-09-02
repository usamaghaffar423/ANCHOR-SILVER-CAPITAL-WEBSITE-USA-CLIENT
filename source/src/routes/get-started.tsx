import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { CallbackForm } from "@/components/site/CallbackForm";
import { H2, Section } from "@/components/site/ui";
import { SITE, breadcrumbSchema, pageHead } from "@/lib/site";

export const Route = createFileRoute("/get-started")({
  component: GetStarted,
  head: () => ({
    ...pageHead({
      title: "Get Started — Free Silver IRA Consultation | Anchor Silver",
      description:
        "Request a callback from a silver specialist. No pressure, no hard sell — a straight conversation about whether a Silver IRA or physical silver fits your situation.",
      path: "/get-started",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbSchema("/get-started", "Get Started")),
      },
    ],
  }),
});

const expectations = [
  "A specialist calls you at the time you choose",
  "They ask a few simple questions about your situation — cash savings or retirement account",
  "They explain honestly whether and how silver fits",
  "If it makes sense, they walk you through next steps",
  "If it doesn't, they tell you that too",
];

function GetStarted() {
  return (
    <>
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
              BBB Accredited Business · Equity Trust Company · Delaware Depository
            </p>
          </div>

          <div className="rounded-md bg-card p-6 shadow-[var(--shadow-card)]">
            <CallbackForm />
          </div>
        </div>
      </Section>
    </>
  );
}
