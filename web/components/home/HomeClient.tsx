"use client";

import { CcpaNotice } from "@/components/site/CcpaNotice";
import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  FORM,
  HERO,
  PHONE,
  STICKY,
} from "@/lib/home-content";
import { LEAD_WEBHOOK_URL, fetchVisitorIp, goToThankYou, toE164, trackLeadConversion } from "@/lib/lead";
import { readAttribution, trackHome } from "@/lib/home-track";

/** Notice version for this page's consent text (the site-wide forms are still v2.0). */
const HOME_NOTICE_VERSION = "v3.0";
const FORM_NAME = "homepage_handbook";

/* ------------------------------ page tracking ------------------------------ */

/** Wraps a form page: counts scroll_50 once per page view. (The form itself keeps its own state.) */
export function HomeProvider({ children }: { children: ReactNode }) {
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
  return <>{children}</>;
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
        <span className="hp-h1-l1">{HERO.line1}</span>{" "}
        <span className="hp-h1-l2">{HERO.line2}</span>{" "}
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

/* ------------------------- one-step form (homepage) ------------------------ */

const EMAIL_DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "aol.com", "comcast.net"];

function editDistance(a: string, b: string) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

/** "name@gmial.com" -> "name@gmail.com" for the common providers; "" when nothing looks wrong. A hint only, never blocks. */
function suggestEmail(value: string) {
  const m = value.trim().match(/^([^@\s]+)@([^@\s]+)$/);
  if (!m) return "";
  const domain = m[2].toLowerCase();
  if (EMAIL_DOMAINS.includes(domain)) return "";
  let best = "";
  let bestDist = 3;
  for (const d of EMAIL_DOMAINS) {
    const dist = editDistance(domain, d);
    if (dist < bestDist) {
      bestDist = dist;
      best = d;
    }
  }
  return best && bestDist <= 2 ? `${m[1]}@${best}` : "";
}

/** Formats US digits as you type: (555) 555-0188. A leading 1 is dropped. */
function formatPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.length > 10 && d[0] === "1") d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

type FieldName = "first_name" | "last_name" | "email" | "phone";

/**
 * The homepage form: one step, four required fields (First name, Last name, Email, Mobile phone), then the
 * submit button, the "Secure" line and the consent text (unchanged). Same webhook, redirect and conversion
 * tracking as before; account_type is sent as "" (the key stays so the GHL mapping does not break).
 */
export function HeroFormOneStep() {
  const uid = useId();
  const [err, setErr] = useState("");
  const [errField, setErrField] = useState<FieldName | "">("");
  const [sending, setSending] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [phone, setPhone] = useState("");
  const [hint, setHint] = useState("");
  const errRef = useRef<HTMLParagraphElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const valid = (name: FieldName, value: string) =>
    name === "email" ? /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value.trim()) : name === "phone" ? toE164(value) !== null : value.trim() !== "";

  /** Clear the error as soon as the field it points at becomes valid (on input and on blur). */
  function recheck(name: FieldName, value: string) {
    if (errField === name && valid(name, value)) {
      setErr("");
      setErrField("");
    }
  }

  // form_start: first focus of the first field, once per visit
  function onFirstFocus() {
    try {
      if (sessionStorage.getItem("hp_form_start")) return;
      sessionStorage.setItem("hp_form_start", "1");
    } catch {
      /* storage blocked: it may fire again, which is harmless */
    }
    trackHome("form_start");
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
    const last = get("last_name");
    const email = get("email");
    const e164 = toE164(get("phone"));
    const focus = (n: string) => (f.elements.namedItem(n) as HTMLInputElement | null)?.focus();
    const fail = (name: FieldName, msg: string) => {
      setErr(msg);
      setErrField(name);
      focus(name);
    };
    if (!first) return fail("first_name", "Please enter your first name.");
    if (!last) return fail("last_name", "Please enter your last name.");
    if (!valid("email", email)) return fail("email", "Please enter a valid email address.");
    if (!e164) return fail("phone", "Please enter a 10-digit mobile number.");

    setSending(true);
    const payload = {
      first_name: first,
      last_name: last,
      email,
      phone: e164,
      account_type: "",
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
      trackLeadConversion(email, e164, FORM_NAME);
      trackHome("form_submit");
      setRedirecting(true);
      goToThankYou(700);
    } catch (error) {
      console.error("[homepage-form] webhook request failed", error);
      setSending(false);
      setErr(`Something went wrong. Please try again or call ${PHONE.display}.`);
      errRef.current?.focus();
    }
  }

  const inv = (n: FieldName) => (errField === n ? true : undefined);

  return (
    <div className="hp-card hp-card-one" id="get">
      <form className="hp-step2 hp-one" onSubmit={onSubmit} noValidate data-clarity-mask="true">
        <div className="hp-row2">
          <div>
            <label className="hp-lbl" htmlFor="hp-first">
              First name
            </label>
            <input id="hp-first" name="first_name" type="text" autoComplete="given-name" placeholder="First name" required className="hp-input" onFocus={onFirstFocus} onInput={(e) => recheck("first_name", e.currentTarget.value)} onBlur={(e) => recheck("first_name", e.currentTarget.value)} aria-invalid={inv("first_name")} />
          </div>
          <div>
            <label className="hp-lbl" htmlFor={`${uid}-last`}>
              Last name
            </label>
            <input id={`${uid}-last`} name="last_name" type="text" autoComplete="family-name" placeholder="Last name" required className="hp-input" onInput={(e) => recheck("last_name", e.currentTarget.value)} onBlur={(e) => recheck("last_name", e.currentTarget.value)} aria-invalid={inv("last_name")} />
          </div>
        </div>
        <label className="hp-lbl" htmlFor={`${uid}-email`}>
          Email
        </label>
        <input ref={emailRef} id={`${uid}-email`} name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@email.com" required className="hp-input" onInput={(e) => { recheck("email", e.currentTarget.value); if (hint) setHint(""); }} onBlur={(e) => { recheck("email", e.currentTarget.value); setHint(suggestEmail(e.currentTarget.value)); }} aria-invalid={inv("email")} />
        {hint && (
          <button type="button" className="hp-hint" onClick={() => { if (emailRef.current) emailRef.current.value = hint; setHint(""); }}>
            Did you mean <b>{hint}</b>?
          </button>
        )}
        <label className="hp-lbl" htmlFor={`${uid}-phone`}>
          Mobile phone
        </label>
        <input id={`${uid}-phone`} name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="(555) 555-5555" required className="hp-input" value={phone} onChange={(e) => { const v = formatPhone(e.target.value); setPhone(v); recheck("phone", v); }} onBlur={(e) => recheck("phone", e.currentTarget.value)} aria-invalid={inv("phone")} />
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
        <CcpaNotice className="hp-consent hp-ccpa" />
      </form>
    </div>
  );
}

/* ------------------------------- final CTA -------------------------------- */

/** Final CTA: one button that takes the visitor back to the form and puts the cursor in First name. */
export function FinalCtaButton() {
  return (
    <button
      type="button"
      className="hp-btn hp-final-btn"
      onClick={() => {
        trackHome("cta_click", { location: "final" });
        document.getElementById("get")?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "start",
        });
        window.setTimeout(() => document.getElementById("hp-first")?.focus({ preventScroll: true }), 450);
      }}
    >
      Get the Free Handbook <span aria-hidden="true">→</span>
    </button>
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
