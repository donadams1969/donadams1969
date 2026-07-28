import { AttestedPayload, SOVEREIGN_CLUSTER } from '../../contracts/ppr';

export class PersistentProvenanceRuntime {

  public generateAttestedPayload(payloadHash: string, governanceState: string): AttestedPayload {
    const timestamp = new Date().toISOString();

    const clusterStateHash = this.simpleHash(SOVEREIGN_CLUSTER.join(',') + timestamp);
    const btcLatch = `BTC-${this.simpleHash(clusterStateHash).slice(0, 16)}`;

    return {
      id: `PPR-${Date.now()}`,
      provenanceIdentity: "donnygillson.eth",
      clusterStateHash,
      btcLatch,
      nodeLocation: "SAINT PAUL NODE 55116",
      governanceState,
      merkleLineage: this.simpleHash(payloadHash + btcLatch),
      payloadHash,
      timestamp
    };
  }

  public verifyContinuity(attested: AttestedPayload, currentPayloadHash: string): boolean {
    return attested.payloadHash === currentPayloadHash;
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

export const PPR = new PersistentProvenanceRuntime();
