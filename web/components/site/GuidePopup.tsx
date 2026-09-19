"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
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
const STORAGE_KEY = "asc_guide_popup_seen";

type FormValues = Omit<LeadInput, "consentTcpa"> & { consentTcpa: boolean };

export function GuidePopup() {
  const router = useRouter();
  const utm = useUtm();
  const heroRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [invalid, setInvalid] = useState(false);
  const dismissed = useRef(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(leadSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      consentTcpa: false,
      honeypot: "",
      interest: "just_learning",
      sourceForm: "guide-popup",
      sourcePage: "home",
    },
  });

  const submitting = status === "submitting";

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
    heroRef.current = hero;

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
          sourceForm: "guide-popup",
          sourcePage: "home",
          utmSource: utm.source || undefined,
          utmMedium: utm.medium || undefined,
          utmCampaign: utm.campaign || undefined,
        }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) throw new Error(json.error ?? "Request failed");
      // Mark as seen so it doesn't reappear after redirect
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore
      }
      router.push("/guide-success");
    } catch (err) {
      console.error("[GuidePopup] submit failed:", err);
      setStatus("error");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-md overflow-hidden p-0">
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
          <h2 className="font-display text-xl font-semibold sm:text-2xl">
            Get the 2026 Silver Investor Guide
          </h2>
          <p className="mt-2 text-sm text-silver">
            What to know before you move retirement money into silver.
          </p>
        </div>

        {/* Form body */}
        <div className="px-6 py-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, () => setInvalid(true))}
              className="space-y-3.5"
              aria-label="Request the free silver investor guide"
              noValidate
            >
              {/* Honeypot */}
              <div
                aria-hidden="true"
                className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
              >
                <label htmlFor="company-guide-popup">Company</label>
                <input
                  id="company-guide-popup"
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
                      <FormLabel className="text-[0.68rem] font-normal normal-case leading-relaxed text-muted-foreground">
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
                  Please fix the highlighted fields before submitting.
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
