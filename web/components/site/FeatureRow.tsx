import type { ReactNode } from "react";
import { ImageFrame } from "@/components/site/ImageFrame";
import { Reveal } from "@/components/site/Reveal";

/**
 * Editorial two-column row: text beside a square framed image, vertically
 * centered with a generous gap. `reverse` puts the image on the left (CSS
 * order — the markup isn't duplicated). Below `md` it collapses to one column
 * with the image stacked on top of the text. The whole row fades in on scroll
 * via `Reveal` (which already respects prefers-reduced-motion).
 */
export function FeatureRow({
  image,
  alt,
  reverse = false,
  children,
}: {
  image: string;
  alt: string;
  reverse?: boolean;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <div className="flex flex-col-reverse gap-8 md:grid md:grid-cols-[55fr_45fr] md:items-center md:gap-14">
        <div className={`min-w-0 md:max-w-xl ${reverse ? "md:order-2" : "md:order-1"}`}>
          {children}
        </div>
        <ImageFrame
          fill
          aspectClassName="aspect-square"
          rounded="rounded-2xl"
          ring="ring-brass/25"
          image={image}
          alt={alt}
          sizes="(max-width: 768px) 100vw, 45vw"
          className={reverse ? "md:order-1" : "md:order-2"}
        />
      </div>
    </Reveal>
  );
}
