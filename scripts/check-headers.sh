# Valor Ai+ — Proprietary | SPDX-License-Identifier: LicenseRef-VALOR-AI-Private
# © 2025 That’s Edutainment LLC (est. 2021). © 2015–2025 32D LLC. © 1991–2025 Don Adams Productions.

#!/usr/bin/env bash
set -euo pipefail
rg -n --hidden --glob '!**/node_modules/**' \
  --iglob '*.{ts,tsx,js,py,sh,yml,yaml,cs,java,go,rs}' \
  'Valor Ai\+\s*—\s*Proprietary' >/dev/null || {
    echo "::error::Missing legal header in some files."
    exit 1
}
