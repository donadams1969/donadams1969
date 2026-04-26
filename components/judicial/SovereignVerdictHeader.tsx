import React from 'react';
import { FileSignature, ShieldCheck, Fingerprint } from 'lucide-react';
import { VerdictSnapshot } from '@/lib/schemas/verdict';

export const SovereignVerdictHeader = ({ snapshot }: { snapshot: VerdictSnapshot }) => (
  <header className="border-b-4 border-emerald-600 bg-black p-8 sticky top-0 z-50 shadow-[0_15px_50px_rgba(0,0,0,1)]">
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-8">
        <div className="bg-emerald-600 p-5 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.5)] transform -rotate-2 border-2 border-white/20">
          <FileSignature className="text-black w-12 h-12" />
        </div>
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-white font-black text-5xl tracking-tighter uppercase italic leading-none">VALORAIPLUS®️</h1>
            <span className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-[11px] font-black border border-emerald-500/30">
              VERDICT CHAIN OMEGA
            </span>
          </div>
          <p className="text-[14px] text-emerald-600 font-black tracking-[0.4em] mt-3 italic flex items-center gap-4 uppercase">
            <ShieldCheck className="w-5 h-5 animate-pulse text-emerald-400" /> Judicial Legitimacy Layer
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6 text-[11px] font-black uppercase italic tracking-widest">
        <div className="bg-zinc-900 px-6 py-4 border border-zinc-800 rounded-2xl shadow-inner flex items-center gap-4">
          <Fingerprint className="w-5 h-5 text-zinc-600" />
          <span className="text-zinc-500">Anchor:</span>
          <span className="text-emerald-400">{snapshot.anchor}</span>
        </div>
        <div className="bg-emerald-600 text-black px-8 py-4 rounded-2xl font-black shadow-[0_0_30px_rgba(16,185,129,0.5)]">
           SAINT PAUL 55116
        </div>
      </div>
    </div>
  </header>
);
