import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/**
 * Lead store. Two-leg pipeline: email (brochure to the visitor) + notify (owner).
 * DB write always happens before either email call so a lead is never lost.
 */
export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  bestTimeToCall: text("best_time_to_call"),
  amountBracket: text("amount_bracket"),
  interest: text("interest").notNull(),
  message: text("message"),
  howHeard: text("how_heard"),
  sourceForm: text("source_form").notNull(),
  sourcePage: text("source_page"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  consentTcpa: integer("consent_tcpa", { mode: "boolean" }).notNull(),
  brochureVariant: text("brochure_variant"),
  emailStatus: text("email_status").default("pending"),
  notifyStatus: text("notify_status").default("pending"),
  ip: text("ip"),
  userAgent: text("user_agent"),
});

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
