import crypto from "crypto";
export function buildMerkle(leaves: string[]): string[] {
if (leaves.length === 1) return leaves;
const next: string[] = [];
for (let i = 0; i < leaves.length; i += 2) {
const L = leaves[i];
const R = leaves[i + 1] || L;
next.push(crypto.createHash("sha3-512").update(Buffer.from(L + R, "hex")).digest("hex"));
}
return buildMerkle(next);
}
