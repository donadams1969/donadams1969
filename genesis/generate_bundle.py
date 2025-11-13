import json, time, hashlib, base64

def sha3(x): return hashlib.sha3_512(x).hexdigest()

ts = int(time.time())
root = sha3(f"valoraiplus-genesis-{ts}".encode())
bundle = {
    "genesis_timestamp": ts,
    "genesis_merkle_root": root,
    "valoraiplus_version": "GENESIS-1.0",
    "components": [
        "Liveness Sentinel",
        "Saint-Paul Node",
        "VALORCHAIN-G Broadcast Harness",
        "OP25_RETURN Encoder",
        "Hybrid Ed25519+PQ Signatures"
    ]
}

open("VALORAIPLUS-GENESIS.json","w").write(json.dumps(bundle, indent=2))
print("Genesis bundle written → VALORAIPLUS-GENESIS.json")
