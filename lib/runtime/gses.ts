import { ReleasePermission, GSESExport } from '../../contracts/gses';
import { VerdictSnapshot } from '../schemas/verdict';

export class GovernedReleaseMachine {

  public evaluateReleaseClearance(snapshot: VerdictSnapshot): ReleasePermission {
    const isSealed = snapshot.metrics.systemState === 'VERDICT_SEALED';
    const isSaturated = snapshot.metrics.receiptsGenerated >= snapshot.metrics.totalFragments;

    if (!isSealed || !isSaturated) {
      return {
        canSerialize: false,
        canTransport: false,
        canRelease: false,
        reason: "Continuity not fully sealed. Rendered state is not exportable."
      };
    }

    return {
      canSerialize: true,
      canTransport: true,
      canRelease: true,
      reason: "Verdict sealed. Export clearance granted."
    };
  }

  public serializeForExport(snapshot: VerdictSnapshot, permission: ReleasePermission): GSESExport | null {
    if (!permission.canSerialize || !permission.canRelease) {
      return null;
    }

    const payloadString = JSON.stringify(snapshot);
    const payloadHash = this.simpleHash(payloadString);

    return {
      payloadHash,
      serializedData: Buffer.from(payloadString).toString('base64'),
      transportSignature: this.simpleHash(payloadHash + Date.now().toString()),
      releaseClearance: true,
      timestamp: new Date().toISOString()
    };
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

export const GSES = new GovernedReleaseMachine();
