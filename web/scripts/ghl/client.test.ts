import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { ghlRequest } from "../../lib/ghl/client";
import { GhlApiError } from "../../lib/ghl/errors";

const auth = async () => "Bearer test-token";
const realFetch = globalThis.fetch;
const calls: string[] = [];

afterEach(() => {
  globalThis.fetch = realFetch;
  calls.length = 0;
});

function mockFetch(responses: Array<() => Response>): typeof fetch {
  let i = 0;
  const impl = (async (input: RequestInfo | URL) => {
    calls.push(String(input));
    const factory = responses[Math.min(i, responses.length - 1)];
    i++;
    return factory();
  }) as unknown as typeof fetch;
  globalThis.fetch = impl;
  return impl;
}

function json(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

test("returns parsed JSON on 200", async () => {
  mockFetch([() => json(200, { ok: true })]);
  const res = await ghlRequest<{ ok: boolean }>("GET", "/contacts/", { auth, backoffMs: 0 });
  assert.deepEqual(res, { ok: true });
  assert.equal(calls.length, 1);
});

test("retries a 429 honoring Retry-After, then succeeds", async () => {
  mockFetch([
    () => json(429, { message: "rate limited" }, { "Retry-After": "0" }),
    () => json(200, { ok: 1 }),
  ]);
  const res = await ghlRequest<{ ok: number }>("GET", "/contacts/", {
    auth,
    backoffMs: 0,
    retries: 2,
  });
  assert.deepEqual(res, { ok: 1 });
  assert.equal(calls.length, 2);
});

test("retries 5xx for GET but ultimately surfaces a typed error", async () => {
  mockFetch([() => json(503, { message: "unavailable" })]);
  await assert.rejects(
    () => ghlRequest("GET", "/contacts/x", { auth, backoffMs: 0, retries: 2 }),
    (err: unknown) => {
      assert.ok(err instanceof GhlApiError);
      assert.equal(err.status, 503);
      assert.equal(err.retryable, true);
      assert.equal(err.method, "GET");
      return true;
    },
  );
  assert.equal(calls.length, 3); // initial + 2 retries
});

test("does not retry a 400 client error", async () => {
  mockFetch([() => json(400, { message: "bad request" })]);
  await assert.rejects(
    () => ghlRequest("GET", "/contacts/", { auth, backoffMs: 0, retries: 3 }),
    (err: unknown) => err instanceof GhlApiError && err.status === 400,
  );
  assert.equal(calls.length, 1);
});

test("does not retry POST on 5xx by default (no duplicate creates)", async () => {
  mockFetch([() => json(500, { message: "boom" })]);
  await assert.rejects(
    () => ghlRequest("POST", "/contacts/", { auth, body: {}, backoffMs: 0, retries: 3 }),
    (err: unknown) => err instanceof GhlApiError && err.status === 500,
  );
  assert.equal(calls.length, 1);
});

test("POST retries 429 (rate limit means the request never ran)", async () => {
  mockFetch([
    () => json(429, { message: "slow down" }, { "Retry-After": "0" }),
    () => json(201, { contact: { id: "c1" } }),
  ]);
  const res = await ghlRequest<{ contact: { id: string } }>("POST", "/contacts/", {
    auth,
    body: {},
    backoffMs: 0,
  });
  assert.equal(res.contact.id, "c1");
  assert.equal(calls.length, 2);
});

test("throws GhlAuthError-style failure when no auth resolves", async () => {
  await assert.rejects(
    () => ghlRequest("GET", "/contacts/", { auth: async () => null, backoffMs: 0 }),
    (err: unknown) => err instanceof GhlApiError && err.status === 401,
  );
  assert.equal(calls.length, 0);
});

test("retries network errors then succeeds", async () => {
  let i = 0;
  globalThis.fetch = (async () => {
    calls.push("net");
    if (i++ === 0) throw new TypeError("fetch failed");
    return json(200, { recovered: true });
  }) as unknown as typeof fetch;

  const res = await ghlRequest<{ recovered: boolean }>("GET", "/contacts/", {
    auth,
    backoffMs: 0,
    retries: 2,
  });
  assert.deepEqual(res, { recovered: true });
  assert.equal(calls.length, 2);
});
