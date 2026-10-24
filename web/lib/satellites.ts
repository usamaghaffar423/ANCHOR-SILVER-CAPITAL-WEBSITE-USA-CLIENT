import { notFound } from "next/navigation";
import { headers } from "next/headers";

/**
 * The two standalone price sites (goldcurrentprice.com, silvercurrentprice.com).
 * They are served by this same app/Worker: next.config.ts rewrites each host to
 * its own internal route tree (`/sat-gold`, `/sat-silver`) with its own root
 * layout. They are NOT redirects or proxies of the anchorsilvercapital.com
 * price pages, and share no page copy with them (copy lives in
 * lib/satellite-content.ts, written separately per domain).
 */

export type SatKey = "gold" | "silver";

export type SatSite = {
  key: SatKey;
  host: string;
  origin: string;
  /** Internal route-tree prefix the host is rewritten to. */
  internalPath: string;
  symbol: "XAU" | "XAG";
  metal: "Gold" | "Silver";
  /** Wordmark shown in the header and footer. */
  wordmark: string;
  /** utm_source / source label for this site. */
  source: string;
  /** Five metallic gradient stops of the site's logo (offsets 0, .3, .5, .7, 1). */
  logoStops: [string, string, string, string, string];
};

export const SAT_SITES: Record<SatKey, SatSite> = {
  gold: {
    key: "gold",
    host: "goldcurrentprice.com",
    origin: "https://goldcurrentprice.com",
    internalPath: "sat-gold",
    symbol: "XAU",
    metal: "Gold",
    wordmark: "Gold Current Price",
    source: "goldcurrentprice.com",
    logoStops: ["#8f6c2a", "#d9b866", "#f7e8aa", "#b08a3a", "#e3c474"],
  },
  silver: {
    key: "silver",
    host: "silvercurrentprice.com",
    origin: "https://silvercurrentprice.com",
    internalPath: "sat-silver",
    symbol: "XAG",
    metal: "Silver",
    wordmark: "Silver Current Price",
    source: "silvercurrentprice.com",
    logoStops: ["#8a8d91", "#d4d6d8", "#eceeef", "#a3a5a9", "#d8dadb"],
  },
};

export type Placement = "module" | "footer-module";

/**
 * The free IRA kit is the handbook offered on the main site's gold & silver IRA
 * landing page (it captures UTMs and fires the UET lead event). Each placement
 * gets its own utm_content so conversions can be attributed per button.
 */
export function kitUrl(site: SatSite, placement: Placement, medium = "sponsor"): string {
  const q = new URLSearchParams({
    utm_source: site.source,
    utm_medium: medium,
    utm_campaign: "sponsored_placement",
    utm_content: placement,
  });
  return `https://anchorsilvercapital.com/gold-silver-ira?${q.toString()}`;
}

/** Publisher named in the visible disclosure and the JSON-LD. */
export const PUBLISHER = "Anchor Silver Capital LLC";
export const PUBLISHER_URL = "https://anchorsilvercapital.com";

/**
 * 404 unless the request arrived on the site's own host (or its www alias).
 * Keeps the internal `/sat-gold` and `/sat-silver` trees from being reachable
 * (and indexable) on anchorsilvercapital.com or the workers.dev URL, which
 * would be duplicate content. Skipped under `next dev` so the routes can be
 * opened directly.
 */
export async function assertSatelliteHost(site: SatSite): Promise<void> {
  if (process.env.NODE_ENV === "development") return;
  const host = ((await headers()).get("host") ?? "").toLowerCase().replace(/:\d+$/, "");
  if (host !== site.host && host !== `www.${site.host}`) notFound();
}

/** Same check for route handlers (robots.txt / sitemap.xml). */
export function isSatelliteHost(site: SatSite, hostHeader: string | null): boolean {
  if (process.env.NODE_ENV === "development") return true;
  const host = (hostHeader ?? "").toLowerCase().replace(/:\d+$/, "");
  return host === site.host || host === `www.${site.host}`;
}
