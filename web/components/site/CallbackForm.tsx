"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buttonStyles } from "./ui";
import { Turnstile } from "./Turnstile";
import {
  leadSchema,
  type LeadInput,
  BEST_TIMES,
  AMOUNT_BRACKETS,
  PRODUCTS,
  VARIANT_TO_SOURCE_FORM,
} from "@/lib/validation";

const field =
  "w-full rounded-sm border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";
const label = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground";
const errorText = "mt-1 text-xs text-destructive";

const INTEREST_OPTIONS: { value: "silver_ira" | "physical_silver" | "just_learning"; label: string }[] = [
  { value: "silver_ira", label: "Silver IRA" },
  { value: "physical_silver", label: "Physical Silver" },
  { value: "just_learning", label: "Just Learning" },
];

const UTM_KEYS = ["utmSource", "utmMedium", "utmCampaign", "utmTerm", "utmContent"] as const;

export function CallbackForm({
  variant = "full",
  submitLabel = "Request a Callback",
}: {
  variant?: "full" | "simple" | "quote";
  submitLabel?: string;
}) {
  const [result, setResult] = useState<{ ok: true; emailStatus?: string } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      sourceForm: VARIANT_TO_SOURCE_FORM[variant],
      bestTimeToCall: variant === "simple" ? undefined : "Morning",
      amountBracket: variant === "simple" ? undefined : "$25,000 – $50,000",
      product: variant === "quote" ? "American Silver Eagles" : undefined,
      consentTcpa: false,
      company: "",
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    for (const key of UTM_KEYS) {
      const v = params.get(key.replace("utm", "utm_").toLowerCase());
      if (v) setValue(key, v);
    }
    setValue("sourcePage", window.location.pathname);
  }, [setValue]);

  async function onSubmit(values: LeadInput) {
    setSubmitError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as { ok: boolean; emailStatus?: string; error?: string };
      if (!res.ok || !data.ok) {
        setSubmitError(
          data.error === "turnstile"
            ? "Spam check failed — please try again."
            : "Something went wrong. Please try again or call (866) 818-7243.",
        );
        return;
      }
      setResult({ ok: true, emailStatus: data.emailStatus });
    } catch {
      setSubmitError("Network error. Please try again or call (866) 818-7243.");
    }
  }

  if (result) {
    return (
      <div className="rounded-md border border-primary bg-sage-soft p-6">
        <h3 className="text-xl">Thank you. We have your request.</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          A specialist will call you at the time you selected. If you would rather speak now, call{" "}
          <a className="font-semibold text-primary underline" href="tel:+18668187243">
            (866) 818-7243
          </a>
          .
        </p>
        {result.emailStatus === "sent" && (
          <p className="mt-2 text-sm text-muted-foreground">
            Check your inbox — your brochure is on the way.
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-label="Request a callback" noValidate>
      <input type="hidden" {...register("sourceForm")} />
      <input type="hidden" {...register("sourcePage")} />
      {UTM_KEYS.map((k) => (
        <input key={k} type="hidden" {...register(k)} />
      ))}

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <div>
        <label className={label} htmlFor="fullName">
          Full name
        </label>
        <input className={field} id="fullName" autoComplete="name" {...register("fullName")} />
        {errors.fullName && <p className={errorText}>{errors.fullName.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="phone">
            Phone number
          </label>
          <input className={field} id="phone" type="tel" autoComplete="tel" {...register("phone")} />
          {errors.phone && <p className={errorText}>{errors.phone.message}</p>}
        </div>
        <div>
          <label className={label} htmlFor="email">
            Email
          </label>
          <input className={field} id="email" type="email" autoComplete="email" {...register("email")} />
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
            <label className={label} htmlFor="bestTimeToCall">
              Best time to call
            </label>
            <select className={field} id="bestTimeToCall" {...register("bestTimeToCall")}>
              {BEST_TIMES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="amountBracket">
              Approximate amount available
            </label>
            <select
              className={field}
              id="amountBracket"
              defaultValue="$25,000 – $50,000"
              {...register("amountBracket")}
            >
              {AMOUNT_BRACKETS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {variant === "quote" && (
        <div>
          <label className={label} htmlFor="product">
            Product interest
          </label>
          <select className={field} id="product" {...register("product")}>
            {PRODUCTS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
      )}

      {variant === "full" && (
        <>
          <fieldset>
            <legend className={label}>I am interested in</legend>
            <div className="flex flex-wrap gap-4 text-sm">
              {INTEREST_OPTIONS.map((opt) => (
                <label key={opt.value} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={opt.value}
                    className="accent-primary"
                    {...register("interest")}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label className={label} htmlFor="howHeard">
              How did you hear about us?
            </label>
            <input className={field} id="howHeard" {...register("howHeard")} />
          </div>
        </>
      )}

      <div>
        <label className={label} htmlFor="message">
          Message (optional)
        </label>
        <textarea className={field} id="message" rows={4} {...register("message")} />
      </div>

      <Turnstile onToken={(token) => setValue("turnstileToken", token ?? undefined)} />

      {submitError && (
        <p role="alert" className="rounded-sm border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {submitError}
        </p>
      )}

      <button type="submit" disabled={isSubmitting} className={`${buttonStyles.primary} w-full disabled:opacity-60`}>
        {isSubmitting ? "Sending…" : submitLabel}
      </button>
      <p className="text-xs italic text-muted-foreground">
        We use your information only to contact you about precious metals. No obligation, and no
        cost for a consultation.
      </p>
    </form>
  );
}
