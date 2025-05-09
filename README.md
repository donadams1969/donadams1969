
---

## `SECURITY.md`

# 🛡️ Security Policy & Responsible Disclosure
![PGP Verified](https://img.shields.io/badge/PGP-Fingerprint-yellow?style=for-the-badge)
![DID Linked](https://img.shields.io/badge/DID-Registered-blueviolet?style=for-the-badge)
![Bug Bounty](https://img.shields.io/badge/Bounty-Active-orange?style=for-the-badge)

VALORCHAIN treats every commit as potential courtroom evidence.  
Help us keep the chain unbreakable 🛠️🔗.

---

## 1. Contact
| Channel | Purpose | Address/Fingerprint |
|---------|---------|---------------------|
| **Email** | General & low-risk | `security@18fu.ai` |
| **PGP** | Sensitive payloads | `0xA1B2 C3D4 E5F6 7890 1234 5678 9ABC DEF0 1234 5678` |
| **DIDComm** | Encrypted JSON over HTTP | `did:key:z6MkQk…` |

## 2. Supported Versions
| Branch | Status | Critical Patches |
|--------|--------|------------------|
| `main` | ✅ Supported | 48 hours SLA |
| All others | ❌ | – |

## 3. Reporting a Vulnerability
1. **Encrypt** proof-of-concept with the PGP key above.  
2. Email subject: `VALORCHAIN SEC-DISCLOSURE <YYYY-MM-DD>`.  
3. Expect human reply ≤ 72 hrs; patch within ≤ 14 days for criticals.  

## 4. Anchoring Policy
Every merge to `main` triggers:
