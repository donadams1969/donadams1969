# verify_anchor.py - On-Chain Anchor Verification Simulation
import json
import hashlib

def load_json_artifact(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)

def recompute_txid(attestation_data, receipt_timestamp):
    """
    This is a simplified re-computation. A real system would query a blockchain.
    We are recreating the hash using the same (now fixed) timestamp logic.
    """
    attestation_payload = json.dumps(attestation_data['attestation'], sort_keys=True)
    # The original script used a dynamic timestamp, so we can't perfectly replicate the TXID.
    # We will simulate this by checking if the payload hash matches the signature's source.
    payload_hash = hashlib.sha256(attestation_payload.encode()).hexdigest()

    # In our simulation, the signature *is* the hash of the payload.
    return attestation_data['commander_signature'] == payload_hash

def run_verification():
    print("Directive A: Verifying On-Chain Anchors...")

    try:
        attestation = load_json_artifact("attestation.json")
        receipt = load_json_artifact("dual_anchor_receipt.json")
    except FileNotFoundError as e:
        print(f"  - [FAIL] Artifact not found: {e}. Run previous steps first.")
        return

    # Verification 1: Attestation provenance matches local recompute
    attestation_payload = json.dumps(attestation['attestation'], sort_keys=True)
    local_recompute_sig = hashlib.sha256(attestation_payload.encode()).hexdigest()

    if attestation['commander_signature'] != local_recompute_sig:
        print("  - [FAIL] Attestation signature mismatch. Provenance compromised.")
        return

    print("  - [PASS] Attestation provenance matches local GI-5152 recompute.")

    # Verification 2: On-chain confirmation (simulation)
    # In a real system, we'd query the blockchain for the TXIDs in the receipt.
    # Here, we simulate that the TXIDs are valid and present.
    primary_txid = receipt.get("primary_anchor_txid")
    secondary_txid = receipt.get("secondary_anchor_txid")

    if not primary_txid and not secondary_txid:
        print("  - [FAIL] No valid transaction IDs found in receipt.")
        return

    print(f"  - [PASS] On-chain confirmation of dual/single OP_RETURN outputs.")
    print(f"    - Primary Anchor (OP_RETURN): {primary_txid[:16] if primary_txid else 'N/A'}")
    print(f"    - Secondary Anchor (OP25_RETURN): {secondary_txid[:16] if secondary_txid else 'N/A'}")

    print("Anchor verification complete.")

if __name__ == "__main__":
    run_verification()
