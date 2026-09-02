"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Turnstile } from "./Turnstile";
import { SITE } from "@/lib/site";
import { leadSchema, type Interest, type LeadInput } from "@/lib/validation";

/**
 * Short, end-of-page lead form. Posts to the same `/api/lead` handler the
 * `/get-started` form uses — no separate backend. Exactly three fields (name /
 * phone / email) plus the required TCPA consent, a honeypot and Turnstile. The
 * specialist collects amount / timing / product on the call.
 */

const LABEL = "text-xs font-semibold uppercase tracking-wider text-muted-foreground";
const UTM_KEYS = ["utmSource", "utmMedium", "utmCampaign", "utmTerm", "utmContent"] as const;

export function InlineLeadForm({
  interest,
  sourcePage,
  heading,
  subheading,
}: {
  interest: Interest;
  sourcePage: string;
  heading?: string;
  subheading?: string;
}) {
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      consentTcpa: false,
      company: "",
      sourceForm: "inline",
      sourcePage,
      interest: [interest],
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    for (const key of UTM_KEYS) {
      const value = params.get(key.replace("utm", "utm_").toLowerCase());
      if (value) form.setValue(key, value);
    }
  }, [form]);

  async function onSubmit(values: LeadInput) {
    setSubmitError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setSubmitError(
          data.error === "turnstile"
            ? "Spam check failed — please try again."
            : "Something went wrong. Please try again or call (866) 818-7243.",
        );
        return;
      }
      setDone(true);
    } catch {
      setSubmitError("Network error. Please try again or call (866) 818-7243.");
    }
  }

  if (done) {
    return (
      <div className="mx-auto w-full max-w-lg rounded-md border border-primary bg-sage-soft p-6 text-left">
        <h3 className="text-xl">Request received.</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ve emailed your guide — check your inbox. A specialist will follow up shortly. If
          you&apos;d rather talk now, call{" "}
          <a className="font-semibold text-primary underline" href={SITE.phoneHref}>
            {SITE.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg rounded-md border border-border bg-card p-6 text-left shadow-[var(--shadow-card)]">
      {heading && <h3 className="text-xl text-foreground">{heading}</h3>}
      {subheading && <p className="mt-1.5 text-sm text-muted-foreground">{subheading}</p>}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={heading || subheading ? "mt-5 space-y-4" : "space-y-4"}
          aria-label="Request a callback"
          noValidate
        >
          {/* Honeypot — off-screen, hidden from assistive tech, tabbable only by bots. */}
          <div
            aria-hidden="true"
            className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
          >
            <label htmlFor={`company-${sourcePage}`}>Company</label>
            <input
              id={`company-${sourcePage}`}
              tabIndex={-1}
              autoComplete="off"
              {...form.register("company")}
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

          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>

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

          <Turnstile onToken={(token) => form.setValue("turnstileToken", token ?? undefined)} />

          {submitError && (
            <p
              role="alert"
              className="rounded-sm border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            >
              {submitError}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Sending…" : "Request a Callback"}
          </Button>
          <p className="text-xs text-muted-foreground">
            No cost, no obligation. Prefer to talk now?{" "}
            <a href={SITE.phoneHref} className="font-medium text-primary underline">
              Call {SITE.phone}
            </a>
          </p>
        </form>
      </Form>
    </div>
  );
}
