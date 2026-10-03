/**
 * Conversations — outbound SMS/Email and internal comments.
 * Docs: https://marketplace.gohighlevel.com/docs/ghl/conversations/send-a-new-message
 * The same endpoint serves every channel; `type` is the switch.
 */

import { ghlRequest } from "./client";
import type { GhlMessagePayload, GhlMessageResponse } from "./types";

export async function sendMessage(payload: GhlMessagePayload): Promise<GhlMessageResponse> {
  return ghlRequest<GhlMessageResponse>("POST", "/conversations/messages", { body: payload });
}

/** Fire an SMS from the sub-account's LC Phone number. */
export async function sendSms(
  contactId: string,
  message: string,
  opts: { fromNumber?: string; toNumber?: string } = {},
): Promise<GhlMessageResponse> {
  return sendMessage({ type: "SMS", contactId, message, ...opts });
}

/** Fire a transactional email through the contact's conversation thread. */
export async function sendEmail(
  contactId: string,
  opts: {
    subject: string;
    message?: string;
    html?: string;
    emailFrom: string;
    emailCc?: string[];
    emailBcc?: string[];
  },
): Promise<GhlMessageResponse> {
  const { subject, emailFrom, ...rest } = opts;
  return sendMessage({
    type: "Email",
    contactId,
    subject,
    emailFrom,
    ...rest,
  });
}

/**
 * Log an internal comment on the contact's timeline (visible to the team,
 * never sent to the contact). `mentions` are GHL user IDs to @-notify.
 */
export async function postInternalComment(
  contactId: string,
  message: string,
  mentions: string[] = [],
): Promise<GhlMessageResponse> {
  return sendMessage({ type: "InternalComment", contactId, message, mentions });
}
