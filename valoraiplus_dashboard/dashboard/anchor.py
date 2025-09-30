import json
from pathlib import Path
import hashlib
import datetime

def anchor_manifest():
    """
    Creates a Merkle snapshot of the manifest file to ensure its integrity.
    It reads the manifest, calculates a "Merkle root" (by hashing all
    records together), and saves it to a snapshot file.
    """
    print("[Anchor] Anchoring manifest with Merkle snapshot...")

    manifest_path = Path("./data/honeypot/manifest.json")
    snapshot_path = Path("./data/honeypot/merkle_snapshot.txt")

    if not manifest_path.exists():
        print(f"[Anchor] Manifest file not found at {manifest_path}. Cannot create anchor.")
        return

    with open(manifest_path, "r") as f:
        records = json.load(f)

    if not records:
        print("[Anchor] Manifest is empty. Nothing to anchor.")
        return

    # Simulate creating a Merkle root by hashing all records together
    # In a real implementation, this would be a proper Merkle tree construction.
    combined_hashes = "".join([hashlib.sha256(json.dumps(rec).encode()).hexdigest() for rec in records])
    merkle_root = hashlib.sha256(combined_hashes.encode()).hexdigest()

    snapshot_content = (
        f"Merkle Snapshot Anchor\n"
        f"Timestamp: {datetime.datetime.utcnow().isoformat()}Z\n"
        f"Manifest File: {manifest_path}\n"
        f"Merkle Root: {merkle_root}\n"
    )

    with open(snapshot_path, "w") as f:
        f.write(snapshot_content)

    print(f"[Anchor] Merkle snapshot created successfully at {snapshot_path}")