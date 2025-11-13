// app/api/audit/verify/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import nacl from "tweetnacl";

export const runtime = "nodejs";

type SigResult = {
  present: boolean;
  verified: boolean;
  reason: string;
};

type FileResult = {
  file: string;
  exists: boolean;
  valoraiplus2e: SigResult;
  valoraiplus3e: SigResult;
};

function stripSignatureBlocks(data: any): any {
  if (data === null || typeof data !== "object") return data;
  const copy: any = Array.isArray(data) ? [] : {};
  for (const key of Object.keys(data)) {
    if (key === "valoraiplus2e_signature" || key === "valoraiplus3e_pq_signature") {
      continue;
    }
    copy[key] = stripSignatureBlocks(data[key]);
  }
  return copy;
}

// Canonicalize like Python: sort_keys=True, separators=(",", ":")
function canonicalBytes(payload: any): Buffer {
  const stringify = (obj: any): string => {
    if (obj === null || typeof obj !== "object") {
      return JSON.stringify(obj);
    }
    if (Array.isArray(obj)) {
      return `[${obj.map((v) => stringify(v)).join(",")}]`;
    }
    const keys = Object.keys(obj).sort();
    const parts = keys.map((k) => `${JSON.stringify(k)}:${stringify(obj[k])}`);
    return `{${parts.join(",")}}`;
  };
  return Buffer.from(stringify(payload), "utf8");
}

function verifyEd25519(data: any): [boolean, string] {
  const sigBlock = data?.valoraiplus2e_signature;
  if (!sigBlock) {
    return [false, "valoraiplus2e_signature block not present"];
  }

  const pub_b64 = sigBlock.pubkey_b64;
  const sig_b64 = sigBlock.signature_b64;
  if (!pub_b64 || !sig_b64) {
    return [false, "missing pubkey_b64 or signature_b64 in valoraiplus2e_signature"];
  }

  let pubkey: Buffer;
  let signature: Buffer;
  try {
    pubkey = Buffer.from(pub_b64, "base64");
    signature = Buffer.from(sig_b64, "base64");
  } catch (e: any) {
    return [false, `base64 decode error: ${e?.message || String(e)}`];
  }

  if (pubkey.length !== nacl.sign.publicKeyLength) {
    return [false, "invalid Ed25519 public key length"];
  }

  const payload = stripSignatureBlocks(data);
  const msg = canonicalBytes(payload);

  try {
    const ok = nacl.sign.detached.verify(
        new Uint8Array(msg),
        new Uint8Array(signature),
        new Uint8Array(pubkey)
    );
    if (!ok) {
      return [false, "Ed25519 verification failed (bad signature)"];
    }
  } catch (e: any) {
    return [false, `Ed25519 verification error: ${e?.message || String(e)}`];
  }

  return [true, "Ed25519 signature verified"];
}

function recomputePqSim(payload: any): string {
  const raw = canonicalBytes(payload);
  const h = crypto.createHash("sha3-512");
  h.update("VALORAIPLUS3E_PQ_SIM");
  h.update(new Uint8Array(raw));
  return h.digest("hex");
}

function verifyPqSim(data: any): [boolean, string] {
  const sigBlock = data?.valoraiplus3e_pq_signature;
  if (!sigBlock) {
    return [false, "valoraiplus3e_pq_signature block not present"];
  }

  const stored = sigBlock.pq_sig_hex;
  if (!stored) {
    return [false, "pq_sig_hex missing in valoraiplus3e_pq_signature"];
  }

  const payload = stripSignatureBlocks(data);
  const recomputed = recomputePqSim(payload);

  if (recomputed !== stored) {
    return [false, "PQ-sim verification failed (hex digest mismatch)"];
  }

  return [true, "PQ-sim signature verified"];
}

function verifyFile(p: string): FileResult {
  const exists = fs.existsSync(p);
  if (!exists) {
    return {
      file: p,
      exists: false,
      valoraiplus2e: {
        present: false,
        verified: false,
        reason: "file not found",
      },
      valoraiplus3e: {
        present: false,
        verified: false,
        reason: "file not found",
      },
    };
  }

  let data: any;
  try {
    const raw = fs.readFileSync(p, "utf8");
    data = JSON.parse(raw);
  } catch (e: any) {
    const msg = `json parse error: ${e?.message || String(e)}`;
    return {
      file: p,
      exists: true,
      valoraiplus2e: { present: false, verified: false, reason: msg },
      valoraiplus3e: { present: false, verified: false, reason: msg },
    };
  }

  const edPresent = typeof data.valoraiplus2e_signature === "object";
  const pqPresent = typeof data.valoraiplus3e_pq_signature === "object";

  const [edOk, edReason] = edPresent
    ? verifyEd25519(data)
    : [false, "valoraiplus2e_signature block not present"];

  const [pqOk, pqReason] = pqPresent
    ? verifyPqSim(data)
    : [false, "valoraiplus3e_pq_signature block not present"];

  return {
    file: p,
    exists: true,
    valoraiplus2e: {
      present: edPresent,
      verified: edPresent ? edOk : false,
      reason: edReason,
    },
    valoraiplus3e: {
      present: pqPresent,
      verified: pqPresent ? pqOk : false,
      reason: pqReason,
    },
  };
}

function latestGenesis(): string | null {
  const root = path.join(process.cwd(), "vault", "genesis");
  if (!fs.existsSync(root)) return null;

  const files = fs
    .readdirSync(root)
    .filter((f) => f.startsWith("valoraiplus_genesis_commit_") && f.endsWith(".json"))
    .sort();

  if (!files.length) return null;
  return path.join(root, files[files.length - 1]);
}

export async function GET() {
  const outDir = path.join(process.cwd(), "audit", "outputs");

  const targets: string[] = [];

  const g = latestGenesis();
  if (g) targets.push(g);

  targets.push(path.join(outDir, "valoraiplus_merkle_root.json"));
  targets.push(path.join(outDir, "valoraiplus_attestation.json"));

  const results = targets.map((t) => verifyFile(t));

  const anyFailure = results.some((r) => {
    if (!r.exists) return false;
    const e = r.valoraiplus2e;
    const p = r.valoraiplus3e;
    return (e.present && !e.verified) || (p.present && !p.verified);
  });

  return NextResponse.json({
    ok: !anyFailure,
    results,
    valoraiplus2e_profile: "verification_snapshot",
    valoraiplus3e_placeholder: "attach_ci_run_id_here",
  });
}
