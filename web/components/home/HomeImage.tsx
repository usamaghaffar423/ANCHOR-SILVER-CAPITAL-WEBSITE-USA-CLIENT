/**
 * Plain <img> with two pre-sized WebP variants (`<name>-<w>.webp`, generated from the handoff
 * originals) so phones don't download the 1200px masters. Width/height reserve the space.
 */
export function HomeImage({
  name,
  widths,
  w,
  h,
  sizes,
  alt,
  className,
  priority = false,
}: {
  name: string;
  widths: [number, number];
  w: number;
  h: number;
  sizes: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  const base = `/images/home/${name}`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${base}-${widths[0]}.webp`}
      srcSet={`${base}-${widths[0]}.webp ${widths[0]}w, ${base}-${widths[1]}.webp ${widths[1]}w`}
      sizes={sizes}
      width={w}
      height={h}
      alt={alt}
      className={className}
      decoding={priority ? "sync" : "async"}
      loading={priority ? "eager" : "lazy"}
      {...(priority ? { fetchPriority: "high" as const } : {})}
    />
  );
}
