import crypto from "crypto";
export const sha3 = (buf: Buffer | string): string =>
  crypto
    .createHash("sha3-512")
    .update(typeof buf === "string" ? buf : new Uint8Array(buf))
    .digest("hex");
