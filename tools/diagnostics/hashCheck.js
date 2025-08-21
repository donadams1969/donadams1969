import fs from 'fs';
import crypto from 'crypto';

export function canonicalize(obj) {
  function stable(obj) {
    if (Array.isArray(obj)) return obj.map(stable);
    if (obj && typeof obj === "object") {
      return Object.fromEntries(Object.keys(obj).sort().map(k => [k, stable(obj[k])]));
    }
    return obj;
  }
  return JSON.stringify(stable(obj));
}

export function computeSHA256(str) {
  return crypto.createHash("sha256").update(str).digest("hex");
}

export function verifyJurisdictionHash(signedPath) {
  const out = JSON.parse(fs.readFileSync(signedPath, "utf8"));
  const clone = { ...out };
  delete clone.signatures;
  delete clone.signing_policy;
  const canon = canonicalize(clone);
  const hash = computeSHA256(canon);
  return out.jurisdiction_hash === `SHA256::${hash}`;
}
