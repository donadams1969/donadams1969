#!/bin/bash
# Nightly Sweep: Verify kernels on primary (codex) + fallback (skroll); fail on divergence

PRIMARY="https://scrollkeeper-codex.org/kernels"
FALLBACK="https://www.skrollkeeper.org/kernels"
KERNELS="de440.bsp naif0012.tls"
TMP_DIR="/tmp/sweep_$(date +%s)"

mkdir -p $TMP_DIR
trap "rm -rf $TMP_DIR" EXIT

for k in $KERNELS; do
  curl -fsSL $PRIMARY/$k -o $TMP_DIR/$k.primary || { echo "ERROR: Primary failed for $k"; exit 1; }
  curl -fsSL $FALLBACK/$k -o $TMP_DIR/$k.fallback || { echo "ERROR: Fallback failed for $k"; exit 1; }

  HASH_P=$(sha256sum $TMP_DIR/$k.primary | cut -d' ' -f1)
  HASH_F=$(sha256sum $TMP_DIR/$k.fallback | cut -d' ' -f1)

  if [ "$HASH_P" != "$HASH_F" ]; then
    echo "ERROR: Checksum divergence for $k: Primary $HASH_P vs Fallback $HASH_F"
    exit 1
  fi
  echo "OK: $k matches ($HASH_P)"
done

echo "Nightly sweep complete—all kernels verified."
