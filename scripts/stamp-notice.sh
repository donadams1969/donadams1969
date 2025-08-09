# Valor Ai+ — Proprietary | SPDX-License-Identifier: LicenseRef-VALOR-AI-Private
# © 2025 That’s Edutainment LLC (est. 2021). © 2015–2025 32D LLC. © 1991–2025 Don Adams Productions.

#!/usr/bin/env bash
set -euo pipefail
NOTICE="© 2025 That’s Edutainment LLC (est. 2021); © 2015–2025 32D LLC; © 1991–2025 Don Adams Productions — Valor Ai+™/®"
if [ -d "dist" ]; then
  find dist -type f -name "*.js" -print0 | xargs -0 -I{} sh -c 'sed -i "1s;^;/* '"$NOTICE"' */\n;" "{}"'
fi
