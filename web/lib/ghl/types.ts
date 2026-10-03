/**
 * TypeScript definitions for every GHL (HighLevel) v2/v3 payload this project
 * touches: Contacts, Opportunities, Conversations, OAuth tokens, webhooks.
 * Field names mirror the official marketplace.gohighlevel.com docs.
 */

// ── Shared ──────────────────────────────────────────────────────────────────

export type GhlCustomFieldValue = string | number | string[] | null;

export interface GhlCustomField {
  id: string;
  value: GhlFieldValue;
}

// Alias kept separate so custom-field values read clearly at call sites.
export type GhlFieldValue = GhlCustomFieldValue;

export interface GhlPagingMeta {
  count?: number;
  total?: number;
  nextPageUrl?: string | null;
}

// ── Contacts ────────────────────────────────────────────────────────────────

export interface GhlContact {
  id: string;
  locationId?: string;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  website?: string | null;
  source?: string;
  tags?: string[];
  customFields?: GhlCustomField[];
  dateAdded?: string;
  dateUpdated?: string;
  assignedTo?: string | null;
  dnd?: boolean;
  country?: string | null;
  timezone?: string | null;
}

export interface GhlContactCreatePayload {
  locationId: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  website?: string;
  source?: string;
  tags?: string[];
  customFields?: GhlCustomField[];
  assignedTo?: string;
  dnd?: boolean;
  country?: string;
}

export type GhlContactUpdatePayload = Partial<Omit<GhlContactCreatePayload, "locationId">> & {
  locationId?: string;
};

export interface GhlContactListResponse {
  contacts: GhlContact[];
  meta?: GhlPagingMeta;
}

export interface GhlContactListQuery {
  email?: string;
  phone?: string;
  limit?: number;
  startAfterDate?: string;
  query?: string;
  [key: string]: unknown;
}

/** POST /contacts/search — advanced filter groups (GHL "ClickUp-style" filters). */
export interface GhlContactSearchFilter {
  field: string;
  operator: "eq" | "neq" | "contains" | "empty" | "not_empty" | "gt" | "lt" | "gte" | "lte" | "in";
  value: string | number | boolean | string[];
}

export interface GhlContactSearchPayload {
  filters?: GhlContactSearchFilter[];
  page?: number;
  limit?: number;
}

export type GhlAddTagsPayload = { tags: string[] };

// ── Notes (contacts) ────────────────────────────────────────────────────────

export interface GhlNotePayload {
  body: string;
  userId?: string;
  title?: string;
  color?: string;
  pinned?: boolean;
}

export interface GhlNote {
  id: string;
  body: string;
  userId?: string;
  dateAdded?: string;
  contactId?: string;
}

// ── Opportunities & pipelines ───────────────────────────────────────────────

export type GhlOpportunityStatus = "open" | "won" | "lost" | "abandoned";

export interface GhlOpportunity {
  id: string;
  locationId?: string;
  name: string;
  status?: GhlOpportunityStatus;
  monetaryValue?: number | null;
  pipelineId?: string;
  stageId?: string;
  contactId?: string;
  assignedTo?: string | null;
  dateAdded?: string;
  dateUpdated?: string;
  source?: string;
}

export interface GhlOpportunityCreatePayload {
  locationId: string;
  name: string;
  pipelineId: string;
  stageId: string;
  contactId: string;
  status?: GhlOpportunityStatus;
  monetaryValue?: number;
  assignedTo?: string;
  source?: string;
  companyName?: string;
}

export type GhlOpportunityUpdatePayload = Partial<
  Omit<GhlOpportunityCreatePayload, "locationId">
> & {
  locationId?: string;
};

export interface GhlOpportunitySearchQuery {
  locationId?: string;
  pipelineId?: string;
  stageId?: string;
  status?: GhlOpportunityStatus;
  contactId?: string;
  limit?: number;
  offset?: number;
  [key: string]: unknown;
}

export interface GhlOpportunitySearchResponse {
  opportunities: GhlOpportunity[];
  meta?: GhlPagingMeta;
}

// ── Conversations & messaging ───────────────────────────────────────────────

export type GhlMessageType =
  | "SMS"
  | "Email"
  | "WhatsApp"
  | "IG"
  | "FB"
  | "Custom"
  | "Live_Chat"
  | "InternalComment";

export type GhlMessageStatus = "delivered" | "failed" | "pending" | "read";

export interface GhlMessagePayload {
  type: GhlMessageType;
  contactId: string;
  message?: string;
  html?: string;
  subject?: string;
  emailFrom?: string;
  emailTo?: string;
  emailCc?: string[];
  emailBcc?: string[];
  fromNumber?: string;
  toNumber?: string;
  attachments?: string[];
  mentions?: string[];
  status?: GhlMessageStatus;
  scheduledTimestamp?: number;
}

export interface GhlMessageResponse {
  conversationId: string;
  messageId?: string;
  messageIds?: string[];
  emailMessageId?: string;
  msg?: string;
}

// ── OAuth 2.0 ───────────────────────────────────────────────────────────────

export type GhlUserType = "Location" | "Company";

export interface GhlTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope?: string;
  userType?: GhlUserType;
  locationId?: string;
  companyId?: string;
  userId?: string;
  refreshTokenId?: string;
}

export interface GhlStoredToken {
  id: string; // locationId when known, else "default"
  locationId: string | null;
  companyId: string | null;
  userId: string | null;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  scope: string | null;
  /** epoch ms when the access token expires */
  expiresAt: number;
  updatedAt: number;
}

// ── Webhooks ────────────────────────────────────────────────────────────────

/**
 * GHL fires webhooks with a top-level `type` plus location/company context;
 * event-specific data lives in `body` (contacts, opportunities, messages…).
 * Unknown types must still round-trip — hence the index signature.
 */
export interface GhlWebhookEvent<TBody = unknown> {
  type: string;
  locationId?: string;
  companyId?: string;
  userId?: string;
  timestamp?: string;
  webhookId?: string;
  appId?: string;
  body?: TBody;
  [key: string]: unknown;
}

/** Common event type constants (not exhaustive — GHL adds new ones regularly). */
export const GHL_WEBHOOK_EVENTS = {
  INSTALL: "INSTALL",
  ContactCreate: "ContactCreate",
  ContactUpdate: "ContactUpdate",
  ContactDND: "ContactDND",
  InboundMessage: "InboundMessage",
  ConversationCreate: "ConversationCreate",
  OpportunityCreate: "OpportunityCreate",
  OpportunityUpdate: "OpportunityUpdate",
  OpportunityStatusUpdate: "OpportunityStatusUpdate",
} as const;
