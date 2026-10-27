import type { Metadata } from "next";
import { HomeImage } from "@/components/home/HomeImage";
import { CallLink, FaqList, FinalCtaButtons, HeroForm, HeroHeading, HeroPhoto, HomeProvider, StickyBar } from "@/components/home/HomeClient";
import { preload } from "react-dom";
import { COMPLIANCE, FAQ, FINAL_CTA, HERO, HOW, LOOK_INSIDE, PHONE, TRUST } from "@/lib/home-content";
import { Landmark, FileText, ShieldCheck, Vault } from "lucide-react";
import { pageMeta } from "@/lib/site";
import "./home.css";

export const metadata: Metadata = pageMeta({
  title: "Free Gold & Silver IRA Handbook",
  description:
    "Get the free Gold and Silver IRA handbook. See how a direct transfer works, what it costs, and talk to a real specialist with no pressure. Marina del Rey, CA. (866) 818-7243.",
  path: "/",
});

function Check() {
  return (
    <svg className="hp-tick" aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function Stars({ size = 28 }: { size?: number }) {
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

export default function HomePage() {
  // Above-the-fold fonts: fetched with the HTML instead of after the stylesheet is parsed.
  preload("/fonts/home/fraunces-600-latin.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload("/fonts/home/inter-latin.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return (
    <div className="hp">
      <HomeProvider>
        {/* ----------------------------- hero ----------------------------- */}
        <section className="hp-hero" aria-labelledby="hp-title">
          <div className="hp-wrap hp-hero-grid">
            <div className="hp-hero-text">
              <p className="hp-pill">{HERO.pill}</p>
              <div id="hp-title">
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
                <Stars />
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
                  <Stars size={22} />
                  <span className="hp-dealer">
                    <ShieldCheck aria-hidden="true" size={18} />
                    {HERO.dealer}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------- trust strip ---------------------------- */}
        <section className="hp-trust" aria-label="Why people trust Anchor">
          <div className="hp-wrap hp-trust-grid">
            {TRUST.map((t, i) => {
              const Icon = [ShieldCheck, Landmark, Vault, FileText][i];
              return (
              <div key={t.title} className="hp-trust-item">
                <Icon className="hp-trust-ic" aria-hidden="true" size={26} strokeWidth={1.6} />
                <div>
                  <p className="hp-trust-t">{t.title}</p>
                  <p className="hp-trust-s">{t.sub}</p>
                </div>
              </div>
              );
            })}
          </div>
        </section>

        {/* ---------------------------- look inside ---------------------------- */}
        <section className="hp-sec hp-light">
          <div className="hp-wrap">
            <h2 className="hp-h2">{LOOK_INSIDE.heading}</h2>
            <ul className="hp-inside">
              {LOOK_INSIDE.items.map((it) => (
                <li key={it.name}>
                  <HomeImage name={it.name} widths={it.widths} w={it.w} h={it.h} alt={it.alt} sizes="(max-width: 859px) 280px, 290px" />
                  <p>{it.caption}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------ how it works ------------------------------ */}
        <section className="hp-sec hp-dark">
          <div className="hp-wrap">
            <h2 className="hp-h2 hp-h2-dark">{HOW.heading}</h2>
            <ol className="hp-how">
              {HOW.steps.map((s, i) => (
                <li key={s.title}>
                  <span className="hp-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------------------------- FAQ ---------------------------------- */}
        <section className="hp-sec hp-light">
          <div className="hp-wrap hp-narrow">
            <h2 className="hp-h2">{FAQ.heading}</h2>
            <FaqList />
          </div>
        </section>

        {/* -------------------------------- final CTA -------------------------------- */}
        <section className="hp-sec hp-dark hp-final" aria-labelledby="hp-final-h">
          <div className="hp-wrap hp-final-grid">
            <HomeImage className="hp-final-cover" name="handbook-cover" widths={[320, 640]} w={1200} h={1552} alt="" sizes="(max-width: 859px) 180px, 240px" />
            <div>
              <h2 id="hp-final-h" className="hp-h2 hp-h2-dark hp-final-h">
                {FINAL_CTA.line1}
                <br />
                <span className="hp-nowrap">{FINAL_CTA.line2}</span>
              </h2>
              <FinalCtaButtons />
              <p className="hp-final-call">
                Prefer to talk? <CallLink location="final" className="hp-tel">{PHONE.display}</CallLink>
              </p>
            </div>
          </div>
        </section>

        {/* -------------------------------- compliance -------------------------------- */}
        <section className="hp-legal" aria-label="Important information">
          <div className="hp-wrap hp-narrow">
            <p>{COMPLIANCE}</p>
          </div>
        </section>

        <StickyBar />
      </HomeProvider>
    </div>
  );
}
