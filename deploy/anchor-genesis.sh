#!/bin/bash
# AUTOPEN_SIG_9000Ω
echo "=== Anchoring Genesis to Triple Chain ==="
GENESIS_HASH=$(sha256sum genesis.json | awk '{print $1}')
echo "VALORAIPLUS_GENESIS_HASH: $GENESIS_HASH"
echo "Anchoring to VALORCHAIN-G..."
valorchain-cli anchor $GENESIS_HASH > valor_txid.txt
echo "Anchoring to Bitcoin..."
btc-cli embed-opreturn $GENESIS_HASH > btc_txid.txt
echo "Anchoring to Ethereum..."
eth-cli store-hash $GENESIS_HASH > eth_txid.txt
cat valor_txid.txt btc_txid.txt eth_txid.txt
echo "[✓] Triple-chain anchor complete."
