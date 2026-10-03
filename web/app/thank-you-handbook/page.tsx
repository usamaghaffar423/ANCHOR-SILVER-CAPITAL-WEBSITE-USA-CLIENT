import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Download,
  FileText,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { JsonLd } from "@/components/site/JsonLd";
import { SITE, breadcrumbSchema, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Your Silver IRA Handbook is Ready | Anchor Silver Capital",
  description:
    "Your free Silver IRA Handbook is ready — download the PDF instantly or speak with an Anchor Silver specialist about a tax-free direct transfer for your 401(k) or IRA.",
  path: "/thank-you-handbook",
});

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
    body: "Who holds title, who holds metal, and how Equity Trust and Delaware Depository work together.",
  },
];

export default function ThankYouHandbookPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white antialiased">
      <JsonLd data={breadcrumbSchema("/thank-you-handbook", "Handbook Ready")} />

      {/* ── Header bar ── */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/50 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-5">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.22em] transition-opacity hover:opacity-80 sm:text-base"
            aria-label="Anchor Silver Capital — home"
          >
            <span className="text-amber-400">Anchor Silver</span>{" "}
            <span className="text-white">Capital</span>
          </Link>
          <a
            href="tel:+18668187243"
            aria-label={`Call Anchor Silver Capital at ${SITE.phone}`}
            className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-200 transition-colors hover:text-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          >
            <Phone className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
            <span className="font-medium">{SITE.phone}</span>
          </a>
        </div>
      </header>

      <main>
        {/* ── Hero / status ── */}
        <section className="px-5 pb-10 pt-14 text-center sm:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Request Confirmed
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-medium leading-[1.1] text-white sm:text-5xl">
            Your Silver IRA Handbook is Ready
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            We&apos;ve sent a copy to your email. You can also download or view the full
            guide immediately below.
          </p>
        </section>

        {/* ── Lead magnet delivery card ── */}
        <section aria-labelledby="handbook-access-heading" className="mx-auto w-full max-w-4xl px-5">
          <div className="grid items-start gap-8 rounded-2xl border border-slate-800 bg-slate-800/40 p-6 shadow-2xl shadow-black/40 transition-shadow duration-300 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] sm:p-8 md:grid-cols-[190px_1fr]">
            {/* Mock book / document preview */}
            <div className="mx-auto flex aspect-[3/4] w-40 flex-col justify-between rounded-lg border border-amber-500/30 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-4 text-center shadow-inner md:mx-0 md:w-full">
              <BookOpen className="mx-auto h-8 w-8 text-amber-400" aria-hidden="true" />
              <div>
                <p className="font-display text-sm font-semibold leading-snug text-white">
                  The Silver IRA Handbook
                </p>
                <p className="mt-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-amber-500">
                  Educational Guide
                </p>
              </div>
              <span className="text-[0.6rem] uppercase tracking-widest text-slate-500">
                2026 Edition
              </span>
            </div>

            {/* Description + download */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                Instant Access
              </p>
              <h2
                id="handbook-access-heading"
                className="mt-2 text-2xl font-semibold text-white sm:text-3xl"
              >
                What&apos;s inside the guide
              </h2>

              <ul className="mt-5 space-y-4">
                {chapters.map((c) => (
                  <li key={c.n} className="flex gap-3.5">
                    <FileText
                      className="mt-0.5 h-5 w-5 shrink-0 text-amber-400"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-semibold text-amber-400/90">{c.n}</p>
                      <p className="mt-0.5 font-medium text-white">{c.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-400">{c.body}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <a
                href="/docs/Silver-IRA-Handbook.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/10 transition-colors duration-200 hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 sm:w-auto"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download PDF Now
              </a>
              <p className="mt-3 text-xs text-slate-500">
                Opens in a new tab · No further sign-up required
              </p>
            </div>
          </div>
        </section>

        {/* ── High-intent secondary CTA ── */}
        <section
          aria-labelledby="next-step-heading"
          className="mx-auto mt-10 w-full max-w-4xl px-5 sm:mt-14"
        >
          <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-br from-slate-800/80 via-slate-800/50 to-slate-900 p-6 text-center shadow-2xl shadow-black/40 sm:p-10">
            <h2
              id="next-step-heading"
              className="font-display text-2xl font-medium text-white sm:text-3xl"
            >
              Ready to Explore Your Transfer Options?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-400">
              Speak with an Anchor Silver specialist to verify whether your existing 401(k)
              or IRA qualifies for a tax-free direct transfer. No pressure, no obligations.
            </p>

            <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                href="/get-started"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-3.5 text-sm font-bold text-slate-950 transition-colors duration-200 hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
              >
                Start Onboarding Application
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href="tel:+18668187243"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-950/40 px-6 py-3.5 text-sm font-bold text-white transition-colors duration-200 hover:border-amber-400 hover:text-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
                aria-label={`Call Anchor Silver Capital at ${SITE.phone}`}
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call {SITE.phone}
              </a>
            </div>

            <p className="mt-6 inline-flex items-center justify-center gap-2 text-xs font-medium tracking-wide text-slate-400">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
              100% Confidential · Direct Trustee-to-Trustee Transfers
            </p>
          </div>
        </section>

        {/* ── Footer & disclosures ── */}
        <footer className="mt-14 border-t border-slate-800 bg-slate-950 px-5 py-10">
          <div className="mx-auto w-full max-w-4xl space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">
                © {new Date().getFullYear()} {SITE.legal}. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <a
                  href={`mailto:${SITE.email}`}
                  className="inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-amber-400"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {SITE.email}
                </a>
                <a
                  href="tel:+18668187243"
                  className="inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-amber-400"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {SITE.phone}
                </a>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-500">
              <strong className="font-semibold text-slate-400">
                Compliance disclosure:
              </strong>{" "}
              {SITE.legal} is a precious metals dealer. It is not a registered investment
              advisor, broker-dealer, or tax advisor, and nothing on this page or in the
              attached guide constitutes investment, legal, or tax advice. Precious metals
              are volatile and carry risk, including the possible loss of principal; past
              performance does not guarantee future results. Purchases may be subject to
              price spreads, storage, and insurance costs. Third-party custodians (such as
              Equity Trust Company) and depositories (such as Delaware Depository) are
              independent, unaffiliated third parties, and their services, solvency, and
              performance are their sole responsibility. Please consult your own financial,
              legal, and tax professionals before making any financial decision, and review
              our full{" "}
              <Link href="/riskdisclosure" className="underline transition-colors hover:text-amber-400">
                Risk Disclosure
              </Link>
              .
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
