/**
 * THE canonical Anchor Silver Capital mark.
 *
 * The header/footer Logo renders the full-color brand PNG from
 * `public/images/logo-122.png`. The AnchorGlyph SVG below remains the
 * single source of truth for the brand anchor geometry and is mirrored
 * byte-for-byte in `public/favicon.svg`, so the favicon and the anchor
 * glyph share the exact same path data.
 *
 * If AnchorGlyph's path data changes, `public/favicon.svg` MUST be updated
 * to match. Replacing the Logo PNG is a separate concern — just swap
 * `public/images/logo-122.png`.
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
  className = "",
}: {
  className?: string;
}) {
  return (
    <img
      src="/images/logo-122.png"
      alt="Anchor Silver Capital"
      width={552}
      height={165}
      className={`h-14 w-auto ${className}`}
    />
  );
}

/**
 * Header logo: `logo-122.png` is a transparent, tightly cropped PNG (no
 * padding), so it is sized to fill the 72px header bar properly.
 */
export function HeaderLogo({ className = "" }: { className?: string }) {
  return (
    <img
      src="/images/logo-122.png"
      alt="Anchor Silver Capital"
      width={552}
      height={165}
      className={`h-12 w-auto sm:h-14 ${className}`}
    />
  );
}
