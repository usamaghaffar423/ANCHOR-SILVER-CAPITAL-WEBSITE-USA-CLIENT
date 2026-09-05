import { unstable_cache } from "next/cache";
import { getHistoricalSilver } from "@/lib/metals";
import { tursoConfigured, tursoBatch } from "@/lib/db/turso";

/**
 * The trailing-12-month reference silver price (USD/oz), resolved once per day.
 *
 * Priority:
 *   a) historical metals API (METALS_API_KEY + METALS_PROVIDER), dated ~365d ago
 *   b) closest row within ±45 days of that date in `silver_price_history` (Turso)
 *   c) null  → /api/market returns changePct: null and the hero hides its badge
 *
 * Cached for 24h — it barely moves day to day, so it is never fetched per
 * request; the hourly /api/market revalidation reuses this cached value.
 */

const TABLE = "silver_price_history";
const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS ${TABLE} (date TEXT PRIMARY KEY, price REAL NOT NULL)`;

/**
 * One real anchor so the DB path works before a year of daily logging exists.
 * Silver spot on 2025-09-03 ≈ $41.07/oz (early-Sep 2025 range $40.6–41.3;
 * corroborated by exchange-rates.org and cmi-gold-silver.com "started the month
 * at $40.81"). Refresh this if the DB is set up on a materially different date.
 */
const SEED = { date: "2025-09-03", price: 41.07 };

/** Reject a "closest" row that is really months off the 365-day target. */
const MATCH_WINDOW_DAYS = 45;

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

export type TwelveMonthRef = {
  price: number;
  source: "api" | "history";
  date: string;
};

async function resolveTwelveMonthRef(): Promise<TwelveMonthRef | null> {
  const target = isoDaysAgo(365);

  // a) historical metals API
  const apiPrice = await getHistoricalSilver(target);
  if (apiPrice && apiPrice > 0) {
    return { price: apiPrice, source: "api", date: target };
  }

  // b) Turso history table — closest row to the target date (self-creates +
  //    seeds the table so this works the moment Turso is configured).
  if (tursoConfigured()) {
    const rows = await tursoBatch([
      { sql: CREATE_TABLE },
      {
        sql: `INSERT OR IGNORE INTO ${TABLE} (date, price) VALUES (?, ?)`,
        args: [SEED.date, SEED.price],
      },
      {
        sql: `SELECT date, price, ABS(julianday(date) - julianday(?)) AS gap
              FROM ${TABLE} ORDER BY gap ASC LIMIT 1`,
        args: [target],
      },
    ]);
    const row = rows?.[0];
    if (
      row &&
      typeof row.price === "number" &&
      typeof row.gap === "number" &&
      row.gap <= MATCH_WINDOW_DAYS
    ) {
      return { price: row.price, source: "history", date: String(row.date) };
    }
  }

  // c) no reference available
  return null;
}

export const getTwelveMonthSilverRef = unstable_cache(
  resolveTwelveMonthRef,
  ["silver-12mo-ref"],
  { revalidate: 86_400, tags: ["silver-12mo-ref"] },
);

/**
 * Append (or overwrite) today's silver spot price in `silver_price_history`.
 * Called by the daily cron so the DB builds a rolling 12-month history that can
 * eventually replace the paid API.
 */
export async function logTodaySilverPrice(
  price: number,
): Promise<{ ok: true; date: string } | { ok: false; reason: string }> {
  if (!(price > 0)) return { ok: false, reason: "invalid_price" };
  if (!tursoConfigured()) return { ok: false, reason: "turso_not_configured" };

  const date = new Date().toISOString().slice(0, 10);
  const rows = await tursoBatch([
    { sql: CREATE_TABLE },
    {
      sql: `INSERT INTO ${TABLE} (date, price) VALUES (?, ?)
            ON CONFLICT(date) DO UPDATE SET price = excluded.price`,
      args: [date, price],
    },
  ]);
  if (rows === null) return { ok: false, reason: "db_error" };
  return { ok: true, date };
}
