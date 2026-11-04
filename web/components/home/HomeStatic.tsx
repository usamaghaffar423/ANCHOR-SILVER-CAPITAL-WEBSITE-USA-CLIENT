import { FAQ_LIVE, PHONE } from "@/lib/home-content";
import type { ReactNode } from "react";

/*
 * Homepage pieces with nothing interactive in them, so they are server components: no client JavaScript,
 * no hydration. Their clicks and toggles are counted by HomeTracking (one delegated listener).
 */

/**
 * The hero flag as the background of a lower dark band (How it works, the final call to action): the same
 * files as the hero, a uniform dark green wash, lazy-loaded (no preload, no fetch priority: it is below the fold).
 */
export function FlagBand() {
  return (
    <div className="hp-bg" aria-hidden="true">
      <picture>
        <source media="(min-width: 860px)" type="image/avif" srcSet="/images/home/flag-d-1100.avif 1100w, /images/home/flag-d-1920.avif 1920w" sizes="100vw" />
        <source media="(min-width: 860px)" type="image/webp" srcSet="/images/home/flag-d-1100.webp 1100w, /images/home/flag-d-1920.webp 1920w" sizes="100vw" />
        <source type="image/avif" srcSet="/images/home/flag-m-440.avif 440w, /images/home/flag-m-880.avif 880w" sizes="100vw" />
        <source type="image/webp" srcSet="/images/home/flag-m-440.webp 440w, /images/home/flag-m-880.webp 880w" sizes="100vw" />
        <img src="/images/home/flag-m-880.webp" width={440} height={569} alt="" loading="lazy" decoding="async" />
      </picture>
    </div>
  );
}

/**
 * Native <details name="faq">: every answer is in the server HTML (crawlable, readable with JavaScript off),
 * only one is open at a time (the shared name), and the first starts open.
 */
export function FaqList() {
  return (
    <div className="hp-faq">
      {FAQ_LIVE.map((it, i) => (
        <details key={it.q} name="faq" className="hp-faq-item" open={i === 0}>
          <summary>
            <h3>{it.q}</h3>
            <span className="hp-pm" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                <path d="M5 12h14" />
                <path className="hp-pm-v" d="M12 5v14" />
              </svg>
            </span>
          </summary>
          <div className="hp-faq-a">
            <p>{it.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

/** A tel: link. `data-hp-call` lets HomeTracking count the click as click_to_call (UET phone_click is delegated site-wide). */
export function CallLink({ location, className, children }: { location: string; className?: string; children: ReactNode }) {
  return (
    <a href={PHONE.href} className={className} data-hp-call={location}>
      {children}
    </a>
  );
}
