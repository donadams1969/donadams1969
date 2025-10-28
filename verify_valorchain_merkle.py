#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VALORCHAIN-G Merkle Proof Verifier
Created: 2025-10-27T16:11:10Z
"""

import hashlib
import json
from pathlib import Path

def verify_merkle_proof(target_hash, proof_siblings, root_hash):
    h = bytes.fromhex(target_hash)
    for s in proof_siblings:
        pair = bytes.fromhex(s)
        h = hashlib.sha3_512(h + pair).digest()
    return h.hex() == root_hash

if __name__ == "__main__":
    data = json.load(open("VALORCHAIN-G_MerkleProof.json"))
    ok = verify_merkle_proof(
        data["target_hash"],
        data["proof_siblings"],
        data["root_hash"]
    )
    print("Verification result:", ok)
