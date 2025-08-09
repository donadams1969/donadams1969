/*!
 * Valor Ai+ — Proprietary
 * © 2025 That’s Edutainment LLC (est. 2021). © 2015–2025 32D LLC. © 1991–2025 Don Adams Productions.
 * All rights reserved. Unauthorized copying, distribution, or reverse engineering is prohibited.
 * SPDX-License-Identifier: LicenseRef-VALOR-AI-Private
 */

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
