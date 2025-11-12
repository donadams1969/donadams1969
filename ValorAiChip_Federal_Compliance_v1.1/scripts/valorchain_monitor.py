#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VALORAIPLUS TRIDENT v0 MONITOR
24/7 Dual-Ledger Integrity Sentinel
Checks VALORCHAIN-G ↔ VALORCHAIN parity and auto-re-anchors if drift detected.
"""

import asyncio, httpx, time, json, hashlib, base58, os
from nacl.signing import SigningKey
from nacl.encoding import RawEncoder

PRIMARY_NODE   = "https://saint-paul.valorchain-g.local/api/hash/"
SECONDARY_NODE = "https://valorchain.local/api/hash/"
ANCHOR_API     = "https://saint-paul.valorchain-g.local/api/attest"

CHECK_INTERVAL = int(os.getenv("VALORCHAIN_MONITOR_INTERVAL", 600))  # seconds
LOCKED_PRIV    = os.getenv("VALORAIPLUS_LOCKED_PRIV", "locked_v2_ed25519_priv.pem")

async def get_hash(url, root):
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            r = await client.get(url + root)
            return r.status_code, r.text.strip()
    except Exception as e:
        return 0, str(e)

def sign_reanchor(priv_path, digest_hex):
    sk = SigningKey(open(priv_path, "rb").read())
    sig = sk.sign(digest_hex.encode(), encoder=RawEncoder).signature
    return base58.b58encode(sig).decode()

async def reanchor(root_hash):
    sig = sign_reanchor(LOCKED_PRIV, root_hash)
    att = {
        "reanchor_root": root_hash,
        "signature": sig,
        "timestamp_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "ledger_ref": "VALORCHAIN-G-GENESIS",
        "policy": "auto-reanchor"
    }
    async with httpx.AsyncClient(timeout=10.0) as client:
        r = await client.post(ANCHOR_API, json=att)
        print(f"🔁 Reanchor attempt -> {r.status_code}")

async def monitor(root_hash):
    while True:
        code1, h1 = await get_hash(PRIMARY_NODE, root_hash)
        code2, h2 = await get_hash(SECONDARY_NODE, root_hash)
        ts = time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())
        print(f"[{ts}] VALORCHAIN-G:{code1} VALORCHAIN:{code2}")
        if code1 == 200 and code2 == 200:
            if h1 == h2:
                print("✅ Ledgers in perfect parity.")
            else:
                print("⚠️  Hash drift detected; initiating auto-re-anchor.")
                await reanchor(root_hash)
        else:
            print("⚠️  One or both ledgers unreachable.")
        await asyncio.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    root = os.getenv("VALORCHAIN_ROOT_HASH")
    if not root:
        try:
            root = open("VALORAIPLUS_TRIDENT_v0_DUAL_PROOF.sha3").read().strip()
        except FileNotFoundError:
            print("Root hash not found; set VALORCHAIN_ROOT_HASH.")
            exit(1)
    print(f"🛰️  Monitoring started for root {root}")
    asyncio.run(monitor(root))
