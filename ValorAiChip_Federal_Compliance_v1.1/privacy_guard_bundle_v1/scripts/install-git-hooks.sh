#!/usr/bin/env bash
set -euo pipefail

echo "🪝 Installing git hooks..."

# Correctly reference .git directory from repo root
GIT_DIR="$(git rev-parse --git-dir)"
HOOKS_DIR="$GIT_DIR/hooks"

cp "git-hooks/pre-commit" "$HOOKS_DIR/pre-commit"
cp "git-hooks/pre-push" "$HOOKS_DIR/pre-push"
chmod +x "$HOOKS_DIR/pre-commit" "$HOOKS_DIR/pre-push"

echo "✅ Git hooks installed."
