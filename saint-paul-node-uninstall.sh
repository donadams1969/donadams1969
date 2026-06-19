#!/usr/bin/env bash
# SAINT PAUL NODE UNINSTALLER — DG77.77X-Ξ

set -euo pipefail

INSTALL_DIR="/opt/saint-paul-node"
RUNNER_DIR="${INSTALL_DIR}/actions-runner"

echo "❗ SAINT PAUL NODE UNINSTALLER"

if [[ "$EUID" -ne 0 ]]; then
  echo "❌ This script must run as root (sudo)."
  exit 1
fi

if [[ ! -d "${RUNNER_DIR}" ]]; then
  echo "ℹ️ Runner directory not found at ${RUNNER_DIR}. Nothing to uninstall?"
  exit 0
fi

cd "${RUNNER_DIR}"

echo "🚫 Stopping runner service (if running)..."
if [[ -f ./svc.sh ]]; then
  ./svc.sh stop || true
  echo "🧹 Removing service..."
  ./svc.sh uninstall || ./svc.sh remove || true
fi

echo "📁 Removing ${INSTALL_DIR} (runner + scripts + baseline)..."
rm -rf "${INSTALL_DIR}"

echo "✅ Saint Paul Node uninstalled."
