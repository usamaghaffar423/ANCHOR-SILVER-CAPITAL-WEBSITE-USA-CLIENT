/**
 * Opportunities (deals) & pipeline stages.
 * Docs: https://marketplace.gohighlevel.com/docs/ghl/opportunities/opportunities-api-v-3
 */

import { ghlRequest } from "./client";
import { requireGhlLocationId } from "./config";
import type {
  GhlOpportunity,
  GhlOpportunityCreatePayload,
  GhlOpportunitySearchQuery,
  GhlOpportunitySearchResponse,
  GhlOpportunityUpdatePayload,
} from "./types";

function unwrapOpportunity(res: unknown): GhlOpportunity {
  if (res && typeof res === "object" && "opportunity" in res) {
    return (res as { opportunity: GhlOpportunity }).opportunity;
  }
  return res as GhlOpportunity;
}

export async function createOpportunity(
  payload: GhlOpportunityCreatePayload,
): Promise<GhlOpportunity> {
  const res = await ghlRequest<unknown>("POST", "/opportunities/", {
    body: { ...payload, locationId: payload.locationId || requireGhlLocationId() },
  });
  return unwrapOpportunity(res);
}

export async function getOpportunity(opportunityId: string): Promise<GhlOpportunity> {
  const res = await ghlRequest<unknown>("GET", `/opportunities/${opportunityId}`);
  return unwrapOpportunity(res);
}

export async function updateOpportunity(
  opportunityId: string,
  payload: GhlOpportunityUpdatePayload,
): Promise<GhlOpportunity> {
  const res = await ghlRequest<unknown>("PUT", `/opportunities/${opportunityId}`, { body: payload });
  return unwrapOpportunity(res);
}

/**
 * Move a deal to a different pipeline stage (the most common pipeline action:
 * stage transitions are just updates to `stageId`).
 */
export async function moveOpportunityStage(
  opportunityId: string,
  stageId: string,
  extra: GhlOpportunityUpdatePayload = {},
): Promise<GhlOpportunity> {
  return updateOpportunity(opportunityId, { ...extra, stageId });
}

/** Mark a deal won/lost/abandoned while keeping it in its current stage. */
export async function setOpportunityStatus(
  opportunityId: string,
  status: NonNullable<GhlOpportunityUpdatePayload["status"]>,
): Promise<GhlOpportunity> {
  return updateOpportunity(opportunityId, { status });
}

export async function searchOpportunities(
  query: GhlOpportunitySearchQuery = {},
): Promise<GhlOpportunity[]> {
  const res = await ghlRequest<GhlOpportunitySearchResponse>("GET", "/opportunities/search", {
    query: { locationId: requireGhlLocationId(), ...query },
  });
  return res.opportunities ?? [];
}
