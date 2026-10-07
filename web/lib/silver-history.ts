import { tursoConfigured, tursoBatch } from "@/lib/db/turso";

/**
 * Rolling daily silver spot log (`silver_price_history`), appended to by the
 * daily cron in app/api/cron/log-price.
 *
 * The five-year reference used by the hero headline is resolved in
 * lib/five-year.ts (gold-api.com /history → historical provider → null).
 * Nothing in this file is ever sent to the browser: only a derived percentage
 * from /api/market crosses the wire, never a raw price.
 */

const TABLE = "silver_price_history";
const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS ${TABLE} (date TEXT PRIMARY KEY, price REAL NOT NULL)`;

/**
 * Append (or overwrite) today's silver spot price in `silver_price_history`.
 * Called by the daily cron so the DB accrues a history that can eventually
 * back historical lookups without a paid API.
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
