/**
 * Purge the Cloudflare zone cache after a deploy.
 *
 * Why this exists: `public/_headers` and `next.config.ts` only control what a
 * response *says* it can be cached for. Anything already stored at the edge
 * keeps its old metadata until it is dropped, so a deploy that changes rendered
 * HTML would otherwise keep serving the previous snapshot. Purging removes that
 * window entirely.
 *
 * Credentials come from the environment only — never hard-code them:
 *   CLOUDFLARE_API_TOKEN  token with Zone.Cache Purge (and Zone.Zone:Read if
 *                         CLOUDFLARE_ZONE_ID is not supplied)
 *   CLOUDFLARE_ZONE_ID    optional; resolved from the API when absent
 *   CLOUDFLARE_ZONE_NAME  optional, defaults to anchorsilvercapital.com
 *
 * Missing credentials are a skip, not a failure, so `npm run deploy` keeps
 * working on machines without a token. A genuine API error fails the deploy so
 * it cannot be missed.
 */

const API = "https://api.cloudflare.com/client/v4";
const DEFAULT_ZONE_NAME = "anchorsilvercapital.com";

async function api(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.success) {
    const detail = body?.errors?.map((e) => e.message).join("; ") || `HTTP ${res.status}`;
    throw new Error(`${init.method ?? "GET"} ${path} failed: ${detail}`);
  }
  return body.result;
}

async function resolveZoneId() {
  if (process.env.CLOUDFLARE_ZONE_ID) return process.env.CLOUDFLARE_ZONE_ID;
  const zones = await api(
    `/zones?name=${encodeURIComponent(process.env.CLOUDFLARE_ZONE_NAME ?? DEFAULT_ZONE_NAME)}`,
  );
  if (!Array.isArray(zones) || zones.length === 0) {
    throw new Error(`no Cloudflare zone found for ${process.env.CLOUDFLARE_ZONE_NAME ?? DEFAULT_ZONE_NAME}`);
  }
  return zones[0].id;
}

async function main() {
  if (!process.env.CLOUDFLARE_API_TOKEN) {
    console.log("[cf-purge] skipped: CLOUDFLARE_API_TOKEN is not set (edge cache left as-is)");
    return;
  }

  const zoneId = await resolveZoneId();
  await api(`/zones/${zoneId}/purge_cache`, {
    method: "POST",
    body: JSON.stringify({ purge_everything: true }),
  });
  console.log(`[cf-purge] purged cache for zone ${zoneId}`);
}

main().catch((error) => {
  console.error(`[cf-purge] ${error.message}`);
  process.exit(1);
});
