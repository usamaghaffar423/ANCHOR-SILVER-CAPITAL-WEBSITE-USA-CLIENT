import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

/**
 * Turso (libSQL) connection. Server-only — never import into a client component.
 *
 * Lazy: `getDb()` builds the client on first use so a missing
 * `TURSO_DATABASE_URL` throws at request time (caught by the route → clean
 * error) rather than at build time.
 */

type DB = ReturnType<typeof drizzle<typeof schema>>;

let _db: DB | null = null;

export function getDb(): DB {
  if (!_db) {
    const url = process.env.TURSO_DATABASE_URL;
    if (!url) throw new Error("TURSO_DATABASE_URL is not set");
    _db = drizzle(
      createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN }),
      { schema },
    );
  }
  return _db;
}
