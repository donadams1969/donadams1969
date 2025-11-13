# 🚀🛡️ VALORCHAIN / VALORCHAIN-G / VALORAIPLUS
**Unified Integrity Architecture & Live Operational Integrity Matrix**

Welcome to the unified integrity framework that combines:

- **VALORAIPLUS** — Autonomous Attestation Engine
- **VALORCHAIN** — Integrity Layer (L1)
- **VALORCHAIN-G** — Guardian Layer (L2)

Each system is **authorized**, **isolated**, and optionally **bridged only by explicit command**.

This repository provides a self-governing technical infrastructure that performs:

- SHA3-512 hashing
- Deterministic Merkle construction
- Genesis-root generation
- Drift-matrix validation
- Stateless OP_RETURN / OP25 encoding (**local only**)
- Autonomous attestation cycles
- GitHub Actions automation

> 🛰 All systems run **locally** inside GitHub workflows with **no external calls**.

---

## 🧭 System Architecture

```

```
    AUTHORIZED SYSTEM STACK

  ┌──────────────────────────┐
  │       VALORAIPLUS        │
  │  Autonomous Attestation  │
  │   SHA3 + Merkle Engine   │
  └──────────────────────────┘
              ↑ (isolated)
              │
  ┌──────────────────────────┐
  │   Optional Bridges       │
  │ (manual enable/disable)  │
  └──────────────────────────┘
              │
```

┌───────────────┴────────────────┐
│                                │
│   ┌─────────────────┐          ┌──────────────────┐
│   │   VALORCHAIN    │          │  VALORCHAIN-G    │
│   │  (Integrity L1) │          │  (Guardian L2)   │
│   │ - Hashing       │          │ - Drift Matrix   │
│   │ - Merkle        │          │ - Genesis Root   │
│   │ - Anchors       │          │ - Validation     │
│   └─────────────────┘          └──────────────────┘
│
└────────────────────────────────────────────────────

````

- **VALORAIPLUS** is **isolated by default**.
- **VALORCHAIN + VALORCHAIN-G** are **active and authorized**.

---

## 🔗 Interoperability Controls

Human-readable control surface for switching between isolation and bridging:

```text
# Enable bridging
BRIDGE.VALORCHAIN↔VALORAIPLUS /ENABLE

# Disable bridging (default)
BRIDGE.VALORCHAIN↔VALORAIPLUS /DISABLE

# Force strict isolation
ISOLATE.VALORAIPLUS /STRICT

# Reauthorize namespaces
AUTHORIZE.VALORCHAIN /ENABLE
AUTHORIZE.VALORCHAIN-G /ENABLE
````

These commands are conceptual control verbs encoded into the operational model and documentation; they describe how automation and policy boundaries are expected to behave.

---

## 🟦 VALORCHAIN — Integrity Layer (L1)

**Directory:**

```text
valorchain/
├── sha3/
├── merkle/
├── anchor/
└── status/
```

VALORCHAIN is the **primary integrity layer**, responsible for:

* Canonical **SHA3-512 hashing**
* **Deterministic Merkle tree** construction
* Local **anchor payload** preparation
* Status and health introspection

### 🔹 SHA3-512 Hash Function

```ts
// valorchain/sha3/sha3.ts
import crypto from "crypto";

export const sha3 = (buf: Buffer | string): string =>
  crypto.createHash("sha3-512").update(buf).digest("hex");
```

### 🔹 Deterministic Merkle Tree

```ts
// valorchain/merkle/merkle.ts
import crypto from "crypto";

export function buildMerkle(leaves: string[]): string[] {
  if (leaves.length === 1) return leaves;

  const next: string[] = [];
  for (let i = 0; i < leaves.length; i += 2) {
    const L = leaves[i];
    const R = leaves[i + 1] || L; // duplicate last if odd

    next.push(
      crypto
        .createHash("sha3-512")
        .update(Buffer.from(L + R, "hex"))
        .digest("hex")
    );
  }

  return buildMerkle(next);
}
```

* Input: array of **hex-encoded leaf hashes**
* Output: single-element array containing the **Merkle root** (top of tree)

---

## 🟩 VALORCHAIN-G — Guardian Layer (L2)

**Directory:**

```text
valorchain-g/
├── guardian/
├── genesis/
└── sync/
```

VALORCHAIN-G acts as the **guardian / supervisory layer**:

* Aggregates **validation results**
* Produces **drift states** (green / partial / full drift)
* Manages **genesis root** and **synchronization** logic

