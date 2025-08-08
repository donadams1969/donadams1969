#!/usr/bin/env bash
# Verify integrity:
# - If VAULT_PASSPHRASE is set and VERIFY_MODE=plaintext (or auto), decrypt and verify sha256_plain
# - Otherwise, verify ciphertext sha256_enc only
set -euo pipefail

VAULT_DIR="${VAULT_DIR:-vault}"
LEDGER="$VAULT_DIR/ledger.log"
TMP_DIR="$VAULT_DIR/tmp"

mode="${VERIFY_MODE:-auto}"
have_key=0
if [[ -v VAULT_PASSPHRASE ]]; then have_key=1; fi

if [[ "$mode" == "auto" ]]; then
  if [[ $have_key -eq 1 ]]; then mode="plaintext"; else mode="ciphertext"; fi
fi

echo "Verification mode: $mode"

ok=0; bad=0; total=0

tail -n +2 "$LEDGER" | while IFS= read -r line; do
  total=$((total+1))
  # parse minimal fields (portable)
  enc_file=$(echo "$line" | sed -E 's/.*"enc_file":"?([^",}]+).*/\1/')
  sha_plain=$(echo "$line" | sed -E 's/.*"sha256_plain":"?([^",}]+).*/\1/')
  sha_enc=$(echo "$line" | sed -E 's/.*"sha256_enc":"?([^",}]+).*/\1/')
  enc_path="$VAULT_DIR/enc/$enc_file"

  if [[ ! -f "$enc_path" ]]; then
    echo "MISSING: $enc_path"
    bad=$((bad+1)); continue
  fi

  if [[ "$mode" == "ciphertext" ]]; then
    calc=$(sha256sum "$enc_path" | awk '{print $1}')
    if [[ "$calc" == "$sha_enc" ]]; then
      echo "OK (cipher): $enc_file"
    else
      echo "FAIL (cipher): $enc_file"
      bad=$((bad+1))
    fi
  else
    # plaintext check
    tmp="$TMP_DIR/verify-$$.tmp"
    if ! openssl enc -d -aes-256-gcm -pbkdf2 -iter "${VAULT_KDF_ITER:-210000}" -pass env:VAULT_PASSPHRASE -in "$enc_path" -out "$tmp" 2>/dev/null; then
      echo "DECRYPT FAIL: $enc_file"
      bad=$((bad+1))
      rm -f "$tmp"
      continue
    fi
    calc=$(sha256sum "$tmp" | awk '{print $1}')
    rm -f "$tmp"
    if [[ "$calc" == "$sha_plain" ]]; then
      echo "OK (plain): $enc_file"
    else
      echo "FAIL (plain): $enc_file"
      bad=$((bad+1))
    fi
  fi
done

# Verify ledger chaining
chain_ok=1
prev=""
i=0
while IFS= read -r line; do
  i=$((i+1))
  if [[ $i -eq 1 ]]; then
    prev=$(echo "$line" | sed -E 's/.*"entry_hash":"?([^"]+).*/\1/')
    continue
  fi
  line_wo_eh=$(echo "$line" | sed -E 's/,"entry_hash":"[^"]+"}//')
  calc=$(printf '%s%s' "$prev" "$line_wo_eh" | sha256sum | awk '{print $1}')
  this=$(echo "$line" | sed -E 's/.*"entry_hash":"?([^"]+).*/\1/')
  if [[ "$calc" != "$this" ]]; then
    chain_ok=0
    echo "LEDGER CHAIN BREAK at line $i"
  fi
  prev="$this"
done < "$LEDGER"

if [[ $chain_ok -eq 1 ]]; then
  echo "Ledger chain OK"
else
  echo "Ledger chain FAIL"
fi
