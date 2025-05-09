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
