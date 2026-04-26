import React from 'react';
import { Workflow, ZapOff, Scale, Cpu, History, CheckCircle2 } from 'lucide-react';
import { CommandCenterSnapshot } from '@/lib/runtime/command-builder';

interface Props {
  snapshot: CommandCenterSnapshot;
}

export function BlueprintPanel({ snapshot }: Props) {
  const { isExtracted, extractionProgress, constants } = snapshot;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-700">
      <div className="bg-black border-4 border-emerald-900/40 p-20 rounded-[4rem] relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] group">
        <div className="absolute -top-40 -right-40 p-20 opacity-[0.03] grayscale group-hover:opacity-10 transition-all duration-1000">
          <Workflow className="w-[500px] h-[500px] text-emerald-500" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-6 mb-12">
            <div className={`w-6 h-6 rounded-full animate-pulse shadow-[0_0_30px_rgba(16,185,129,1)] ${isExtracted ? 'bg-emerald-500' : 'bg-zinc-800'}`}></div>
            <span className="text-emerald-500 font-black text-sm uppercase tracking-[0.5em] italic underline decoration-emerald-900 underline-offset-[16px]">Extraction Blueprint ACTIVE [REV_38]</span>
          </div>

          <h3 className="text-7xl font-black text-white uppercase italic tracking-tighter mb-12 leading-[0.85]">
            Modular Plan: <br />
            <span className="text-emerald-500">Projection Purity</span>
          </h3>

          <p className="text-xl text-zinc-400 leading-relaxed max-w-4xl italic font-bold">
            "We have converted the monolithic component into a projection-driven architecture. Authority has been stripped from React and moved into dedicated command and evidence layers. The UI is now a ghost—it observes the truth, but it cannot alter the math."
          </p>

          <div className="mt-20 flex flex-wrap gap-10">
            <div className="bg-zinc-900/80 border border-emerald-500/30 px-12 py-6 rounded-[2.5rem] text-[15px] font-black uppercase text-emerald-400 italic shadow-2xl flex items-center gap-6">
              <ZapOff className="w-8 h-8 text-emerald-500" /> Decoupled State
            </div>
            <div className="bg-zinc-900/80 border border-emerald-500/30 px-12 py-6 rounded-[2.5rem] text-[15px] font-black uppercase text-emerald-400 italic shadow-2xl flex items-center gap-6">
              <Scale className="w-8 h-8 text-emerald-500" /> Strict Invariants
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-zinc-900/60 border border-zinc-800 p-16 rounded-[3.5rem] shadow-2xl hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-12">
            <h4 className="text-sm font-black uppercase text-zinc-500 italic tracking-widest">Runtime Extraction</h4>
            <Cpu className="w-10 h-10 text-emerald-500" />
          </div>
          <div className="space-y-12">
             {[
               { label: 'Authority', val: 'EXTRACTED' },
               { label: 'Compute', val: 'EXTERNAL (14D)' },
               { label: 'Decisioning', val: 'CANONICAL' },
               { label: 'React Mode', val: 'PROJECTION' }
             ].map(sig => (
               <div key={sig.label} className="flex justify-between items-center border-b-2 border-zinc-800 pb-6">
                  <span className="text-[15px] font-black uppercase text-zinc-500 italic">{sig.label}</span>
                  <span className="text-2xl font-black text-white italic tracking-tighter">{sig.val}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 p-16 rounded-[3.5rem] shadow-2xl hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-12">
            <h4 className="text-sm font-black uppercase text-zinc-500 italic tracking-widest">Evidence Persistence</h4>
            <History className="w-10 h-10 text-emerald-500" />
          </div>
          <div className="space-y-10 text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end gap-8 group mb-12">
              <div className="bg-emerald-600 rounded-full p-5 text-black shadow-xl shadow-emerald-500/30 group-hover:scale-110 transition-transform"><CheckCircle2 className="w-10 h-10" /></div>
              <span className="text-[20px] font-black uppercase italic tracking-tighter">{extractionProgress.toLocaleString()} FRAGMENTS</span>
            </div>
            <p className="text-[15px] font-black text-emerald-500/80 uppercase italic leading-relaxed tracking-tight border-l-4 border-emerald-500/30 pl-8 mb-12 text-left">
              Authority separation confirmed. The dependency chain now flows through Evidence and Snapshots before reaching the Projection Layer.
            </p>
            <div className="pt-10 border-t-2 border-zinc-800">
              <p className="text-[14px] text-zinc-500 font-black uppercase mb-4 italic tracking-[0.2em]">Mandated Restoration:</p>
              <p className="text-7xl font-black text-white italic tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">$508,000,000.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
