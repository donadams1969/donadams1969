#!/usr/bin/env python3
import sys, json, time, hashlib, base64, pathlib, os
from nacl.signing import VerifyKey
from nacl.exceptions import BadSignatureError

ALLOWED_SKEW_S = 15*60  # 15 min
REQUIRED_FIELDS = ["iso_time","workflow","run_id","run_number","commit_sha","actor","repo","run_nonce","prev_chain_root","merkle_root"]

def sha256(b): return hashlib.sha256(b).hexdigest()

def verify_signature(pub_path, file_path, sig_path):
    vk = VerifyKey(open(pub_path,"rb").read())
    sigdoc = json.loads(open(sig_path).read())
    data = open(file_path,"rb").read()
    try: vk.verify(data, base64.b64decode(sigdoc["signature_b64"]))
    except BadSignatureError: sys.exit("BAD SIGNATURE")
    if sha256(data) != sigdoc["sha256"]: sys.exit("SHA256 mismatch")

def verify_schema_and_merkle(doc):
    for k in REQUIRED_FIELDS:
        if k not in doc: sys.exit(f"Missing field: {k}")
    # Freshness
    t = time.strptime(doc["iso_time"], "%Y-%m-%dT%H:%M:%SZ")
    if abs(time.time() - time.mktime(t)) > ALLOWED_SKEW_S:
        sys.exit("Timestamp too old/new")
    # Merkle over canonical core (deterministic)
    core = {k: doc[k] for k in ["iso_time","workflow","run_id","run_number","commit_sha","actor","repo","run_nonce","prev_chain_root"]}
    cj = json.dumps(core, separators=(",",":"), sort_keys=True).encode()
    root = sha256(cj)
    if root != doc["merkle_root"]:
        sys.exit("Merkle root mismatch")

def update_chain_state(doc, chain_state="receipts/CHAIN.state"):
    # Ensure monotonic run_number and consistent linkage
    last_n, last_root = 0, ""
    p = pathlib.Path(chain_state)
    if p.exists():
        with open(p) as f:
            j = json.loads(f.read())
            last_n, last_root = j["run_number"], j["merkle_root"]
    if doc["run_number"] <= last_n:
        sys.exit("Run number not monotonic")
    if doc["prev_chain_root"] != last_root:
        sys.exit("Chain link mismatch")
    with open(chain_state,"w") as f:
        f.write(json.dumps({"run_number": doc["run_number"], "merkle_root": doc["merkle_root"]}, separators=(",",":"), sort_keys=True))

if __name__ == "__main__":
    pub, js, sig = sys.argv[1], sys.argv[2], sys.argv[3]
    verify_signature(pub, js, sig)
    doc = json.loads(open(js).read())
    verify_schema_and_merkle(doc)
    update_chain_state(doc)
    print("RECEIPT OK")
