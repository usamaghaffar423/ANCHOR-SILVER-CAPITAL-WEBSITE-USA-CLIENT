"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { label: string; href: string; external?: boolean };

/**
 * Dense, single-level data-site menu: small uppercase labels, thin dividers.
 * No dropdowns: there is no group of two or more related pages to put in one.
 */
export function SatNav({ items }: { items: Item[] }) {
  // The browser path is the public one; strip the internal route prefix defensively.
  const path = (usePathname() || "/").replace(/^\/sat-(gold|silver)(?=\/|$)/, "") || "/";
  return (
    <nav className="sat-nav" aria-label="Primary">
      {items.map((it) => {
        const current = !it.external && it.href === path;
        const cls = current ? "is-current" : undefined;
        return it.external ? (
          <a key={it.href} href={it.href} className={cls}>
            {it.label}
          </a>
        ) : (
          <Link key={it.href} href={it.href} className={cls} aria-current={current ? "page" : undefined}>
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
