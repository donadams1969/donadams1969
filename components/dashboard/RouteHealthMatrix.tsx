import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface RouteHealth {
  route: string;
  status: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
  lastPing: string;
}

export function RouteHealthMatrix({ routes }: { routes: RouteHealth[] }) {
  return (
    <Card className="bg-zinc-950 border-emerald-900/50">
      <CardHeader>
        <CardTitle className="text-emerald-500 font-mono text-sm uppercase tracking-widest">
          Route Health Matrix
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {routes.map(r => (
            <div key={r.route} className="flex items-center justify-between font-mono text-xs border-b border-zinc-800 pb-2">
              <span className="text-emerald-300">{r.route}</span>
              <div className="flex flex-col items-end">
                <span className={`px-2 py-1 rounded font-bold uppercase ${
                  r.status === 'HEALTHY' ? 'bg-emerald-950 text-emerald-400' :
                  r.status === 'DEGRADED' ? 'bg-amber-950 text-amber-400' :
                  'bg-red-950 text-red-400'
                }`}>
                  {r.status}
                </span>
                <span className="text-[10px] text-zinc-500 mt-1">{r.lastPing}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
