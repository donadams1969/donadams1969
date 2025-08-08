#!/usr/bin/env bash
set -euo pipefail
FILE="$1"
REMOTE_A="${2:-user@scrollkeeper-codex.org:/var/www/scrollkeeper-codex.org/html/downloads/}"
REMOTE_B="${3:-user@skrollkeeper.org:/var/www/skrollkeeper.org/html/downloads/}"
OUTDIR="${4:-downloads}"

scp "$FILE" "$REMOTE_A"
scp "$OUTDIR/$(basename "${FILE%.zip}.html")" "$REMOTE_A"
scp "$OUTDIR/$(basename "${FILE%.zip}.json")" "$REMOTE_A"

scp "$FILE" "$REMOTE_B"
scp "$OUTDIR/$(basename "${FILE%.zip}.html")" "$REMOTE_B"
scp "$OUTDIR/$(basename "${FILE%.zip}.json")" "$REMOTE_B"

URL_A="https://scrollkeeper-codex.org/downloads/$(basename "$FILE")"
URL_B="https://www.skrollkeeper.org/downloads/$(basename "$FILE")"

TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
curl -fsSL "$URL_A" -o "$TMP/a"
curl -fsSL "$URL_B" -o "$TMP/b"
sha256sum "$TMP/a" "$TMP/b"
