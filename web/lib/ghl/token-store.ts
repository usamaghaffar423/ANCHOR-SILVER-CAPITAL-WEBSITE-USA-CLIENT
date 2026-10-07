/**
 * Persistence for OAuth tokens (single row per location, upserted).
 *
 * Raw SQL over the dependency-free Turso helper in lib/turso.ts — the site no
 * longer ships a database driver or ORM. The `ghl_tokens` table is created on
 * first write (same idempotent pattern as lib/silver-history.ts).
 *
 * Reads are deliberately forgiving: an unconfigured Turso, a missing table or
 * a failed read all resolve to null so callers fall back to API-key auth
 * instead of 500ing (see lib/ghl/auth.ts). Writes throw — a rotated refresh
 * token that cannot be persisted must not look like a success, or the next
 * refresh would 401.
 */

import { tursoBatch, type Row } from "@/lib/turso";
import type { GhlStoredToken } from "./types";

const TABLE = "ghl_tokens";

const CREATE_TABLE = `CREATE TABLE IF NOT EXISTS ${TABLE} (
  id TEXT PRIMARY KEY,
  location_id TEXT,
  company_id TEXT,
  user_id TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_type TEXT NOT NULL DEFAULT 'Bearer',
  scope TEXT,
  expires_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
)`;

const UPSERT = `INSERT INTO ${TABLE} (
  id, location_id, company_id, user_id, access_token, refresh_token,
  token_type, scope, expires_at, updated_at
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
ON CONFLICT(id) DO UPDATE SET
  location_id = excluded.location_id,
  company_id = excluded.company_id,
  user_id = excluded.user_id,
  access_token = excluded.access_token,
  refresh_token = excluded.refresh_token,
  token_type = excluded.token_type,
  scope = excluded.scope,
  expires_at = excluded.expires_at,
  updated_at = excluded.updated_at`;

function asText(v: Row[keyof Row]): string | null {
  return typeof v === "string" ? v : null;
}

function toToken(row: Row): GhlStoredToken | null {
  const id = row.id;
  const accessToken = row.access_token;
  const refreshToken = row.refresh_token;
  if (typeof id !== "string" || typeof accessToken !== "string" || typeof refreshToken !== "string") {
    return null;
  }
  const tokenType = asText(row.token_type);
  return {
    id,
    locationId: asText(row.location_id),
    companyId: asText(row.company_id),
    userId: asText(row.user_id),
    accessToken,
    refreshToken,
    tokenType: tokenType && tokenType.length > 0 ? tokenType : "Bearer",
    scope: asText(row.scope),
    expiresAt: Number(row.expires_at),
    updatedAt: Number(row.updated_at),
  };
}

export async function getStoredToken(): Promise<GhlStoredToken | null> {
  const rows = await tursoBatch([{ sql: `SELECT * FROM ${TABLE}` }]);
  if (rows === null) return null;
  // Newest row wins — supports multi-location installs later.
  const tokens = rows
    .map(toToken)
    .filter((t): t is GhlStoredToken => t !== null)
    .sort((a, b) => b.updatedAt - a.updatedAt);
  return tokens.length > 0 ? tokens[0] : null;
}

export async function saveStoredToken(token: GhlStoredToken): Promise<void> {
  const rows = await tursoBatch([
    { sql: CREATE_TABLE },
    {
      sql: UPSERT,
      args: [
        token.id,
        token.locationId,
        token.companyId,
        token.userId,
        token.accessToken,
        token.refreshToken,
        token.tokenType,
        token.scope,
        token.expiresAt,
        token.updatedAt,
      ],
    },
  ]);
  if (rows === null) {
    throw new Error(
      "ghl_tokens: failed to persist OAuth token — check TURSO_DATABASE_URL / TURSO_AUTH_TOKEN and the [turso] logs",
    );
  }
}

export async function findTokenById(id: string): Promise<GhlStoredToken | null> {
  const rows = await tursoBatch([{ sql: `SELECT * FROM ${TABLE} WHERE id = ?`, args: [id] }]);
  if (rows === null || rows.length === 0) return null;
  return toToken(rows[0]);
}
