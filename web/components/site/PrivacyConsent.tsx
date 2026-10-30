"use client";

import { useEffect } from "react";
import { applyConsent } from "@/lib/consent";

/**
 * Applies the visitor's saved privacy choice (cookie) and Global Privacy Control on every page
 * load, with no reload needed. Renders nothing. Mounted in both root layouts.
 */
export function PrivacyConsent() {
  useEffect(() => {
    applyConsent();
  }, []);
  return null;
}
