import type { ReactNode } from "react";
import { AnchorGlyph } from "../brand/AnchorMark";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="chart-lines relative -mt-[112px] bg-ink px-5 pb-14 pt-[152px] text-silver">
      <AnchorGlyph className="pointer-events-none absolute right-6 top-24 hidden h-40 w-40 text-secondary/10 lg:block" />
      <div className="mx-auto w-full max-w-6xl">
        {eyebrow && <p className="eyebrow text-secondary">{eyebrow}</p>}
        <h1 className="mt-4 max-w-4xl text-4xl leading-[1.1] text-background md:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-silver">{subtitle}</p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
