import json

print("Generating symbolic OP_RETURN and OP25 payloads...")

payloads = {
    "op_return_hex": "6a4c50" + "0" * 154,
    "op25_hex": "6a19" + "0" * 42,
    "op_return_bin": "op_return.bin",
    "op25_bin": "op25.bin",
    "op_return_asm": "OP_RETURN PUSHDATA(80) ...",
    "op25_asm": "OP_RETURN PUSHDATA(25) ...",
    "op_return_b43": "op_return.b43",
    "op25_b43": "op25.b43",
}

with open("op_return.bin", "wb") as f:
    f.write(b"")
with open("op25.bin", "wb") as f:
    f.write(b"")
with open("op_return.b43", "w") as f:
    f.write("")
with open("op25.b43", "w") as f:
    f.write("")

with open("payloads.json", "w") as f:
    json.dump(payloads, f, indent=2)

print("Symbolic payloads generated.")
