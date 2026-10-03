"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GhlFormEmbed } from "@/components/site/GhlFormEmbed";

export function GuideLeadModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
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
        />
      </DialogContent>
    </Dialog>
  );
}
