import Image from "next/image";

/**
 * Framed product/coin shot for dark or busy sections — rounded, a thin brass
 * ring, a lifted shadow. Uses next/image width+height (not fill) so the box's
 * aspect ratio is known up front and nothing shifts while it loads.
 */
export function ImageFrame({
  image,
  alt,
  width,
  height,
  scrim = "none",
  tint = false,
  sizes = "(min-width: 1024px) 480px, 90vw",
  className = "",
}: {
  image: string;
  alt: string;
  width: number;
  height: number;
  scrim?: "veil" | "none";
  /** Desaturate/darken for a background/texture read. Never true on a product shot. */
  tint?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-[var(--shadow-lift)] ring-1 ring-brass/30 ${className}`}
    >
      <Image
        src={image}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        sizes={sizes}
        quality={78}
        className={`h-auto w-full object-cover ${tint ? "brand-tint" : ""}`}
      />
      {scrim === "veil" && <div className="absolute inset-0 scrim-veil" aria-hidden="true" />}
    </div>
  );
}
