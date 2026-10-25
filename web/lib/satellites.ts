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
  /** Source label sent with contact-form submissions. */
  source: string;
  /** Logo emblem gradient (offset, colour) and the background tile colour it sits on. */
  logo: { stops: [number, string][]; tile: string };
  /** Page colour scheme and browser UI colour. */
  scheme: "dark" | "light";
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
    logo: {
      stops: [[0, "#8f6c2a"], [0.3, "#d9b866"], [0.5, "#f7e8aa"], [0.7, "#b08a3a"], [1, "#e3c474"]],
      tile: "#092619",
    },
    scheme: "dark",
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
    logo: { stops: [[0, "#0a2519"], [0.5, "#3b6b55"], [1, "#0a2519"]], tile: "#F7F5F0" },
    scheme: "light",
  },
};

/**
 * Destination of every ad image on the price sites. Deliberately a plain URL: no
 * UTM or other query parameters.
 */
export const AD_URL = "https://anchorsilvercapital.com/gold-silver-ira";

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
