"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { GhlFormEmbed } from "@/components/site/GhlFormEmbed";

const STORAGE_KEY = "asc_guide_popup_seen";

const FORM_ID = "alxqzSiTiGE5BWiIkyaV";
const FORM_NAME = "Silver IRA Handbook Request Form";

/**
 * Scroll-triggered popup on the home page — fires once per browser after the
 * visitor scrolls past the hero. The body is the same GHL-hosted Silver IRA
 * Handbook embed the hero CTA opens (GuideLeadModal), so every lead lands in
 * GHL directly; only the branded banner and the scroll trigger stay ours.
 */
export function GuidePopup() {
  const [open, setOpen] = useState(false);
  const dismissed = useRef(false);

  // Find the hero section and watch for scroll past it
  useEffect(() => {
    // Don't show if already seen
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      // localStorage unavailable — SSR or private browsing
      return;
    }

    // Find the hero section (first .hero-surface on the page)
    const hero = document.querySelector(".hero-surface") as HTMLElement | null;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the hero is no longer intersecting (scrolled past), show popup
        if (!entry.isIntersecting && !dismissed.current) {
          dismissed.current = true;
          setOpen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  function handleClose() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) handleClose();
      }}
    >
      <DialogContent className="max-h-[92vh] overflow-y-auto p-0 sm:max-w-md">
        {/* Top banner */}
        <div className="relative bg-gradient-to-br from-primary to-hero-from px-6 pb-6 pt-8 text-center text-white">
          <button
            onClick={handleClose}
            className="absolute right-3 top-3 rounded-full p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close popup"
          >
            <X className="h-4 w-4" />
          </button>
          <span className="mb-3 inline-block rounded bg-brass px-3 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-widest text-[#1b1408]">
            FREE
          </span>
          <DialogTitle className="font-display text-xl font-semibold leading-normal sm:text-2xl">
            Get the 2026 Silver Investor Guide
          </DialogTitle>
          <p className="mt-2 text-sm text-silver">
            What to know before you move retirement money into silver.
          </p>
        </div>

        {/* GHL-hosted handbook form — same embed as GuideLeadModal */}
        <div className="px-6 pb-6">
          <GhlFormEmbed
            formId={FORM_ID}
            formName={FORM_NAME}
            height={936}
            title={FORM_NAME}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
