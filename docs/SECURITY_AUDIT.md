<!-- docs/SECURITY_AUDIT.md -->
<!-- Replace donadams1969/valor-ai and ensure the banner SVGs exist under /assets (see section 3) -->

<!-- Responsive dark/light banner -->
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../assets/valorai-banner-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="../assets/valorai-banner-light.svg">
  <img alt="ValorAi+ — Security & Compliance" src="../assets/valorai-banner-light.svg" width="100%">
</picture>

<p align="center">
  <img alt="ValorAi+ Audit" src="https://img.shields.io/badge/ValorAi%2B-Audit-6f42c1?logo=github&logoColor=white">
  <img alt="JULE READY" src="https://img.shields.io/badge/JULE%E2%80%91READY-LOCKED%E2%80%94GREEN-2ea043?logo=dependabot&logoColor=white">
  <a href="https://github.com/donadams1969/valor-ai/actions/workflows/jule-ready.yml"><img alt="jule-ready" src="https://github.com/donadams1969/valor-ai/actions/workflows/jule-ready.yml/badge.svg?branch=main"></a>
  <a href="https://github.com/donadams1969/valor-ai/actions/workflows/math-receipts.yml"><img alt="AMath++ receipts" src="https://github.com/donadams1969/valor-ai/actions/workflows/math-receipts.yml/badge.svg?branch=main"></a>
  <a href="https://github.com/donadams1969/valor-ai/actions/workflows/claim-guard.yml"><img alt="claim-guard" src="https://github.com/donadams1969/valor-ai/actions/workflows/claim-guard.yml/badge.svg?branch=main"></a>
  <a href="https://github.com/donadams1969/valor-ai/actions/workflows/release-attest.yml"><img alt="release-attest" src="https://github.com/donadams1969/valor-ai/actions/workflows/release-attest.yml/badge.svg"></a>
  <a href="https://github.com/donadams1969/valor-ai/actions/workflows/manifest-repair.yml"><img alt="manifest-repair" src="https://github.com/donadams1969/valor-ai/actions/workflows/manifest-repair.yml/badge.svg"></a>
  <img alt="Cosign" src="https://img.shields.io/badge/Cosign-keyless-0ea5e9">
  <img alt="SLSA" src="https://img.shields.io/badge/SLSA-v1_provenance-0f766e">
  <img alt="in-toto" src="https://img.shields.io/badge/in--toto-attestations-1e293b">
  <img alt="SBOM" src="https://img.shields.io/badge/SBOM-CycloneDX-3b82f6">
  <img alt="NIST 800-53" src="https://img.shields.io/badge/NIST%20800--53-Mapped-111827">
  <img alt="ASVS" src="https://img.shields.io/badge/OWASP%20ASVS-L2%2FL3-7c3aed">
  <img alt="HIPAA" src="https://img.shields.io/badge/HIPAA-Security_Rule-f59e0b">
  <img alt="FERPA" src="https://img.shields.io/badge/FERPA-Controls-ef4444">
  <img alt="SOC2" src="https://img.shields.io/badge/SOC%202-TSC-64748b">
  <img alt="CIS v8.1" src="https://img.shields.io/badge/CIS-v8.1-22c55e">
</p>

<h1 align="center">🛡️ ValorAi+ Security & Compliance Audit (JULE-READY)</h1>
<p align="center"><em>Automation-first evidence, cryptographic receipts, SLSA v1 provenance, and policy-as-code gates.</em></p>

> [!NOTE]
> Replace `donadams1969/valor-ai` in badge links. If the banner is missing, add the SVGs from the “assets” section below.

---

## 🔗 Quick links
- 🧪 CI Evidence: [jule-ready.yml](../.github/workflows/jule-ready.yml) · [math-receipts.yml](../.github/workflows/math-receipts.yml) · [claim-guard.yml](../.github/workflows/claim-guard.yml) · [release-attest.yml](../.github/workflows/release-attest.yml)
- 🧾 Manifest integrity: [manifest-repair.yml](../.github/workflows/manifest-repair.yml) · `MANIFEST_SHA256.txt` (repo root)
- 📦 Supply chain: `provenance/*.intoto.jsonl` (SLSA v1) · `sbom/*.cdx.json` (CycloneDX)
- 📜 Policies: NIST 800-53, OWASP ASVS, HIPAA, FERPA, SOC 2, CIS v8.1
- 🧰 Verifying evidence? Jump to **Verification playbook** ↓

