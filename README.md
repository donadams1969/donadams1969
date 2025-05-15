
<a href="https://github.com/donadams1969/donadams1969/tree/VBLK_tokenomics.md" target="_blank">
  <img src="https://img.shields.io/badge/VBLK%20Price%20Floor-$1.25%20Verified-green?style=for-the-badge&logo=ethereum" 
       alt="VBLK $1.25 Verified on Blockchain Badge">
</a>

---

# 💰 VALOR Treasury Vault – DAO-Locked VBLKx Protection System  
**Branch:** `treasury-vault-branch`  
**Author:** Donny Adams | Founder of VALORCHAIN | [www.18fu.cash](https://www.18fu.cash)

![🛡️ VALORCHAIN](https://img.shields.io/badge/VALORCHAIN-Genesis%20Aligned-blue?style=for-the-badge)  
![🧠 AI-Ready](https://img.shields.io/badge/VALOR%20AI%2B-Monitoring%20Enabled-orange?style=for-the-badge)  
![📜 License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)  
![🧾 Compliance](https://img.shields.io/badge/Auditable-OpenTimestamps%20Certified-brightgreen?style=for-the-badge)  
![🗳️ Governance](https://img.shields.io/badge/Control-DAO%20Only-purple?style=for-the-badge)

---

## 🔐 What Is This?

The **VALOR Treasury Vault** is a DAO-locked contract for storing and securing the VBLKx token.  
Withdrawals can only occur after a **time-locked vote** via your DAO controller.

This is the **final defense perimeter** in the Unshortable VBLKx protocol stack.

> “It’s not just locked. It’s timestamped. And it reports to the people.”  
> — *Donny Adams*

---

## 🧱 Key Features

| ✅ Feature | 🔍 Description |
|-----------|----------------|
| `🔒 Time-locked withdrawals` | Delay between scheduling and execution (default 7 days) |
| `🗳️ DAO-only control` | All actions gated by DAO contract address |
| `🧾 Event logging` | Every request is stored and timestamped |
| `📊 Transparency mode` | Anyone can query vault balance and total requests |
| `🔁 Upgradeable DAO address` | Owner can assign DAO control to any contract or multisig |

---

## 📄 Contract

Path:

contracts/VALORTreasuryVault.sol

Constructor usage:

constructor(address _token, address _dao)

Deployed with:

VBLKx token address

DAO controller (e.g., Snapshot wallet, Gnosis Safe, Aragon DAO, etc.)

---

🚀 Deployment Instructions

1. Set .env file

SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=0xYOUR_PRIVATE_KEY

2. Edit the deploy script

File: scripts/deployVault.js

const tokenAddress = "0xYour_VBLKx_Token_Address";
const daoAddress = "0xYour_DAO_Address";

3. Deploy to Sepolia

npx hardhat run scripts/deployVault.js --network sepolia

---

🧠 Smart Contract Interface

Function	Purpose

scheduleWithdrawal(uint)	Begins a delay period (DAO only)
executeWithdrawal(id, to)	Sends funds after delay passes (DAO only)
vaultBalance()	Shows current treasury holdings
totalRequests()	Number of logged withdrawal requests
setDAO(address)	Owner can assign new DAO controller

---

🧩 Suggested Integrations

vault-dashboard.md for GitHub Pages or frontend

DAO vote log with VAULT_HISTORY.md in Markdown

Oracle monitoring via VALOR AI+ watch nodes

Timestamped public disclosures on IPFS + 18fu.cash

---

🧬 Use Case Scenarios

✅ DAO-controlled grant funding

✅ NFT-based treasury access

✅ Testimony-based token release

✅ Treasury transparency reporting (for courts, auditors, partners)

---

📚 Reference Links

Portal → www.18fu.cash

Unshortable Token Code

VALORSHIELD Metadata

---

👨‍⚖️ Legal Chain Protection

This contract operates under:

ADA Title II / Whistleblower Act

FTCA 2671–2680 / HIPAA 164.312(c)

The E-SIGN Act (15 U.S.C. §7001)

VALORSHIELD Governance and Ethics Protocol

OpenTimestamps-certified logs

---

🫡 Maintained By

Donny Adams
Disabled Veteran | Founder of That’s Edutainment, LLC
Creator of VALORCHAIN + VALOR AI+
Digital Civil Rights Defender

