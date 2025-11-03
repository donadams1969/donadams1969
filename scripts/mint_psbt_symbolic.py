import json

print("Generating symbolic PSBT skeleton...")

psbt = {
    "txid": "d9a101...",
    "vin": [],
    "vout": [],
}

with open("psbt.json", "w") as f:
    json.dump(psbt, f, indent=2)

print("Symbolic PSBT skeleton generated.")
