#!/usr/bin/env ts-node

import { Rev34Core } from '../lib/rev34/core';
import { PrivacyLayer } from '../lib/rev34/privacy';
import { MerkleTree } from '../lib/rev34/merkle';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.log(`
REV_34 Deterministic Verifier CLI
Usage:
  rev34-cli canonicalize <file.json>
  rev34-cli verify-manifest <manifest.json>
  rev34-cli generate-export <audit_log.json>
  rev34-cli redact <file.json>
    `);
    process.exit(1);
  }

  const filePath = args[1];
  if (!filePath || !fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(filePath, 'utf-8');
  let data: any;

  try {
    data = JSON.parse(rawData);
  } catch (e) {
    console.error('Invalid JSON file');
    process.exit(1);
  }

  switch (command) {
    case 'canonicalize':
      console.log(Rev34Core.canonicalize(data));
      break;

    case 'verify-manifest':
      const hash = await Rev34Core.generateIdentityHash(data.provenance);
      if (hash === data.identityHash && Rev34Core.verifyEd25519Signature(hash, data.signature, 'mock_pub_key')) {
        console.log('[OK] REV_34 Manifest Verified');
      } else {
        console.error('[FAIL] Manifest verification failed');
      }
      break;

    case 'redact':
      const redacted = PrivacyLayer.redactPII(data);
      console.log(JSON.stringify(redacted, null, 2));
      break;

    case 'generate-export':
      // Assumes data is an array of receipts
      const leaves = (data as any[]).map(r => r.receiptHash);
      const root = MerkleTree.generateRoot(leaves);

      const exportPayload = {
        exportId: `EXP-${Date.now()}`,
        merkleRoot: root,
        events: data.map(r => ({ eventId: r.signalId, receiptHash: r.receiptHash, redacted: true })),
        signature: 'mock_export_signature'
      };

      console.log(JSON.stringify(exportPayload, null, 2));
      break;

    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
}

main().catch(console.error);
