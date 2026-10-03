/**
 * Webhook event dispatch — one typed handler per GHL event type, a default
 * logger for everything else. Handlers must never throw: the listener always
 * returns 200 so GHL doesn't retry-storm us; failures are logged instead.
 *
 * Extend by adding entries to `handlers` — e.g. sync ContactUpdate back into
 * the `leads` table once a `ghl_contact_id` column exists.
 */

import { GHL_WEBHOOK_EVENTS, type GhlContact, type GhlWebhookEvent } from "./types";

export interface GhlDispatchResult {
  type: string;
  handled: boolean;
}

type GhlEventHandler = (event: GhlWebhookEvent) => void | Promise<void>;

function log(type: string, event: GhlWebhookEvent): void {
  console.log(
    `[ghl:webhook] ${type} location=${event.locationId ?? "?"} webhookId=${event.webhookId ?? "?"}`,
  );
}

const handlers: Record<string, GhlEventHandler> = {
  [GHL_WEBHOOK_EVENTS.INSTALL]: (event) => {
    console.log(
      `[ghl:webhook] app installed location=${event.locationId ?? "?"} company=${event.companyId ?? "?"}`,
    );
  },

  [GHL_WEBHOOK_EVENTS.ContactCreate]: (event) => {
    const contact = (event.body ?? event) as GhlContact;
    log("ContactCreate", event);
    console.log(
      `[ghl:webhook] new GHL contact id=${contact.id ?? "?"} email=${contact.email ?? "-"} phone=${contact.phone ?? "-"}`,
    );
  },

  [GHL_WEBHOOK_EVENTS.ContactUpdate]: (event) => {
    const contact = (event.body ?? event) as GhlContact;
    log("ContactUpdate", event);
    console.log(`[ghl:webhook] GHL contact updated id=${contact.id ?? "?"}`);
  },

  [GHL_WEBHOOK_EVENTS.InboundMessage]: (event) => {
    log("InboundMessage", event);
  },

  [GHL_WEBHOOK_EVENTS.OpportunityStatusUpdate]: (event) => {
    log("OpportunityStatusUpdate", event);
  },
};

export async function dispatchGhlEvent(event: GhlWebhookEvent): Promise<GhlDispatchResult> {
  const handler = handlers[event.type];
  try {
    if (handler) {
      await handler(event);
      return { type: event.type, handled: true };
    }
    log(event.type || "unknown", event);
    return { type: event.type, handled: false };
  } catch (err) {
    // Never bubble — a thrown handler would make GHL retry the whole delivery.
    console.error(`[ghl:webhook] handler failed for ${event.type}:`, err);
    return { type: event.type, handled: true };
  }
}
