# Valor Ai+ — Proprietary | SPDX-License-Identifier: LicenseRef-VALOR-AI-Private
# © 2025 That’s Edutainment LLC (est. 2021). © 2015–2025 32D LLC. © 1991–2025 Don Adams Productions.

#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"

NOTICE_LINE="© 2025 That’s Edutainment LLC (est. 2021). © 2015–2025 32D LLC. © 1991–2025 Don Adams Productions. Valor Ai+™/® — all rights reserved."
OWNER_SHORT="That’s Edutainment LLC • 32D LLC • Don Adams Productions"
SPDX="LicenseRef-VALOR-AI-Private"

say() { printf "\033[1;36m==>\033[0m %s\n" "$*"; }

mkdir -p "$ROOT/scripts" "$ROOT/.github/workflows" "$ROOT/frontend/src/components" "$ROOT/backend/src/mw" "$ROOT/templates/nft"

# 1) LICENSE
say "Writing LICENSE"
cat > "$ROOT/LICENSE" <<EOF
$SPDX

This software and all associated assets are proprietary to:
- That’s Edutainment LLC (est. 2021) © 2025
- 32D LLC © 2015–2025
- Don Adams Productions © 1991–2025

All rights reserved. No license is granted except under a signed, written agreement.
Unauthorized use, copying, distribution, modification, or reverse engineering is prohibited.

Trademarks:
- Valor Ai+™/® is a trademark of That’s Edutainment LLC. All other marks are the property of their owners.
EOF

# 2) NOTICE
say "Writing NOTICE"
cat > "$ROOT/NOTICE" <<EOF
This distribution includes proprietary components branded as “Valor Ai+”.
$NOTICE_LINE
All rights reserved.

Third-party notices (if any) are listed in THIRD_PARTY_NOTICES.
EOF

# 3) Footer component
say "Writing frontend LegalFooter.tsx"
cat > "$ROOT/frontend/src/components/LegalFooter.tsx" <<'EOF'
/*!
 * Valor Ai+ — Proprietary
 * © 2025 That’s Edutainment LLC (est. 2021). © 2015–2025 32D LLC. © 1991–2025 Don Adams Productions.
 * SPDX-License-Identifier: LicenseRef-VALOR-AI-Private
 */
export default function LegalFooter() {
  const y = new Date().getFullYear();
  return (
    <footer className="text-xs text-gray-500 py-6 text-center">
      <div>
        © {y} That’s Edutainment LLC (est. 2021). © 2015–{y} 32D LLC. © 1991–{y} Don Adams Productions.
      </div>
      <div>Valor Ai+™/® — all rights reserved.</div>
    </footer>
  );
}
EOF

# 4) Backend branding headers
say "Writing backend brandHeaders middleware"
cat > "$ROOT/backend/src/mw/branding.ts" <<'EOF'
/*!
 * Valor Ai+ — Proprietary
 * © 2025 That’s Edutainment LLC (est. 2021). © 2015–2025 32D LLC. © 1991–2025 Don Adams Productions.
 * SPDX-License-Identifier: LicenseRef-VALOR-AI-Private
 */
import type { Request, Response, NextFunction } from "express";

export function brandHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Powered-By", "Valor Ai+");
  res.setHeader("X-Brand", "Valor Ai+");
  res.setHeader(
    "X-Copyright",
    "© 2025 That’s Edutainment LLC (est. 2021); © 2015–2025 32D LLC; © 1991–2025 Don Adams Productions"
  );
  next();
}
EOF

# 5) Build stamp
say "Writing build stamp script"
cat > "$ROOT/scripts/stamp-notice.sh" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
NOTICE="© 2025 That’s Edutainment LLC (est. 2021); © 2015–2025 32D LLC; © 1991–2025 Don Adams Productions — Valor Ai+™/®"
if [ -d "dist" ]; then
  find dist -type f -name "*.js" -print0 | xargs -0 -I{} sh -c 'sed -i "1s;^;/* '"$NOTICE"' */\n;" "{}"'
fi
EOF
chmod +x "$ROOT/scripts/stamp-notice.sh"

# 6) Header check (CI guard)
say "Writing header check script"
cat > "$ROOT/scripts/check-headers.sh" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
rg -n --hidden --glob '!**/node_modules/**' \
  --iglob '*.{ts,tsx,js,py,sh,yml,yaml,cs,java,go,rs}' \
  'Valor Ai\+\s*—\s*Proprietary' >/dev/null || {
    echo "::error::Missing legal header in some files."
    exit 1
}
EOF
chmod +x "$ROOT/scripts/check-headers.sh"

