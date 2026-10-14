"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LeadForm } from "@/components/forms/LeadForm";

const STORAGE_KEY = "asc_guide_popup_seen";

/**
 * Scroll-triggered popup on the home page — fires once per browser after the
 * visitor scrolls past the hero. The body is the native Silver IRA Handbook
 * lead form (same as GuideLeadModal), posting straight to the GHL inbound
 * webhook; only the branded banner and the scroll trigger are ours.
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
      {/*
        Same structure as GuideLeadModal: banner on top, native lead form
        (with the compliance notice inside it) in the scrollable body.
      */}
      <DialogContent className="flex max-h-[92vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
        {/* Top banner */}
        <div className="relative shrink-0 bg-gradient-to-br from-primary to-hero-from px-6 pb-6 pt-8 text-center text-white">
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

        {/* Scrollable region — native handbook form posting to the GHL webhook */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <LeadForm submitLabel="Send Me the Handbook" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
