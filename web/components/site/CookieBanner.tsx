"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonStyles } from "./ui";

const KEY = "asc-cookie-consent";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* storage blocked */
    }
  }, []);

  // Lets page CSS (e.g. the homepage sticky CTA bar) step aside while the banner is up.
  useEffect(() => {
    if (!show) return;
    document.documentElement.setAttribute("data-cookie-banner", "");
    return () => document.documentElement.removeAttribute("data-cookie-banner");
  }, [show]);

  if (!show) return null;

  const decide = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* storage blocked */
    }
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-silver/20 bg-ink px-3 py-2 text-silver min-[860px]:px-5 min-[860px]:py-4"
    >
      {/* Phones and small tablets (<860px): one slim row, about 56px tall */}
      <div className="flex items-center gap-2 min-[860px]:hidden">
        <p className="min-w-0 flex-1 text-xs leading-tight">
          We use cookies to improve your site.{" "}
          <Link href="/privacy" className="underline underline-offset-2">
            Privacy
          </Link>
        </p>
        <button className="h-10 shrink-0 rounded-sm border border-secondary px-3 text-xs font-semibold text-secondary" onClick={() => decide("declined")}>
          Decline
        </button>
        <button className="h-10 shrink-0 rounded-sm bg-secondary px-4 text-xs font-semibold text-accent" onClick={() => decide("accepted")}>
          Accept
        </button>
      </div>
      <div className="mx-auto hidden w-full max-w-6xl flex-col gap-3 min-[860px]:flex min-[860px]:flex-row min-[860px]:items-center min-[860px]:justify-between">
        <p className="text-xs leading-relaxed">
          We use cookies to measure site performance and improve your experience. You can decline
          non-essential cookies at any time. See our{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-background">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="underline underline-offset-4 hover:text-background">
            Terms of Use
          </Link>{" "}
          for details.
        </p>
        <div className="flex shrink-0 gap-2">
          <button className={`${buttonStyles.outlineLight} py-2 text-xs`} onClick={() => decide("declined")}>
            Decline
          </button>
          <button className={`${buttonStyles.silver} py-2 text-xs`} onClick={() => decide("accepted")}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
