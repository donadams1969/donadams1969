#!/usr/bin/env python3
"""
SGAU ValueGuard Attestation Tool
- Load JSON audit
- Canonicalize JSON deterministically
- keccak256 hash
- Build calldata for recordAttestation(bytes32,string,string)
- Save attestation_packet.json

Requirements:
pip install eth-utils eth-abi
"""

import argparse
import json
import sys
from pathlib import Path

from eth_utils import keccak, to_hex
from eth_abi import encode

RECORD_ATTESTATION_SIG = "recordAttestation(bytes32,string,string)"


def canonical_json_bytes(obj) -> bytes:
    s = json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return s.encode("utf-8")


def function_selector(signature: str) -> bytes:
    return keccak(text=signature)[:4]


def encode_record_attestation_calldata(audit_hash32: bytes, audit_uri: str, memo: str) -> bytes:
    selector = function_selector(RECORD_ATTESTATION_SIG)
    args_encoded = encode(
        ["bytes32", "string", "string"],
        [audit_hash32, audit_uri, memo]
    )
    return selector + args_encoded


def short_hex(h: str, head=6, tail=4) -> str:
    if not h.startswith("0x") or len(h) < (2 + head + tail):
        return h
    return h[:2 + head] + "…" + h[-tail:]


def main():
    p = argparse.ArgumentParser(description="SGAU ValueGuard Attestation Generator")
    p.add_argument("--audit", required=True, help="Path to audit JSON")
    p.add_argument("--contract", required=False, default="", help="Contract address (optional)")
    p.add_argument("--chain", required=False, default="sepolia", help="Chain label")
    p.add_argument("--uri", required=False, default="", help="Optional audit URI")
    p.add_argument("--memo", required=False, default="Treasury audit attestation", help="Memo")
    p.add_argument("--out", required=False, default="attestation_packet.json", help="Output file")
    args = p.parse_args()

    audit_path = Path(args.audit)
    if not audit_path.exists():
        print(f"ERROR: audit file not found: {audit_path}", file=sys.stderr)
        sys.exit(1)

    with audit_path.open("r", encoding="utf-8") as f:
        audit_obj = json.load(f)

    canon_bytes = canonical_json_bytes(audit_obj)
    audit_hash = keccak(canon_bytes)

    calldata = encode_record_attestation_calldata(audit_hash, args.uri, args.memo)

    packet = {
        "tool": "sgau_valueguard_attest.py",
        "chain": args.chain,
        "contract_address": args.contract,
        "function": RECORD_ATTESTATION_SIG,
        "audit_file": str(audit_path),
        "canonical_json_keccak256": to_hex(audit_hash),
        "calldata": to_hex(calldata),
        "uri": args.uri,
        "memo": args.memo,
        "notes": [
            "Hash is keccak256(canonical_json_bytes).",
            "Canonical JSON uses sorted keys and compact separators.",
            "Calldata is selector + abi.encode(bytes32,string,string)."
        ],
    }

    out_path = Path(args.out)
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(packet, f, indent=2)

    print("OK")
    print("Audit Hash:", packet["canonical_json_keccak256"])
    print("Audit Hash (short):", short_hex(packet["canonical_json_keccak256"], 10, 6))
    print("Calldata (short):", short_hex(packet["calldata"], 12, 8))
    print("Saved:", str(out_path))


if __name__ == "__main__":
    main()
