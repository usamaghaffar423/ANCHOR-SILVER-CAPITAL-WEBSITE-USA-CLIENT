"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SITE } from "@/lib/site";
import { useUtm } from "@/lib/useUtm";
import { leadSchema, type LeadInput } from "@/lib/validation";

const LABEL = "text-xs font-semibold uppercase tracking-wider text-muted-foreground";

type FormValues = Omit<LeadInput, "consentTcpa"> & { consentTcpa: boolean };

export function GuideLeadModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const utm = useUtm();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [invalid, setInvalid] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(leadSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      consentTcpa: false,
      honeypot: "",
      interest: "just_learning",
      sourceForm: "guide-hero",
      sourcePage: "home",
    },
  });

  const submitting = status === "submitting";

  async function onSubmit(values: FormValues) {
    setInvalid(false);
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          interest: "just_learning",
          sourceForm: "guide-hero",
          sourcePage: "home",
          utmSource: utm.source || undefined,
          utmMedium: utm.medium || undefined,
          utmCampaign: utm.campaign || undefined,
        }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) throw new Error(json.error ?? "Request failed");
      router.push("/guide-success");
    } catch (err) {
      console.error("[GuideLeadModal] submit failed:", err);
      setStatus("error");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">
            Get Your Free Silver Investor Guide
          </DialogTitle>
          <DialogDescription>
            Fill in your details and we&apos;ll mail or email the 2026 Edition
            of the Silver Investor Guide — no cost, no obligation.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, () => setInvalid(true))}
            className="space-y-4"
            aria-label="Request the free silver investor guide"
            noValidate
          >
            {/* Honeypot */}
            <div
              aria-hidden="true"
              className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
            >
              <label htmlFor="company-guide-modal">Company</label>
              <input
                id="company-guide-modal"
                tabIndex={-1}
                autoComplete="off"
                {...form.register("honeypot")}
              />
            </div>

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className={LABEL}>Full name</FormLabel>
                  <FormControl>
                    <Input autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className={LABEL}>Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className={LABEL}>Phone number</FormLabel>
                  <FormControl>
                    <Input type="tel" autoComplete="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="consentTcpa"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <div className="flex items-start gap-2.5">
                    <FormControl>
                      <Checkbox
                        className="mt-0.5"
                        checked={field.value === true}
                        onCheckedChange={(checked) => field.onChange(checked === true)}
                      />
                    </FormControl>
                    <FormLabel className="text-xs font-normal normal-case leading-relaxed text-muted-foreground">
                      I agree that Anchor Silver Capital may contact me at the phone number and email
                      provided — including by automated technology, text, and prerecorded voice — about
                      precious metals products and services. Consent is not a condition of any
                      purchase. Message and data rates may apply.
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {invalid && (
              <p role="alert" className="text-sm text-destructive">
                Please fix the highlighted fields before submitting (the consent box is required).
              </p>
            )}

            {status === "error" && (
              <p
                role="alert"
                className="rounded-sm border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive"
              >
                Something went wrong. Please try again or call{" "}
                <a href={SITE.phoneHref} className="font-semibold underline">
                  {SITE.phone}
                </a>{" "}
                directly.
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-brass text-[#1b1408] hover:bg-brass-light"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? "Sending…" : "Send me the free guide"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              No cost, no obligation · Mailed or emailed
            </p>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
