"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Every client-side navigation returns the viewport to the top of the new
 * page. Next's own scroll handling can restore a previously visited route's
 * scroll offset, which made menu clicks land mid-page — this re-asserts
 * top: 0 after the route has rendered, using a smooth scroll.
 *
 * The first run is skipped so a normal page load keeps the browser's own
 * scroll restoration (refreshing mid-article must not yank the reader up).
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const id = window.setTimeout(() => {
      if (window.scrollY !== 0) {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
