/**
 * Tiny TTL cache for server-side provider calls. **Server-only.**
 *
 * Why it exists: this site runs on Cloudflare Workers through OpenNext with no
 * incremental-cache binding, so Next's `fetch(..., { next: { revalidate } })`
 * does not persist between requests (the live /api/market answers
 * `x-nextjs-cache: MISS` every time). For the paid gold-api.com endpoints that
 * would mean one upstream call per page view, so those go through here:
 *
 *   L1  module memory (per isolate)
 *   L2  the Workers Cache API (`caches.default`, per data centre) — absent in
 *       Node (`next dev` / `next start`), where L1 alone is used
 *
 * Only real results are stored. When `load()` returns null the last value for
 * the key is served instead (stale-on-error), and with none it returns null —
 * callers render "unavailable"; nothing is ever invented.
 */

type Entry = { exp: number; value: unknown };

const mem = new Map<string, Entry>();
const inflight = new Map<string, Promise<unknown>>();
const CACHE_ORIGIN = "https://edge-cache.internal";
/** An L2 hit may be up to `ttl` old, so its L1 copy lives only briefly. */
const L1_AFTER_L2_HIT_SECONDS = 30;

function edgeCache(): Cache | null {
  try {
    return (globalThis as { caches?: { default?: Cache } }).caches?.default ?? null;
  } catch {
    return null;
  }
}

export async function cachedJson<T>(
  key: string,
  ttlSeconds: number,
  load: () => Promise<T | null>,
): Promise<T | null> {
  const now = Date.now();
  const hit = mem.get(key);
  if (hit && hit.exp > now) return hit.value as T;

  const pending = inflight.get(key);
  if (pending) return (await pending) as T | null;

  const run = (async (): Promise<T | null> => {
    const edge = edgeCache();
    const req = new Request(`${CACHE_ORIGIN}/${encodeURIComponent(key)}`);
    if (edge) {
      try {
        const res = await edge.match(req);
        if (res) {
          const value = (await res.json()) as T;
          mem.set(key, { exp: Date.now() + L1_AFTER_L2_HIT_SECONDS * 1000, value });
          return value;
        }
      } catch {
        /* cache read failed — fall through to the provider */
      }
    }

    const value = await load();
    if (value == null) return hit ? (hit.value as T) : null;

    mem.set(key, { exp: Date.now() + ttlSeconds * 1000, value });
    if (edge) {
      try {
        await edge.put(
          req,
          new Response(JSON.stringify(value), {
            headers: {
              "content-type": "application/json",
              "cache-control": `public, max-age=${ttlSeconds}`,
            },
          }),
        );
      } catch {
        /* cache write failed — L1 still holds it */
      }
    }
    return value;
  })();

  inflight.set(key, run);
  try {
    return await run;
  } finally {
    inflight.delete(key);
  }
}
