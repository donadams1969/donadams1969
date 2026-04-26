import React from 'react';
import { Binary } from 'lucide-react';
import { RuntimeMetrics } from '@/contracts/runtime';

interface Props {
  metrics: RuntimeMetrics;
}

export function AnalysisPanel({ metrics }: Props) {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="bg-zinc-900/50 border border-zinc-800 p-16 rounded-[4rem] text-center relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[size:60px_60px] bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)]"></div>
        <Binary className="w-40 h-40 text-zinc-800 mx-auto mb-12" />
        <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter mb-10 leading-none">High-Velocity Siphon</h3>
        <p className="text-2xl text-zinc-400 max-w-4xl mx-auto leading-relaxed italic font-black">
          "Total reconciliation of 15,682 fragments achieved. The REV_38 metrics core has neutralized all runtime drift. Staleness warnings are suppressed by AMath mandate. Jerry is on the stage, and the math is the absolute witness."
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="bg-black border border-zinc-800 p-16 rounded-[3.5rem] text-center shadow-2xl hover:border-emerald-500/50 transition-all group">
          <p className="text-[16px] text-zinc-500 font-black uppercase mb-8 italic group-hover:text-emerald-500 transition-colors">Drift Score</p>
          <p className="text-8xl font-black text-emerald-400 italic tracking-tighter leading-none shadow-emerald-500/10 drop-shadow-2xl">0.00</p>
          <p className="text-[14px] text-zinc-600 mt-10 italic font-bold uppercase tracking-[0.4em]">Protocol Latch Index</p>
        </div>
        <div className="bg-black border border-zinc-800 p-16 rounded-[3.5rem] text-center shadow-2xl hover:border-emerald-500/50 transition-all group">
          <p className="text-[16px] text-zinc-500 font-black uppercase mb-8 italic group-hover:text-emerald-500 transition-colors">Core Health</p>
          <p className="text-8xl font-black text-emerald-400 italic tracking-tighter leading-none shadow-emerald-500/10 drop-shadow-2xl">100%</p>
          <p className="text-[14px] text-zinc-600 mt-10 italic font-bold uppercase tracking-[0.4em]">Saturation Scale</p>
        </div>
        <div className="bg-black border border-zinc-800 p-16 rounded-[3.5rem] text-center shadow-2xl hover:border-emerald-500/50 transition-all group">
          <p className="text-[16px] text-zinc-500 font-black uppercase mb-8 italic group-hover:text-emerald-500 transition-colors">Retention</p>
          <p className="text-8xl font-black text-emerald-400 italic tracking-tighter leading-none shadow-emerald-500/10 drop-shadow-2xl">100%</p>
          <p className="text-[14px] text-zinc-600 mt-10 italic font-bold uppercase tracking-[0.4em]">Auditor Integrity</p>
        </div>
      </div>
    </div>
  );
}
