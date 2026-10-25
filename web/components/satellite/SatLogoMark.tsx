import type { SatSite } from "@/lib/satellites";

/**
 * The emblem from the supplied logo (ring, trend arrow, baseline), inline so there is no
 * extra request. Geometry matches public/<site>/mark.svg; gradient comes from the site's
 * own logo file (gold on the dark tile, dark green on the cream tile).
 */
export function SatLogoMark({ site, size = 40 }: { site: SatSite; size?: number }) {
  const id = `sat-mark-${site.key}`;
  return (
    <svg viewBox="1380 890 1740 1740" width={size} height={size} aria-hidden="true" focusable="false" className="sat-logo-mark">
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="1350" y1="0" x2="3150" y2="0">
          {site.logo.stops.map(([o, c]) => (
            <stop key={o} offset={o} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      <circle cx="2250" cy="1760" r="820" fill="none" stroke={`url(#${id})`} strokeWidth="84" />
      <circle cx="2250" cy="1760" r="710" fill="none" stroke={`url(#${id})`} strokeWidth="22" />
      <polyline points="1871.6,2054 2030,1895.6 2153.2,1979.2 2329.2,1763.6 2439.2,1842.8 2602,1570" fill="none" stroke={`url(#${id})`} strokeWidth="64" />
      <polygon points="2650.7,1488.4 2680.3,1663.3 2482.7,1545.4" fill={`url(#${id})`} />
      <rect x="1780" y="2160" width="940" height="28" fill={`url(#${id})`} />
    </svg>
  );
}
