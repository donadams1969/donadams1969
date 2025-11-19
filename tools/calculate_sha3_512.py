#!/usr/bin/env python3
import sys
import hashlib

def main():
    if len(sys.argv) != 2:
        print("Usage: python calculate_sha3_512.py <file>")
        sys.exit(1)

    filepath = sys.argv[1]
    with open(filepath, 'rb') as f:
        data = f.read()
        sha3_512_hash = hashlib.sha3_512(data).hexdigest()
        print(sha3_512_hash)

if __name__ == "__main__":
    main()
