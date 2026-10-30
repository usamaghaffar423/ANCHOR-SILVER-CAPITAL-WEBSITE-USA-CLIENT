/**
 * React side of the consent module (see lib/consent-state.ts for the state itself).
 */
import { useSyncExternalStore } from "react";
import { CONSENT_CHANGE_EVENT, gpcEnabled, isOptedOut } from "@/lib/consent-state";

export * from "@/lib/consent-state";
export { OPT_OUT_INLINE_CHECK } from "@/lib/consent-inline";

function subscribe(cb: () => void) {
  window.addEventListener(CONSENT_CHANGE_EVENT, cb);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, cb);
}

/** React state for the current opt-out (false on the server and during hydration). */
export function useOptedOut(): boolean {
  return useSyncExternalStore(subscribe, isOptedOut, () => false);
}

export function useGpc(): boolean {
  return useSyncExternalStore(subscribe, gpcEnabled, () => false);
}
