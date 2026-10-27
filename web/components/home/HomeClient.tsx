"use client";

import Image from "next/image";
import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ACCOUNT_TYPES,
  FAQ,
  FINAL_CTA,
  FORM,
  HERO,
  PHONE,
  STICKY,
  type AccountType,
} from "@/lib/home-content";
import { LEAD_WEBHOOK_URL, fetchVisitorIp, goToThankYou, setUetEnhancedConversion, toE164, trackUet } from "@/lib/lead";
import { readAttribution, trackHome } from "@/lib/home-track";

/** Notice version for this page's consent text (the site-wide forms are still v2.0). */
const HOME_NOTICE_VERSION = "v3.0";
const FORM_NAME = "homepage_handbook";

/* ------------------------------ shared state ------------------------------ */

type Ctx = {
  account: AccountType | "";
  step: 1 | 2;
  pickAccount: (a: AccountType, where: "hero" | "final") => void;
  setStep: (s: 1 | 2) => void;
};
const HomeCtx = createContext<Ctx | null>(null);
const useHome = () => {
  const c = useContext(HomeCtx);
  if (!c) throw new Error("HomeProvider missing");
  return c;
};

export function HomeProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<AccountType | "">("");
  const [step, setStep] = useState<1 | 2>(1);

  const pickAccount = useCallback((a: AccountType, where: "hero" | "final") => {
    setAccount(a);
    setStep(2);
    trackHome("form_step1", { account_type: a, location: where });
    if (where === "hero") {
      // The clicked button is unmounted by the step change; move focus to the new heading so
      // keyboard and screen-reader users land in the form (not first name: it would pop the
      // phone keyboard over the card).
      requestAnimationFrame(() => document.querySelector<HTMLElement>(".hp-fh")?.focus({ preventScroll: true }));
    }
    if (where === "final") {
      // Hand the visitor back to the hero form, already on step 2.
      requestAnimationFrame(() => {
        const el = document.getElementById("get");
        el?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
        window.setTimeout(() => document.getElementById("hp-first")?.focus({ preventScroll: true }), 450);
      });
    }
  }, []);

  // scroll_50, once per page view
  useEffect(() => {
    let sent = false;
    const onScroll = () => {
      if (sent) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= 0.5) {
        sent = true;
        trackHome("scroll_50");
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <HomeCtx.Provider value={{ account, step, pickAccount, setStep }}>{children}</HomeCtx.Provider>;
}

/* -------------------------------- hero H1 --------------------------------- */

/** Three-line justified stack. `?h=gold|silver` swaps the third line. */
export function HeroHeading() {
  const variant = useSyncExternalStore(
    () => () => {},
    () => {
      const h = new URLSearchParams(location.search).get("h");
      return h === "gold" || h === "silver" ? h : "default";
    },
    () => "default" as const,
  );
  return (
    <div className="hp-h1wrap">
      <h1 className="hp-h1">
        <span className="hp-h1-l1">{HERO.line1}</span>
        <span className="hp-h1-l2">{HERO.line2}</span>
        <span className={`hp-h1-l3 hp-h1-${variant}`}>
          {variant !== "silver" && <b className="hp-gold">Gold</b>}
          {variant === "default" && " and "}
          {variant !== "gold" && <b className="hp-silver">Silver</b>}
          {" IRA."}
        </span>
      </h1>
    </div>
  );
}

/* --------------------------------- the form -------------------------------- */

function AccountButtons({ where, className = "" }: { where: "hero" | "final"; className?: string }) {
  const { pickAccount } = useHome();
  return (
    <div className={`hp-acct ${className}`}>
      {ACCOUNT_TYPES.map((a) => (
        <button key={a} type="button" className="hp-acct-btn" onClick={() => pickAccount(a, where)}>
          <span>{a}</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export function HeroForm() {
  const { account, step, setStep } = useHome();
  const uid = useId();
  const [err, setErr] = useState("");
  const [errField, setErrField] = useState<"first_name" | "email" | "phone" | "">("");
  const [sending, setSending] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const errRef = useRef<HTMLParagraphElement>(null);

  /** Clear the error as soon as the field it points at becomes valid (on input and on blur). */
  function recheck(name: "first_name" | "email" | "phone", value: string) {
    if (errField !== name) return;
    const ok = name === "first_name" ? value.trim() !== "" : name === "email" ? /^[^@s]+@[^@s]+.[^@s]+$/.test(value.trim()) : toE164(value) !== null;
    if (ok) {
      setErr("");
      setErrField("");
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setErr("");
    setErrField("");
    const f = e.currentTarget;
    const get = (n: string) => ((f.elements.namedItem(n) as HTMLInputElement | null)?.value ?? "").trim();
    if (get("website")) return; // honeypot: bots fill it, people never see it

    const first = get("first_name");
    const email = get("email");
    const e164 = toE164(get("phone"));
    const focus = (n: string) => (f.elements.namedItem(n) as HTMLInputElement | null)?.focus();
    if (!first) {
      setErr("Please enter your first name.");
      setErrField("first_name");
      return focus("first_name");
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setErr("Please enter a valid email address.");
      setErrField("email");
      return focus("email");
    }
    if (!e164) {
      setErr("Please enter a 10-digit mobile number.");
      setErrField("phone");
      return focus("phone");
    }

    setSending(true);
    const payload = {
      first_name: first,
      email,
      phone: e164,
      account_type: account || "Not Specified",
      ip: await fetchVisitorIp(),
      ...readAttribution(),
      page_url: location.href,
      device: window.matchMedia("(max-width: 859px)").matches ? "mobile" : "desktop",
      submitted_at: new Date().toISOString(),
      notice_version: HOME_NOTICE_VERSION,
      consent_text: FORM.consent,
      form_name: FORM_NAME,
    };
    try {
      const r = await fetch(LEAD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(`webhook ${r.status}`);
      setUetEnhancedConversion(email, e164);
      trackUet("lead", { event_category: "lead_form", event_label: FORM_NAME });
      trackHome("form_submit", { account_type: payload.account_type });
      setRedirecting(true);
      goToThankYou(700);
    } catch (error) {
      console.error("[homepage-form] webhook request failed", error);
      setSending(false);
      setErr(`Something went wrong. Please try again or call ${PHONE.display}.`);
      errRef.current?.focus();
    }
  }

  return (
    <div className="hp-card" id="get" data-step={step}>
      {step === 1 ? (
        <div className="hp-step1">
          <p className="hp-stepper" aria-hidden="false">
            <span className="hp-dash on" />
            <span className="hp-dash" />
            <span>STEP 1 OF 2</span>
          </p>
          <p className="hp-q" id={`${uid}-q`} tabIndex={-1}>
            {FORM.step1Question}
          </p>
          <div role="group" aria-labelledby={`${uid}-q`}>
            <AccountButtons where="hero" />
          </div>
        </div>
      ) : (
        <form className="hp-step2" onSubmit={onSubmit} noValidate>
          <p className="hp-stepper">
            <span className="hp-dash on" />
            <span className="hp-dash on" />
            <span>STEP 2 OF 2</span>
            <span className="hp-pill-acct">{account || "Other"}</span>
            <button type="button" className="hp-link" onClick={() => {
                setStep(1);
                requestAnimationFrame(() => document.querySelector<HTMLElement>(".hp-q")?.focus({ preventScroll: true }));
              }}>
              Change
            </button>
          </p>
          <h2 className="hp-fh" tabIndex={-1}>{FORM.step2Heading}</h2>
          <p className="hp-fsub">{FORM.step2Sub}</p>
          <label className="hp-lbl" htmlFor="hp-first">
            First name
          </label>
          <input id="hp-first" name="first_name" type="text" autoComplete="given-name" placeholder="First name" className="hp-input" onInput={(e) => recheck("first_name", e.currentTarget.value)} onBlur={(e) => recheck("first_name", e.currentTarget.value)} aria-invalid={errField === "first_name" || undefined} />
          <label className="hp-lbl" htmlFor={`${uid}-email`}>
            Email
          </label>
          <input id={`${uid}-email`} name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@email.com" className="hp-input" onInput={(e) => recheck("email", e.currentTarget.value)} onBlur={(e) => recheck("email", e.currentTarget.value)} aria-invalid={errField === "email" || undefined} />
          <label className="hp-lbl" htmlFor={`${uid}-phone`}>
            Mobile phone
          </label>
          <input id={`${uid}-phone`} name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="(555) 555-5555" className="hp-input" aria-describedby={`${uid}-help`} onInput={(e) => recheck("phone", e.currentTarget.value)} onBlur={(e) => recheck("phone", e.currentTarget.value)} aria-invalid={errField === "phone" || undefined} />
          <p className="hp-help" id={`${uid}-help`}>
            {FORM.phoneHelper}
          </p>
          <div className="hp-hp" aria-hidden="true">
            <label htmlFor={`${uid}-web`}>Leave this field empty</label>
            <input id={`${uid}-web`} name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <p className="hp-err" role="alert" tabIndex={-1} ref={errRef}>
            {err}
          </p>
          <button type="submit" className="hp-btn" disabled={sending}>
            {sending ? (redirecting ? "Redirecting…" : "Sending…") : <>{FORM.submit} <span aria-hidden="true">→</span></>}
          </button>
          <p className="hp-secure">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>{" "}
            {FORM.secure}
          </p>
          <p className="hp-consent">
            {FORM.consent} See our <Link href="/terms">Terms of Use</Link> and <Link href="/privacy">Privacy Policy</Link>.
          </p>
          <button type="button" className="hp-link hp-back" onClick={() => {
                setStep(1);
                requestAnimationFrame(() => document.querySelector<HTMLElement>(".hp-q")?.focus({ preventScroll: true }));
              }}>
            ← Back
          </button>
        </form>
      )}
    </div>
  );
}

/** Photo above the form card. Hidden on phones once the visitor is on step 2. */
export function HeroPhoto() {
  const { step } = useHome();
  return (
    <div className={`hp-photo ${step === 2 ? "hp-photo-hide" : ""}`} aria-hidden="true">
      <Image src="/images/home/metals3_cut.webp" alt="" width={1200} height={668} priority fetchPriority="high" unoptimized sizes="(max-width: 859px) 56vw, 400px" />
    </div>
  );
}

/* ------------------------------- final CTA -------------------------------- */

export function FinalCtaButtons() {
  return (
    <div>
      <p className="hp-fc-label">{FINAL_CTA.label}</p>
      <AccountButtons where="final" className="hp-acct-final" />
    </div>
  );
}

/* --------------------------------- FAQ ------------------------------------ */

export function FaqList() {
  const [open, setOpen] = useState(0);
  const base = useId();
  return (
    <div className="hp-faq">
      {FAQ.items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} className={`hp-faq-item ${isOpen ? "open" : ""}`}>
            <h3>
              <button
                type="button"
                id={`${base}-b${i}`}
                aria-expanded={isOpen}
                aria-controls={`${base}-p${i}`}
                onClick={() => {
                  if (!isOpen) trackHome("faq_open", { question: it.q });
                  setOpen(isOpen ? -1 : i);
                }}
              >
                <span>{it.q}</span>
                <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </h3>
            <div id={`${base}-p${i}`} role="region" aria-labelledby={`${base}-b${i}`} hidden={!isOpen}>
              <p>{it.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------ sticky bar -------------------------------- */

/** Phones only. Slides away while the hero form is on screen. */
export function StickyBar() {
  const [hide, setHide] = useState(true);
  useEffect(() => {
    const el = document.getElementById("get");
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setHide(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`hp-sticky ${hide ? "hp-sticky-hide" : ""}`} aria-hidden={hide} {...(hide ? { inert: true } : {})}>
      <a
        href="#get"
        className="hp-sticky-cta"
        onClick={(e) => {
          e.preventDefault();
          trackHome("cta_click", { location: "sticky" });
          document.getElementById("get")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      >
        {STICKY.cta} <span aria-hidden="true">→</span>
      </a>
      <a href={PHONE.href} className="hp-sticky-call" aria-label={STICKY.callLabel} onClick={() => trackHome("click_to_call", { location: "sticky" })}>
        <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
        </svg>
      </a>
    </div>
  );
}

/** Wraps the hero call link so the click is counted. */
export function CallLink({ location, className, children }: { location: string; className?: string; children: ReactNode }) {
  return (
    <a href={PHONE.href} className={className} onClick={() => trackHome("click_to_call", { location })}>
      {children}
    </a>
  );
}
