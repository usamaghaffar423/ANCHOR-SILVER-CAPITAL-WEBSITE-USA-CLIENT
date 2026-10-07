"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GhlFormEmbed } from "@/components/site/GhlFormEmbed";
import { LegalLinks } from "@/components/site/LegalLinks";

export function GuideLeadModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/*
        The handbook form is ~1150px tall while the sheet is capped at 92vh, so
        a normal-flow legal line lands ~370px below the fold on a phone and
        reads as missing. Split the sheet into a scrolling body plus a fixed
        foot so the Privacy/Terms line stays on screen the whole time.
      */}
      <DialogContent className="flex max-h-[92vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4 pt-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">
              Get Your Free Silver IRA Handbook
            </DialogTitle>
            <DialogDescription>
              Fill in your details and we&apos;ll email the 2026 Edition of the Silver IRA
              Handbook — no cost, no obligation.
            </DialogDescription>
          </DialogHeader>

          <GhlFormEmbed
            formId="alxqzSiTiGE5BWiIkyaV"
            formName="Silver IRA Handbook Request Form"
            height={936}
            showLegal={false}
          />
        </div>

        <div className="shrink-0 border-t border-border bg-background px-6 py-3">
          <LegalLinks
            lead="Submitting this form means you agree to our"
            className="text-center"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
