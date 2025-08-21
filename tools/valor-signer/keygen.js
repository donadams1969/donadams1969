#!/usr/bin/env node
// Ed25519 keygen with full outputs (no truncation). Writes JWK + raw encodings.

import fs from "fs";
import path from "path";
import nacl from "tweetnacl";

const enc = new TextEncoder();
const b64u = (u8)=>Buffer.from(u8).toString("base64").replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
const hex  = (u8)=>Buffer.from(u8).toString("hex");

const outBase = process.argv[2] || "ed25519_key";
const seed = nacl.randomBytes(32);
const kp = nacl.sign.keyPair.fromSeed(seed);

const jwk = {
  kty: "OKP",
  crv: "Ed25519",
  x: b64u(kp.publicKey),
  d: b64u(seed) // 32-byte seed only (no truncation)
};

const bundle = {
  jwk,
  public_b64u: b64u(kp.publicKey),
  public_hex: hex(kp.publicKey),
  seed_b64u: b64u(seed),
  seed_hex: hex(seed),
  secret_b64u: b64u(kp.secretKey), // 64 bytes
  secret_hex: hex(kp.secretKey)
};

fs.writeFileSync(`${outBase}.json`, JSON.stringify(bundle, null, 2), "utf8");
console.log("Wrote:", path.resolve(`${outBase}.json`));
