#!/usr/bin/env bash
# SAINT PAUL NODE INSTALLER v1.0 — DG77.77X-Ξ
# Sets up a sovereign self-hosted GitHub Actions runner with label: saint-paul-node

set -euo pipefail

# ==== CONFIG VIA ENV ====
: "${GH_OWNER:?GH_OWNER environment variable is required (GitHub user/org)}"
: "${GH_REPO:?GH_REPO environment variable is required (GitHub repo name)}"
: "${GH_RUNNER_TOKEN:?GH_RUNNER_TOKEN environment variable is required (GitHub runner registration token)}"

RUNNER_LABEL="saint-paul-node"
INSTALL_DIR="/opt/saint-paul-node"
RUNNER_DIR="${INSTALL_DIR}/actions-runner"
SCRIPTS_DIR="${INSTALL_DIR}/scripts"
SERVICE_NAME="github-runner-saint-paul"

echo "🛡️ SAINT PAUL NODE INSTALLER"
echo "   Repo: https://github.com/${GH_OWNER}/${GH_REPO}"
echo "   Label: ${RUNNER_LABEL}"
echo "   Install dir: ${INSTALL_DIR}"
echo

# ==== ROOT CHECK ====
if [[ "$EUID" -ne 0 ]]; then
  echo "❌ This script must run as root (sudo)."
  exit 1
fi

# ==== PREPARE DIRECTORIES ====
echo "📁 Creating directories at ${INSTALL_DIR} ..."
mkdir -p "${RUNNER_DIR}"
mkdir -p "${SCRIPTS_DIR}"

# ==== INSTALL DEPENDENCIES ====
echo "🔧 Installing dependencies (curl, jq, bc, git, node) if missing..."

if command -v apt-get &> /dev/null; then
  PKG_MGR="apt-get"
  $PKG_MGR update -y
  $PKG_MGR install -y curl jq bc git ca-certificates
  # Node via apt if present, otherwise user can upgrade later
  if ! command -v node &> /dev/null; then
    echo "⚠️ Node.js not found. Installing minimal nodejs..."
    $PKG_MGR install -y nodejs
  fi
elif command -v yum &> /dev/null; then
  PKG_MGR="yum"
  $PKG_MGR install -y curl jq bc git ca-certificates
  if ! command -v node &> /dev/null; then
    echo "⚠️ Node.js not found. Installing minimal nodejs..."
    $PKG_MGR install -y nodejs
  fi
else
  echo "⚠️ Unknown package manager. Please ensure curl, jq, bc, git, node are installed manually."
fi

# ==== INSTALL COSIGN IF MISSING ====
if ! command -v cosign &> /dev/null; then
  echo "🔐 Installing cosign..."
  curl -sSL https://github.com/sigstore/cosign/releases/latest/download/cosign-linux-amd64 \
    -o /usr/local/bin/cosign
  chmod +x /usr/local/bin/cosign
fi

# ==== DOWNLOAD GITHUB ACTIONS RUNNER ====
echo "⬇️ Downloading latest GitHub Actions runner..."
cd "${RUNNER_DIR}"
if [[ ! -f "actions-runner-linux-x64.tar.gz" ]]; then
  curl -sSL https://github.com/actions/runner/releases/latest/download/actions-runner-linux-x64.tar.gz \
    -o actions-runner-linux-x64.tar.gz
fi

echo "📦 Extracting runner..."
tar xzf actions-runner-linux-x64.tar.gz

# ==== CONFIGURE RUNNER ====
echo "⚙️ Configuring runner for https://github.com/${GH_OWNER}/${GH_REPO} ..."
./config.sh \
  --url "https://github.com/${GH_OWNER}/${GH_REPO}" \
  --token "${GH_RUNNER_TOKEN}" \
  --labels "self-hosted,${RUNNER_LABEL}" \
  --unattended \
  --replace

# ==== INSTALL SYSTEMD SERVICE VIA svc.sh ====
echo "🧩 Installing systemd service..."
./svc.sh install

# Service naming is handled by svc.sh (actions.runner.<OWNER>-<REPO>.<ID>.service)
if systemctl list-units | grep -q "actions.runner"; then
  echo "ℹ️ GitHub runner service installed (actions.runner...)."
else
  echo "ℹ️ GitHub runner service installed via svc.sh."
fi

echo "🚀 Starting runner service..."
./svc.sh start

# ==== CREATE BASELINE HASH REPORT ====
BASELINE_FILE="${INSTALL_DIR}/saint-paul-baseline.txt"
echo "🧬 Creating baseline integrity snapshot at ${BASELINE_FILE} ..."

{
  echo "SAINT PAUL NODE BASELINE — $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  echo "Commander: DG77.77X-Ξ"
  echo "Repo: https://github.com/${GH_OWNER}/${GH_REPO}"
  echo "Runner label: ${RUNNER_LABEL}"
  echo
  echo "===== SYSTEM INFO ====="
  uname -a || true
  echo
  echo "===== OS RELEASE ====="
  if [[ -f /etc/os-release ]]; then
    cat /etc/os-release
  fi
  echo
  echo "===== BINARY HASHES (curl, jq, bc, node, cosign) ====="
  for b in curl jq bc node cosign; do
    if command -v "$b" &> /dev/null; then
      BIN_PATH=$(command -v "$b")
      echo "$b :: $BIN_PATH"
      sha256sum "$BIN_PATH" || true
      echo
    else
      echo "$b :: NOT FOUND"
      echo
    fi
  done

  echo "===== ACTIONS RUNNER HASHES ====="
  find "${RUNNER_DIR}" -maxdepth 1 -type f \
    -name "*.sh" -o -name "Runner.*" -o -name "config.*" | sort | while read -r f; do
      if [[ -f "$f" ]]; then
        sha256sum "$f" || true
      fi
    done
} > "${BASELINE_FILE}"

chmod 600 "${BASELINE_FILE}"

echo
echo "✅ SAINT PAUL NODE INSTALL COMPLETE."
echo "   - Runner dir: ${RUNNER_DIR}"
echo "   - Scripts dir: ${SCRIPTS_DIR}"
echo "   - Baseline: ${BASELINE_FILE}"
echo
echo "You can check service status with:  sudo systemctl status actions.runner*"
echo "This node is now ready to run: saint-paul-node labelled workflows."
