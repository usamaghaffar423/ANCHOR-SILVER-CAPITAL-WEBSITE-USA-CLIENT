/**
 * Persistence for OAuth tokens (single row per location, upserted).
 * Uses the same Turso/Drizzle stack as the leads table.
 *
 * Reads/writes are deliberately forgiving: if the `ghl_tokens` migration
 * hasn't been applied yet, callers fall back to API-key auth instead of 500ing.
 */

import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { ghlTokens } from "@/lib/db/schema";
import type { GhlStoredToken } from "./types";

export async function getStoredToken(): Promise<GhlStoredToken | null> {
  const rows = await getDb().select().from(ghlTokens);
  if (rows.length === 0) return null;
  // Newest row wins — supports multi-location installs later.
  const row = rows.sort((a, b) => b.updatedAt - a.updatedAt)[0];
  return {
    id: row.id,
    locationId: row.locationId,
    companyId: row.companyId,
    userId: row.userId,
    accessToken: row.accessToken,
    refreshToken: row.refreshToken,
    tokenType: row.tokenType,
    scope: row.scope,
    expiresAt: row.expiresAt,
    updatedAt: row.updatedAt,
  };
}

export async function saveStoredToken(token: GhlStoredToken): Promise<void> {
  await getDb()
    .insert(ghlTokens)
    .values({
      id: token.id,
      locationId: token.locationId,
      companyId: token.companyId,
      userId: token.userId,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      tokenType: token.tokenType,
      scope: token.scope,
      expiresAt: token.expiresAt,
      updatedAt: token.updatedAt,
    })
    .onConflictDoUpdate({
      target: ghlTokens.id,
      set: {
        locationId: token.locationId,
        companyId: token.companyId,
        userId: token.userId,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        tokenType: token.tokenType,
        scope: token.scope,
        expiresAt: token.expiresAt,
        updatedAt: token.updatedAt,
      },
    });
}

export async function findTokenById(id: string): Promise<GhlStoredToken | null> {
  const rows = await getDb().select().from(ghlTokens).where(eq(ghlTokens.id, id));
  const row = rows[0];
  if (!row) return null;
  return {
    id: row.id,
    locationId: row.locationId,
    companyId: row.companyId,
    userId: row.userId,
    accessToken: row.accessToken,
    refreshToken: row.refreshToken,
    tokenType: row.tokenType,
    scope: row.scope,
    expiresAt: row.expiresAt,
    updatedAt: row.updatedAt,
  };
}