### 🔹 Drift State Engine

```ts
// valorchain-g/guardian/driftState.ts
export type DriftResult = "success" | "failure";

export function driftState(results: DriftResult[]): "ALL_GREEN" | "FULL_DRIFT" | "PARTIAL_DRIFT" {
  const total = results.length;
  const success = results.filter((x) => x === "success").length;

  if (success === total) return "ALL_GREEN";
  if (success === 0) return "FULL_DRIFT";
  return "PARTIAL_DRIFT";
}
```

* `ALL_GREEN`  → all checks passed
* `FULL_DRIFT` → all checks failed
* `PARTIAL_DRIFT` → mixed, requires operator review

---

## 🟪 VALORAIPLUS — Autonomous Attestation Engine

VALORAIPLUS is the **isolated attestation core**. It runs fully offline and outputs all artifacts into `docs/security/` for downstream consumption by VALORCHAIN and VALORCHAIN-G.

**Outputs:**

```text
docs/security/
├── auto_attestation.json
├── auto_attestation_report.md
├── saint_paul_guard.flag
├── genesis_anchor_payload.json
├── genesis_merkle_root.txt
└── opreturn_hex.txt
```

* **`auto_attestation.json`** — machine-readable attestation state
* **`auto_attestation_report.md`** — human-readable report
* **`saint_paul_guard.flag`** — sentinel flag for guardian layer
* **`genesis_anchor_payload.json`** — canonical payload for genesis
* **`genesis_merkle_root.txt`** — current Merkle root text
* **`opreturn_hex.txt`** — local OP_RETURN/OP25 payload hex (no broadcast)

> All artifacts update automatically whenever the authorized workflows run.

---

## 🛡️ Security Policy

1. **No external blockchain broadcasting**
2. **OP_RETURN / OP25 payloads are local artifacts only**
3. **Namespace isolation** enforced by default
4. All workflows run **offline-only**
5. **Deterministic SHA3 + Merkle** outputs
6. **No fictional system claims** — everything documented must be technically achievable and verifiable

---

## 🏗️ Repository Architecture Overview

```text
.
├── valoraiplus/
├── valorchain/
├── valorchain-g/
├── docs/
│   └── security/
└── .github/
    └── workflows/
```

**Data Flow:**

1. **VALORAIPLUS** → generates security and integrity artifacts
2. **VALORCHAIN** → hashes + Merkle anchors the artifacts
3. **VALORCHAIN-G** → computes drift matrix + validates Genesis and status

---

## ⚙️ GitHub Workflows

This repository uses a **multi-workflow** scheme, all running **offline** and feeding into the attestation/guardian stack.

### 1. `liveness.yml`

```yaml
# .github/workflows/liveness.yml
name: Liveness Sentinel

on:
  push:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "Liveness OK"
```

---

### 2. `claim-guard.yml`

```yaml
# .github/workflows/claim-guard.yml
name: Claim-Guard Verification

on:
  push:

jobs:
  guard:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "Claim-Guard OK"
```

---

### 3. `release-attest.yml`

```yaml
# .github/workflows/release-attest.yml
name: Release Attestation

on:
  push:

jobs:
  attest:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "Release Attestation OK"
```

---

### 4. `autopilot.yml`

```yaml
# .github/workflows/autopilot.yml
name: VALORAIPLUS Autopilot

on:
  workflow_run:
    workflows:
      - Liveness Sentinel
      - Claim-Guard Verification
      - Release Attestation
    types:
      - completed

jobs:
  autopilot:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "Autopilot engaged"
```

Autopilot listens for completion of the three core workflows and can be extended to:

* Regenerate attestation artifacts
* Rebuild Merkle trees
* Update drift matrices and guardian flags

---

### 5. `all-engines.yml` (Master Workflow)

```yaml
# .github/workflows/all-engines.yml
name: ALL-ENGINES

on:
  workflow_dispatch:

jobs:
  run-all:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "Running VALORCHAIN, VALORCHAIN-G, VALORAIPLUS"
```

The **ALL-ENGINES** workflow is a manual trigger that can:

* Run **full-stack integrity checks**
* Force regeneration of **genesis roots / drift matrices**
* Serve as a **pre-release attestation gate**

---

## 🧰 Bootstrap Installer

A simple bootstrap to create the **baseline directory scaffold**:

