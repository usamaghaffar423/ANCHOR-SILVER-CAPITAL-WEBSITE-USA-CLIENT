import { HomeImage } from "@/components/home/HomeImage";
import { FAQ_LIVE, PHONE } from "@/lib/home-content";
import type { ReactNode } from "react";

/*
 * Homepage pieces with nothing interactive in them, so they are server components: no client JavaScript,
 * no hydration. Their clicks and toggles are counted by HomeTracking (one delegated listener).
 */

/** Photo above the form card. Hidden once the visitor is on step 2 (CSS `:has` on the card's data-step). */
export function HeroPhoto() {
  return (
    <div className="hp-photo" aria-hidden="true">
      <HomeImage name="metals3_cut" widths={[420, 840]} w={1200} h={668} sizes="(max-width: 859px) 56vw, 382px" alt="Gold and silver coins and bars" priority />
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
