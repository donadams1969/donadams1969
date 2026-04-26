import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { SOVEREIGN_IDENTITY } from "@/lib/sovereign-identity";
import { SYSTEM_CORE } from "@/lib/sovereign-kernel";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "hhs_intake";
  const data = {
    identity: SOVEREIGN_IDENTITY.name,
    accommodation: SOVEREIGN_IDENTITY.accommodation,
    artifacts: SOVEREIGN_IDENTITY.artifacts,
    btc_anchor: SOVEREIGN_IDENTITY.bitcoinAnchor,
    sync_hash: SYSTEM_CORE.laminar_sync_id,
    timestamp: new Date().toISOString()
  };
  const hash = crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
  return NextResponse.json({ ...data, hash }, {
    headers: { "X-Content-Hash": hash, "X-Sovereign-Identity": "Donny Gillson" }
  });
}