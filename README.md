# 📜 VALOR Open Justice License&nbsp;v0.1
![License](https://img.shields.io/badge/License-VALOR%20OJ%20v0.1-brightgreen?style=for-the-badge)
![Built for Truth](https://img.shields.io/badge/Built_for-Truth_&_Accountability-blue?style=for-the-badge)
![BTC-Anchor](https://img.shields.io/badge/Blockchain-OpenTimestamps-success?style=for-the-badge)

> **TL;DR** – You may **use, fork, verify, and distribute** the contents of this repository  
> so long as every derivative work **preserves cryptographic proofs** (SHA-256 + OTS)  
> **and** cites “VALOR Open Justice License v0.1”.

---

## 0. Preamble
VALORCHAIN is designed to protect whistle-blowers, disabled veterans, and the public from evidence tampering.  
All content here is **timestamped, hash-locked, and AI-monitored**. Your freedom to build on it hinges on preserving that integrity.

## 1. Permissions
| Action | Allowed? | Notes |
|--------|----------|-------|
| Commercial & non-commercial use | ✅ | Credit + proof chain required |
| Forking & distribution | ✅ | Must include this license & `.sha/.ots` |
| Modification | ✅ | Anchoring of modifications **mandatory** |
| Patent use | ✅ | No patent claims asserted |

## 2. Conditions
1. **Integrity First** – Do **not** strip or alter SHA-256 digests, `.ots` files, or VALOR badges.  
2. **Transparent Derivatives** – Publish new proofs for every modified file.  
3. **Attribution** – Keep the original copyright lines & link back to <https://18fu.ai>.

## 3. Limitations
- **No Warranty** – Provided *“as-is.”*  
- **No Liability** – Authors aren’t liable for damages arising from use.  
- **No Trademark Grant** – “VALOR” & “VBLK” remain property of That’s Edutainment, LLC.

---

### 👁️ Verify This File
```bash
sha256sum LICENSE.md   # compare to LICENSE.md.sha
ots verify LICENSE.md.ots
