import crypto from 'crypto';

export function doubleSha256(data: string): string {
  const firstHash = crypto.createHash('sha256').update(data).digest();
  const secondHash = crypto.createHash('sha256').update(firstHash).digest('hex');
  return secondHash;
}

export function executeClawback() {
  console.log("Clawback execution started.");
}