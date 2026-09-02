import { z } from "zod";

/**
 * Shared lead schema — used by the client form (react-hook-form resolver) and
 * re-validated server-side in `app/api/lead/route.ts`. Never trust the client.
 */

export const INTERESTS = ["silver_ira", "physical_silver", "just_learning"] as const;
export type Interest = (typeof INTERESTS)[number];

export const BEST_TIMES = ["Morning", "Afternoon", "Evening"] as const;

export const AMOUNT_BRACKETS = [
  "Under $10,000",
  "$10,000 – $25,000",
  "$25,000 – $50,000",
  "$50,000 – $100,000",
  "$100,000 – $250,000",
  "$250,000+",
] as const;

export const PRODUCTS = [
  "American Silver Eagles",
  "Morgan Silver Dollars",
  "Peace Silver Dollars",
  "Canadian Maple Leafs",
  "10 oz Silver Bars",
  "100 oz Silver Bars",
  "Junk Silver (pre-1964 US coins)",
  "Generic Silver Rounds",
  "Not sure yet",
] as const;

export const SOURCE_FORMS = ["get_started", "quote", "simple", "inline"] as const;
export type SourceForm = (typeof SOURCE_FORMS)[number];

/** Maps the `CallbackForm` visual variant to the persisted `sourceForm`. */
export const VARIANT_TO_SOURCE_FORM: Record<"full" | "quote" | "simple", SourceForm> = {
  full: "get_started",
  quote: "quote",
  simple: "simple",
};

const optionalTrimmed = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

export const leadSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(32)
    .regex(/^[0-9+().\-\s]+$/, "Please enter a valid phone number."),

  bestTimeToCall: z.enum(BEST_TIMES).optional(),
  amountBracket: z.enum(AMOUNT_BRACKETS).optional(),
  product: z.enum(PRODUCTS).optional(),
  interest: z.array(z.enum(INTERESTS)).optional(),
  howHeard: optionalTrimmed(200),
  message: optionalTrimmed(2000),

  // Required TCPA consent — every form here collects a phone number.
  consentTcpa: z.boolean().refine((v) => v === true, {
    message: "Please agree to be contacted so a specialist can reach you.",
  }),

  sourceForm: z.enum(SOURCE_FORMS),
  sourcePage: optionalTrimmed(200),

  // Spam controls — the honeypot must stay empty (checked in the route); the
  // Turnstile token is verified server-side (optional here so the schema also
  // passes when Turnstile is not configured yet).
  company: z.string().optional(),
  turnstileToken: z.string().optional(),

  utmSource: optionalTrimmed(200),
  utmMedium: optionalTrimmed(200),
  utmCampaign: optionalTrimmed(200),
  utmTerm: optionalTrimmed(200),
  utmContent: optionalTrimmed(200),
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;

/**
 * Normalises the parsed lead into a single `interest` string for storage and
 * downstream systems (the DB model and GHL expect one value / tag list).
 * Falls back per variant when the visitor selected nothing.
 */
export function resolveInterest(lead: Lead): string {
  if (lead.interest && lead.interest.length > 0) return lead.interest.join(",");
  if (lead.sourceForm === "quote") return "physical_silver";
  return "just_learning";
}

/** Brochure selection: Silver IRA interest → IRA Handbook, otherwise the Prospectus. */
export function brochureForInterest(interest: string): "ira_handbook" | "prospectus" {
  return interest.split(",").includes("silver_ira") ? "ira_handbook" : "prospectus";
}
