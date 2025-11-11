#!/usr/bin/env bash
set -euo pipefail

: "${DG_REAL_NAME:?ERROR: Set DG_REAL_NAME environment variable}"
: "${DG_PSEUDONYM:=DG77.77X-Ξ}"

echo "🔐 Rendering privacy templates..."
echo "   Real Name: [REDACTED]"
echo "   Pseudonym: ${DG_PSEUDONYM}"

# Escape for regex (character class method)
DG_REAL_NAME_REGEX="$(printf '%s' "$DG_REAL_NAME" | sed -e 's/[^^]/[&]/g; s/\^/\\^/g')"
DG_REAL_NAME_REGEX_LOWER="$(echo "$DG_REAL_NAME" | tr '[:upper:]' '[:lower:]' | sed -e 's/[^^]/[&]/g; s/\^/\\^/g')"
DG_REAL_NAME_LITERAL="$(printf '%s' "$DG_REAL_NAME" | sed 's/[.[\*^$(){}+?|\-]/\\&/g')"

export DG_REAL_NAME_REGEX DG_REAL_NAME_REGEX_LOWER DG_REAL_NAME_LITERAL DG_PSEUDONYM

# Render all .tpl files
for tpl in $(find privacy_guard_bundle_v1 -name "*.tpl"); do
  out="${tpl%.tpl}"
  echo "  → $tpl → $out"
  envsubst '$DG_REAL_NAME_REGEX $DG_REAL_NAME_REGEX_LOWER $DG_REAL_NAME_LITERAL $DG_PSEUDONYM' < "$tpl" > "$out"
done

echo "✅ Templates rendered. Safe to deploy."
