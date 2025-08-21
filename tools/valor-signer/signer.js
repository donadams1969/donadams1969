#!/usr/bin/env node
// VALOR multisig JSON signer - no truncation, raw Ed25519 + JWS, sidecar hash, canonicalizes exactly to match viewer

import fs from "fs";
import path from "path";
import crypto from "crypto";
import nacl from "tweetnacl";

// ---- helpers ----
const enc = new TextEncoder();
const dec = new TextDecoder();
const b64u = {
  enc: (u8) => Buffer.from(u8).toString("base64").replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""),
  dec: (s) => new Uint8Array(Buffer.from(s.replace(/-/g,"+").replace(/_/g,"/"), "base64"))
};
const hex = {
  enc: (u8) => Buffer.from(u8).toString("hex"),
  dec: (h) => new Uint8Array(Buffer.from(h.replace(/^0x/,""), "hex"))
};
function sha256HexString(s) { return crypto.createHash("sha256").update(s).digest("hex"); }
function stableSort(x){
  if (Array.isArray(x)) return x.map(stableSort);
  if (x && typeof x === "object" && !(x instanceof Uint8Array)) {
    return Object.fromEntries(Object.keys(x).sort().map(k => [k, stableSort(x[k])]));
  }
  return x;
}
function canonical(obj){ return JSON.stringify(stableSort(obj)); }
function deepClone(o){ return JSON.parse(JSON.stringify(o)); }
function readJsonMaybe(filepath){
  let text; try { text = fs.readFileSync(filepath, "utf8"); } catch { return null; }
  try { return JSON.parse(text); } catch { return null; }
}
function isLikelyJwk(o){ return o && typeof o==="object" && o.kty==="OKP" && o.crv==="Ed25519" && typeof o.x==="string"; }
function asU8(val){
  if (typeof val==="string" && /^[0-9a-fA-Fx]+$/.test(val)) return hex.dec(val);
  if (typeof val==="string" && /^[A-Za-z0-9_-]+$/.test(val)) return b64u.dec(val);
  if (val instanceof Uint8Array) return val;
  throw new Error("Unsupported byte input format");
}
function loadKeyMaterial(arg){
  // Accept: key file path, jwk string, b64u/hex private
  let v=arg;
  if (fs.existsSync(arg) && fs.statSync(arg).isFile()) {
    const maybe = readJsonMaybe(arg);
    if (maybe) v = maybe;
    else {
      const t = fs.readFileSync(arg, "utf8").trim();
      try { v = JSON.parse(t); } catch { v = t; }
    }
  } else {
    if (typeof v === "string" && v.trim().startsWith("{")) { try { v = JSON.parse(v); } catch {} }
  }
  // JWK with d
  if (isLikelyJwk(v) && typeof v.d === "string") {
    const pub = b64u.dec(v.x);
    const d   = b64u.dec(v.d);
    let kp;
    if (d.length === 32) { kp = nacl.sign.keyPair.fromSeed(d); }
    else if (d.length === 64) { kp = nacl.sign.keyPair.fromSeed(d.slice(0,32)); }
    else { throw new Error("JWK.d must be 32 or 64 raw bytes"); }
    return { publicKey: kp.publicKey, secretKey: kp.secretKey };
  }
  if (typeof v === "string") {
    const bytes = asU8(v);
    if (bytes.length === 32) { const kp = nacl.sign.keyPair.fromSeed(bytes); return { publicKey: kp.publicKey, secretKey: kp.secretKey }; }
    if (bytes.length === 64) { const sk = bytes; const pk = sk.slice(32); return { publicKey: pk, secretKey: sk }; }
    throw new Error("Raw key must be 32-byte seed or 64-byte secretKey");
  }
  if (v && typeof v === "object") {
    if (v.seed_b64u || v.seed_hex) {
      const seed = v.seed_b64u ? b64u.dec(v.seed_b64u) : hex.dec(v.seed_hex);
      if (seed.length !== 32) throw new Error("seed must be 32 bytes");
      const kp = nacl.sign.keyPair.fromSeed(seed);
      return { publicKey: kp.publicKey, secretKey: kp.secretKey };
    }
    if (v.secret_b64u || v.secret_hex) {
      const sk = v.secret_b64u ? b64u.dec(v.secret_b64u) : hex.dec(v.secret_hex);
      if (sk.length !== 64) throw new Error("secretKey must be 64 bytes");
      return { publicKey: sk.slice(32), secretKey: sk };
    }
  }
  throw new Error("Unrecognized key format");
}
function toJwkFromPublic(pkU8){
  return { kty:"OKP", crv:"Ed25519", x: b64u.enc(pkU8) };
}

