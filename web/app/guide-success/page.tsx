import { Lock } from "lucide-react";

/**
 * Success page after submitting the guide request form.
 * Embeds the PDF in a restricted iframe (no toolbar) for a premium
 * "in-app" preview experience. The user is redirected here by the
 * GuideLeadModal after a successful POST to /api/lead.
 */
export default function GuideSuccessPage() {
  return (
    <section className="hero-surface relative -mt-[60px] px-5 pb-16 pt-[120px] text-silver md:-mt-[112px] md:pb-24 md:pt-[160px]">
      <div className="mx-auto max-w-4xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-brass/30 bg-brass/15 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-brass-light">
          <Lock className="h-3 w-3" aria-hidden="true" />
          Free Silver Investor Guide
        </span>

        <h1 className="mt-6 font-fraunces text-3xl font-light leading-[1.12] text-white sm:text-5xl">
          Your Guide Is Ready
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-silver sm:text-lg">
          Preview it below. We&apos;ve also emailed a copy to the address you provided
          — check your inbox (and spam folder) just in case.
        </p>

        {/* PDF embed — #toolbar=0 hides the browser chrome */}
        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-xl shadow-2xl">
          <iframe
            src="/docs/silver-investor-guide.pdf#toolbar=0"
            title="Silver Investor Guide — 2026 Edition"
            className="h-[500px] w-full border-none sm:h-[680px]"
          />
        </div>

        <p className="mt-8 text-sm text-silver-deep">
          Questions? Call us at{" "}
          <a
            href="tel:+18668187243"
            className="font-semibold text-secondary underline underline-offset-4 hover:text-white"
          >
            (866) 818-7243
          </a>{" "}
          or{" "}
          <a
            href="/contact"
            className="font-semibold text-secondary underline underline-offset-4 hover:text-white"
          >
            request a call back
          </a>
          .
        </p>
      </div>
    </section>
  );
}
