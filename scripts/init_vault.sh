#!/usr/bin/env bash
set -euo pipefail

VAULT_DIR="${1:-vault}"

mkdir -p "$VAULT_DIR"/{enc,store,tmp,logs}
LEDGER="$VAULT_DIR/ledger.log"

if [[ -f "$LEDGER" ]]; then
  echo "Ledger already exists at $LEDGER"
  exit 0
fi

ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
prev="GENESIS"
entry_hash="$(printf '%s' "$prev" | sha256sum | awk '{print $1}')"

printf '{"ts":"%s","event":"genesis","prev_hash":"%s","entry_hash":"%s"}
'   "$ts" "$prev" "$entry_hash" > "$LEDGER"

echo "Initialized vault at $VAULT_DIR"
