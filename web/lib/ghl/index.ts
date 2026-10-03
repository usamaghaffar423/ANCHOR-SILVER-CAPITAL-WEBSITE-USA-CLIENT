/**
 * GoHighLevel integration — public surface.
 *
 *   client        retrying HTTP client (429/5xx/backoff)
 *   auth          OAuth 2.0 + private-token auth, auto-refresh
 *   contacts      CRUD, search, tags, custom fields, notes
 *   opportunities deals + pipeline stage moves
 *   conversations SMS / Email / internal comments
 *   webhooks      Ed25519 signature verification + event dispatch
 *   lead-push     the /api/lead bridge (site-specific)
 */

export { ghlRequest } from "./client";
export type { GhlMethod, GhlRequestOptions } from "./client";

export {
  exchangeAuthorizationCode,
  getGhlAuthHeader,
  buildAuthorizeUrl,
  userTypeForFlow,
} from "./auth";

export { getGhlConfig, isGhlConfigured, GHL_BASE_URL, GHL_API_VERSION } from "./config";
export type { GhlConfig, GhlAuthMode } from "./config";

export * from "./types";
export * from "./errors";

export {
  createContact,
  getContact,
  updateContact,
  deleteContact,
  upsertContact,
  listContacts,
  findContactByEmail,
  findContactByPhone,
  searchContacts,
  addTags,
  removeTags,
  setCustomFields,
  addNote,
} from "./contacts";

export {
  createOpportunity,
  getOpportunity,
  updateOpportunity,
  moveOpportunityStage,
  setOpportunityStatus,
  searchOpportunities,
} from "./opportunities";

export { sendMessage, sendSms, sendEmail, postInternalComment } from "./conversations";

export {
  verifyGhlSignature,
  parseGhlWebhook,
  GHL_ED25519_PUBLIC_KEY_PEM,
} from "./webhooks";
export type { GhlSignatureResult, VerifyGhlSignatureOptions } from "./webhooks";

export { dispatchGhlEvent } from "./webhook-handlers";
export type { GhlDispatchResult } from "./webhook-handlers";

export { pushLeadToGhl, leadToContactPayload } from "./lead-push";
export type { GhlLead } from "./lead-push";

export { getStoredToken, saveStoredToken, findTokenById } from "./token-store";
