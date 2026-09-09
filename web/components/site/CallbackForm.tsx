"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buttonStyles } from "./ui";
import { useUtm } from "@/lib/useUtm";
import {
  leadSchema,
  type LeadInput,
  type Interest,
  INTEREST_OPTIONS,
  BEST_TIMES,
  AMOUNT_BRACKETS,
} from "@/lib/validation";

type Variant = "full" | "simple" | "quote";

const SOURCE_FORM: Record<Variant, string> = {
  full: "get_started",
  simple: "simple",
  quote: "quote",
};

const DEFAULT_INTEREST: Record<Variant, Interest> = {
  full: "just_learning",
  simple: "just_learning",
  quote: "physical_silver",
};

/** The consent checkbox is a plain boolean in the UI; `z.literal(true)` in the
 *  schema rejects an unchecked box on submit. */
type FormValues = Omit<LeadInput, "consentTcpa"> & { consentTcpa: boolean };

const field =
  "w-full rounded-sm border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";
const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground";
const errorText = "mt-1 text-xs text-destructive";

export function CallbackForm({
  variant = "full",
  submitLabel = "Request a Callback",
}: {
  variant?: Variant;
  submitLabel?: string;
}) {
  const utm = useUtm();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [sentTo, setSentTo] = useState("");
  const [invalid, setInvalid] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(leadSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      // sourceForm is required by the schema — it must be in the form state, not
      // just added at submit time, or client validation fails silently.
      sourceForm: SOURCE_FORM[variant],
      sourcePage: "",
      interest: DEFAULT_INTEREST[variant],
      bestTimeToCall: variant === "simple" ? undefined : "Morning",
      amountBracket: variant === "simple" ? undefined : "$25,000 – $50,000",
      consentTcpa: false,
      honeypot: "",
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
          sourcePage: window.location.pathname,
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
      console.error("[CallbackForm] submit failed:", err);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-md border border-primary bg-sage-soft p-6">
        <h3 className="text-xl">Check your inbox</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your guide is on its way to {sentTo}. A specialist will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, () => setInvalid(true))}
      className="space-y-4"
      aria-label="Request a callback"
      noValidate
    >
      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="cb-company">Company</label>
        <input id="cb-company" tabIndex={-1} autoComplete="off" {...register("honeypot")} />
      </div>

      <div>
        <label className={labelCls} htmlFor="cb-fullName">
          Full name
        </label>
        <input className={field} id="cb-fullName" autoComplete="name" {...register("fullName")} />
        {errors.fullName && <p className={errorText}>{errors.fullName.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="cb-phone">
            Phone number
          </label>
          <input className={field} id="cb-phone" type="tel" autoComplete="tel" {...register("phone")} />
          {errors.phone && <p className={errorText}>{errors.phone.message}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="cb-email">
            Email
          </label>
          <input className={field} id="cb-email" type="email" autoComplete="email" {...register("email")} />
          {errors.email && <p className={errorText}>{errors.email.message}</p>}
        </div>
      </div>

      {/* Required TCPA consent — sits with the phone field. */}
      <div>
        <label className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
          <input
            type="checkbox"
            className="mt-0.5 accent-primary"
            aria-invalid={errors.consentTcpa ? "true" : "false"}
            {...register("consentTcpa")}
          />
          <span>
            I agree that Anchor Silver Capital may contact me at the phone number and email provided —
            including by automated technology, text, and prerecorded voice — about precious metals
            products and services. Consent is not a condition of any purchase. Message and data rates
            may apply.
          </span>
        </label>
        {errors.consentTcpa && <p className={errorText}>{errors.consentTcpa.message}</p>}
      </div>

      {variant !== "simple" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="cb-bestTime">
              Best time to call
            </label>
            <select className={field} id="cb-bestTime" {...register("bestTimeToCall")}>
              {BEST_TIMES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="cb-amount">
              Approximate amount available
            </label>
            <select className={field} id="cb-amount" {...register("amountBracket")}>
              {AMOUNT_BRACKETS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {variant === "full" && (
        <>
          <fieldset>
            <legend className={labelCls}>I am interested in</legend>
            <div className="flex flex-wrap gap-4 text-sm">
              {INTEREST_OPTIONS.map((opt) => (
                <label key={opt.value} className="inline-flex items-center gap-2">
                  <input type="radio" value={opt.value} className="accent-primary" {...register("interest")} />
                  {opt.label}
                </label>
              ))}
            </div>
            {errors.interest && <p className={errorText}>{errors.interest.message}</p>}
          </fieldset>
          <div>
            <label className={labelCls} htmlFor="cb-howHeard">
              How did you hear about us?
            </label>
            <input className={field} id="cb-howHeard" {...register("howHeard")} />
          </div>
        </>
      )}

      <div>
        <label className={labelCls} htmlFor="cb-message">
          Message (optional)
        </label>
        <textarea className={field} id="cb-message" rows={4} {...register("message")} />
        {errors.message && <p className={errorText}>{errors.message.message}</p>}
      </div>

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
          <a href="tel:+18668187243" className="font-semibold underline">
            (866) 818-7243
          </a>{" "}
          directly.
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className={`${buttonStyles.primary} w-full disabled:opacity-60`}
      >
        {submitting ? "Sending…" : submitLabel}
      </button>
      <p className="text-xs italic text-muted-foreground">
        We use your information only to contact you about precious metals. No obligation, and no cost
        for a consultation.
      </p>
    </form>
  );
}
