#!/usr/bin/env bash
# Decrypt an encrypted evidence file to stdout or to a file
set -euo pipefail
if [[ $# -lt 1 ]]; then
  echo "Usage: VAULT_DIR=vault $0 enc/<uid>-<name>.enc [out_file]"
  exit 1
fi
VAULT_DIR="${VAULT_DIR:-vault}"
IN="$1"
OUT="${2:-}"
if [[ ! -v VAULT_PASSPHRASE ]]; then
  echo "ERROR: VAULT_PASSPHRASE env var must be set." >&2
  exit 2
fi
FULL="$VAULT_DIR/$IN"
if [[ ! -f "$FULL" ]]; then
  echo "Encrypted file not found: $FULL" >&2
  exit 3
fi
if [[ -z "$OUT" ]]; then
  openssl enc -d -aes-256-gcm -pbkdf2 -iter "${VAULT_KDF_ITER:-210000}" -pass env:VAULT_PASSPHRASE -in "$FULL"
else
  openssl enc -d -aes-256-gcm -pbkdf2 -iter "${VAULT_KDF_ITER:-210000}" -pass env:VAULT_PASSPHRASE -in "$FULL" -out "$OUT"
  echo "Decrypted to $OUT"
fi
