"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { HeroHeadline } from "@/components/site/HeroHeadline";
import { HeroDisclaimer } from "@/components/site/HeroDisclaimer";
import { GuideLeadModal } from "@/components/site/GuideLeadModal";

/**
 * Premium lead-magnet hero — replaces the data-heavy MarketDataHero with a
 * high-conversion "Free Guide" layout. Two-column on desktop: copy left,
 * gated lead card right. Matches the Goldencrestmetals premium aesthetic
 * while staying on Anchor Silver brand (Deep Green / Gold).
 *
 * Full-screen at every breakpoint: the section is always at least one viewport
 * tall, so the following section never peeks above the fold. `-mt-[72px]`
 * cancels the sticky header (72px on mobile; on md+ the hero then starts 36px
 * under the 108px header, so `min-h-dvh` still puts its bottom edge at or below
 * the fold whether or not the dismissible TopBar is open).
 *
 * Mobile/tablet: the hero holds the copy block only, so the whole hero is
 * visible without scrolling — the lead card sits in its own section directly
 * below. lg and up: the card returns to the right-hand column.
 *
 * Framer-motion is not in this project — hover animations use Tailwind
 * group-hover + CSS perspective transforms instead.
 *
 * `today` is rendered on the server (see app/page.tsx) so the disclaimer date
 * is present in the shipped HTML instead of popping in after hydration.
 */
export function PremiumGuideHero({ today }: { today?: string | null }) {
  const [modalOpen, setModalOpen] = useState(false);
  const open = () => setModalOpen(true);

  return (
    <>
      <section className="hero-surface relative flex min-h-dvh -mt-[72px] flex-col justify-center px-5 pb-10 pt-[96px] text-silver md:pb-20 md:pt-[140px]">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-14">
          {/* ─── Left Column: Copy ─── */}
          <div className="min-w-0 order-1">
            <p className="eyebrow text-xs text-brass-light sm:text-sm">
              Free 2026 Edition
            </p>
            <HeroHeadline />
            <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-silver sm:text-base md:mt-4 md:text-[1.08rem]">
              Own physical silver in your retirement account or outright. Six consecutive years of
              supply shortfall, according to the Silver Institute. Plan on holding at least five
              years. Start with the free investor guide.
            </p>
            <HeroDisclaimer today={today} />
            <div className="mt-5 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4 md:mt-6">
              <button
                onClick={open}
                className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-brass px-6 py-3.5 text-sm font-semibold text-[#1b1408] transition-colors hover:bg-brass-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-light sm:w-auto"
              >
                Get the free Silver guide
              </button>
              <a
                href="tel:+18668187243"
                className="text-center text-sm text-silver underline decoration-1 underline-offset-4 transition-colors hover:text-white sm:text-left"
              >
                or talk to a specialist →
              </a>
            </div>

            {/* Trust badges — bottom of text block (custodian + depository only) */}
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[0.74rem] text-silver-deep md:mt-7">
              {["AET", "IDS of Delaware"].map((b) => (
                <li key={b} className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="text-brass">✦</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Right Column: Lead Card (lg and up only) ─── */}
          <div className="mx-auto w-full min-w-0 max-w-md order-2 hidden lg:mx-0 lg:block lg:max-w-none lg:pl-2">
            <GuideCard onSelect={open} />
          </div>
        </div>
      </section>

      {/* Lead card below the fold on mobile/tablet, so the hero stays one screen */}
      <section className="bg-hero-to px-5 pb-14 pt-10 lg:hidden">
        <div className="mx-auto w-full max-w-md">
          <GuideCard onSelect={open} />
        </div>
      </section>

      <GuideLeadModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}

function GuideCard({ onSelect }: { onSelect: () => void }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/15 bg-[#F8FAFC] shadow-2xl">
      {/* Top section: book mockup area */}
      <div className="relative h-[280px] overflow-hidden sm:h-[340px]">
        {/* FREE ribbon */}
        <span className="absolute left-3 top-3 z-10 rounded bg-brass px-2.5 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-widest text-[#1b1408] shadow-md">
          FREE
        </span>

        {/* 3D Book mockup — real image, covers full area */}
        <img
          src="/images/hero-book-preview.jpeg"
          alt="The Silver IRA Handbook — 2026 Edition"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      {/* Bottom section: CTA area */}
      <div className="px-5 pb-6 pt-5 sm:px-8">
        <h3 className="text-center font-display text-lg font-semibold text-foreground sm:text-xl">
          2026 EDITION: What to know before you move retirement money into silver
        </h3>
        <button
          onClick={onSelect}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-brass px-6 py-3.5 text-sm font-semibold text-[#1b1408] transition-colors hover:bg-brass-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-light"
        >
          Send me the free guide
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <Lock className="h-3 w-3" aria-hidden="true" />
          No cost, no obligation · Mailed or emailed
        </p>
      </div>
    </div>
  );
}
