
---

# 🌐 VBLK Token: Smart Contract Deployment

![Branch: next](https://img.shields.io/badge/Branch-next-blue?style=flat-square)  
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)  
![Status](https://img.shields.io/github/workflow/status/DonAdams1969/VBLK_Token/Run%20Hardhat%20Tests?label=CI%20Status&style=flat-square)

---

## 🧱 Overview

This branch (`next`) contains the full development stack for the **VBLKToken**, the ERC-20 utility token anchoring the VALORCHAIN ecosystem.  
Built by **Donny Adams**, this token powers the AI-verified, OpenTimestamps-anchored compliance architecture deployed through [18fu.cash](https://www.18fu.cash).

---

## ✅ Features in This Branch

| Component          | Description                                           |
|--------------------|-------------------------------------------------------|
| `VBLKToken.sol`    | ERC-20 token with mint/burn and 100M initial supply   |
| `deploy.js`        | Hardhat deployment script for Sepolia & Polygon       |
| `VBLKToken.test.js`| Full Chai + Hardhat unit test coverage                |
| `CI/CD Pipeline`   | GitHub Actions for automatic test enforcement         |
| `README.md`        | Branch-level developer and deployer instructions      |

---
## 🧪 How to Run Locally

| Step | Command / Description |
|------|------------------------|
| 1️⃣   | `git clone https://github.com/DonAdams1969/VBLK_Token.git` <br> Clone the repository |
| 2️⃣   | `cd VBLK_Token` <br> Navigate into the project directory |
| 3️⃣   | `git checkout next` <br> Switch to the `next` branch |
| 4️⃣   | `npm install` <br> Install project dependencies |
| 5️⃣   | `npx hardhat test` <br> Run the full test suite |
| 6️⃣   | `npx hardhat run scripts/deploy.js --network sepolia` <br> Deploy to Sepolia testnet |

---

🌐 Deployment Metadata

Network	Chain ID	Explorer

Sepolia	11155111	sepolia.etherscan.io
Polygon Mumbai	80001	mumbai.polygonscan.com


> Deployment addresses and token registry links will be added post verification.

---

🛡️ Authored By

Donny Adams
Founder, That’s Edutainment, LLC
Inventor of VALORCHAIN | Architect of VALOR AI+

GitHub: @DonAdams1969

Compliance Gateway: www.18fu.cash

---

🧬 Legal & Ethics Tag

This repository, its metadata, smart contracts, and signature trails are protected under the
VALORSHIELD Compliance Doctrine, timestamped, sealed, and aligned with the
ADA, HIPAA, FTCA, and Unruh Civil Rights protocols.

> “Code isn’t just utility. It’s testimony.” — Donny Adams

