"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// The popup can only appear once the visitor has scrolled past the hero, so
// nothing is gained by fetching or hydrating it before they move. Loading on
// first scroll keeps Radix Dialog + the GHL wrapper out of the initial
// hydration task, and there is no visual difference: GuidePopup renders null
// until its IntersectionObserver fires.
const GuidePopup = dynamic(
  () => import("@/components/site/GuidePopup").then((m) => ({ default: m.GuidePopup })),
  { ssr: false, loading: () => null },
);

export function LazyGuidePopup() {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const load = () => setArmed(true);
    if (window.scrollY > 0) {
      load();
      return;
    }
    for (const type of ["scroll", "wheel", "touchstart", "pointerdown", "keydown"]) {
      window.addEventListener(type, load, { passive: true, once: true });
    }
    return () => {
      for (const type of ["scroll", "wheel", "touchstart", "pointerdown", "keydown"]) {
        window.removeEventListener(type, load);
      }
    };
  }, []);

  if (!armed) return null;
  return <GuidePopup />;
}
