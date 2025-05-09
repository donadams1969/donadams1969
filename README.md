# 🪪 Decentralized Identifier (DID) Record
![W3C DID](https://img.shields.io/badge/W3C-DID-blue?style=for-the-badge)
![Verifiable Credentials](https://img.shields.io/badge/VC-Ready-brightgreen?style=for-the-badge)

This repo’s cryptographic identity is expressed via a **did:key** document.  
Import it into any DID wallet to verify signatures or encrypt messages.

---

```jsonc
{
  "@context": "https://w3.org/ns/did/v1",
  "id": "did:key:z6MkQkLkF8N6wx8Kq8u8E9bVSPmqHqpzkU1VY4a9Yy3TjVfj",
  "controller": "did:key:z6MkQkLkF8N6wx8Kq8u8E9bVSPmqHqpzkU1VY4a9Yy3TjVfj",
  "verificationMethod": [{
    "id": "did:key:z6Mk…#z6Mk…",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:key:z6Mk…",
    "publicKeyMultibase": "z6MkqRY…"
  }],
  "authentication": ["did:key:z6Mk…#z6Mk…"],
  "assertionMethod": ["did:key:z6Mk…#z6Mk…"],
  "capabilityInvocation": ["did:key:z6Mk…#z6Mk…"]
}

```
