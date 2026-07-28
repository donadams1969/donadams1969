import { RuntimeEvidence, RuntimeEvidenceBundle } from '../../contracts/evidence';
import { TraceContext, RuntimeMetrics, RuntimeReason } from '../../contracts/schemas';
import { MerkleTree } from '../rev34/merkle';
import { VerificationEngine } from './verification';

export class EvidenceBuilder {
  private evidenceChain: RuntimeEvidence[] = [];
  private verifier = new VerificationEngine();

  public recordEvent(
    type: RuntimeEvidence['type'],
    trace: TraceContext,
    payload: Record<string, unknown>
  ): RuntimeEvidence | null {
    const event: RuntimeEvidence = {
      id: `EV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      timestamp: new Date().toISOString(),
      trace,
      payload
    };

    // Strict Verification Rule: No verification -> no evidence
    const potentialChain = [...this.evidenceChain, event];
    if (!this.verifier.verifyEvidenceChain(potentialChain)) {
      console.error(`[EVIDENCE_REJECTED] Event ${event.id} failed verification chain rules.`);
      return null; // Refuse to emit unverified evidence
    }

    this.evidenceChain.push(event);
    return event;
  }

  public finalizeBundle(
    bundleId: string,
    finalMetrics: RuntimeMetrics,
    reasons: RuntimeReason[]
  ): RuntimeEvidenceBundle | null {

    // Strict Verification Rule: Metrics must be valid
    const metricsVerification = this.verifier.verifyMetricsInvariant(finalMetrics);
    if (!metricsVerification.verified) {
       console.error(`[BUNDLE_REJECTED] Metrics invariant failure: ${metricsVerification.violations.join(', ')}`);
       return null;
    }

    const leaves = this.evidenceChain.map(e => this.simpleHash(JSON.stringify(e)));
    const merkleRoot = leaves.length > 0 ? MerkleTree.generateRoot(leaves) : 'EMPTY_ROOT';

    return {
      bundleId,
      merkleRoot,
      evidence: [...this.evidenceChain],
      finalMetrics,
      reasons
    };
  }

  public getHistory(): RuntimeEvidence[] {
    return [...this.evidenceChain];
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return `0x${Math.abs(hash).toString(16)}`;
  }
}
