import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

/**
 * Turso (libSQL) connection. Server-only — never import this into a client
 * component. `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` are required at runtime;
 * without them the client throws on first query (the route handler catches it
 * and returns a clean error).
 */
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, { schema });
