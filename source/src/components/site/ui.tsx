import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function Section({
  children,
  tone = "light",
  className = "",
  id,
}: {
  children: ReactNode;
  tone?: "light" | "muted" | "sage" | "ink";
  className?: string;
  id?: string;
}) {
  const tones = {
    light: "bg-background text-foreground",
    muted: "bg-muted text-foreground",
    sage: "bg-primary text-primary-foreground",
    ink: "bg-ink text-silver",
  } as const;
  return (
    <section id={id} className={`${tones[tone]} px-5 py-12 md:py-20 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

export function H2({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`text-3xl leading-tight md:text-[2.6rem] ${className}`}>{children}</h2>
  );
}

export function Lede({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`max-w-3xl text-lg leading-relaxed ${className}`}>{children}</p>;
}

export function Prose({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`max-w-3xl space-y-4 text-base leading-relaxed text-foreground ${className}`}>
      {children}
    </div>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-xs italic text-muted-foreground">{children}</p>;
}

export function Card({
  children,
  className = "",
  as: As = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  return (
    <As
      className={`rounded-md border border-l-2 border-border border-l-transparent bg-card p-6 shadow-[var(--shadow-card)] transition-all duration-300 hover:border-l-primary hover:shadow-[var(--shadow-lift)] ${className}`}
    >
      {children}
    </As>
  );
}

export function Divider() {
  return <hr className="my-10 border-0 border-t border-border" />;
}

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export const buttonStyles = {
  primary: `${btnBase} bg-primary text-primary-foreground shadow-[var(--shadow-card)] hover:bg-accent`,
  secondary: `${btnBase} border border-primary bg-card text-primary hover:bg-sage-soft`,
  outlineLight: `${btnBase} border border-secondary text-secondary hover:bg-secondary hover:text-accent`,
  silver: `${btnBase} bg-secondary text-accent hover:bg-silver-deep`,
} as const;

export function ButtonLink({
  to,
  children,
  variant = "primary",
  className = "",
}: {
  to: string;
  children: ReactNode;
  variant?: keyof typeof buttonStyles;
  className?: string;
}) {
  return (
    <Link to={to} className={`${buttonStyles[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function PhoneLink({
  variant = "secondary",
  className = "",
  label,
}: {
  variant?: keyof typeof buttonStyles;
  className?: string;
  label?: string;
}) {
  return (
    <a href="tel:+18668187243" className={`${buttonStyles[variant]} ${className}`}>
      {label ?? "Call (866) 818-7243"}
    </a>
  );
}
