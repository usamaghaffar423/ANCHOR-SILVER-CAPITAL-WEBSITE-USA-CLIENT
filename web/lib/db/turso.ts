/**
 * Minimal Turso (libSQL) access over the HTTP pipeline API.
 *
 * The full Drizzle + `@libsql/client` setup is deferred until the custom domain
 * is assigned (see lib/leads.ts). This helper is enough for the one table the
 * market widget needs — `silver_price_history` — without adding a dependency.
 * Swap it for the Drizzle client when lib/leads.ts is wired.
 *
 * Dormant until TURSO_DATABASE_URL + TURSO_AUTH_TOKEN are set: every call
 * returns null so callers degrade gracefully.
 */

type Arg = string | number | null;

type LibsqlValue =
  | { type: "null" }
  | { type: "integer"; value: string }
  | { type: "float"; value: number }
  | { type: "text"; value: string }
  | { type: "blob"; base64: string };

export type Row = Record<string, Arg>;

export function tursoConfigured(): boolean {
  return Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN);
}

function httpEndpoint(): string {
  const url = process.env.TURSO_DATABASE_URL as string;
  return (
    url.replace(/^libsql:\/\//, "https://").replace(/\/+$/, "") + "/v2/pipeline"
  );
}

function toArg(v: Arg): LibsqlValue {
  if (v === null) return { type: "null" };
  if (typeof v === "number") return { type: "float", value: v };
  return { type: "text", value: v };
}

function fromValue(v: LibsqlValue): Arg {
  switch (v.type) {
    case "integer":
      return Number(v.value);
    case "float":
      return v.value;
    case "text":
      return v.value;
    default:
      return null;
  }
}

/**
 * Run statements in order on one connection; return the rows of the LAST
 * statement (`[]` when it yields none), or null when Turso is unconfigured or
 * the request fails.
 */
export async function tursoBatch(
  statements: Array<{ sql: string; args?: Arg[] }>,
): Promise<Row[] | null> {
  if (!tursoConfigured() || statements.length === 0) return null;
  try {
    const res = await fetch(httpEndpoint(), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.TURSO_AUTH_TOKEN}`,
      },
      cache: "no-store",
      body: JSON.stringify({
        requests: [
          ...statements.map((s) => ({
            type: "execute" as const,
            stmt: { sql: s.sql, args: (s.args ?? []).map(toArg) },
          })),
          { type: "close" as const },
        ],
      }),
    });
    if (!res.ok) {
      console.error("[turso] HTTP", res.status, await res.text().catch(() => ""));
      return null;
    }
    const body = (await res.json()) as {
      results?: Array<{
        type: string;
        response?: {
          result?: { cols: Array<{ name: string }>; rows: LibsqlValue[][] };
        };
        error?: { message: string };
      }>;
    };
    const target = body.results?.[statements.length - 1];
    if (!target || target.type === "error" || target.error) {
      console.error("[turso] statement error", target?.error?.message);
      return null;
    }
    const result = target.response?.result;
    if (!result) return [];
    return result.rows.map((r) => {
      const row: Row = {};
      result.cols.forEach((c, i) => {
        row[c.name] = fromValue(r[i]);
      });
      return row;
    });
  } catch (err) {
    console.error("[turso] request failed", err);
    return null;
  }
}
