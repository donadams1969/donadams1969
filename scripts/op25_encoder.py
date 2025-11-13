#!/usr/bin/env python3
import hashlib, json, binascii, sys

data = open(sys.argv[1]).read().encode()
tag = b"OP25_RETURN::"

payload = tag + data
hexout = binascii.hexlify(payload).decode()

print(json.dumps({
    "op25_hex": hexout,
    "len": len(hexout) // 2
}, indent=2))
