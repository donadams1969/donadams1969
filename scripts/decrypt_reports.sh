#!/bin/bash
REPORTS_DIR="${REPORTS_DIR:-reports}"
for file in $(find "$REPORTS_DIR" -name "*.md.enc"); do
  sops -d "$file" > "${file%.enc}"
  echo "[sops] Decrypted: ${file%.enc}"
done
