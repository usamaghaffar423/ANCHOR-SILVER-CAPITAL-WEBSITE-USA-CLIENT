import type { Metadata } from "next";
import Link from "next/link";
import { AnchorGlyph } from "@/components/brand/AnchorMark";
import { HeroHeadline } from "@/components/site/HeroHeadline";
import { HeroMarketCard } from "@/components/site/HeroMarketCard";
import { CallbackForm } from "@/components/site/CallbackForm";
import { SilverByTheNumbers } from "@/components/site/SilverByTheNumbers";
import { Card, Disclaimer, H2, Section, buttonStyles } from "@/components/site/ui";
import { Reveal } from "@/components/site/Reveal";
import { Banner } from "@/components/site/Banner";
import { SITE, pageMeta } from "@/lib/site";

const texSilver = "/assets/tex-silver.jpg";
const texCurrency = "/assets/tex-currency.jpg";
const texVault = "/assets/tex-vault.jpg";

export const metadata: Metadata = pageMeta({
  title: "Silver IRA Rollovers & Physical Silver | Anchor Silver Capital",
  description:
    "Roll your 401k or IRA into a Silver IRA tax-free. Buy physical silver rounds, bars, and coins delivered to your door. Santa Monica, CA. Call (866) 818-7243.",
  path: "/",
});

/* ---------------------------------- icons --------------------------------- */

const iconProps = {
  "aria-hidden": true as const,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function VaultIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <rect x="2.5" y="4" width="19" height="16" rx="1.5" />
      <circle cx="11" cy="12" r="4" />
      <path d="M11 8.6v1.2M11 14.2v1.2M7.6 12h1.2M13.2 12h1.2M18 8.5v7" />
    </svg>
  );
}

function BoxIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5Z" />
      <path d="M3 7.5 12 12l9-4.5M12 12v9" />
      <circle cx="12" cy="7.6" r="1.6" />
    </svg>
  );
}

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4h2c.7 0 1.3.5 1.5 1.2l.6 2.4c.1.6-.1 1.2-.6 1.5l-1.2.8a12 12 0 0 0 5.3 5.3l.8-1.2c.4-.5 1-.7 1.5-.6l2.4.6c.7.2 1.2.8 1.2 1.5v2c0 .8-.7 1.5-1.5 1.5A14.5 14.5 0 0 1 4 5.5Z" />
    </svg>
  );
}

function DocIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M6 3h8l4 4v14H6Z" />
      <path d="M14 3v4h4" />
      <path d="M9 12.5l1.4 1.4 3-3M9 17h6" />
    </svg>
  );
}

function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M12 2.8 20 6v6.2c0 4.4-3.2 7.6-8 9-4.8-1.4-8-4.6-8-9V6Z" />
      <path d="M9.2 12.2 11.3 14.3l3.6-3.9" />
    </svg>
  );
}

function ScaleIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M12 3v17M6 20h12M4 8h16" />
      <path d="M4 8 1.8 13.4a3.6 3.6 0 0 0 4.4 0Z" />
      <path d="M20 8l2.2 5.4a3.6 3.6 0 0 1-4.4 0Z" />
    </svg>
  );
}

/* ---------------------------------- data ---------------------------------- */

const whyColumns = [
  {
    title: "It Holds Its Ground",
    body: "No counterparty. No printing press. Silver is what it is, whatever the dollar does.",
    texture: texSilver,
    Icon: AnchorGlyph,
  },
  {
    title: "Supply Can't Keep Up",
    body: "Six straight years of global mine deficit while industrial demand keeps climbing.",
    texture: texCurrency,
    Icon: ScaleIcon,
  },
  {
    title: "Outside the System",
    body: "Held outside the banking system. No bail-in risk, no institution to stay solvent.",
    texture: texVault,
    Icon: ShieldIcon,
  },
];

