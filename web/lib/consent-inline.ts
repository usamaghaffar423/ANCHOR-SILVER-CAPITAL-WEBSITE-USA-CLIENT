/**
 * Server-safe pieces of the consent module (no React), so the head tag components, which are
 * server components, can use them. The client side is lib/consent.ts.
 */
export const OPT_OUT_COOKIE = "asc_privacy_optout";

/**
 * The opt-out check as plain JavaScript text, for the head scripts that must run before their
 * tag loads (they cannot import modules). Evaluates to a boolean: Global Privacy Control or the
 * Your Privacy Choices cookie.
 */
export const OPT_OUT_INLINE_CHECK = `(navigator.globalPrivacyControl===true||/(?:^|; )${OPT_OUT_COOKIE}=1/.test(document.cookie))`;
