# smoke_test.py - Smoke Test and Attestation for Directive A
import os
import json
import hashlib
from datetime import datetime

def load_env(file_path=".env.testnet"):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Environment file not found: {file_path}")

    env_vars = {}
    with open(file_path) as f:
        for line in f:
            if '=' in line:
                key, value = line.strip().split('=', 1)
                env_vars[key] = value
    return env_vars

def run_smoke_test(env):
    print("Directive A: Running Smoke Test...")

    # Check 1: Build artifacts exist
    dist_dir = "dist"
    index_file = os.path.join(dist_dir, "index.html")
    api_status_file = os.path.join(dist_dir, "api_status.json")

    if not os.path.exists(index_file) or not os.path.exists(api_status_file):
        raise FileNotFoundError("Build artifacts not found in 'dist' directory.")

    print("  - [PASS] Build artifacts found.")

    # Check 2: API status is correct
    with open(api_status_file, 'r') as f:
        api_status = json.load(f)

    if api_status.get("module_id") != env.get("MODULE_ID"):
        raise ValueError("API status module ID does not match environment.")

    print("  - [PASS] API status is correct.")

    print("Smoke test completed successfully.")
    return True

def generate_attestation(env):
    print("Directive A: Generating Attestation...")

    file_to_hash = "dist/index.html"
    with open(file_to_hash, 'rb') as f:
        file_sha = hashlib.sha256(f.read()).hexdigest()

    attestation = {
        "timestamp": datetime.utcnow().isoformat(),
        "status": "ATTESTED_SUCCESS",
        "anchor_chain": env.get("ANCHOR_CHAIN"),
        "asset": env.get("ASSET"),
        "module_id": env.get("MODULE_ID"),
        "gillson_invariant_hex": env.get("GILLSON_INVARIANT_HEX"),
        "file_sha": file_sha,
        "provenance": {
            "ci_cd_platform": env.get("CI_CD_PLATFORM"),
            "build_script": "build.sh"
        }
    }

    # Sign the attestation (simulation)
    # In a real system, this would use a private key.
    attestation_json = json.dumps(attestation, sort_keys=True)
    signature = hashlib.sha256(attestation_json.encode()).hexdigest()

    signed_attestation = {
        "attestation": attestation,
        "commander_signature": signature
    }

    output_file = "attestation.json"
    with open(output_file, 'w') as f:
        json.dump(signed_attestation, f, indent=4)

    print(f"Attestation artifact generated: {output_file}")
    return output_file

if __name__ == "__main__":
    try:
        env_vars = load_env()
        if run_smoke_test(env_vars):
            generate_attestation(env_vars)
    except (FileNotFoundError, ValueError) as e:
        print(f"  - [FAIL] {e}")
        exit(1)
