"use client";

import { useState } from "react";

export type Utm = { source: string; medium: string; campaign: string };

const EMPTY: Utm = { source: "", medium: "", campaign: "" };

function readUtm(): Utm {
  if (typeof window === "undefined") return EMPTY;
  const p = new URLSearchParams(window.location.search);
  return {
    source: p.get("utm_source") ?? "",
    medium: p.get("utm_medium") ?? "",
    campaign: p.get("utm_campaign") ?? "",
  };
}

/**
 * Reads utm_source / utm_medium / utm_campaign from the URL once, on the client,
 * so a form can attach them to its submission. Read via a lazy `useState`
 * initializer (not an effect) — the values are never rendered, so there's no
 * hydration concern. The route treats "" as absent.
 */
export function useUtm(): Utm {
  const [utm] = useState<Utm>(readUtm);
  return utm;
}
