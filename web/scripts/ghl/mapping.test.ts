import { test } from "node:test";
import assert from "node:assert/strict";
import { leadToContactPayload, type GhlLead } from "../../lib/ghl/lead-push";

const lead: GhlLead = {
  fullName: "Jane Q. Doe",
  email: "jane@example.com",
  phone: "+15551234567",
  interest: "silver_ira",
  amountBracket: "$50k-$100k",
  sourceForm: "contact_page",
  sourcePage: "/contact",
  utmSource: "google",
  utmMedium: "cpc",
  utmCampaign: "silver-ira",
  message: "Please call after 5pm",
  howHeard: "radio",
  consentTcpa: true,
};

test("splits the full name into first/last", () => {
  const p = leadToContactPayload(lead, {});
  assert.equal(p.firstName, "Jane");
  assert.equal(p.lastName, "Q. Doe");
  assert.equal(p.name, "Jane Q. Doe");
  assert.equal(p.email, "jane@example.com");
  assert.equal(p.phone, "+15551234567");
});

test("handles single-word names without an empty lastName", () => {
  const p = leadToContactPayload({ ...lead, fullName: "Plato" }, {});
  assert.equal(p.firstName, "Plato");
  assert.equal(p.lastName, undefined);
  assert.equal("lastName" in p, false);
});

test("builds the standard tag set", () => {
  const p = leadToContactPayload(lead, {});
  assert.deepEqual(p.tags, [
    "website",
    "anchorsilvercapital",
    "contact_page",
    "silver_ira",
    "$50k-$100k",
  ]);
});

test("omits the amount tag when no bracket was chosen", () => {
  const p = leadToContactPayload({ ...lead, amountBracket: undefined }, {});
  assert.deepEqual(p.tags, ["website", "anchorsilvercapital", "contact_page", "silver_ira"]);
});

test("maps lead fields to GHL custom fields via fieldMap", () => {
  const p = leadToContactPayload(lead, {
    interest: "cf_interest",
    amountBracket: "cf_amount",
    message: "cf_message",
    utmCampaign: "cf_campaign",
  });
  assert.deepEqual(p.customFields, [
    { id: "cf_interest", value: "silver_ira" },
    { id: "cf_amount", value: "$50k-$100k" },
    { id: "cf_message", value: "Please call after 5pm" },
    { id: "cf_campaign", value: "silver-ira" },
  ]);
});

test("skips unmapped/empty fields and omits customFields entirely when map is empty", () => {
  const p = leadToContactPayload({ ...lead, amountBracket: null }, { amountBracket: "cf_amount" });
  assert.equal("customFields" in p, false);
});

test("source string identifies the site and form", () => {
  const p = leadToContactPayload(lead, {});
  assert.equal(p.source, "anchorsilvercapital.com (contact_page)");
});