# 7) CI workflow
say "Writing GitHub Actions workflow"
cat > "$ROOT/.github/workflows/valor-legal.yml" <<'EOF'
name: ValorAi+ Legal & Branding
on: [push, pull_request]
jobs:
  legal:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: taiki-e/install-action@ripgrep
      - name: Check legal headers
        run: bash scripts/check-headers.sh
      - name: Ensure LICENSE & NOTICE exist
        run: test -f LICENSE && test -f NOTICE
EOF

# 8) NFT / IPFS template
say "Writing NFT metadata template"
cat > "$ROOT/templates/nft/valor_audit.json" <<EOF
{
  "name": "Valor Ai+ Audit Credential",
  "description": "Audit proof minted by Valor Ai+ for Scrollkeeper.",
  "image": "ipfs://<image_cid>",
  "external_url": "https://www.scrollkeeper-codex.org",
  "rights": "$NOTICE_LINE",
  "brand": "Valor Ai+™/®",
  "license": "$SPDX",
  "attributes": [
    {"trait_type":"suite","value":"Valor Ai+"},
    {"trait_type":"owner","value":"$OWNER_SHORT"}
  ]
}
EOF

# 9) HTML meta helper (for Next.js include in _document or Head)
say "Writing meta snippet (frontend/public/meta.html)"
mkdir -p "$ROOT/frontend/public"
cat > "$ROOT/frontend/public/meta.html" <<EOF
<meta name="application-name" content="Valor Ai+" />
<meta name="copyright" content="$NOTICE_LINE" />
<meta property="og:site_name" content="Valor Ai+" />
<meta property="og:copyright" content="© 2025 That’s Edutainment LLC; © 2015–2025 32D LLC; © 1991–2025 Don Adams Productions" />
EOF

# 10) Optional package.json stamping (non-destructive)
if command -v jq >/dev/null 2>&1 && [ -f "$ROOT/package.json" ]; then
  say "Updating package.json metadata"
  tmp="$(mktemp)"
  jq \
    --arg lic "$SPDX" \
    --arg auth "That’s Edutainment LLC" \
    --arg cr "© 2025 That’s Edutainment LLC (est. 2021); © 2015–2025 32D LLC; © 1991–2025 Don Adams Productions" \
    '.license=$lic | .author=$auth | .copyright=$cr' \
    "$ROOT/package.json" > "$tmp" && mv "$tmp" "$ROOT/package.json"
fi

say "Prepending legal headers to source files (new files unaffected if already stamped)"
HEADER_TS="/*!
 * Valor Ai+ — Proprietary
 * © 2025 That’s Edutainment LLC (est. 2021). © 2015–2025 32D LLC. © 1991–2025 Don Adams Productions.
 * All rights reserved. Unauthorized copying, distribution, or reverse engineering is prohibited.
 * SPDX-License-Identifier: $SPDX
 */"
HEADER_SH="# Valor Ai+ — Proprietary | SPDX-License-Identifier: $SPDX
# © 2025 That’s Edutainment LLC (est. 2021). © 2015–2025 32D LLC. © 1991–2025 Don Adams Productions."
HEADER_PY="# Valor Ai+ — Proprietary
# © 2025 That’s Edutainment LLC (est. 2021). © 2015–2025 32D LLC. © 1991–2025 Don Adams Productions.
# All rights reserved. Unauthorized use prohibited.
# SPDX-License-Identifier: $SPDX"

# Only add if not already present
add_header() {
  file="$1"; hdr="$2"
  grep -q "Valor Ai\+ — Proprietary" "$file" 2>/dev/null && return 0
  printf "%s\n\n" "$hdr" | cat - "$file" > "$file.__tmp__" && mv "$file.__tmp__" "$file"
}

# TS/JS/TSX
while IFS= read -r -d '' f; do add_header "$f" "$HEADER_TS"; done < <(find "$ROOT" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -not -path "*/node_modules/*" -print0)
# SH / YAML
while IFS= read -r -d '' f; do add_header "$f" "$HEADER_SH"; done < <(find "$ROOT" -type f \( -name "*.sh" -o -name "*.yml" -o -name "*.yaml" \) -not -path "*/node_modules/*" -print0)
# PY
while IFS= read -r -d '' f; do add_header "$f" "$HEADER_PY"; done < <(find "$ROOT" -type f -name "*.py" -not -path "*/node_modules/*" -print0)

say "Done. Next steps:"
echo "  1) Wire backend: import { brandHeaders } from './src/mw/branding'; app.use(brandHeaders);"
echo "  2) Add <LegalFooter /> to your main layout."
echo "  3) Add CI step: bash scripts/stamp-notice.sh (after build)."
echo "  4) Commit: git add -A && git commit -m 'Branding: Valor Ai+ proprietary hardwired'"
