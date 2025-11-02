# dual_anchor.py - GI-5152 Dual-Anchor Protocol Simulation
import json
import hashlib
from datetime import datetime
import random

def load_attestation(file_path="attestation.json"):
    with open(file_path, 'r') as f:
        return json.load(f)

def simulate_op_return_broadcast(payload, anchor_type="OP_RETURN"):
    print(f"  - Broadcasting {anchor_type} with payload: {payload[:30]}...")

    # Simulate a chance of failure for the primary anchor
    if anchor_type == "OP_RETURN" and random.random() < 0.1: # 10% chance of failure
        print("    - [FAIL] Primary OP_RETURN broadcast failed. Simulating network congestion.")
        return None

    txid = hashlib.sha256(payload.encode() + str(datetime.utcnow()).encode()).hexdigest()
    print(f"    - [SUCCESS] {anchor_type} broadcast successful. TXID: {txid[:16]}...")
    return txid

def run_dual_anchor(attestation_data):
    print("Directive A: Executing GI-5152 Dual-Anchor Protocol...")

    attestation_payload = json.dumps(attestation_data['attestation'], sort_keys=True)

    # Primary Anchor: OP_RETURN
    primary_txid = simulate_op_return_broadcast(attestation_payload, "OP_RETURN")

    # Secondary Anchor with Auto-Fallback
    if primary_txid:
        # If primary is successful, secondary is still broadcast for redundancy.
        secondary_payload = "backup_" + attestation_payload
        secondary_txid = simulate_op_return_broadcast(secondary_payload, "OP25_RETURN")
    else:
        # If primary failed, secondary becomes the primary record (auto-fallback).
        print("  - Auto-fallback engaged. Broadcasting on secondary channel as primary.")
        secondary_txid = simulate_op_return_broadcast(attestation_payload, "OP25_RETURN")

    receipt = {
        "timestamp": datetime.utcnow().isoformat(),
        "protocol": "GI-5152",
        "primary_anchor_txid": primary_txid,
        "secondary_anchor_txid": secondary_txid,
        "status": "DUAL_ANCHOR_SUCCESS" if primary_txid and secondary_txid else "FALLBACK_SUCCESS" if secondary_txid else "ANCHOR_FAILURE",
        "attestation_signature": attestation_data['commander_signature']
    }

    output_file = "dual_anchor_receipt.json"
    with open(output_file, 'w') as f:
        json.dump(receipt, f, indent=4)

    print(f"Dual-anchor receipt generated: {output_file}")
    return output_file

if __name__ == "__main__":
    try:
        attestation = load_attestation()
        run_dual_anchor(attestation)
    except FileNotFoundError:
        print("  - [FAIL] attestation.json not found. Run smoke_test.py first.")
        exit(1)
