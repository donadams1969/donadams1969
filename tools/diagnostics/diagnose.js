import { checkFileExists, verifyFileReadable, getCanonicalPath } from './fileCheck.js';
import { checkSidecarHash, checkSignedJson } from './signatureCheck.js';
import { checkAllKeys } from './keyCheck.js';
import { verifyJurisdictionHash } from './hashCheck.js';
import { checkRepoPermissions } from './envCheck.js';

export function diagnose(payloadPath, signedPath, keys, repoDir) {
  // 1. File checks
  if (!checkFileExists(payloadPath)) return `File not found: ${payloadPath}`;
  if (!verifyFileReadable(payloadPath)) return `File not readable: ${payloadPath}`;

  // 2. Output/signed file checks
  if (!checkSignedJson(signedPath)) return `Signed JSON invalid or missing: ${signedPath}`;
  if (!checkSidecarHash(signedPath)) return `Sidecar hash missing or invalid for: ${signedPath}`;

  // 3. Keys
  if (!checkAllKeys(keys)) return `One or more key files invalid or unreadable.`;

  // 4. Hash canonicalization
  if (!verifyJurisdictionHash(signedPath)) return `SHA256 hash mismatch or jurisdiction_hash incorrect in signed JSON.`;

  // 5. Permissions
  if (!checkRepoPermissions(repoDir)) return `Insufficient permissions on repo directory: ${repoDir}`;

  return `All checks passed. System ready.`;
}
