#!/bin/bash
# VALORAIPLUS_AUTO_SYNC.sh - Jules Ready
set -euo pipefail

echo "--- STARTING SGAU VALUEGUARD SYNC ---"

AUDIT_JSON="treasury_valuation_77_77x.json"
ATTEST_PY="sgau_valueguard_attest.py"
ATTEST_OUT="attestation_packet.json"

CHAIN="sepolia"
AUDIT_URI="ipfs://VALORAIPLUS_TREASURY_CID"
MEMO="VALORAIPLUS_FULL_VALUATION_ANCHOR_2026"

CONTRACT_ADDRESS="${CONTRACT_ADDRESS:-0xb103666AB91ceb4Cbb9e1FC21B81f1ec93601BeB}"

need_cmd () { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: missing dependency: $1"; exit 1; }; }
need_cmd python3
need_cmd forge
need_cmd jq

if [ ! -f "$AUDIT_JSON" ]; then
  echo "ERROR: audit JSON not found: $AUDIT_JSON"
  exit 1
fi

if [ ! -f "$ATTEST_PY" ]; then
  echo "ERROR: attestation tool not found: $ATTEST_PY"
  exit 1
fi

short_hex () {
  local x="$1"
  local head="${2:-10}"
  local tail="${3:-6}"
  if [ ${#x} -le $((2+head+tail)) ]; then
    echo "$x"
  else
    echo "${x:0:2+head}…${x: -tail}"
  fi
}

echo "[1/2] Generate canonical hash + attestation packet..."
python3 "$ATTEST_PY" \
  --audit "$AUDIT_JSON" \
  --chain "$CHAIN" \
  --contract "$CONTRACT_ADDRESS" \
  --uri "$AUDIT_URI" \
  --memo "$MEMO" \
  --out "$ATTEST_OUT"

AUDIT_HASH=$(jq -r '.canonical_json_keccak256' "$ATTEST_OUT")

if [ -z "$AUDIT_HASH" ] || [ "$AUDIT_HASH" = "null" ]; then
  echo "ERROR: could not read canonical_json_keccak256"
  exit 1
fi

echo "AUDIT_HASH(short): $(short_hex "$AUDIT_HASH" 10 6)"
echo "CONTRACT(short):   $(short_hex "$CONTRACT_ADDRESS" 8 6)"

if [ ! -f ".env" ]; then
  echo "ERROR: .env not found"
  exit 1
fi

# shellcheck disable=SC1091
source .env

: "${SEPOLIA_RPC_URL:?ERROR: SEPOLIA_RPC_URL not set}"
: "${PRIVATE_KEY:?ERROR: PRIVATE_KEY not set}"

export SGAU_CONTRACT_ADDRESS="$CONTRACT_ADDRESS"
export SGAU_AUDIT_HASH="$AUDIT_HASH"
export SGAU_AUDIT_URI="$AUDIT_URI"
export SGAU_MEMO="$MEMO"

echo "[2/2] Broadcast attestation to Sepolia..."
forge script script/Attest.s.sol:AttestScript \
  --rpc-url "$SEPOLIA_RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  --broadcast \
  -vvvv

echo "--- COMPLETE ---"
echo "AUDIT_HASH(full): $AUDIT_HASH"