const steps = [
  {
    title: "Talk to a Specialist",
    body: "A 10-minute call, no pressure — we tell you honestly whether silver fits.",
    Icon: PhoneIcon,
  },
  {
    title: "We Handle the Paperwork",
    body: "Equity Trust IRA setup, rollover forms, depository account. You sign, we do the rest.",
    Icon: DocIcon,
  },
  {
    title: "Your Silver Is Secured",
    body: "Shipped fully insured to Delaware Depository or your door. View holdings online.",
    Icon: VaultIcon,
  },
];

const testimonials = [
  {
    quote:
      "Anchor Silver Capital walked me through the entire process without any pressure. I finally feel like I have something real.",
    name: "Robert M.",
    meta: "Retired engineer, Phoenix AZ",
  },
  {
    quote:
      "Direct, no-nonsense, and they answered every question honestly — including the ones where the answer wasn't what I expected.",
    name: "Patricia L.",
    meta: "Retired teacher, Austin TX",
  },
  {
    quote: "Smooth from start to finish, and they kept me updated at every step. No hard sell.",
    name: "David K.",
    meta: "Business owner, Seattle WA",
  },
];

const trustBadges = [
  "BBB Accredited — A+",
  "Equity Trust Company",
  "Delaware Depository",
  "Fox Business · Yahoo Finance · Newsmax",
];

function Stars({ className = "text-primary" }: { className?: string }) {
  return (
    <span aria-label="Five out of five stars" className={`text-sm tracking-widest ${className}`}>
      ★★★★★
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sage-soft font-mono text-sm text-primary"
    >
      {name
        .replace(/[^A-Za-z .]/g, "")
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)}
    </span>
  );
}

/* ---------------------------------- page ---------------------------------- */

