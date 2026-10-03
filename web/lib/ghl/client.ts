/**
 * Shared HTTP client for every GHL API call.
 *
 * Hardening:
 *   - 429 rate-limit aware: honors Retry-After, falls back to exponential
 *     backoff with jitter (GHL burst limit ≈ 100 req / 10 s).
 *   - 5xx retried for idempotent verbs only (GET/PUT/DELETE) — POSTs are not
 *     auto-retried on 5xx to avoid duplicate contacts/opportunities; pass
 *     `retryOn5xx: true` to override when the call is provably idempotent.
 *   - Every failure becomes a typed GhlApiError with status + parsed body.
 *   - 15 s default timeout so a hung GHL edge can't stall a lead response.
 */

import { GHL_API_VERSION, GHL_BASE_URL } from "./config";
import { GhlApiError } from "./errors";

export type GhlMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface GhlRequestOptions {
  query?: Record<string, unknown>;
  body?: unknown;
  headers?: Record<string, string>;
  /** Max retry attempts after the first try (default 2 → 3 total). */
  retries?: number;
  retryOn5xx?: boolean;
  /** Base backoff in ms; tests set this to 0. Default 500. */
  backoffMs?: number;
  timeoutMs?: number;
  /** Auth header resolver; defaults to OAuth/API-key resolution in auth.ts. */
  auth?: () => Promise<string | null>;
}

const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);
const IDEMPOTENT: ReadonlySet<GhlMethod> = new Set(["GET", "PUT", "DELETE", "PATCH"]);

async function resolveAuthHeader(opts: GhlRequestOptions): Promise<string> {
  if (opts.auth) {
    const header = await opts.auth();
    if (header) return header;
  } else {
    // Lazy import keeps auth (and its DB token store) out of pure/test paths.
    const auth = await import("./auth");
    const header = await auth.getGhlAuthHeader();
    if (header) return header;
  }
  throw new GhlApiError({
    message: "GHL is not authenticated — set GHL_API_KEY or complete the OAuth flow",
    status: 401,
    method: "AUTH",
    path: "/",
  });
}

function buildUrl(path: string, query?: Record<string, unknown>): string {
  const url = new URL(GHL_BASE_URL + path);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function retryDelayMs(attempt: number, res: Response | null, base: number): number {
  if (res) {
    const retryAfter = res.headers.get("Retry-After");
    if (retryAfter) {
      const secs = Number(retryAfter);
      if (Number.isFinite(secs) && secs >= 0) return Math.min(secs * 1000, 15_000);
    }
  }
  const exp = base * 2 ** attempt;
  const jitter = Math.floor(Math.random() * base);
  return Math.min(exp + jitter, 15_000);
}

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text().catch(() => "");
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function errorFromBody(
  res: Response,
  body: unknown,
  method: GhlMethod,
  path: string,
): GhlApiError {
  let message = `GHL ${method} ${path} failed with ${res.status}`;
  if (typeof body === "string" && body) {
    message = body.slice(0, 200);
  } else if (body && typeof body === "object" && "message" in body) {
    const m = (body as { message?: unknown }).message;
    if (typeof m === "string" && m) message = m;
  }
  return new GhlApiError({
    message,
    status: res.status,
    method,
    path,
    body,
    retryable: RETRYABLE_STATUS.has(res.status),
  });
}

export async function ghlRequest<T>(
  method: GhlMethod,
  path: string,
  opts: GhlRequestOptions = {},
): Promise<T> {
  const retries = opts.retries ?? 2;
  const base = opts.backoffMs ?? 500;
  const timeoutMs = opts.timeoutMs ?? 15_000;
  const retryOn5xx = opts.retryOn5xx ?? IDEMPOTENT.has(method);
  const url = buildUrl(path, opts.query);
  const authHeader = await resolveAuthHeader(opts);

  let lastError: GhlApiError | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    let res: Response | null = null;
    try {
      res = await fetch(url, {
        method,
        headers: {
          Authorization: authHeader,
          Version: GHL_API_VERSION,
          Accept: "application/json",
          ...(opts.body !== undefined ? { "Content-Type": "application/json" } : {}),
          ...opts.headers,
        },
        body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (err) {
      // Network-level failure — safe to retry any verb (request may not have landed).
      lastError = new GhlApiError({
        message: `GHL network error: ${err instanceof Error ? err.message : String(err)}`,
        status: 0,
        method,
        path,
        retryable: true,
        cause: err,
      });
      if (attempt < retries) {
        await sleep(retryDelayMs(attempt, null, base));
        continue;
      }
      throw lastError;
    }

    if (res.ok) {
      return (await parseBody(res)) as T;
    }

    const body = await parseBody(res);
    lastError = errorFromBody(res, body, method, path);

    const retriable =
      res.status === 429 || (retryOn5xx && res.status >= 500 && RETRYABLE_STATUS.has(res.status));

    if (retriable && attempt < retries) {
      await sleep(retryDelayMs(attempt, res, base));
      continue;
    }
    throw lastError;
  }

  throw lastError ?? new GhlApiError({ message: "GHL request failed", status: 0, method, path });
}
