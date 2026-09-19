import Link from "next/link";
import { HeroHeadline } from "@/components/site/HeroHeadline";
import { HeroMarketCard } from "@/components/site/HeroMarketCard";

/**
 * Original home hero — data-heavy layout with live market card.
 * Kept intact for A/B testing against PremiumGuideHero.
 */
export function MarketDataHero() {
  return (
    <section className="hero-surface relative flex min-h-dvh -mt-[60px] flex-col justify-center px-5 pb-10 pt-[84px] text-silver md:min-h-0 md:-mt-[112px] md:block md:justify-normal md:pb-20 md:pt-[140px]">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-14">
        <div className="min-w-0 order-1">
          <p className="eyebrow text-xs text-brass-light sm:text-sm">
            The metal that&apos;s quietly climbing
          </p>
          <HeroHeadline />
          <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-silver sm:text-base md:mt-4 md:text-[1.08rem]">
            Own real metal in your retirement, backed by a six-year supply shortfall — not a promise.
            Start with the free investor guide.
          </p>
          <div className="mt-5 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4 md:mt-6">
            <Link
              href="/get-started"
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-brass px-6 py-3.5 text-sm font-semibold text-[#1b1408] transition-colors hover:bg-brass-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-light sm:w-auto"
            >
              Get the free Silver guide
            </Link>
            <Link
              href="/contact"
              className="text-center text-sm text-silver underline decoration-1 underline-offset-4 transition-colors hover:text-white sm:text-left"
            >
              or talk to a specialist →
            </Link>
          </div>
          <ul className="mt-5 hidden flex-wrap gap-x-5 gap-y-2 text-[0.74rem] text-silver-deep sm:flex md:mt-7">
            {["BBB Accredited A+", "Equity Trust", "Delaware Depository"].map((b) => (
              <li key={b} className="flex items-center gap-1.5">
                <span aria-hidden="true" className="text-brass">
                  ✦
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full min-w-0 max-w-md order-2 lg:mx-0 lg:max-w-none lg:pl-2">
          <HeroMarketCard />
        </div>
      </div>
    </section>
  );
}
