import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface DriftEvent {
  id: string;
  timestamp: string;
  expectedHash: string;
  actualHash: string;
  delta: string;
}

export function DriftTimeline({ events }: { events: DriftEvent[] }) {
  return (
    <Card className="bg-zinc-950 border-red-900/50">
      <CardHeader>
        <CardTitle className="text-red-500 font-mono text-sm uppercase tracking-widest">
          Version Drift Control
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-emerald-500 font-mono text-xs uppercase tracking-widest text-center py-4">
            No drift detected. Runtime is canonical.
          </div>
        ) : (
          <div className="space-y-4">
            {events.map(e => (
              <div key={e.id} className="p-3 border border-red-900/30 bg-red-950/10 font-mono text-xs">
                <div className="flex justify-between text-red-400 font-bold mb-2">
                  <span>Drift Detected</span>
                  <span>{e.timestamp}</span>
                </div>
                <div className="space-y-1">
                  <div className="grid grid-cols-12 gap-2">
                    <span className="col-span-3 text-zinc-500">Expected:</span>
                    <span className="col-span-9 text-zinc-300 truncate">{e.expectedHash}</span>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <span className="col-span-3 text-zinc-500">Actual:</span>
                    <span className="col-span-9 text-red-300 truncate">{e.actualHash}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