---

## 📑 Table of contents
- 🚀 Executive summary
- 🧭 Scope & method
- 🧩 System inventory
- 🔐 Security assessment
- 🧪 Application security (ASVS)
- 🧾 Data integrity & manifests
- 🔗 Supply chain attestations
- 🧯 Compliance posture
- 🛡️ Hardening priorities
- 🛠️ CI/CD & automation
- ⚠️ Risk register (top)
- 🗺️ Control mapping snapshot
- ✅ Immediate actions
- 📥 Evidence requests
- 🧪 Verification playbook
- 🧠 Conclusion
- 🏷️ Status panel
- 🧾 Audit metadata

---

## 🚀 Executive summary
ValorAi+ integrates cryptographic integrity tooling, sovereignty/chain anchoring, and modular security frameworks across AI, data, and deployment, now extended with SLSA v1 provenance and keyless signing for stronger supply‑chain assurance.
Targets map to **NIST SP 800‑53** control families, **OWASP ASVS** levels, **HIPAA** Security Rule, **FERPA**, **SOC 2 TSC**, and **CIS Controls v8.1** for comprehensive governance.

> [!IMPORTANT]
> **JULE‑READY** is a required status check; PRs cannot merge if the manifest, SBOM, or provenance drift from expectations.

---

## 🧭 Scope & method
- Primary catalog: **NIST SP 800‑53 Rev.5** families & baselines.
- AppSec verification: **OWASP ASVS** level selection per sensitivity/criticality.
- Regulatory overlays: **HIPAA** (ePHI), **FERPA** (education records), **SOC 2**, **CIS v8.1**.

---

## 🧩 System inventory
- Core: AI services + blockchain sovereignty & verification.
- Integrity toolchain: **SHA‑256/512, SHA‑3, Merkle roots, JSON receipts/manifests**.
- Sovereignty & **SGAU 7226.3461** on‑chain anchoring for tamper‑evidence.
- ValorMath+ “Hyper‑Docs Universe” (self‑healing docs).
- Token stack with **GILLGOLD** reserve.
- CI/CD gating for integrity, reproducible releases, and evidence retention.
- **Valor Manifest** hardening + crypto enhancements.

<details>
  <summary>📎 Evidence locations (expand)</summary>

- Manifests: `MANIFEST_SHA256.txt` + `.sig`
- Math receipts: `amath-receipts/*`
- SBOMs (CycloneDX): `sbom/*.cdx.json`
- SLSA provenance: `provenance/*.intoto.jsonl`
- Cosign bundles: `artifacts/*.cosign.(pem|sig)`
- CI logs: GitHub Actions → specific run → “Artifacts” and “Logs”
</details>

---

## 🔐 Security assessment
- Govern controls across **AC, AU, CM, IA, IR, RA, SC, SI** (NIST).
- Prioritize **AC/IA** for AI↔chain paths and administrative surfaces.
- Strengthen **SI/SC** for builds, configs, and artifact integrity.
- Enforce **CM/CA/RA** via CI/CD gates and machine‑verifiable evidence.

---

## 🧪 Application security (ASVS)
- Adopt **OWASP ASVS**; target **L2** for sensitive services; **L3** for chain, key custody, and safety‑critical modules.
- Cover authN/Z, crypto usage, supply‑chain integrity, secrets hygiene, logging/monitoring, and error handling.

---

## 🧾 Data integrity & manifests
- Deterministic supply‑chain verification via manifests and receipts.
- Extend coverage to **inputs, training snapshots, lockfiles, SBOMs**, and config state; record verification in CI.
- Maintain tamper‑evident logs linking manifests → on‑chain proofs.

---

## 🔗 Supply chain attestations
- Produce and verify **SLSA v1 provenance** to prove what built each artifact and with which parameters.
- Use **Cosign keyless** to bind CI OIDC identity to signatures stored with transparency logs.
- Publish **CycloneDX** SBOMs for dependency/provenance analysis and license/compliance workflows.

