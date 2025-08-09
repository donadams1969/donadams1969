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
