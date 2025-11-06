#!/usr/bin/env python3
import sys
import json
import time
import hashlib
import base64
import pathlib
import calendar
from typing import Any, Dict
from nacl.signing import VerifyKey
from nacl.exceptions import BadSignatureError

ALLOWED_SKEW_S = 15 * 60  # 15 min
REQUIRED_FIELDS = [
    "iso_time",
    "workflow",
    "run_id",
    "run_number",
    "commit_sha",
    "actor",
    "repo",
    "run_nonce",
    "prev_chain_root",
    "chain_height",
    "merkle_root",
    "payload_sha256",
]


def sha256(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()


def load_json(path: pathlib.Path) -> Dict[str, Any]:
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def verify_signature(pub_path: str, file_path: str, sig_path: str) -> None:
    with open(pub_path, "rb") as fh:
        vk = VerifyKey(fh.read())
    sigdoc = load_json(pathlib.Path(sig_path))
    with open(file_path, "rb") as fh:
        data = fh.read()
    try:
        vk.verify(data, base64.b64decode(sigdoc["signature_b64"]))
    except BadSignatureError:
        sys.exit("BAD SIGNATURE")
    if sha256(data) != sigdoc["sha256"]:
        sys.exit("SHA256 mismatch")


def ensure_string(doc: Dict[str, Any], key: str) -> None:
    if not isinstance(doc[key], str) or not doc[key]:
        sys.exit(f"{key} must be a non-empty string")


def verify_schema_and_merkle(doc: Dict[str, Any]) -> None:
    for k in REQUIRED_FIELDS:
        if k not in doc:
            sys.exit(f"Missing field: {k}")
    # Freshness
    t = time.strptime(doc["iso_time"], "%Y-%m-%dT%H:%M:%SZ")
    if abs(time.time() - calendar.timegm(t)) > ALLOWED_SKEW_S:
        sys.exit("Timestamp too old/new")
    if not isinstance(doc["run_number"], int):
        sys.exit("run_number must be an integer")
    if not isinstance(doc["chain_height"], int):
        sys.exit("chain_height must be an integer")
    ensure_string(doc, "workflow")
    ensure_string(doc, "run_id")
    ensure_string(doc, "commit_sha")
    ensure_string(doc, "actor")
    ensure_string(doc, "repo")
    ensure_string(doc, "run_nonce")
    # Merkle over canonical core (deterministic)
    core_keys = [
        "iso_time",
        "workflow",
        "run_id",
        "run_number",
        "commit_sha",
        "actor",
        "repo",
        "run_nonce",
        "prev_chain_root",
        "chain_height",
    ]
    core = {k: doc[k] for k in core_keys}
    cj = json.dumps(core, separators=(",", ":"), sort_keys=True).encode()
    root = sha256(cj)
    if root != doc["merkle_root"]:
        sys.exit("Merkle root mismatch")
    payload_body = dict(core)
    payload_body["merkle_root"] = doc["merkle_root"]
    body_json = json.dumps(payload_body, separators=(",", ":"), sort_keys=True).encode()
    if sha256(body_json) != doc["payload_sha256"]:
        sys.exit("payload_sha256 mismatch")


def update_chain_state(doc: Dict[str, Any], chain_state: str = "receipts/CHAIN.state") -> None:
    # Ensure monotonic run_number and consistent linkage
    p = pathlib.Path(chain_state)
    state = {"run_number": 0, "merkle_root": "", "chain_height": 0, "payload_sha256": ""}
    if p.exists():
        state.update(load_json(p))
    last_n = int(state.get("run_number", 0))
    last_root = state.get("merkle_root", "")
    last_height = int(state.get("chain_height", 0))
    if doc["run_number"] <= last_n:
        sys.exit("Run number not monotonic")
    expected_height = last_height + 1
    if doc["chain_height"] != expected_height:
        sys.exit(f"Chain height mismatch (expected {expected_height})")
    if doc["prev_chain_root"] != last_root:
        sys.exit("Chain link mismatch")
    next_state = {
        "run_number": doc["run_number"],
        "merkle_root": doc["merkle_root"],
        "chain_height": doc["chain_height"],
        "payload_sha256": doc["payload_sha256"],
    }
    with p.open("w", encoding="utf-8") as f:
        json.dump(next_state, f, separators=(",", ":"), sort_keys=True)


if __name__ == "__main__":
    if len(sys.argv) != 4:
        sys.exit("Usage: verify_receipt.py <pub> <receipt.json> <receipt.sig>")
    pub, js, sig = sys.argv[1], sys.argv[2], sys.argv[3]
    verify_signature(pub, js, sig)
    doc = load_json(pathlib.Path(js))
    verify_schema_and_merkle(doc)
    update_chain_state(doc)
    print("RECEIPT OK")
