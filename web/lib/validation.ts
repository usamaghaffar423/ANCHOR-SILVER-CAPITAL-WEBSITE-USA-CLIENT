import { z } from "zod";

/**
 * Shared lead schema — the client form (react-hook-form resolver) and the
 * `/api/lead` route both use it. Never trust the client; the route re-validates.
 */

export const leadSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z
    .string()
    .min(7)
    .max(20)
    .regex(/^[\d\s()\-+]+$/, "Invalid phone number"),
  bestTimeToCall: z.string().optional(),
  amountBracket: z.string().optional(),
  interest: z.enum(["silver_ira", "physical_silver", "just_learning"]),
  message: z.string().max(1000).optional(),
  howHeard: z.string().optional(),
  sourceForm: z.string(),
  sourcePage: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  consentTcpa: z.literal(true, {
    errorMap: () => ({ message: "You must agree to be contacted." }),
  }),
  // Must stay empty. Left un-constrained here so a filled honeypot passes
  // validation and the route can reject it *silently* (see route step 3) — a
  // 422 naming the field would just teach bots to leave it blank.
  honeypot: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

/* ---- UI option lists (used by the form components) ---- */

export type Interest = "silver_ira" | "physical_silver" | "just_learning";

export const INTEREST_OPTIONS: { value: Interest; label: string }[] = [
  { value: "silver_ira", label: "Silver IRA" },
  { value: "physical_silver", label: "Physical Silver" },
  { value: "just_learning", label: "Just Learning" },
];

export const BEST_TIMES = ["Morning", "Afternoon", "Evening"] as const;

export const AMOUNT_BRACKETS = [
  "Under $10,000",
  "$10,000 – $25,000",
  "$25,000 – $50,000",
  "$50,000 – $100,000",
  "$100,000 – $250,000",
  "$250,000+",
] as const;
