import Image from "next/image";

export type GalleryImage = { src: string; alt: string };

/**
 * Responsive image grid — consistent aspect ratio, lazy, a brass hover ring.
 * Keep the set small and cohesive (a handful of repeated images beats a wall
 * of metal) — see the calling page for which images belong together.
 */
export function Gallery({ images, className = "" }: { images: GalleryImage[]; className?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {images.map((img) => (
        <div
          key={img.src}
          className="group relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-border transition-all duration-300 hover:ring-2 hover:ring-brass/50"
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            quality={78}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      ))}
    </div>
  );
}
