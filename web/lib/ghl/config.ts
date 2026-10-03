import { GhlConfigError } from "./errors";
import type { GhlUserType } from "./types";

/** All GHL traffic goes through this host (v2 + v3 live under it). */
export const GHL_BASE_URL = "https://services.leadconnectorhq.com";
export const GHL_API_VERSION = "2021-07-28";

export type GhlAuthMode = "oauth" | "apikey";

export interface GhlConfig {
  apiKey: string | null;
  locationId: string | null;
  workflowId: string | null;
  clientId: string | null;
  clientSecret: string | null;
  redirectUri: string | null;
  scopes: string;
  userType: GhlUserType;
  installUrl: string | null;
  webhookPublicKeyPem: string | null;
  fieldMap: Record<string, string>;
}

function env(name: string): string | null {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : null;
}

/** Parsed once per isolate; env never changes at runtime on Workers. */
let cached: GhlConfig | null = null;

export function getGhlConfig(): GhlConfig {
  if (cached) return cached;

  let fieldMap: Record<string, string> = {};
  const rawMap = env("GHL_FIELD_MAP");
  if (rawMap) {
    try {
      const parsed: unknown = JSON.parse(rawMap);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        fieldMap = parsed as Record<string, string>;
      } else {
        throw new GhlConfigError("GHL_FIELD_MAP must be a JSON object of {leadField: customFieldId}");
      }
    } catch (err) {
      if (err instanceof GhlConfigError) throw err;
      throw new GhlConfigError("GHL_FIELD_MAP is not valid JSON");
    }
  }

  cached = {
    apiKey: env("GHL_API_KEY"),
    locationId: env("GHL_LOCATION_ID"),
    workflowId: env("GHL_WORKFLOW_ID"),
    clientId: env("GHL_CLIENT_ID"),
    clientSecret: env("GHL_CLIENT_SECRET"),
    redirectUri: env("GHL_REDIRECT_URI"),
    scopes:
      env("GHL_SCOPES") ??
      "contacts.readonly contacts.write conversations.readonly conversations.write opportunities.readonly opportunities.write",
    userType: (env("GHL_USER_TYPE") as GhlUserType | null) ?? "Location",
    installUrl: env("GHL_INSTALL_URL"),
    webhookPublicKeyPem: env("GHL_WEBHOOK_PUBLIC_KEY"),
    fieldMap,
  };
  return cached;
}

/** True when either auth path is usable — drives the "skip if unconfigured" behavior. */
export function isGhlConfigured(): boolean {
  const cfg = getGhlConfig();
  return Boolean(cfg.apiKey || cfg.clientId);
}

/** OAuth app pieces needed to start the authorization flow. */
export function requireGhlOAuthConfig(): { clientId: string; redirectUri: string } {
  const cfg = getGhlConfig();
  if (!cfg.clientId || !cfg.clientSecret || !cfg.redirectUri) {
    throw new GhlConfigError("GHL_CLIENT_ID / GHL_CLIENT_SECRET / GHL_REDIRECT_URI must be set");
  }
  return { clientId: cfg.clientId, redirectUri: cfg.redirectUri };
}

/** Contact location used for create/search when the caller doesn't pass one. */
export function requireGhlLocationId(): string {
  const cfg = getGhlConfig();
  if (!cfg.locationId) throw new GhlConfigError("GHL_LOCATION_ID must be set");
  return cfg.locationId;
}
