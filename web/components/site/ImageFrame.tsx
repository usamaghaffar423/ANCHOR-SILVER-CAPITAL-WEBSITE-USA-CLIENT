import Image from "next/image";

/**
 * Framed image for dark or busy sections — rounded, a thin brass ring, a lifted
 * shadow. Two modes, both zero-CLS:
 *  - default: pass `width`/`height`, the box takes the image's aspect ratio.
 *  - `fill`: pass an `aspectClassName` (e.g. "aspect-square"); the box owns the
 *    ratio and the image covers it.
 */
type ImageFrameProps = {
  image: string;
  alt: string;
  scrim?: "veil" | "none";
  /** Desaturate/darken for a background/texture read. Never true on a product shot. */
  tint?: boolean;
  sizes?: string;
  rounded?: string;
  ring?: string;
  className?: string;
} & (
  | { fill: true; aspectClassName: string; width?: never; height?: never }
  | { fill?: false; width: number; height: number; aspectClassName?: never }
);

export function ImageFrame({
  image,
  alt,
  fill = false,
  aspectClassName = "",
  width,
  height,
  scrim = "none",
  tint = false,
  sizes = "(min-width: 1024px) 480px, 90vw",
  rounded = "rounded-xl",
  ring = "ring-brass/30",
  className = "",
}: ImageFrameProps) {
  return (
    <div
      className={`relative overflow-hidden shadow-[var(--shadow-lift)] ring-1 ${rounded} ${ring} ${aspectClassName} ${className}`}
    >
      <Image
        src={image}
        alt={alt}
        {...(fill ? { fill: true } : { width: width as number, height: height as number })}
        loading="lazy"
        sizes={sizes}
        quality={78}
        className={`object-cover ${fill ? "" : "h-auto w-full"} ${tint ? "brand-tint" : ""}`}
      />
      {scrim === "veil" && <div className="absolute inset-0 scrim-veil" aria-hidden="true" />}
    </div>
  );
}
