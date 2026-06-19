#!/usr/bin/env bash
# SAINT PAUL NODE DIAGNOSTICS — DG77.77X-Ξ

set -euo pipefail

INSTALL_DIR="/opt/saint-paul-node"
RUNNER_DIR="${INSTALL_DIR}/actions-runner"
BASELINE_FILE="${INSTALL_DIR}/saint-paul-baseline.txt"

echo "🩺 SAINT PAUL NODE DIAGNOSTICS"
echo "Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo

echo "===== SYSTEMD RUNNER SERVICE STATUS ====="
systemctl list-units "actions.runner*" || echo "No actions.runner units found."
echo

echo "===== RUNNER DIRECTORY ====="
if [[ -d "${RUNNER_DIR}" ]]; then
  echo "Runner dir present: ${RUNNER_DIR}"
  ls -1 "${RUNNER_DIR}" || true
else
  echo "Runner dir missing: ${RUNNER_DIR}"
fi
echo

echo "===== SAINT PAUL BASELINE ====="
if [[ -f "${BASELINE_FILE}" ]]; then
  head -n 30 "${BASELINE_FILE}" || true
else
  echo "Baseline file not found at ${BASELINE_FILE}"
fi
echo

echo "===== CORE BINARIES ====="
for b in curl jq bc node cosign; do
  if command -v "$b" &> /dev/null; then
    echo -n "$b -> "
    command -v "$b"
  else
    echo "$b -> NOT FOUND"
  fi
done
echo

echo "===== NODE HEALTH PING (if reachable) ====="
if command -v curl &> /dev/null; then
  curl -s -f --connect-timeout 5 https://node.valorai.plus/health || echo "Node health endpoint unreachable."
else
  echo "curl not installed; skipping health ping."
fi

echo
echo "✅ Diagnostics complete."
