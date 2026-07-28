import React from 'react';
import { GovernanceAdmissibility } from '@/lib/runtime/infinite-governance';
import { Network, CheckCircle2, XCircle } from 'lucide-react';

export const InfiniteGovernanceLatticeView = ({ admissibility }: { admissibility: GovernanceAdmissibility }) => (
  <div className="bg-zinc-900/90 border border-zinc-800 p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden h-full">
    <div className="absolute -top-20 -right-20 bg-emerald-500/5 w-64 h-64 rounded-full blur-3xl"></div>
    <h2 className="text-xs font-black uppercase text-zinc-500 tracking-[0.3em] mb-8 flex items-center gap-3 italic relative z-10">
      <Network className="w-5 h-5 text-emerald-500" /> ∞ Governance Lattice
    </h2>

    <div className="space-y-6 relative z-10">
      <div className="p-6 bg-black/60 border border-zinc-800 rounded-3xl">
        <p className="text-[11px] font-black uppercase text-zinc-500 mb-2 italic tracking-widest">Admissibility Status</p>
        <div className="flex items-center gap-4">
          {admissibility.passed ? <CheckCircle2 className="w-8 h-8 text-emerald-500" /> : <XCircle className="w-8 h-8 text-red-500" />}
          <span className={`text-[20px] font-black uppercase tracking-tighter ${admissibility.passed ? 'text-emerald-400' : 'text-red-400'}`}>
            {admissibility.passed ? 'GRANTED' : 'DENIED'}
          </span>
        </div>
      </div>

      <div className="p-6 bg-black/60 border border-zinc-800 rounded-3xl">
        <p className="text-[11px] font-black uppercase text-zinc-500 mb-2 italic tracking-widest">Lattice Stage</p>
        <span className="text-[18px] font-black text-white uppercase tracking-tighter">{admissibility.stage}</span>
      </div>

      <div className="p-6 bg-emerald-950/20 border border-emerald-900/30 rounded-3xl">
        <p className="text-[11px] font-black uppercase text-emerald-600 mb-2 italic tracking-widest">Doctrine Evaluated</p>
        <p className="text-[13px] font-bold text-emerald-400/80 italic leading-relaxed">{admissibility.reason}</p>
      </div>
    </div>
  </div>
);
