/**
 * Contacts CRUD + search + tags + custom fields + notes.
 * Docs: https://marketplace.gohighlevel.com/docs/ghl/contacts/contacts-api-v-3
 */

import { ghlRequest } from "./client";
import { requireGhlLocationId } from "./config";
import type {
  GhlAddTagsPayload,
  GhlContact,
  GhlContactCreatePayload,
  GhlContactListQuery,
  GhlContactListResponse,
  GhlContactSearchPayload,
  GhlContactUpdatePayload,
  GhlNote,
  GhlNotePayload,
} from "./types";

/** Create and Update both wrap the entity (`{ contact }`) on some versions, bare on others. */
function unwrapContact(res: unknown): GhlContact {
  if (res && typeof res === "object" && "contact" in res) {
    return (res as { contact: GhlContact }).contact;
  }
  return res as GhlContact;
}

export async function createContact(payload: GhlContactCreatePayload): Promise<GhlContact> {
  const res = await ghlRequest<unknown>("POST", "/contacts/", {
    body: { ...payload, locationId: payload.locationId || requireGhlLocationId() },
  });
  return unwrapContact(res);
}

export async function getContact(contactId: string): Promise<GhlContact> {
  const res = await ghlRequest<unknown>("GET", `/contacts/${contactId}`);
  return unwrapContact(res);
}

export async function updateContact(
  contactId: string,
  payload: GhlContactUpdatePayload,
): Promise<GhlContact> {
  const res = await ghlRequest<unknown>("PUT", `/contacts/${contactId}`, { body: payload });
  return unwrapContact(res);
}

export async function deleteContact(contactId: string): Promise<void> {
  await ghlRequest<unknown>("DELETE", `/contacts/${contactId}`);
}

/**
 * Create-or-update keyed on email/phone (honors the sub-account's duplicate
 * settings). Preferred for lead ingestion — never produces duplicates.
 */
export async function upsertContact(
  payload: Partial<GhlContactCreatePayload> & { email?: string; phone?: string },
): Promise<GhlContact> {
  const res = await ghlRequest<unknown>("POST", "/contacts/upsert", {
    body: { locationId: requireGhlLocationId(), ...payload },
  });
  return unwrapContact(res);
}

export async function listContacts(query: GhlContactListQuery = {}): Promise<GhlContact[]> {
  const res = await ghlRequest<GhlContactListResponse>("GET", "/contacts/", { query });
  return res.contacts ?? [];
}

/** Search by exact email; returns the first match or null. */
export async function findContactByEmail(email: string): Promise<GhlContact | null> {
  const contacts = await listContacts({ email, limit: 1 });
  return contacts[0] ?? null;
}

/** Search by exact phone (E.164); returns the first match or null. */
export async function findContactByPhone(phone: string): Promise<GhlContact | null> {
  const contacts = await listContacts({ phone, limit: 1 });
  return contacts[0] ?? null;
}

/** Advanced multi-filter search (POST /contacts/search). */
export async function searchContacts(payload: GhlContactSearchPayload): Promise<GhlContact[]> {
  const res = await ghlRequest<{ contacts?: GhlContact[] }>("POST", "/contacts/search", {
    body: payload,
  });
  return res.contacts ?? [];
}

export async function addTags(contactId: string, tags: string[]): Promise<void> {
  await ghlRequest<unknown>("POST", `/contacts/${contactId}/tags/add`, {
    body: { tags } satisfies GhlAddTagsPayload,
  });
}

export async function removeTags(contactId: string, tags: string[]): Promise<void> {
  await ghlRequest<unknown>("POST", `/contacts/${contactId}/tags/remove`, {
    body: { tags } satisfies GhlAddTagsPayload,
  });
}

/** Set custom fields wholesale (each entry `{ id: <customFieldId>, value }`). */
export async function setCustomFields(
  contactId: string,
  customFields: GhlContactCreatePayload["customFields"],
): Promise<GhlContact> {
  return updateContact(contactId, { customFields });
}

export async function addNote(contactId: string, payload: GhlNotePayload): Promise<GhlNote> {
  const res = await ghlRequest<unknown>("POST", `/contacts/${contactId}/notes`, { body: payload });
  if (res && typeof res === "object" && "note" in res) {
    return (res as { note: GhlNote }).note;
  }
  return res as GhlNote;
}