export default function Home() {
  return (
    <>
      <section className="hero-surface relative -mt-[112px] px-5 pb-14 pt-[124px] text-silver md:pb-20 md:pt-[140px]">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0">
            <p className="eyebrow text-brass-light">The metal that&apos;s quietly climbing</p>
            <HeroHeadline />
            <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-silver md:text-[1.08rem]">
              Own real metal in your retirement, backed by a six-year supply shortfall — not a
              promise. Start with the free investor guide.
            </p>
            <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Link
                href="/get-started"
                className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-brass px-6 py-3.5 text-sm font-semibold text-[#1b1408] transition-colors hover:bg-brass-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-light sm:w-auto"
              >
                Get the free Silver guide
              </Link>
              <Link
                href="/contact"
                className="text-sm text-silver underline decoration-1 underline-offset-4 transition-colors hover:text-white"
              >
                or talk to a specialist →
              </Link>
            </div>
            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[0.74rem] text-silver-deep">
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

          <div className="mx-auto w-full min-w-0 max-w-md lg:mx-0 lg:max-w-none lg:pl-2">
            <HeroMarketCard />
          </div>
        </div>
      </section>

      <Section className="md:py-24">
        <H2>Two Ways to Anchor Your Savings</H2>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <Card className="h-full">
              <span className="grid h-14 w-14 place-items-center rounded-sm bg-sage-soft">
                <AnchorGlyph className="h-8 w-8 text-primary" />
              </span>
              <h3 className="mt-5 text-2xl">Silver IRA Rollover</h3>
              <ul className="mt-4 space-y-2 text-base text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary">—</span> 401k, IRA, or annuity rollover
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">—</span> Penalty-free, tax-free
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">—</span> $25,000 minimum
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">—</span> Any age for IRA, annuity, or former
                  employer 401k; current employer 401k at 59½+
                </li>
              </ul>
              <Link
                href="/silver-ira"
                className="mt-6 inline-block font-semibold text-primary underline underline-offset-4"
              >
                Learn About Silver IRA →
              </Link>
            </Card>
          </Reveal>
          <Reveal delay={100}>
            <Card className="h-full">
              <span className="grid h-14 w-14 place-items-center rounded-sm bg-sage-soft">
                <BoxIcon className="h-8 w-8 text-primary" />
              </span>
              <h3 className="mt-5 text-2xl">Physical Silver Delivered</h3>
              <ul className="mt-4 space-y-2 text-base text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary">—</span> Rounds, bars, and coins
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">—</span> Insured shipping to your door
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">—</span> Or allocated storage at Delaware Depository
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">—</span> $5,000 minimum
                </li>
              </ul>
              <Link
                href="/physical-silver"
                className="mt-6 inline-block font-semibold text-primary underline underline-offset-4"
              >
                Buy Physical Silver →
              </Link>
            </Card>
          </Reveal>
        </div>
      </Section>

      <Banner
        image="/images/silver-bars-duo-dark.jpg"
        mobileImage="/images/silver-bars-stacked.jpg"
        alt="Two .999 fine silver bars in dramatic light."
        focal="center"
        scrim="band"
        tint
        aspect="aspect-[4/5] sm:aspect-[16/6]"
        contentAlign="center"
      >
        <p className="eyebrow text-brass-light">Own It Outright</p>
        <h2 className="mt-3 font-fraunces text-3xl font-light text-white sm:text-4xl">
          Real Metal. In Your Name. In Your Hands.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-silver sm:text-lg">
          No paper promises — silver you can hold, insured and delivered to your door.
        </p>
        <Link
          href="/get-started"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-sm bg-brass px-6 py-3.5 text-sm font-semibold text-[#1b1408] transition-colors hover:bg-brass-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass-light"
        >
          Get the Free Silver Guide
        </Link>
      </Banner>

      <Section tone="muted" className="md:py-24">
        <H2>The Case for Physical Silver</H2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {whyColumns.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <div className="relative h-full overflow-hidden rounded-md border border-border bg-card p-6 shadow-[var(--shadow-card)]">
                <img
                  src={c.texture}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/70 to-card/30" />
                <div className="relative">
                  <c.Icon className="h-8 w-8 text-primary" />
                  <h3 className="mt-5 text-xl">{c.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <SilverByTheNumbers />

      <Section className="md:py-24">
        <H2>Getting Started Is Simpler Than You Think</H2>
        <ol className="relative mt-10 grid gap-6 md:grid-cols-3">
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-[3.4rem] hidden border-t border-dashed border-border md:block"
          />
          {steps.map((s, i) => (
            <li key={s.title} className="relative">
              <Card className="h-full">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-primary/25 bg-card">
                    <s.Icon className="h-6 w-6 text-primary" />
                  </span>
                  <span className="font-mono text-sm text-silver-deep">0{i + 1}</span>
                </div>
                <h3 className="mt-4 text-xl">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </Card>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <Link href="/get-started" className={buttonStyles.primary}>
            Get Started Today
          </Link>
        </div>
      </Section>

      <Section tone="muted" className="md:py-24">
        <H2>What Our Clients Say</H2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="flex h-full flex-col">
              <Stars />
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground">
                “{t.quote}”
              </blockquote>
              <div className="mt-auto flex items-center gap-3 pt-5">
                <Avatar name={t.name} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{t.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.meta}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Disclaimer>
          Client statements are illustrative and do not guarantee comparable results.
        </Disclaimer>
      </Section>

      <Section className="md:py-20">
        <ul className="grid gap-4 text-center text-xs uppercase tracking-[0.18em] text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
          {trustBadges.map((b) => (
            <li key={b} className="flex min-h-[4.5rem] items-center justify-center rounded-sm border border-border px-5 py-4">
              {b}
            </li>
          ))}
        </ul>
      </Section>

      <section className="bg-accent px-5 py-16 md:py-24">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
          <div>
            <h2 className="max-w-3xl text-3xl text-background md:text-[2.6rem]">
              The Anchor Is Set. The Tide Is Rising.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-silver">
              The people who anchored early are in a very different position than those still
              waiting.
            </p>
            <p className="mt-6 text-sm text-silver">
              Prefer to talk now?{" "}
              <a
                href={SITE.phoneHref}
                className="font-semibold text-secondary underline underline-offset-4"
              >
                Call {SITE.phone}
              </a>
            </p>
          </div>
          <div className="rounded-md bg-card p-6 shadow-[var(--shadow-card)]">
            <CallbackForm />
          </div>
        </div>
      </section>
    </>
  );
}
