"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
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
import { SITE } from "@/lib/site";
import { useUtm } from "@/lib/useUtm";
import { leadSchema, type Interest, type LeadInput } from "@/lib/validation";

/**
 * Short, end-of-page lead form. Posts to the same `/api/lead` handler the
 * `/get-started` form uses. Exactly three fields (name / phone / email) plus the
 * required TCPA consent and a honeypot. The specialist collects the rest on the
 * call.
 */

const LABEL = "text-xs font-semibold uppercase tracking-wider text-muted-foreground";

type FormValues = Omit<LeadInput, "consentTcpa"> & { consentTcpa: boolean };

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
  const utm = useUtm();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [sentTo, setSentTo] = useState("");
  const [invalid, setInvalid] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(leadSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      consentTcpa: false,
      honeypot: "",
      interest,
      // sourceForm is required by the schema — it must be in the form state.
      sourceForm: "inline",
      sourcePage,
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
          interest,
          sourceForm: "inline",
          sourcePage,
          utmSource: utm.source || undefined,
          utmMedium: utm.medium || undefined,
          utmCampaign: utm.campaign || undefined,
        }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) throw new Error(json.error ?? "Request failed");
      setSentTo(values.email);
      setStatus("success");
    } catch (err) {
      console.error("[InlineLeadForm] submit failed:", err);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto w-full max-w-lg rounded-md border border-primary bg-sage-soft p-6 text-left">
        <h3 className="text-xl">Check your inbox</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your guide is on its way to {sentTo}. A specialist will be in touch shortly.
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
          onSubmit={form.handleSubmit(onSubmit, () => setInvalid(true))}
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

          <Button type="submit" className="w-full" disabled={submitting} aria-busy={submitting}>
            {submitting ? "Sending…" : "Request a Callback"}
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
