import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Full-bleed image banner: next/image (fill) + a scrim + an overlaid slot for
 * heading/text/CTA. Used for secondary banners and section backgrounds — never
 * behind the home hero (see CLAUDE.md: no photo competing with the hero's LCP).
 *
 * `mobileImage` renders true art-direction (a different crop/shot below `sm`),
 * not just a different width — `sizes` alone can only pick a width from the SAME
 * source, it can't swap images, so small screens get their own <Image>.
 *
 * Never set `priority` unless this banner is genuinely above the fold; none of
 * the current placements are, so all of them lazy-load.
 */
export function Banner({
  image,
  mobileImage,
  alt,
  focal = "center",
  scrim = "veil",
  tint = false,
  priority = false,
  sizes = "100vw",
  aspect = "aspect-[4/5] sm:aspect-[16/6]",
  contentAlign = "center",
  children,
  className = "",
}: {
  image: string;
  mobileImage?: string;
  alt: string;
  focal?: string;
  scrim?: "band" | "side" | "veil" | "none";
  /** Desaturate/darken for a background/texture read. Never true on a product shot. */
  tint?: boolean;
  priority?: boolean;
  sizes?: string;
  aspect?: string;
  contentAlign?: "left" | "center" | "right";
  children?: ReactNode;
  className?: string;
}) {
  const scrimClass =
    scrim === "band" ? "scrim-band" : scrim === "side" ? "scrim-side" : scrim === "veil" ? "scrim-veil" : "";
  const tintClass = tint ? "brand-tint" : "";
  const justify =
    contentAlign === "left" ? "justify-start text-left" : contentAlign === "right" ? "justify-end text-right" : "justify-center text-center";

  return (
    <div className={`relative isolate w-full overflow-hidden ${aspect} ${className}`}>
      {mobileImage && (
        <Image
          src={mobileImage}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          quality={78}
          className={`object-cover sm:hidden ${tintClass}`}
          style={{ objectPosition: focal }}
        />
      )}
      <Image
        src={image}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        quality={78}
        className={`object-cover ${mobileImage ? "hidden sm:block" : ""} ${tintClass}`}
        style={{ objectPosition: focal }}
      />
      {scrimClass && <div className={`absolute inset-0 ${scrimClass}`} aria-hidden="true" />}
      {children && (
        <div className={`relative z-10 flex h-full w-full items-center px-6 py-10 sm:px-10 ${justify}`}>
          {/* Callers use light text (text-white / text-silver / text-brass-light) —
              the drop-shadow is a second, always-on line of defense for AA
              contrast regardless of what's under a lighter scrim. */}
          <div className="max-w-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">{children}</div>
        </div>
      )}
    </div>
  );
}
