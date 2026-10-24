import type { SatSite } from "@/lib/satellites";

const OFFSETS = ["0", ".3", ".5", ".7", "1"];

/**
 * The emblem from the supplied dark logo (ring, trend arrow, baseline), inline so
 * the header needs no extra request. Geometry matches public/<site>/mark.svg.
 */
export function SatLogoMark({ site }: { site: SatSite }) {
  const id = `sat-mark-${site.key}`;
  return (
    <svg viewBox="1380 890 1740 1740" width="40" height="40" aria-hidden="true" focusable="false" className="sat-logo-mark">
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="1350" y1="0" x2="3150" y2="0">
          {site.logoStops.map((c, i) => (
            <stop key={OFFSETS[i]} offset={OFFSETS[i]} stopColor={c} />
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
