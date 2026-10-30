"use client";

import { useGpc, useOptedOut, setOptOut } from "@/lib/consent";
import { PRIVACY_CHOICES_PAGE } from "@/content/privacy-ccpa";

/**
 * "Do not sell or share my personal information" switch. Uses the one consent module, so
 * flipping it takes effect immediately (no reload) and is remembered for 12 months.
 * When the browser sends Global Privacy Control, the opt-out is on and locked.
 */
export function PrivacyChoicesPanel() {
  const optedOut = useOptedOut();
  const gpc = useGpc();

  return (
    <div className="rounded-sm border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 id="optout-label" className="font-display text-xl text-foreground">
            {PRIVACY_CHOICES_PAGE.toggleLabel}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{PRIVACY_CHOICES_PAGE.toggleHelp}</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={optedOut}
          aria-labelledby="optout-label"
          disabled={gpc}
          onClick={() => setOptOut(!optedOut)}
          className={`relative mt-1 inline-flex h-8 w-14 shrink-0 items-center rounded-full border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-80 ${
            optedOut ? "border-primary bg-primary" : "border-border bg-muted"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
              optedOut ? "translate-x-7" : "translate-x-1"
            }`}
          />
          <span className="sr-only">{optedOut ? "On" : "Off"}</span>
        </button>
      </div>

      <p className="mt-4 text-sm font-medium text-foreground" role="status" aria-live="polite">
        {optedOut ? "You have opted out of the sale and sharing of your personal information." : "You have not opted out."}
      </p>

      {gpc && (
        <p className="mt-3 rounded-sm border border-primary/30 bg-primary/5 p-3 text-sm leading-relaxed text-foreground">
          <strong>{PRIVACY_CHOICES_PAGE.gpcHonored}.</strong> {PRIVACY_CHOICES_PAGE.gpcExplain}
        </p>
      )}
    </div>
  );
}
