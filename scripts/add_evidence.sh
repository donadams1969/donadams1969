#!/usr/bin/env bash
# Add evidence with AES-256-GCM encryption-at-rest and hash-chained ledger entry
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: VAULT_DIR=vault $0 /path/to/file [label]"
  exit 1
fi

FILE="$1"
LABEL="${2:-}"
VAULT_DIR="${VAULT_DIR:-vault}"
LEDGER="$VAULT_DIR/ledger.log"
ENC_DIR="$VAULT_DIR/enc"
STORE_DIR="$VAULT_DIR/store"
TMP_DIR="$VAULT_DIR/tmp"

if [[ ! -f "$LEDGER" ]]; then
  echo "Ledger not found. Initialize with ./scripts/init_vault.sh $VAULT_DIR" >&2
  exit 2
fi

if [[ ! -v VAULT_PASSPHRASE ]]; then
  echo "ERROR: VAULT_PASSPHRASE env var must be set to encrypt evidence." >&2
  exit 3
fi

bn="$(basename -- "$FILE")"
uid="$(uuidgen 2>/dev/null || cat /proc/sys/kernel/random/uuid)"
stamp="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
store_path="$STORE_DIR/$uid-$bn"
enc_path="$ENC_DIR/$uid-$bn.enc"

mkdir -p "$ENC_DIR" "$STORE_DIR" "$TMP_DIR"

# Copy to store and hash plaintext
cp -p "$FILE" "$store_path"
size_plain=$(stat -c%s "$store_path" 2>/dev/null || stat -f%z "$store_path")
sha_plain=$(sha256sum "$store_path" | awk '{print $1}')

# Encrypt (AES-256-GCM with PBKDF2)
openssl enc -aes-256-gcm -pbkdf2 -iter "${VAULT_KDF_ITER:-210000}" -salt   -pass env:VAULT_PASSPHRASE -in "$store_path" -out "$enc_path"

size_enc=$(stat -c%s "$enc_path" 2>/dev/null || stat -f%z "$enc_path")
sha_enc=$(sha256sum "$enc_path" | awk '{print $1}')

# Optionally delete plaintext
if [[ "${DELETE_PLAINTEXT_AFTER_ENCRYPT:-1}" == "1" ]]; then
  shred -uz "$store_path" 2>/dev/null || rm -f "$store_path"
  store_path="(deleted)"
fi

# Chain the ledger (entry hash depends on prev entry_hash + current fields)
prev_hash="$(tail -n1 "$LEDGER" | sed -E 's/.*"entry_hash":"?([^"]+).*/\1/')"

json=$(printf '{"ts":"%s","event":"add","uid":"%s","file":"%s","label":"%s","size_plain":%s,"sha256_plain":"%s","enc_file":"%s","size_enc":%s,"sha256_enc":"%s","alg":"aes-256-gcm","kdf":"pbkdf2","iter":%s,"prev_hash":"%s"}'   "$stamp" "$uid" "$(echo "$bn" | sed 's/"/\"/g')" "$(echo "$LABEL" | sed 's/"/\"/g')"   "${size_plain:-0}" "$sha_plain" "$(basename -- "$enc_path")" "${size_enc:-0}" "$sha_enc"   "${VAULT_KDF_ITER:-210000}" "$prev_hash")

entry_hash="$(printf '%s' "$prev_hash$json" | sha256sum | awk '{print $1}')"
printf '%s,"entry_hash":"%s"}
' "$json" "$entry_hash" >> "$LEDGER"

echo "Added evidence: $bn → $enc_path"
