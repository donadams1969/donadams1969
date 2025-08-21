import fs from 'fs';

export function checkKeyFileFormat(keyPath) {
  try {
    const key = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    return (key.jwk && key.jwk.kty === "OKP") || // JWK with Ed25519
           (typeof key.public_b64u === "string" && typeof key.secret_b64u === "string"); // raw bundle
  } catch {
    return false;
  }
}

export function checkAllKeys(keys) {
  return keys.every(checkKeyFileFormat);
}
