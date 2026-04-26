export interface ProvenanceRecord {
  hash: string;
  previousHash: string;
  timestamp: string;
  payloadHash: string;
}

export class ProvenanceLedger {
  private ledger: ProvenanceRecord[] = [];

  public append(payloadHash: string): ProvenanceRecord {
    const previousHash = this.ledger.length > 0 ? this.ledger[this.ledger.length - 1].hash : 'GENESIS';
    const timestamp = new Date().toISOString();

    // Simple deterministic hash function for demonstration
    const contentToHash = `${previousHash}:${timestamp}:${payloadHash}`;
    const hash = this.simpleHash(contentToHash);

    const record: ProvenanceRecord = {
      hash,
      previousHash,
      timestamp,
      payloadHash
    };

    this.ledger.push(record);
    return record;
  }

  public verifyChain(): boolean {
    if (this.ledger.length <= 1) return true;

    for (let i = 1; i < this.ledger.length; i++) {
      const current = this.ledger[i];
      const previous = this.ledger[i - 1];

      if (current.previousHash !== previous.hash) {
        console.error(`[PROVENANCE] Chain broken at index ${i}. Previous hash mismatch.`);
        return false;
      }

      const expectedHash = this.simpleHash(`${current.previousHash}:${current.timestamp}:${current.payloadHash}`);
      if (current.hash !== expectedHash) {
        console.error(`[PROVENANCE] Chain broken at index ${i}. Hash invalid.`);
        return false;
      }
    }
    return true;
  }

  public getHistory(): ProvenanceRecord[] {
    return [...this.ledger];
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return `0x${Math.abs(hash).toString(16).padStart(64, '0')}`;
  }
}
