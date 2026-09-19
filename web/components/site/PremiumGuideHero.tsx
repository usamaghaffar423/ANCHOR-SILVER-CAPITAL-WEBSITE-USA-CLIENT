"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { HeroHeadline } from "@/components/site/HeroHeadline";
import { GuideLeadModal } from "@/components/site/GuideLeadModal";

/**
 * Premium lead-magnet hero — replaces the data-heavy MarketDataHero with a
 * high-conversion "Free Guide" layout. Two-column on desktop: copy left,
 * gated lead card right. Matches the Goldencrestmetals premium aesthetic
 * while staying on Anchor Silver brand (Deep Green / Gold).
 *
 * Framer-motion is not in this project — hover animations use Tailwind
 * group-hover + CSS perspective transforms instead.
 */
export function PremiumGuideHero() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="hero-surface relative flex min-h-dvh -mt-[60px] flex-col justify-center px-5 pb-10 pt-[84px] text-silver md:min-h-0 md:-mt-[112px] md:block md:justify-normal md:pb-20 md:pt-[140px]">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-14">
          {/* ─── Left Column: Copy ─── */}
          <div className="min-w-0 order-1">
            <p className="eyebrow text-xs text-brass-light sm:text-sm">
              Free 2026 Edition
            </p>
            <HeroHeadline />
            <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-silver sm:text-base md:mt-4 md:text-[1.08rem]">
              Own real metal in your retirement, backed by a six-year supply shortfall — not a
              promise. Start with the free investor guide.
            </p>
            <div className="mt-5 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4 md:mt-6">
              <button
                onClick={() => setModalOpen(true)}
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

            {/* Trust badges — bottom of text block */}
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[0.74rem] text-silver-deep md:mt-7">
              {["BBB Accredited A+", "Equity Trust", "Delaware Depository"].map((b) => (
                <li key={b} className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="text-brass">✦</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Right Column: Lead Card ─── */}
          <div className="mx-auto w-full min-w-0 max-w-md order-2 lg:mx-0 lg:max-w-none lg:pl-2">
            <div className="overflow-hidden rounded-xl border border-white/15 bg-[#F8FAFC] shadow-2xl">
              {/* Top section: book mockup area */}
              <div className="relative flex items-center justify-center overflow-hidden bg-[#E2E8F0] px-6 py-10">
                {/* FREE ribbon */}
                <span className="absolute left-3 top-3 z-10 rounded bg-brass px-2.5 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-widest text-[#1b1408] shadow-md">
                  FREE
                </span>

                {/* 3D Book mockup — CSS perspective */}
                <div
                  className="group relative"
                  style={{ perspective: "800px" }}
                >
                  <div
                    className="transition-transform duration-500 ease-out group-hover:scale-105"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Book front face */}
                    <div className="relative h-[200px] w-[150px] rounded-r-sm bg-gradient-to-br from-primary to-hero-from shadow-xl transition-transform duration-500 ease-out group-hover:rotate-y-[-5deg] sm:h-[260px] sm:w-[190px]">
                      {/* Spine shadow */}
                      <div
                        aria-hidden="true"
                        className="absolute left-0 top-0 h-full w-3 bg-gradient-to-r from-black/30 to-transparent"
                      />
                      {/* Book content */}
                      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                        <span className="text-3xl sm:text-4xl">🥈</span>
                        <span className="mt-2 font-display text-[0.6rem] font-bold uppercase tracking-wider text-white sm:text-xs">
                          Silver
                        </span>
                        <span className="mt-0.5 font-display text-[0.5rem] uppercase tracking-wider text-secondary sm:text-[0.6rem]">
                          Investor Guide
                        </span>
                        <span className="mt-2 rounded border border-brass/40 px-2 py-0.5 font-mono text-[0.45rem] text-brass-light sm:text-[0.5rem]">
                          2026 EDITION
                        </span>
                      </div>
                    </div>
                    {/* Book spine */}
                    <div
                      aria-hidden="true"
                      className="absolute -left-2 top-1 h-[calc(100%-8px)] w-2 rounded-l-sm bg-primary/90"
                      style={{ transform: "rotateY(90deg) translateZ(0px)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom section: CTA area */}
              <div className="px-5 pb-6 pt-5 sm:px-8">
                <h3 className="text-center font-display text-lg font-semibold text-foreground sm:text-xl">
                  2026 EDITION: What to know before you move retirement money into silver
                </h3>
                <button
                  onClick={() => setModalOpen(true)}
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
          </div>
        </div>
      </section>

      <GuideLeadModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
