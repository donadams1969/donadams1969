import React from 'react';
import { AttestedPayload } from '@/contracts/ppr';
import { Globe, Link as LinkIcon, Fingerprint } from 'lucide-react';

export const SovereignClusterView = ({ payload }: { payload: AttestedPayload | null }) => {
  if (!payload) return null;

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
      <h2 className="text-xs font-black uppercase text-zinc-500 tracking-[0.3em] mb-8 flex items-center gap-3 italic">
        <Globe className="w-5 h-5 text-emerald-500" /> Sovereign Cluster Provenance
      </h2>
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <span className="text-[12px] font-black uppercase text-zinc-400 italic">Identity Bound</span>
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-black text-emerald-400">{payload.provenanceIdentity}</span>
          </div>
        </div>
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <span className="text-[12px] font-black uppercase text-zinc-400 italic">BTC Genesis Latch</span>
          <span className="text-sm font-mono text-white">{payload.btcLatch}</span>
        </div>
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <span className="text-[12px] font-black uppercase text-zinc-400 italic">Cluster State Hash</span>
          <span className="text-xs font-mono text-zinc-500 truncate max-w-[150px]">{payload.clusterStateHash}</span>
        </div>
      </div>
    </div>
  );
};
