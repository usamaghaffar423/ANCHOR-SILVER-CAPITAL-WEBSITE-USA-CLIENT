import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { AnchorGlyph } from "@/components/brand/AnchorMark";
import { JsonLd } from "@/components/site/JsonLd";
import { ButtonLink, Card, Eyebrow, H2, PhoneLink, Section } from "@/components/site/ui";
import { signHandbookToken } from "@/lib/handbook-token";
import { SITE, breadcrumbSchema, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Your Silver IRA Handbook is Ready | Anchor Silver Capital",
  description:
    "Your free Silver IRA Handbook is ready — download the PDF instantly or speak with an Anchor Silver specialist about a tax-free direct transfer for your 401(k) or IRA.",
  path: "/thank-you-critical-minerals",
});

// Rendered per-request so the download link always carries a fresh signed
// token when HANDBOOK_DOWNLOAD_SECRET is enabled (a prerendered token would
// expire). Post-conversion page — no SEO/caching value lost.
//
// The GHL Critical Minerals Report form redirects here. We only publish one
// lead magnet — the Silver IRA Handbook — so this URL delivers it.
export const dynamic = "force-dynamic";

const chapters = [
  {
    n: "Chapter 3",
    title: "Direct Transfer vs. Indirect Rollovers",
    body: "Why a trustee-to-trustee transfer keeps the IRS out of your pocket — and how a 60-day mistake can cost 10%.",
  },
  {
    n: "Chapter 4",
    title: "IRS-Approved .999 Silver Standards",
    body: "Exactly which silver bars and coins qualify for IRA ownership under IRC Section 408(m)(3).",
  },
  {
    n: "Chapter 5",
    title: "Custodian & Depository Roles",
    body: "Who holds title, who holds metal, and how AET and IDS of Delaware work together.",
  },
];

const brassButton =
  "mt-7 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-brass px-6 py-3.5 text-sm font-semibold text-[#1b1408] transition-colors hover:bg-brass-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-light sm:w-auto";

export default function ThankYouCriticalMineralsPage() {
  // Signed link when token verification is enabled, plain endpoint otherwise.
  const token = signHandbookToken();
  const handbookHref = token
    ? `/api/download-handbook?token=${encodeURIComponent(token)}`
    : "/api/download-handbook";

  return (
    <>
      <JsonLd data={breadcrumbSchema("/thank-you-critical-minerals", "Silver IRA Handbook Ready")} />

      {/* ── Hero / status ── */}
      <section className="chart-lines relative -mt-[112px] bg-ink px-5 pb-16 pt-[152px] text-silver">
        <AnchorGlyph className="pointer-events-none absolute right-6 top-24 hidden h-40 w-40 text-secondary/10 lg:block" />
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gain/40 bg-gain/10 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-gain">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Request Confirmed
          </span>

          <h1 className="mt-6 font-fraunces text-3xl font-light leading-[1.12] text-white sm:text-5xl">
            Your Silver IRA Handbook is Ready
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-silver sm:text-lg">
            We&apos;ve sent a copy to your email. You can also download or view the full
            guide immediately below.
          </p>
        </div>
      </section>

      {/* ── Lead magnet delivery card ── */}
      <Section>
        <div className="mx-auto w-full max-w-4xl">
          <Card className="grid items-start gap-8 md:grid-cols-[260px_1fr] md:p-8">
            {/* Book preview — brand hero artwork */}
            <figure className="mx-auto w-full max-w-[260px]">
              <div className="overflow-hidden rounded-md border border-border shadow-[var(--shadow-card)]">
                <img
                  src="/images/hero-book-preview.jpeg"
                  alt="The Silver IRA Handbook — 2026 Edition"
                  width={1600}
                  height={900}
                  className="h-[300px] w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 text-center text-xs uppercase tracking-wider text-muted-foreground">
                The Silver IRA Handbook · Educational Guide
              </figcaption>
            </figure>

            {/* Description + download */}
            <div>
              <Eyebrow className="text-brass">Instant Access</Eyebrow>
              <H2 className="mt-2">What&apos;s inside the guide</H2>

              <ul className="mt-6 space-y-5">
                {chapters.map((c) => (
                  <li key={c.n} className="flex gap-3.5">
                    <FileText
                      className="mt-0.5 h-5 w-5 shrink-0 text-brass"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-wider text-brass">
                        {c.n}
                      </p>
                      <p className="mt-0.5 font-medium text-foreground">{c.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {c.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <a href={handbookHref} target="_blank" rel="noopener noreferrer" className={brassButton}>
                <Download className="h-4 w-4" aria-hidden="true" />
                Download PDF Now
              </a>
              <p className="mt-3 text-xs text-muted-foreground">
                Opens in a new tab · No further sign-up required
              </p>
            </div>
          </Card>
        </div>
      </Section>

      {/* ── High-intent secondary CTA ── */}
      <section className="bg-hero-from px-5 py-16 text-center md:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl text-white md:text-[2.6rem]">
            Ready to Explore Your Transfer Options?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-silver">
            Speak with an Anchor Silver specialist to verify whether your existing 401(k)
            or IRA qualifies for a tax-free direct transfer. No pressure, no obligations.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink to="/get-started" variant="primary">
              Start Onboarding Application
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <PhoneLink variant="outlineLight" label={`Call ${SITE.phone}`} />
          </div>

          <p className="mt-6 inline-flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-silver-deep">
            <ShieldCheck className="h-4 w-4 shrink-0 text-brass" aria-hidden="true" />
            100% Confidential · Direct Trustee-to-Trustee Transfers
          </p>
        </div>
      </section>

      {/* ── Guide-specific compliance note — the site Footer renders below ── */}
      <section
        aria-label="Legal disclosures"
        className="border-t border-silver/15 bg-ink px-5 py-8"
      >
        <div className="mx-auto w-full max-w-4xl">
          <p className="text-xs leading-relaxed text-silver-deep">
            <strong className="font-semibold text-silver">
              Compliance disclosure:
            </strong>{" "}
            {SITE.legal} is a precious metals dealer. It is not a registered investment
            advisor, broker-dealer, or tax advisor, and nothing on this page or in the
            attached guide constitutes investment, legal, or tax advice. Precious metals
            are volatile and carry risk, including the possible loss of principal; past
            performance does not guarantee future results. Purchases may be subject to
            price spreads, storage, and insurance costs. Third-party custodians (such as
            American Estate & Trust (AET)) and depositories (such as IDS of Delaware) are
            independent, unaffiliated third parties, and their services, solvency, and
            performance are their sole responsibility. Please consult your own financial,
            legal, and tax professionals before making any financial decision, and review
            our full{" "}
            <Link
              href="/riskdisclosure"
              className="font-medium text-secondary underline underline-offset-2 hover:text-white"
            >
              Risk Disclosure
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
