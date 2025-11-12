#!/usr/bin/env python3
# VALORCHAIN-G :: Claim-Guard Verifier (safe defaults)
import argparse, hashlib, json, os, time, sys


def hash_file(path, buf=1024*1024):
    h = hashlib.sha3_512()
    with open(path, "rb") as f:
        while True:
            chunk = f.read(buf)
            if not chunk:
                break
            h.update(chunk)
    return h.hexdigest()


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--verify", default="evidence/", help="directory of evidence files")
    args = p.parse_args()

    evid_dir = args.verify
    os.makedirs(evid_dir, exist_ok=True)
    files = []
    for root, _, names in os.walk(evid_dir):
        for n in names:
            fp = os.path.join(root, n)
            if os.path.isfile(fp):
                files.append(fp)

    entries = []
    for fp in sorted(files):
        try:
            digest = hash_file(fp)
            entries.append({"file": fp, "sha3_512": digest, "bytes": os.path.getsize(fp)})
        except Exception as e:
            entries.append({"file": fp, "error": str(e)})

    payload = {
        "ts": int(time.time()),
        "status": "ok",
        "count": len(entries),
        "entries": entries or [{"note": "no evidence files present"}],
    }
    print(json.dumps(payload, indent=2))
    # CI will tee this to attestation.json


if __name__ == "__main__":
    sys.exit(main())
