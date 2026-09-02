import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "../brand/AnchorMark";
import { NAV, SITE } from "@/lib/site";
import { buttonStyles } from "./ui";

function TopBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="bg-ink px-5 text-silver">
      <div className="mx-auto flex h-auto min-h-9 w-full max-w-6xl items-center justify-between gap-3 py-1 text-[0.65rem] leading-tight tracking-wide sm:h-9 sm:text-[0.7rem] sm:leading-none">
        <p className="whitespace-normal sm:truncate">
          Silver up over 75% in the past 12 months. Gold up over 30%.{" "}
          <span className="hidden sm:inline">Call us: </span>
          <a href={SITE.phoneHref} className="font-mono underline underline-offset-2">
            {SITE.phone}
          </a>
        </p>
        <button
          onClick={() => setOpen(false)}
          aria-label="Dismiss announcement"
          className="-mr-2 grid h-10 w-10 shrink-0 place-items-center text-silver-deep hover:text-background"
        >
          ✕
        </button>

      </div>
    </div>
  );
}

export function Header() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const overHero = path === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenu(false), [path]);

  const solid = scrolled || !overHero;

  return (
    <header className="sticky top-0 z-50">
      <TopBar />
      <div
        className={`px-5 transition-colors duration-300 ${
          solid ? "bg-primary shadow-[var(--shadow-card)]" : "bg-ink/0"
        }`}
      >
        <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between">
          <Link to="/" aria-label="Anchor Silver Capital home">
            <Logo tone={solid || overHero ? "light" : "dark"} />
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm font-medium text-background/90 transition-colors hover:text-background"
                activeProps={{ className: "text-background" }}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/get-started" className={`${buttonStyles.silver} py-2.5`}>
              Get Started
            </Link>
          </nav>

          <button
            className="-mr-2 grid h-11 w-11 place-items-center text-background md:hidden"
            aria-label="Open menu"
            aria-expanded={menu}
            onClick={() => setMenu((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span aria-hidden="true" className="block">
              <span className="block h-0.5 w-6 bg-current" />
              <span className="mt-1.5 block h-0.5 w-6 bg-current" />
              <span className="mt-1.5 block h-0.5 w-6 bg-current" />
            </span>
          </button>

        </div>
      </div>

      {menu && (
        <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-accent px-6 pb-10 pt-6 md:hidden">
          <div className="flex items-center justify-between">
            <Logo tone="light" />
            <button
              aria-label="Close menu"
              className="-mr-2 grid h-11 w-11 place-items-center text-background"
              onClick={() => setMenu(false)}
            >
              ✕
            </button>
          </div>
          <nav className="mt-8 flex flex-col gap-5" aria-label="Mobile">

            {[...NAV, { to: "/silver-supply", label: "The Supply Story" }, { to: "/faq", label: "FAQ" }, { to: "/market-update", label: "Market Update" }, { to: "/contact", label: "Contact" }].map(
              (item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="font-display text-2xl text-background"
                  onClick={() => setMenu(false)}
                >
                  {item.label}
                </Link>
              ),
            )}
            <Link to="/get-started" className={`${buttonStyles.silver} mt-4 w-full`}>
              Get Started
            </Link>
            <a href={SITE.phoneHref} className="font-mono text-secondary">
              {SITE.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
