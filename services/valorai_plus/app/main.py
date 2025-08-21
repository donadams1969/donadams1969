import os
import json
import requests
from nacl import signing, encoding

VALORAI_PLUS_CHAIN_RPC_URL = os.getenv("VALORAI_PLUS_CHAIN_RPC_URL")
VALORAI_PLUS_ANCHOR_KEY = os.getenv("VALORAI_PLUS_ANCHOR_KEY")

def submit_anchor_plus(payload: dict) -> str:
    """
    Submit an anchor transaction to Valor Ai+ Chain RPC.
    Returns TXID string. Falls back to mock mode if RPC URL or key missing.
    """
    if not VALORAI_PLUS_CHAIN_RPC_URL or not VALORAI_PLUS_ANCHOR_KEY:
        print("[valorai_plus] RPC env vars not set - returning mock TXID")
        return f"MOCK-{os.urandom(4).hex()}"

    # 1. Canonicalize payload
    canonical = json.dumps(payload, sort_keys=True, separators=(',', ':')).encode()

    # 2. Load signing key
    try:
        sk_bytes = encoding.Base64Encoder.decode(VALORAI_PLUS_ANCHOR_KEY.encode())
        sk = signing.SigningKey(sk_bytes)
    except Exception as e:
        raise RuntimeError(f"Invalid VALORAI_PLUS_ANCHOR_KEY: {e}")

    # 3. Sign
    sig = sk.sign(canonical).signature.hex()

    # 4. Build RPC request
    rpc_payload = {
        "method": "anchor_submit",
        "params": {
            "payload": payload,
            "signature": sig,
            "public_key": sk.verify_key.encode(encoder=encoding.Base64Encoder).decode()
        },
        "id": 1,
        "jsonrpc": "2.0"
    }

    # 5. Send
    try:
        resp = requests.post(VALORAI_PLUS_CHAIN_RPC_URL, json=rpc_payload, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        if "result" in data and "txid" in data["result"]:
            return data["result"]["txid"]
        raise RuntimeError(f"Unexpected RPC result: {data}")
    except Exception as e:
        raise RuntimeError(f"Failed to submit anchor: {e}")
