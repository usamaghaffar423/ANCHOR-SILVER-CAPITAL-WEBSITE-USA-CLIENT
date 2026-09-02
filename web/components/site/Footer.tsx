import Link from "next/link";
import { AnchorGlyph } from "../brand/AnchorMark";
import { SITE } from "@/lib/site";

const quickLinks = [
  { to: "/why-silver", label: "Why Silver" },
  { to: "/silver-ira", label: "Silver IRA" },
  { to: "/physical-silver", label: "Physical Silver" },
  { to: "/silver-supply", label: "The Supply Story" },
  { to: "/about", label: "About Us" },
  { to: "/faq", label: "FAQ" },
];

const services = [
  { to: "/silver-ira", label: "Silver IRA Rollover" },
  { to: "/silver-ira", label: "401k to Silver IRA" },
  { to: "/physical-silver", label: "Physical Silver Purchase" },
  { to: "/silver-ira", label: "IRA Storage at Delaware Depository" },
  { to: "/get-started", label: "Free Consultation" },
];

function ColTitle({ children }: { children: string }) {
  return <h2 className="eyebrow mb-4 text-secondary">{children}</h2>;
}

export function Footer() {
  return (
    <footer className="bg-ink px-5 pt-14 pb-8 text-silver">
      <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="inline-flex items-center gap-3">
            <AnchorGlyph className="h-8 w-8 text-background" />
            <span className="font-display text-[0.9rem] font-semibold uppercase tracking-[0.18em] text-background">
              Anchor Silver Capital
            </span>
          </span>
          <p className="mt-4 font-display text-lg text-secondary">{SITE.tagline}</p>
          <p className="mt-4 text-sm">
            <a className="font-mono hover:text-background" href={SITE.phoneHref}>
              {SITE.phone}
            </a>
          </p>
          <p className="text-sm">
            <a className="hover:text-background" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
          </p>
          <address className="mt-2 text-sm not-italic leading-relaxed">
            {SITE.street}
            <br />
            {SITE.city}, {SITE.state} {SITE.zip}
          </address>
        </div>

        <div>
          <ColTitle>Quick Links</ColTitle>
          <ul className="text-sm">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.to} className="inline-block py-1.5 hover:text-background">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ColTitle>Services</ColTitle>
          <ul className="text-sm">
            {services.map((l) => (
              <li key={l.label}>
                <Link href={l.to} className="inline-block py-1.5 hover:text-background">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ColTitle>Trust</ColTitle>
          <ul className="space-y-3 text-sm">
            <li className="inline-flex items-center gap-2 rounded-sm border border-silver/25 px-3 py-2 text-xs uppercase tracking-wider">
              BBB Accredited Business
            </li>
            <li className="text-xs leading-relaxed text-silver-deep">
              As seen on: Fox Business · Yahoo Finance · Newsmax
            </li>
            <li className="text-xs leading-relaxed">IRA Custodian Partner: Equity Trust Company</li>
            <li className="text-xs leading-relaxed">Depository Partner: Delaware Depository</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 w-full max-w-6xl border-t border-silver/20 pt-6">
        <p className="text-xs text-silver-deep">
          Copyright 2026 {SITE.legal}. All rights reserved. |{" "}
          <Link href="/privacy" className="inline-block py-1.5 hover:text-background">
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link href="/terms" className="inline-block py-1.5 hover:text-background">
            Terms of Use
          </Link>{" "}
          |{" "}
          <Link href="/disclaimer" className="inline-block py-1.5 hover:text-background">
            Disclaimer
          </Link>
        </p>
        <p className="mt-4 max-w-4xl text-xs italic leading-relaxed text-silver-deep">
          {SITE.legal} is a precious metals dealer, not a registered investment advisor. Precious
          metals involve risk. Past performance does not guarantee future results. All performance
          figures referenced are historical. Physical precious metals are not FDIC insured.
        </p>
      </div>
    </footer>
  );
}
