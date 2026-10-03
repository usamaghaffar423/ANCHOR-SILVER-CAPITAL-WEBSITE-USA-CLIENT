import { test } from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync, sign } from "node:crypto";
import { verifyGhlSignature } from "../../lib/ghl/webhooks";

const payload = JSON.stringify({ type: "ContactCreate", locationId: "LOC123", body: { id: "c1" } });

const { publicKey, privateKey } = generateKeyPairSync("ed25519");
const publicKeyPem = publicKey.export({ type: "spki", format: "pem" }).toString();

function signWith(key: typeof privateKey, data: string): string {
  return sign(null, Buffer.from(data, "utf8"), key).toString("base64");
}

test("accepts a valid Ed25519 signature over the raw body", () => {
  const sig = signWith(privateKey, payload);
  const result = verifyGhlSignature(payload, sig, { publicKeyPem });
  assert.equal(result.valid, true);
  assert.equal(result.reason, undefined);
});

test("rejects when the body was tampered with after signing", () => {
  const sig = signWith(privateKey, payload);
  const tampered = payload.replace("LOC123", "LOC999");
  const result = verifyGhlSignature(tampered, sig, { publicKeyPem });
  assert.equal(result.valid, false);
  assert.match(result.reason ?? "", /verification failed/);
});

test("rejects a signature made by a different key", () => {
  const other = generateKeyPairSync("ed25519");
  const sig = signWith(other.privateKey, payload);
  const result = verifyGhlSignature(payload, sig, { publicKeyPem });
  assert.equal(result.valid, false);
});

test("rejects a missing signature", () => {
  assert.equal(verifyGhlSignature(payload, null).valid, false);
  assert.equal(verifyGhlSignature(payload, undefined).valid, false);
  assert.equal(verifyGhlSignature(payload, "").valid, false);
  assert.equal(verifyGhlSignature(payload, "N/A").valid, false);
});

test("rejects garbage base64 without throwing", () => {
  const result = verifyGhlSignature(payload, "!!!not-base64!!!", { publicKeyPem });
  assert.equal(result.valid, false);
});

test("rejects an invalid public key PEM without throwing", () => {
  const sig = signWith(privateKey, payload);
  const result = verifyGhlSignature(payload, sig, { publicKeyPem: "-----BEGIN PUBLIC KEY-----\nbogus\n-----END PUBLIC KEY-----" });
  assert.equal(result.valid, false);
});
