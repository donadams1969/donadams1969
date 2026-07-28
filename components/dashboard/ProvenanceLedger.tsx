import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TelemetrySnapshot } from '@/lib/telemetry/runtime';

export function ProvenanceLedger({ snapshots }: { snapshots: TelemetrySnapshot[] }) {
  return (
    <Card className="bg-zinc-950 border-emerald-900/50">
      <CardHeader>
        <CardTitle className="text-emerald-500 font-mono text-sm uppercase tracking-widest">
          Provenance Ledger
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {snapshots.map(s => (
            <div key={s.snapshotId} className="flex flex-col font-mono text-xs border-l-2 border-emerald-600 pl-3">
              <div className="flex justify-between text-emerald-300">
                <span className="font-bold">{s.snapshotId}</span>
                <span>Confidence: {s.confidence}</span>
              </div>
              <div className="text-[10px] text-zinc-500 mt-1">
                Merkle Root: <span className="text-zinc-400 truncate">{s.merkleRoot}</span>
              </div>
              <div className="text-[10px] text-zinc-500">
                Identity Hash: <span className="text-zinc-400 truncate">{s.provenance.identityHash}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
