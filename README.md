# 🛡️ VALOR AI+ 2E | DBLK Anti-Short Reflex Protocol  
**Author:** Donny Adams  
**Entity:** That’s Edutainment, LLC  
**Powered by:** VALORCHAIN | NFT + DAO Compatible  

![Short-Proof](https://img.shields.io/badge/Short--Proof-Engine-red?style=for-the-badge)
![VALOR AI+ 2E](https://img.shields.io/badge/VALOR%20AI%2B-2E%20Activated-purple?style=for-the-badge)
![Donny Adams](https://img.shields.io/badge/Author-Donny%20Adams-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge)

---

## ⚙️ Overview
This smart contract system implements the **VALOR AI+ 2E Reflex Protocol**, designed to fight back against off-chain and on-chain shorting behavior. It includes:

- Dynamic sell tax logic  
- High-risk wallet flagging  
- Burn-on-transfer mechanism  
- DAO-compatible governance  
- Oracle-ready anti-short hooks  

---

## 🔍 Smart Contract Features

| ⚙️ Function                | 🧠 Purpose                                                              |
|--------------------------|-------------------------------------------------------------------------|
| `sellTaxRate`            | Baseline sell tax applied to all outgoing transfers                     |
| `highRiskSellTaxRate`    | Increased penalty tax applied to flagged shorters                        |
| `flagShorter()`          | Allows owner/DAO to mark malicious wallets                              |
| `transfer()`             | Applies tax and burns it before transferring remaining balance          |
| `updateSellTaxRate()`    | Owner can modify the base tax for general volume behavior               |
| `updateHighRiskSellTaxRate()` | Adjusts punishment ratio for bad actors                              |

---

## ⚔️ Anti-Short Reflex Chain

| Step | Mechanism              | Action Triggered                                                                 |
|------|------------------------|----------------------------------------------------------------------------------|
| 1    | Borrow to Short        | Off-chain/DEX-based borrowing is detected                                        |
| 2    | Oracle Trigger         | Chainlink-style feed activates based on price pressure                          |
| 3    | Flagged Wallet         | Owner or protocol flags address as shorting                                     |
| 4    | Tax Spike              | 3x tax applied on transfers from flagged wallet                                 |
| 5    | Token Burn             | Taxed portion of tokens is burned to tighten supply                             |
| 6    | Reflex Redistribution  | Future logic will reward DAO, LPs, or stakers                                   |

---

## 📦 Repository Structure


# 🛡️ VBLK Identity Protocol Branch – NFT-Gated Unshortable Token Architecture  
**Branch Name:** `unshortable-vblk-nft-branch`  
**Author:** Donny Adams | Architect of VALORCHAIN + VALOR AI+  
**Official Gateway:** [www.18fu.cash](https://www.18fu.cash)

![VBLKx Token](https://img.shields.io/badge/VBLKx-Anti--Short%20Token-red?style=flat-square)  
![NFT Access](https://img.shields.io/badge/NFT--Gated-Required-blue?style=flat-square)  
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)  
![Status](https://img.shields.io/badge/Deployment-Sepolia%20Ready-orange?style=flat-square)

---

## 🧬 Overview

This GitHub branch introduces the **VBLKx Token**, an enhanced, anti-short ERC-20 token with built-in protections, gated exclusively by the `VALORBadgeNFT` identity layer.

**Together**, these two contracts form a **civil-rights-aligned, testimony-anchored, market-resistant asset class** engineered for:

- Compliance enforcement  
- Liquidity shielding  
- Contributor authentication  
- Web3-based legal sovereignty

---

## 🧩 What's Included

| File / Contract             | Description |
|-----------------------------|-------------|
| `VALORBadgeNFT.sol`         | ERC721 badge for identity verification & whitelist logic |
| `UnshortableVBLKToken.sol`  | Short-resistant ERC20 token requiring NFT to trade |
| `deployNFT.js`              | Deploys the identity NFT contract |
| `deployToken.js`            | Deploys the token with reference to deployed NFT |

---

## ⚙️ How to Deploy (Sepolia Network)

### 1. Configure `.env`

```ini
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=0xYOUR_WALLET_PRIVATE_KEY

```
Here's a visual flow diagram of the Anti-Short Reflex Protocol designed for DBLK:

Red: Detects and penalizes shorting activity

Gold/Green: Uses sell tax and buyback vaults to stabilize price

Purple/Cyan: Tracks wallet behavior and mirrors synthetic shorts

Blue: Triggers auto-squeeze to punish aggressive borrowing

![1000013375](https://github.com/user-attachments/assets/e595aba5-85ba-4ad3-a4c2-d75877f13ece)


