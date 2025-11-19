#!/usr/bin/env python3
import json
import time
import hashlib
import os
import pathlib

def sha256(b):
    return hashlib.sha256(b).hexdigest()

def main():
    # Read the manifest hash
    with open("downloads/OP25_RETURN_HEX_GENESIS_V3.8_FULL.sha3_512") as f:
        manifest_hash = f.read().strip()

    # Create the receipt
    receipt = {
        "iso_time": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "workflow": "embed-manifest",
        "run_id": "12345",
        "run_number": 1,
        "commit_sha": "unknown",
        "actor": "jules",
        "repo": "valoraiplus",
        "run_nonce": "0",
        "prev_chain_root": "",
        "merkle_root": "",
        "manifest_sha3_512": manifest_hash,
    }

    # Calculate the Merkle root
    core = {
        k: receipt[k]
        for k in [
            "iso_time",
            "workflow",
            "run_id",
            "run_number",
            "commit_sha",
            "actor",
            "repo",
            "run_nonce",
            "prev_chain_root",
        ]
    }
    cj = json.dumps(core, separators=(",", ":"), sort_keys=True).encode()
    receipt["merkle_root"] = sha256(cj)

    # Read the current chain state
    chain_state_path = "receipts/CHAIN.state"
    p = pathlib.Path(chain_state_path)
    if p.exists():
        with open(p) as f:
            j = json.loads(f.read())
            receipt["run_number"] = j["run_number"] + 1
            receipt["prev_chain_root"] = j["merkle_root"]

    # Write the new receipt
    receipt_path = f"receipts/run-{receipt['run_number']}.json"
    with open(receipt_path, "w") as f:
        f.write(json.dumps(receipt, separators=(",", ":"), sort_keys=True))

    # Update the chain state
    with open(chain_state_path, "w") as f:
        f.write(
            json.dumps(
                {"run_number": receipt["run_number"], "merkle_root": receipt["merkle_root"]},
                separators=(",", ":"),
                sort_keys=True,
            )
        )

    print(f"Manifest embedded in receipt: {receipt_path}")

if __name__ == "__main__":
    main()
