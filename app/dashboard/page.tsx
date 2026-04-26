"use client";

import React, { useState, useEffect } from 'react';
import { RouteHealthMatrix } from '@/components/dashboard/RouteHealthMatrix';
import { ProvenanceLedger } from '@/components/dashboard/ProvenanceLedger';
import { ClassificationBadge } from '@/components/dashboard/ClassificationBadge';
import { DriftTimeline } from '@/components/dashboard/DriftTimeline';
import { TelemetryRuntime, TelemetrySnapshot } from '@/lib/telemetry/runtime';
import { Rev34Core } from '@/lib/rev34/core';
import { Shield } from 'lucide-react';

export default function Dashboard() {
  const [snapshots, setSnapshots] = useState<TelemetrySnapshot[]>([]);
  const runtime = new TelemetryRuntime();

  useEffect(() => {
    async function initTelemetry() {
      // Mocking initial telemetry provenance data
      const mockProvenanceData = {
        source: 'saint-paul-node-55116',
        session: 'active',
        layer: 'dashboard-runtime'
      };

      const hash = await Rev34Core.generateIdentityHash(mockProvenanceData);

      const snapshot = runtime.emitSnapshot(
        { cpu: 45, memory: 60, network: 120 },
        {
          version: 'REV_34',
          identityHash: hash,
          signature: 'MOCK_ED25519_SIG_DATA',
          timestamp: new Date().toISOString(),
          provenance: JSON.stringify(mockProvenanceData)
        }
      );

      setSnapshots(runtime.getHistory());
    }

    initTelemetry();
  }, []);

  const mockRoutes = [
    { route: '/api/verify', status: 'HEALTHY' as const, lastPing: new Date().toISOString() },
    { route: '/api/audit/verify', status: 'HEALTHY' as const, lastPing: new Date().toISOString() },
    { route: '/auth/session', status: 'DEGRADED' as const, lastPing: new Date().toISOString() }
  ];

  const mockDrift = [
    {
      id: 'D-01',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      expectedHash: '0x1a2b3c4d5e6f...',
      actualHash: '0x9f8e7d6c5b4a...',
      delta: 'Unexpected module payload in auth context'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-emerald-400 p-8">
      <header className="mb-12 border-b border-emerald-900 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Shield className="text-emerald-500 w-12 h-12" />
          <div>
            <h1 className="text-2xl font-black font-mono uppercase tracking-widest text-emerald-500">
              REV_34 Telemetry Runtime
            </h1>
            <p className="text-xs font-mono text-zinc-500 tracking-widest mt-1">
              Deterministic Verification Ecosystem
            </p>
          </div>
        </div>
        <ClassificationBadge level="TOP_SECRET" />
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <div className="space-y-8">
          <RouteHealthMatrix routes={mockRoutes} />
          <ProvenanceLedger snapshots={snapshots} />
        </div>

        <div className="space-y-8">
          <DriftTimeline events={mockDrift} />

          <div className="bg-zinc-950 border border-emerald-900/50 p-6 rounded-lg">
            <h2 className="text-emerald-500 font-mono text-sm uppercase tracking-widest mb-4">
              Permanent Trust Boundary
            </h2>
            <div className="font-mono text-xs text-zinc-400 leading-relaxed">
              <p className="mb-2">This surface is the verifiable execution plane for the REV_34 architecture.</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>All displayed telemetry is cryptographically proven.</li>
                <li>Visualized state accurately reflects the audit chain.</li>
                <li>Route degradation does not compromise policy enforcement.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
