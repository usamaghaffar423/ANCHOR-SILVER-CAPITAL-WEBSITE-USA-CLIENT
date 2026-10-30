import type { Metadata } from "next";
import Link from "next/link";
import { preload } from "react-dom";
import { Check, Download, Phone } from "lucide-react";
import { JsonLd } from "@/components/site/JsonLd";
import { COMPLIANCE, PHONE } from "@/lib/home-content";
import { BOOKING_URL } from "@/lib/lead";
import { SITE, breadcrumbSchema, pageMeta } from "@/lib/site";
import "../home.css";
import "./thank-you.css";

// Thank-you pages are only meant to be reached after a form submit: keep them out of the index.
export const metadata: Metadata = {
  ...pageMeta({
    title: "Thank You — Your Handbook Is On Its Way",
    description:
      "Thanks for your request. Your free Precious Metals IRA Handbook is being emailed to you. Want it right now? Download it here, or speak with an Anchor Silver specialist.",
    path: "/thank-you-handbook",
  }),
  robots: { index: false, follow: false },
};

const PDF = "/precious-metals-ira-handbook.pdf?v=20261027";

const STEPS = [
  {
    title: "Check your inbox",
    body: "The email comes from Anchor Silver Capital. Not there? Check spam or promotions.",
  },
  {
    title: "Expect our call",
    body: `A specialist will call from ${PHONE.display}. Save the number so you know it is us.`,
  },
  {
    title: "Ask anything",
    body: "Get answers about your account, costs, and timing. No obligation.",
  },
];

const HANDY = [
  "Where your retirement money is held now",
  "A rough idea of the balance",
  "Any questions from the handbook",
];

/**
 * Own header and footer: the site's are not rendered on this route (components/site/ChromeGate.tsx),
 * so the page is a short, focused confirmation. Tokens, fonts and resets come from ../home.css.
 */
export default function ThankYouHandbookPage() {
  preload("/fonts/home/fraunces-600-latin.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload("/fonts/home/inter-latin.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return (
    <div className="hp ty">
      <JsonLd data={breadcrumbSchema("/thank-you-handbook", "Thank You")} />

      {/* ------------------------------ header ------------------------------ */}
      <header className="ty-top">
        <div className="ty-wrap ty-top-bar">
          <Link href="/" aria-label="Anchor Silver Capital home" className="ty-logo">
            <img src="/images/home/anchor-logo-horizontal.webp" alt="Anchor Silver Capital" width={552} height={165} />
          </Link>
          <a href={PHONE.href} className="ty-top-call" data-call="">
            <span className="ty-top-ic" aria-hidden="true">
              <Phone size={16} />
            </span>
            <span>
              <small>Talk to a specialist</small>
              <b>{PHONE.display}</b>
            </span>
          </a>
        </div>
      </header>

      {/* ------------------------------- hero ------------------------------- */}
      <section className="ty-hero" aria-labelledby="ty-title">
        <div className="ty-wrap ty-hero-grid">
          <div className="ty-hero-text">
            <p className="ty-pill">
              <span aria-hidden="true">
                <Check size={12} strokeWidth={3.5} />
              </span>
              You are all set
            </p>
            <h1 id="ty-title">Your handbook is on its way.</h1>
            <p className="ty-sub">Check your inbox. Want it right now?</p>
            <a href={PDF} download="Precious-Metals-IRA-Handbook.pdf" className="ty-btn ty-btn-gold">
              <Download size={17} aria-hidden="true" />
              Download the handbook
            </a>
            <p className="ty-fine">PDF, about 2.5 MB</p>
          </div>
          <div className="ty-hero-cover">
            <img
              src="/images/home/handbook-cover-640.webp"
              srcSet="/images/home/handbook-cover-320.webp 320w, /images/home/handbook-cover-640.webp 640w"
              sizes="(max-width: 859px) 200px, 300px"
              width={640}
              height={828}
              alt="The Precious Metals IRA Handbook"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* --------------------------- what happens next --------------------------- */}
      <section className="ty-next" aria-labelledby="ty-next-h">
        <div className="ty-wrap">
          <h2 id="ty-next-h" className="ty-h2">
            What happens next
          </h2>
          <ol className="ty-steps">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <span className="ty-num" aria-hidden="true">
                  {i + 1}
                </span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ----------------------------- talk sooner ----------------------------- */}
      <section className="ty-talk" aria-label="Talk to a specialist">
        <div className="ty-wrap">
          <div className="ty-talk-grid">
            <div className="ty-talk-card">
              <h2>Want to talk sooner?</h2>
              <p>Call now or pick a time that works for you.</p>
              <div className="ty-talk-btns">
                <a href={PHONE.href} className="ty-btn ty-btn-gold" data-call="">
                  Call {PHONE.display}
                </a>
                <a href={BOOKING_URL || "#book"} className="ty-btn ty-btn-ghost" rel={BOOKING_URL ? "noopener" : undefined}>
                  Pick a time
                </a>
              </div>
            </div>
            <div className="ty-handy">
              <h2>Have these handy for your call</h2>
              <ul>
                {HANDY.map((h) => (
                  <li key={h}>
                    <Check size={15} strokeWidth={3} aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div id="book" className="ty-book">
            {BOOKING_URL ? (
              <iframe src={BOOKING_URL} title="Book a call with an Anchor Silver specialist" loading="lazy" />
            ) : (
              <div className="ty-book-fallback">
                <h2>Call to book your time</h2>
                <p>
                  Call{" "}
                  <a href={PHONE.href} data-call="">
                    {PHONE.display}
                  </a>{" "}
                  and we will set up a time that works for you. Online scheduling is coming soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------ footer ------------------------------ */}
      <footer className="ty-foot">
        <div className="ty-wrap">
          <img src="/images/home/anchor-logo-horizontal.webp" alt="Anchor Silver Capital" width={552} height={165} className="ty-foot-logo" />
          <p className="ty-legal">{COMPLIANCE}</p>
          <p className="ty-foot-links">
            © {SITE.legal} · {SITE.city}, {SITE.state} · <a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms of Use</a> ·{" "}
            <a href="/riskdisclosure">Disclosure</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
