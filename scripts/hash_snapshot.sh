#!/usr/bin/env bash
set -e
find . -type f -not -path "./.git/*" -print0 | sort -z | xargs -0 sha256sum > exports/manifest.sha256
echo "✓ WROTE exports/manifest.sha256"
