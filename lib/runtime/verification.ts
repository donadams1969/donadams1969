import { RuntimeEvidence } from '../../contracts/evidence';
import { RuntimeMetrics } from '../../contracts/schemas';

export interface VerificationResult {
  verified: boolean;
  score: number;
  violations: string[];
}

export class VerificationEngine {

  public verifyMetricsInvariant(metrics: RuntimeMetrics): VerificationResult {
    const violations: string[] = [];

    // Example Invariant: errorResolution cannot exceed totalErrors
    if (metrics.errorResolution > metrics.totalErrors) {
      violations.push(`Invariant breach: errorResolution (${metrics.errorResolution}) > totalErrors (${metrics.totalErrors})`);
    }

    // Example Invariant: Saturation must be bounded
    if (metrics.logicSaturation < 0 || metrics.logicSaturation > 100) {
      violations.push(`Invariant breach: logicSaturation (${metrics.logicSaturation}) out of bounds`);
    }

    const verified = violations.length === 0;
    const score = verified ? 100 : Math.max(0, 100 - (violations.length * 20));

    return { verified, score, violations };
  }

  public verifyReplayConsistency(originalEvidence: RuntimeEvidence, replayedEvidence: RuntimeEvidence): boolean {
    // A true system would compare deterministic hashes here
    return originalEvidence.id === replayedEvidence.id &&
           JSON.stringify(originalEvidence.payload) === JSON.stringify(replayedEvidence.payload);
  }

  public verifyEvidenceChain(chain: RuntimeEvidence[]): boolean {
    if (chain.length === 0) return true;

    // Ensure all timestamps are strictly monotonically increasing
    for (let i = 1; i < chain.length; i++) {
      const prev = new Date(chain[i-1].timestamp).getTime();
      const curr = new Date(chain[i].timestamp).getTime();
      if (curr < prev) {
        console.error(`Verification Failed: Time drift detected at evidence ${chain[i].id}`);
        return false;
      }
    }
    return true;
  }
}
