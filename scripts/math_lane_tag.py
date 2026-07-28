#!/usr/bin/env python3
import sys, json

def digital_root(n: int) -> int:
    return 1 + (n - 1) % 9 if n > 0 else 0

if len(sys.argv) != 2:
    print("Usage: math_lane_tag.py <integer>")
    sys.exit(1)

n = int(sys.argv[1])
print(json.dumps({
    "value": n,
    "digital_root": digital_root(n),
    "mod9": n % 9
}, indent=2))
