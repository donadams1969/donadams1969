#!/usr/bin/env python3
# AUTOPEN_SIG_9000Ω
import json, hashlib, sys
from web3 import Web3

with open("genesis.json") as f:
    local = hashlib.sha3_512(f.read().encode()).hexdigest()

w3 = Web3(Web3.HTTPProvider("http://localhost:8545"))
onchain = w3.eth.contract(address="<contract>", abi=json.load(open("abi.json")))
remote = onchain.functions.getGenesisHash().call()

print("Local :", local)
print("Remote:", remote)
assert local == remote, "Mismatch between on-chain and local genesis hash"
print("[✓] Genesis verified successfully.")
