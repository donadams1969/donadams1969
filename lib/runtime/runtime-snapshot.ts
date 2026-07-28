import { RuntimeSnapshot, TraceContext, RuntimeReason, RuntimeMetrics, RuntimeSnapshotSchema } from '../../contracts/schemas';
import { VerificationEngine } from './verification';

export class SnapshotManager {
  private snapshots: Map<string, RuntimeSnapshot> = new Map();
  private verifier = new VerificationEngine();

  public createSnapshot(
    trace: TraceContext,
    metrics: RuntimeMetrics,
    accessibilityMode: string,
    reasons: RuntimeReason[]
  ): RuntimeSnapshot | null {

    // Strict Verification Rule: No verification -> no snapshot
    const metricsVerification = this.verifier.verifyMetricsInvariant(metrics);
    if (!metricsVerification.verified) {
        console.error(`[SNAPSHOT_REJECTED] Invariant breach detected for trace ${trace.traceId}. No snapshot generated.`);
        return null;
    }

    let decision: "allow" | "deny" | "hold" = "allow";

    const hasDenial = reasons.some(r => r.rationale.toLowerCase().includes('failed') || r.rationale.toLowerCase().includes('denied'));
    if (hasDenial) {
      decision = "deny";
    }

    const rawSnapshot = {
      traceId: trace.traceId,
      decision,
      metrics,
      accessibilityMode,
      observedAt: new Date().toISOString(),
      reasons
    };

    // Strict Verification Rule: Zod Schema enforcement at runtime
    const parsed = RuntimeSnapshotSchema.safeParse(rawSnapshot);

    if (!parsed.success) {
      console.error(`[SNAPSHOT_REJECTED] Schema validation failed for trace ${trace.traceId}: ${parsed.error.message}`);
      return null;
    }

    this.snapshots.set(trace.traceId, parsed.data);
    return parsed.data;
  }

  public getSnapshot(traceId: string): RuntimeSnapshot | undefined {
    return this.snapshots.get(traceId);
  }

  public getAllSnapshots(): RuntimeSnapshot[] {
    return Array.from(this.snapshots.values());
  }
}