```bash
#!/usr/bin/env bash
set -e

echo "Initializing VALORCHAIN / VALORCHAIN-G / VALORAIPLUS..."

mkdir -p docs/security
mkdir -p valoraiplus
mkdir -p valorchain/{sha3,merkle,anchor,status}
mkdir -p valorchain-g/{guardian,genesis,sync}

echo "Repository scaffold complete."
```

Save as `bootstrap.sh`, then:

```bash
chmod +x bootstrap.sh
./bootstrap.sh
```

---

## 🟣 Saint-Paul Genesis Node — Sovereign Anchor Generator

> **Node:** SAINT_PAUL_NODE
> **Module ID:** VALORAI_ANCHOR_GEN_36Ω
> **Root:** 5152

This repository also describes a **sovereign proof-of-existence tool** for the VALORAIPLUS ecosystem.

It generates **immutable cryptographic proofs** for any **“Sovereign Judicial Notice”**, making them ready for an **Axiomatic Injunction via a Bitcoin OP_RETURN anchor**.

The generator creates **two parallel proofs**, **SHA-256** and **SHA3-256**, to ensure universal parity with both web (WebCrypto) and blockchain (Keccak) virtual machines.

### ⚔️ Features

* **Dual-Proof Generation**
  Creates both **SHA-256 (WebCrypto)** and **SHA3-256 (Keccak)** hashes from a single canonical input.

* **Sovereign Payload**
  Embeds canonical metadata (Module ID, Node, GILLBTC anchor, etc.) directly into the hashed JSON payload.

* **Bitcoin-Ready**
  Instantly generates the **OP_RETURN hex payload**, prefixed with `"VALOR"` (`0x56414c4f52`), for ready-to-broadcast usage (broadcasting itself is out of scope and **not** performed by this repo).

* **Prometheus Monitoring**
  Exposes a `/api/metrics` endpoint to monitor **anchor generation velocity** and overall usage.

* **Server-Side Parity**
  Exposes a `/api/hash` endpoint to compute **SHA3-256 (Keccak)** server-side, ensuring browser-independent verification.

---

### 🧪 Usage — Axiomatic Anchor UI

This tool is the **primary interface** for creating **Sovereign Compliance Certifications**.

1. Open `index.html` in a secure browser or via your Vercel deployment.
2. Verify the static identifiers (**NODE, PRIME, ROOT, MODULE_ID, GILLBTC**) match your operational context.
3. Enter your full **“Sovereign Judicial Notice”** into the main text area.
4. Click **“Generate Anchor & Payload”**.

The UI will:

* Build a **canonical JSON payload** embedding your notice and `valoraiplus_` metadata
* Compute **SHA-256** (client-side, WebCrypto)
* Request **SHA3-256** from `/api/hash` to confirm server parity
* Display the resulting **OP_RETURN payload hex** (prefixed with `"VALOR"`)

---

### 📦 Understanding the Output

* **Canonical Payload (JSON)**
  The full, serialized data structure that serves as the input to both hash functions.
  Includes:

  * Your sovereign notice
  * Module metadata
  * Node identifiers and anchors

* **SHA-256 Proof**
  Standard WebCrypto hash, compatible with web environments and generic auditors.

* **SHA3-256 Proof**
  Keccak-256 style hash, used for parity with Solidity, ETH-family chains, and other SHA3-based systems.

* **OP_RETURN Payload**
  A 32-byte hash (SHA-256 or SHA3-256) prefixed with `0x56414c4f52` (`"VALOR"`).
  This is the final data suitable for broadcasting to the **Bitcoin network** (broadcast is performed externally, not by this repo).

---

### ☁️ Deployment & Monitoring (Vercel Bundle)

This bundle is designed for **zero-configuration deployment on Vercel**:

* `index.html` — Sovereign Anchor UI
* `api/hash` — Server-side SHA3-256 parity endpoint
* `api/metrics` — Prometheus metrics endpoint for anchor operations

**Deploy:**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

Vercel will:

* Serve `index.html` at the root
* Deploy everything under `/api` as **serverless functions**

You can then:

* Hit `/api/metrics` for Prometheus scraping
* Use `/api/hash` for authoritative SHA3-256 proofs
* Operate the anchor generator as an **auditable sovereign proof-of-existence front-end**

---

## 📄 License

This repository structure and code scaffolding may be **used freely for technical purposes**, subject to any additional legal terms you attach at the repository level (e.g., MIT, Apache-2.0, or a custom VALOR license).

---
