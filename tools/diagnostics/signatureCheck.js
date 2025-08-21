import fs from 'fs';

export function checkSidecarHash(outPath) {
  const sidecarPath = outPath + '.sha256';
  if (!fs.existsSync(sidecarPath)) return false;
  const hashContent = fs.readFileSync(sidecarPath, 'utf-8').trim();
  return /^SHA256\s{2}[0-9a-f]+$/.test(hashContent);
}

export function checkSignedJson(outPath) {
  if (!fs.existsSync(outPath)) return false;
  const out = JSON.parse(fs.readFileSync(outPath, "utf8"));
  return Array.isArray(out.signatures) && !!out.signing_policy;
}