// ---- argument parse ----
const args = process.argv.slice(2);
function getFlag(name){ return args.includes(`--${name}`); }
function getArg(name, def=null){ const i=args.indexOf(`--${name}`); if(i<0 || i+1 >= args.length) return def; return args[i+1]; }
function getArgs(name){
  const out = [];
  for(let i=0; i<args.length; i++){ if(args[i] === `--${name}`) { if (i+1 < args.length) { out.push(args[i+1]); i++; } } }
  return out;
}
const inPath = getArg("in");
const outPath = getArg("out");
const wantRaw = getFlag("raw");
const wantJws = getFlag("jws");
const setJurisdictionHash = getFlag("set-hash");
const policyThreshold = parseInt(getArg("threshold", "1"), 10);
const keyArgs = getArgs("key");
const policyKeysArgs = getArgs("policy-key");
if (!inPath || !outPath || keyArgs.length === 0 || (!wantRaw && !wantJws)){
  console.error([
    "Usage: valor-signer --in <in.json> --out <out.json> --key <key1> [--key <key2>...]",
    "Required flags:",
    "  --in <path>     Path to unsigned JSON file",
    "  --out <path>    Path to write signed JSON file to",
    "  --key <spec>    Key material (file, JWK string, raw hex/b64u). Can be repeated.",
    "Signing schemes (at least one required):",
    "  --raw           Include raw Ed25519 signatures",
    "  --jws           Include JWS (JOSE compact) signatures",
    "Optional flags:",
    "  --threshold <N>   Multisig threshold (default: 1)",
    "  --policy-key <pk> Public key for policy (file, JWK string, raw hex/b64u). Can be repeated.",
    "  --set-hash        Set 'jurisdiction_hash' to the canonical payload hash before signing"
  ].join("\n"));
  process.exit(2);
}

// ---- process ----
let record;
try { record = JSON.parse(fs.readFileSync(inPath, "utf8")); } catch (e) { console.error("Failed to read --in:", e.message); process.exit(2); }
function baseForSigning(obj){ const base = deepClone(obj); delete base.sig_ed25519; delete base.jws; delete base.signatures; return base;}
const base = baseForSigning(record);
const canonicalStr = canonical(base);
const digestHex = sha256HexString(canonicalStr);
if (setJurisdictionHash) { record.jurisdiction_hash = `SHA256::${digestHex}`; }
const privs = keyArgs.map(loadKeyMaterial);
const pubJwks = privs.map(kp => toJwkFromPublic(kp.publicKey));

const signatures = [];

if (wantRaw){
  for (const kp of privs){
    const msg = enc.encode(canonicalStr);
    const sig = nacl.sign.detached(msg, kp.secretKey);
    const pubB64u = b64u.enc(kp.publicKey);
    signatures.push({
      scheme: "raw",
      pubkey_ed25519: pubB64u,
      sig_ed25519: b64u.enc(sig)
    });
  }
}
if (wantJws){
  for (const jwk of pubJwks){
    const header = { alg:"EdDSA", jwk };
    const prot = b64u.enc(enc.encode(JSON.stringify(header)));
    const payload = b64u.enc(enc.encode(canonicalStr));
    const toSign = enc.encode(`${prot}.${payload}`);
    const idx = pubJwks.findIndex(j => j.x === jwk.x);
    const kp = privs[idx];
    const sig = nacl.sign.detached(toSign, kp.secretKey);
    const sigB64u = b64u.enc(sig);
    const compact = `${prot}.${payload}.${sigB64u}`;
    signatures.push({ scheme: "jws", jws: compact });
  }
}
let policyKeys = policyKeysArgs.length
  ? policyKeysArgs
  : pubJwks.map(j => j);
policyKeys = policyKeys.map(k => {
  if (typeof k === "string" && k.trim().startsWith("{")) { try { const jwk = JSON.parse(k); if (isLikelyJwk(jwk)) return jwk; } catch {} }
  if (typeof k === "string") { const u8 = asU8(k); return toJwkFromPublic(u8); }
  if (isLikelyJwk(k)) return k;
  throw new Error("Unsupported --policy-key format");
});
const signing_policy = {
  type: "threshold",
  threshold: Math.max(1, policyThreshold),
  keys: policyKeys
};

const out = deepClone(record);
out.signatures = signatures;
out.signing_policy = signing_policy;
const outText = JSON.stringify(out, null, 2);
fs.writeFileSync(outPath, outText, "utf8");
const sidecarPath = outPath + ".sha256";
fs.writeFileSync(sidecarPath, `SHA256  ${digestHex}\n`, "utf8");

console.log("Wrote:", path.resolve(outPath));
console.log("Hash:", `SHA256::${digestHex}`);
console.log("Sidecar:", path.resolve(sidecarPath));