---

## 🧯 Compliance posture
- **HIPAA**: admin/technical/physical safeguards; risk analysis and ongoing risk management.
- **FERPA**: PII protection; consent, de‑identification, and disclosure controls.
- **SOC 2**: Security (+ Availability, Confidentiality, Processing Integrity, Privacy) scoped to services and commitments.

---

## 🛡️ Hardening priorities
- Close gaps in **AC, IA, CM, RA, IR, SC, SI** with control‑to‑evidence mapping.
- Set **ASVS L2/L3** objectives per component; schedule verification and treat findings as release blockers.
- Apply **CIS v8.1**: asset inventory, vuln mgmt, logging/monitoring, access mgmt, secure configuration.

---

## 🛠️ CI/CD & automation
- Integrity checks are **mandatory**; store attestations as artifacts & link to release tags.
- Publish **hashes, Merkle roots, SBOMs, SLSA provenance, signatures** per build.
- Use **policy‑as‑code** (OPA/Rego, rulesets) for provenance, dependency policies, and secret scanning.

---

## ⚠️ Risk register (top)
| Risk | Severity | Mitigation |
|---|---|---|
| Key/secret management (AI, manifests, chain) | ![High](https://img.shields.io/badge/Severity-High-red) | HSM/secure enclave; rotation; scoped tokens |
| Supply chain (deps, models, data) | ![High](https://img.shields.io/badge/Severity-High-red) | SBOM; provenance; reproducible builds; pinning |
| Privileged automation/runners | ![Med](https://img.shields.io/badge/Severity-Med-orange) | Least privilege; rulesets; audit trails |
| Data classification (ePHI/education) | ![High](https://img.shields.io/badge/Severity-High-red) | DLP; access logging; de‑identification; consent |

---

## 🗺️ Control mapping snapshot
> Minimal starter — link each row to real evidence (receipts, SBOMs, logs).

| Domain | Standard/Control | Implementation (short) | Evidence (link) | Status |
|---|---|---|---|---|
| Access Control | NIST AC‑2/AC‑6 | Least‑privileged runners; branch protection | `/.github/workflows/jule-ready.yml` | 🟢 |
| Identity & Auth | NIST IA‑2 | OIDC keyless Cosign; workflow identity pin | `artifacts/*.cosign.(pem|sig)` | 🟢 |
| Config Mgmt | NIST CM‑2 | Signed manifest; repair job | `MANIFEST_SHA256.txt(.sig)` | 🟢 |
| System Integrity | NIST SI‑7 | AMath++ receipts; Ed25519 sig | `amath-receipts/*` | 🟢 |
| Monitoring | NIST AU/CA | Evidence artifacts retained; logs | Actions run logs | 🟡 |
| AppSec | OWASP ASVS L2/L3 | AuthZ/N, crypto, deps policy | Test plan + results | 🟡 |
| HIPAA Safeguards | 164.308/.310/.312 | Policy, risk analysis, audit controls | HIPAA RA doc set | 🟡 |
| FERPA | Consent/PII | Consent workflows, de‑ID | FERPA SOPs | 🟡 |
| SOC 2 | Security/TSC | Logging, change mgmt, availability | Control matrix | 🟡 |
| CIS v8.1 | Safeguards | Inventory, vuln mgmt, hardening | CIS worksheet | 🟡 |
| SLSA v1 | Provenance | intoto JSONL provenance; verify | `provenance/*` | 🟢 |
| SBOM | CycloneDX | Component inventory, licenses | `sbom/*.cdx.json` | 🟢 |

Legend: 🟢 in place · 🟡 in progress · 🔴 gap

---

## ✅ Immediate actions
- Control→evidence mapping with owners & review cadence.
- Define **ASVS** targets per service; treat findings as **release blockers**.
- Run **HIPAA** risk analysis; formalize **FERPA** consent & de‑ID.
- Adopt **CIS v8.1** governance updates (align to NIST CSF 2.0).

---

## 📥 Evidence requests
- Diagrams, threat models, data flows (AI, manifests, chain anchoring).
- CI/CD logs, artifacts, **SBOMs, provenance, signature bundles, verification receipts**.
- Policies/procedures/training for access control, IR, SSDLC.
- HIPAA/FERPA risk analyses, data classification matrices, consent/de‑ID records.

<details>
  <summary>🧠 Threat model quick template</summary>

- Assets: {models, data snapshots, manifests, sboms, provenance, keys}
- Trust zones: {dev, CI runners, artifact registry, chain anchoring}
- Entry points: {PRs, CI jobs, release promotion, API endpoints}
- Abuse cases: {artifact swap, provenance spoofing, SBOM drift, secret exfil}
- Controls: {branch rules, OIDC keyless, SLSA v1 verify, DLP, rate limits}
- Residual risks: {3rd‑party deps, opaque model weights, human error}
</details>

---

## 🧪 Verification playbook
```
# 1) Verify manifest content vs repo tree (mirrors jule-ready)
python tools/manifest/verify_manifest.py

# 2) Verify manifest signature (Ed25519)
python tools/ed25519_sign.py verify \
  --pub keys/public.key \
  --file MANIFEST_SHA256.txt \
  --sig  MANIFEST_SHA256.txt.sig

# 3) Verify math receipt from latest CI (AMath++)
python tools/ed25519_sign.py verify \
  --pub keys/public.key \
  --file amath-receipts/math_receipt.json \
  --sig  amath-receipts/math_receipt.json.sig

# 4) Verify keyless Cosign identity for any signed blob
cosign verify-blob target.json \
  --certificate target.json.cosign.pem \
  --signature   target.json.cosign.sig \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  --certificate-identity-regexp '^https://github.com/donadams1969/valor-ai/.github/workflows/(math-receipts|manifest-repair|release-attest)\.yml@.*$'

# 5) Verify SLSA v1 provenance (install slsa-verifier)
slsa-verifier verify-artifact ./dist/artifact.tgz \
  --provenance-path ./provenance/artifact.intoto.jsonl \
  --source-uri github.com/donadams1969/valor-ai \
  --source-tag vX.Y.Z

# 6) Validate CycloneDX SBOM and basic sanity checks
cyclonedx validate --input sbom/app.cdx.json --input-format json
jq -r '.components[].version' sbom/app.cdx.json | sort -u

# 7) (Optional) Verify RFC3161/OpenTimestamps tokens alongside signatures
# rfc3161-client verify --hash <sha256> --tsa <tsa-url> --token <file.tsr>
# ots verify <file.ots> <target>
```

> [!TIP]
> Keep provenance and SBOMs tied to immutable release tags, and verify that inputs/parameters in SLSA predicates match expected source URIs, tags, and builder identities.

---

## 🧠 Conclusion
Strong cryptographic integrity, sovereignty anchoring, and automation‑centric controls are in place; tying them explicitly to **NIST/ASVS/HIPAA/FERPA/SOC2/CIS** and enforcing **SLSA v1 + keyless Cosign + CycloneDX** elevates evidence to auditable, repeatable compliance.

---

## 🏷️ Status panel
- 🔒 **JULE‑READY**: **ENFORCED** via `jule-ready.yml` ✓
- 🧮 **AMath++ Receipts**: `math-receipts.yml` ✓
- 🧾 **Manifest Signed**: `manifest-repair.yml` ✓
- 📦 **Release Attestation (SLSA)**: `release-attest.yml` ✓
- 🧰 **Claim‑Guard** (evidence policy): `claim-guard.yml` ✓

---

## 🧾 Audit metadata
> Update these fields when publishing a release audit.

- **Audit version**: `v1.0.0`
- **Commit**: `<git sha>`
- **ISO time**: `<YYYY-MM-DDThh:mm:ssZ>`
- **SIGNATURE (Ed25519)**: `<base64>`
- **Cosign cert (optional)**: `artifacts/<file>.cosign.pem`
- **Receipt hash (sha256)**: `<hex>`
- **Provenance digest (sha256)**: `<hex>`
- **SBOM hash (sha256)**: `<hex>`
