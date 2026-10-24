/**
 * Host → internal route-tree table used by next.config.ts. Kept dependency-free
 * (no "next/headers") because the config file imports it. The full site records
 * live in lib/satellites.ts; keep the two in sync.
 */
export const SAT_SITES = [
  { host: "goldcurrentprice.com", internalPath: "sat-gold" },
  { host: "silvercurrentprice.com", internalPath: "sat-silver" },
] as const;
