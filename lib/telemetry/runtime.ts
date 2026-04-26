import { Rev34Identity } from '../rev34/core';
import { MerkleTree } from '../rev34/merkle';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'DEGRADED';

export interface TelemetrySnapshot {
  snapshotId: string;
  timestamp: string;
  metrics: Record<string, number>;
  confidence: ConfidenceLevel;
  provenance: Rev34Identity;
  merkleRoot: string;
}

export class TelemetryRuntime {
  private snapshots: TelemetrySnapshot[] = [];

  public emitSnapshot(metrics: Record<string, number>, provenance: Rev34Identity): TelemetrySnapshot {
    // Calculate simple confidence based on metric completeness
    const keys = Object.keys(metrics);
    const confidence: ConfidenceLevel = keys.length > 5 ? 'HIGH' : keys.length > 2 ? 'MEDIUM' : 'LOW';

    // Maintain Merkle continuity
    const previousLeaves = this.snapshots.map(s => s.snapshotId);
    const newSnapshotId = `SNAP-${Date.now()}`;
    const newRoot = MerkleTree.generateRoot([...previousLeaves, newSnapshotId]);

    const snapshot: TelemetrySnapshot = {
      snapshotId: newSnapshotId,
      timestamp: new Date().toISOString(),
      metrics,
      confidence,
      provenance,
      merkleRoot: newRoot
    };

    this.snapshots.push(snapshot);
    return snapshot;
  }

  public getHistory(): TelemetrySnapshot[] {
    return [...this.snapshots];
  }
}
