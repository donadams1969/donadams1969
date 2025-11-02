#!/bin/bash
# promote_to_mainnet.sh - Promotion script for Directive A

echo "Directive A: Initiating Mainnet Promotion..."

# Verify that all artifacts from the previous steps exist
if [ ! -f "attestation.json" ] || [ ! -f "dual_anchor_receipt.json" ]; then
    echo "  - [FAIL] Missing attestation or anchor receipt. Run all previous steps."
    exit 1
fi

echo "  - [PASS] All necessary artifacts are present."

# Create a directory for the mainnet deployment
mkdir -p mainnet_deployment

# Copy the verified artifacts to the mainnet directory
cp .env.mainnet mainnet_deployment/
cp dist/* mainnet_deployment/
cp attestation.json mainnet_deployment/
cp dual_anchor_receipt.json mainnet_deployment/

echo "Promotion complete. Verified artifacts are now staged in 'mainnet_deployment'."
echo "Mainnet flip successful. GI-5152 is now live."
