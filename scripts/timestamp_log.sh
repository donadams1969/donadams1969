#!/usr/bin/env bash
set -e
OUT="logs/operation.log"
{
  echo "VALORAIPLUS OPERATION LOG"
  echo "Local: $(date)"
  echo "UTC  : $(date -u)"
  echo "Node : Saint Paul, MN"
} >> "$OUT"
echo "✓ LOGGED TO $OUT"
