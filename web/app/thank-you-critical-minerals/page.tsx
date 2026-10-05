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
import { signDownloadToken } from "@/lib/download-token";
import { SITE, breadcrumbSchema, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Your Critical Minerals Report is Ready | Anchor Silver Capital",
  description:
    "Your free Critical Minerals Report is ready — download the PDF instantly or speak with an Anchor Silver specialist about physical silver and self-directed IRA allocation.",
  path: "/thank-you-critical-minerals",
});

// Rendered per-request so the download link always carries a fresh signed
// token when HANDBOOK_DOWNLOAD_SECRET is enabled (a prerendered token would
// expire). Post-conversion page — no SEO/caching value lost.
export const dynamic = "force-dynamic";

const chapters = [
  {
    title: "Supply Constraints & Geopolitical Risk Factors",
    body: "Where mine output, processing, and export controls concentrate risk for Western buyers.",
  },
  {
    title: "Silver's Role as an Industrial Critical Mineral",
    body: "Solar, electronics, and defense demand measured against a structural mine-supply deficit.",
  },
  {
    title: "Asset Allocation & Self-Directed Storage Strategies",
    body: "How physical holdings sit alongside a self-directed IRA, custodian, and depository.",
  },
];

const brassButton =
  "mt-7 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-brass px-6 py-3.5 text-sm font-semibold text-[#1b1408] transition-colors hover:bg-brass-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-light sm:w-auto";

export default function ThankYouCriticalMineralsPage() {
  // Signed link when token verification is enabled, plain endpoint otherwise.
  const token = signDownloadToken("critical-minerals");
  const reportHref = token
    ? `/api/download-critical-minerals-report?token=${encodeURIComponent(token)}`
    : "/api/download-critical-minerals-report";

  return (
    <>
      <JsonLd
        data={breadcrumbSchema("/thank-you-critical-minerals", "Critical Minerals Report Ready")}
      />

      {/* ── Hero / status ── */}
      <section className="chart-lines relative -mt-[112px] bg-ink px-5 pb-16 pt-[152px] text-silver">
        <AnchorGlyph className="pointer-events-none absolute right-6 top-24 hidden h-40 w-40 text-secondary/10 lg:block" />
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gain/40 bg-gain/10 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-gain">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Request Confirmed
          </span>

          <h1 className="mt-6 font-fraunces text-3xl font-light leading-[1.12] text-white sm:text-5xl">
            Your Critical Minerals Report is Ready
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-silver sm:text-lg">
            We have sent a copy to your email address. You can also view or download the
            full analysis immediately below.
          </p>
        </div>
      </section>

      {/* ── Lead magnet delivery card ── */}
      <Section>
        <div className="mx-auto w-full max-w-4xl">
          <Card className="grid items-start gap-8 md:grid-cols-[260px_1fr] md:p-8">
            {/* Report cover — brand-styled document preview */}
            <figure className="mx-auto w-full max-w-[260px]">
              <div className="chart-lines flex h-[300px] flex-col justify-between rounded-md border border-silver/20 bg-hero-from p-5 text-left shadow-[var(--shadow-card)]">
                <div>
                  <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-brass-light">
                    Investor Briefing · 2026 Edition
                  </p>
                  <span aria-hidden="true" className="mt-3 block h-px w-10 bg-brass/70" />
                </div>

                <div>
                  <p className="font-fraunces text-2xl font-light leading-[1.15] text-white">
                    The Critical Minerals Report
                  </p>
                  <p className="mt-2 text-[0.7rem] leading-snug text-silver">
                    Strategic metals, supply chain risks, and physical asset allocation.
                  </p>
                </div>

                <div className="flex items-center gap-2 border-t border-silver/20 pt-3">
                  <AnchorGlyph className="h-4 w-4 shrink-0 text-secondary" />
                  <span className="font-display text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-silver">
                    Anchor Silver Capital
                  </span>
                </div>
              </div>
              <figcaption className="mt-3 text-center text-xs uppercase tracking-wider text-muted-foreground">
                The Critical Minerals Report · Educational Guide
              </figcaption>
            </figure>

            {/* Description + download */}
            <div>
              <Eyebrow className="text-brass">Instant Access</Eyebrow>
              <H2 className="mt-2">The Critical Minerals Report</H2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Strategic metals, supply chain risks, and physical asset allocation.
              </p>

              <ul className="mt-6 space-y-5">
                {chapters.map((c) => (
                  <li key={c.title} className="flex gap-3.5">
                    <FileText
                      className="mt-0.5 h-5 w-5 shrink-0 text-brass"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-medium text-foreground">{c.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {c.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <a
                href={reportHref}
                target="_blank"
                rel="noopener noreferrer"
                className={brassButton}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download Critical Minerals Report
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
            Discuss Strategic Metal Allocation with a Specialist
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-silver">
            Speak with an Anchor Silver specialist to learn how critical minerals and
            physical silver fit into your broader portfolio or self-directed IRA.
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
            100% Confidential · Direct Trustee-to-Trustee Transfers · No Obligation
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
            <strong className="font-semibold text-silver">Compliance disclosure:</strong>{" "}
            {SITE.legal} is a precious metals dealer, not a registered investment advisor,
            broker-dealer, or tax advisor, and nothing on this page or in the attached
            report constitutes investment, legal, or tax advice. Physical precious metals
            carry risk of loss, including the possible loss of principal; past performance
            does not guarantee future results. Third-party custodians (such as Equity
            Trust Company) and depositories (such as Delaware Depository) are independent,
            unaffiliated third parties, and their services, solvency, and performance are
            their sole responsibility. Please consult your own financial, legal, and tax
            professionals before making any financial decision, and review our full{" "}
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
