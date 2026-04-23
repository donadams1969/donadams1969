export async function doubleSha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const firstHashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  const secondBuffer = encoder.encode(firstHashHex); // Or hash the raw bytes depending on requirement
  // To keep it simple and match standard double-sha256 which typically hashes the raw bytes again:
  const hashBuffer2 = await crypto.subtle.digest('SHA-256', hashBuffer);
  const hashArray2 = Array.from(new Uint8Array(hashBuffer2));
  const secondHashHex = hashArray2.map(b => b.toString(16).padStart(2, '0')).join('');

  return secondHashHex;
}

export function executeClawback() {
  console.log("Clawback execution started.");
}