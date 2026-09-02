/**
 * THE canonical Anchor Silver Capital mark.
 *
 * This geometry is the single source of truth for the brand anchor.
 * The identical path data is mirrored byte-for-byte in `public/favicon.svg`
 * (and the apple-touch icon), so the header logo and the favicon are the
 * exact same glyph — same stroke weight, same crossbar, same flukes.
 *
 * If this file changes, `public/favicon.svg` MUST be updated to match.
 */
export const ANCHOR_VIEWBOX = "0 0 24 24";

export function AnchorGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox={ANCHOR_VIEWBOX}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Anchor Silver Capital anchor mark"
    >
      <circle cx="12" cy="5" r="2.8" />
      <path d="M12 7.8V21.6" />
      <path d="M6.6 10.2h10.8" />
      <path d="M3.4 13.2A8.9 8.9 0 0 0 12 21.6 8.9 8.9 0 0 0 20.6 13.2" />
      <path d="M3.4 13.2 1.9 11.6M3.4 13.2l2.3-.7" />
      <path d="M20.6 13.2 22.1 11.6M20.6 13.2l-2.3-.7" />
    </svg>
  );
}

export function Logo({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const text = tone === "light" ? "text-background" : "text-accent";
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <AnchorGlyph className={`h-8 w-8 shrink-0 ${text}`} />
      <span
        className={`font-display text-[0.95rem] font-semibold uppercase leading-none tracking-[0.18em] ${text}`}
      >
        Anchor Silver Capital
      </span>
    </span>
  );
}
