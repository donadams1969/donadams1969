#!/usr/bin/env python3
"""
Valor AI+® — Manifest Verifier
Checks SHA-256 hashes of all files in the current directory (or the path you pass)
against MANIFEST_SHA256.txt.
Usage:
  python3 verify_manifest.py            # verify current directory
  python3 verify_manifest.py /path/to/bundle
Exit codes: 0 = OK, 1 = mismatch or missing files, 2 = manifest missing.
"""
import sys, hashlib
from pathlib import Path

def sha256(p: Path) -> str:
    h = hashlib.sha256()
    with p.open('rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            h.update(chunk)
    return h.hexdigest()

def main():
    base = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".")
    manifest = base / "MANIFEST_SHA256.txt"
    if not manifest.exists():
        print("ERROR: MANIFEST_SHA256.txt not found.", file=sys.stderr)
        sys.exit(2)

    # Read manifest
    entries = []
    with manifest.open("r", encoding="utf-8") as mf:
        for line in mf:
            line = line.strip()
            if not line:
                continue
            parts = line.split()
            if len(parts) < 2:
                continue
            hash_hex, fname = parts[0], parts[-1]
            entries.append((hash_hex, fname))

    ok_all = True
    for expected_hash, fname in entries:
        fp = base / fname
        if not fp.exists():
            print(f"[MISSING] {fname}")
            ok_all = False
            continue
        actual = sha256(fp)
        if actual.lower() == expected_hash.lower():
            print(f"[OK] {fname}")
        else:
            print(f"[MISMATCH] {fname}")
            print(f"  expected: {expected_hash}")
            print(f"  actual:   {actual}")
            ok_all = False

    if ok_all:
        print("All files match manifest. ✅")
        sys.exit(0)
    else:
        print("One or more files failed verification. ❌")
        sys.exit(1)

if __name__ == "__main__":
    main()
