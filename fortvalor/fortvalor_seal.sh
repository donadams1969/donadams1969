#!/bin/bash
#
# Fort Valor: OpenTimestamps Sealing Protocol
#
# This script automates the process of creating a timestamp proof for a
# given document and organizes the output into the Fort Valor directory
# structure.
#
# Usage: ./fortvalor/fortvalor_seal.sh <path_to_manifest>
#

set -e
set -o pipefail

# --- Configuration ---
# Ensure script is run from repo root for consistent paths.
if [ ! -d "fortvalor" ]; then
    echo "Error: This script must be run from the repository root." >&2
    exit 1
fi

BASE_DIR="fortvalor"
MANIFESTS_DIR="${BASE_DIR}/manifests"
PROOFS_DIR="${BASE_DIR}/proofs"
LOGS_DIR="${BASE_DIR}/logs"

# Create directories if they don't exist
mkdir -p "$MANIFESTS_DIR" "$PROOFS_DIR" "$LOGS_DIR"

# --- Script Body ---
echo "Fort Valor: OpenTimestamps Sealing Protocol Initialized."

# Check for correct number of arguments
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <path_to_manifest>" >&2
    echo "Error: No manifest file provided." >&2
    exit 1
fi

INPUT_MANIFEST_PATH=$1

# Check if the manifest file exists
if [ ! -f "$INPUT_MANIFEST_PATH" ]; then
    echo "Error: Manifest file not found at '${INPUT_MANIFEST_PATH}'" >&2
    exit 1
fi

FILENAME=$(basename -- "$INPUT_MANIFEST_PATH")
LOG_FILE="${LOGS_DIR}/${FILENAME}.log"
TEMP_MANIFEST_PATH="${MANIFESTS_DIR}/${FILENAME}"

# Clear previous log file if it exists
> "$LOG_FILE"
echo "Logging to ${LOG_FILE}" | tee -a "$LOG_FILE"

# Step 1: Copy the manifest to the processing directory for stamping
echo "[1/6] Copying '${FILENAME}' to '${MANIFESTS_DIR}' for processing..." | tee -a "$LOG_FILE"
cp "$INPUT_MANIFEST_PATH" "$TEMP_MANIFEST_PATH"

# Step 2: Create the OpenTimestamps proof
echo "[2/6] Stamping '${TEMP_MANIFEST_PATH}' with OpenTimestamps..." | tee -a "$LOG_FILE"
ots stamp "$TEMP_MANIFEST_PATH" | tee -a "$LOG_FILE"

# The proof file will be created next to the stamped file.
PROOF_FILE_SOURCE="${TEMP_MANIFEST_PATH}.ots"

# Step 3: Store the proof in the proofs folder
DEST_PROOF_PATH="${PROOFS_DIR}/${FILENAME}.ots"
echo "[3/6] Moving proof to '${DEST_PROOF_PATH}'..." | tee -a "$LOG_FILE"
mv "$PROOF_FILE_SOURCE" "$DEST_PROOF_PATH"

# Step 4: View proof details
echo "[4/6] Displaying proof info..." | tee -a "$LOG_FILE"
ots info "$DEST_PROOF_PATH" | tee -a "$LOG_FILE"

# Step 5: Verify the proof
echo "[5/6] Verifying proof integrity..." | tee -a "$LOG_FILE"
# Temporarily copy the stamped manifest to the proofs dir for verification
TEMP_VERIFY_MANIFEST_PATH="${PROOFS_DIR}/${FILENAME}"
cp "$TEMP_MANIFEST_PATH" "$TEMP_VERIFY_MANIFEST_PATH"

# Run verify from within the proofs directory
(cd "$PROOFS_DIR" && ots verify "${FILENAME}.ots") | tee -a "$LOG_FILE"

# Clean up the temporary manifest used for verification
rm "$TEMP_VERIFY_MANIFEST_PATH"

# Step 6: Upgrade the proof
echo "[6/6] Attempting to upgrade proof..." | tee -a "$LOG_FILE"
ots upgrade "$DEST_PROOF_PATH" | tee -a "$LOG_FILE"

# Clean up the originally copied manifest file
rm "$TEMP_MANIFEST_PATH"

echo "Protocol complete. Log file created at ${LOG_FILE}"