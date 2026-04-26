import React from 'react';
import { Layers, Zap } from 'lucide-react';
import { CommandCenterSnapshot } from '@/lib/runtime/command-builder';

interface Props {
  snapshot: CommandCenterSnapshot;
  onExecute: () => void;
}

export function ExtractionPanel({ snapshot, onExecute }: Props) {
  const { isExtracted, extractionProgress, constants } = snapshot;
  const isExtracting = extractionProgress > 0 && extractionProgress < constants.totalFragments;

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 p-12 rounded-[3rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
      <div className="absolute -top-32 -right-32 bg-emerald-500/10 w-96 h-96 rounded-full blur-3xl"></div>

      <h2 className="text-xs font-black uppercase text-zinc-500 tracking-[0.5em] mb-12 flex items-center gap-4 italic">
        <Layers className="w-7 h-7 text-emerald-500" /> Separation Engine
      </h2>

      <div className="space-y-16 relative z-10">
        <div>
          <div className="flex justify-between text-[14px] mb-6">
            <span className="font-black uppercase tracking-tight text-zinc-400 italic">Extraction Persistence</span>
            <span className="font-mono text-emerald-400 font-black text-2xl italic">
              {((extractionProgress / constants.totalFragments) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-7 bg-black rounded-full overflow-hidden border border-zinc-800 p-1.5 shadow-inner">
            <div
              className="h-full bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.9)] transition-all duration-[1000ms] rounded-full relative"
              style={{ width: `${(extractionProgress / constants.totalFragments) * 100}%` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </div>

        <button
          onClick={onExecute}
          disabled={isExtracting}
          className={`w-full py-8 rounded-[2.5rem] font-black uppercase tracking-tighter flex items-center justify-center gap-6 transition-all transform active:scale-95 shadow-2xl relative group overflow-hidden ${
            isExtracted
            ? 'bg-emerald-900/20 text-emerald-500 border border-emerald-500/30'
            : 'bg-emerald-600 hover:bg-emerald-500 text-black'
          }`}
        >
          <Zap className={isExtracting ? "animate-spin text-white" : "group-hover:rotate-12 transition-transform"} />
          <span className="relative z-10 text-xl">
            {isExtracting ? "Extracting Authority..." : isExtracted ? "Authority Separated" : "Execute Separation"}
          </span>
        </button>

        <div className="grid grid-cols-1 gap-6 pt-4">
           <div className="bg-zinc-950/70 border border-zinc-800 p-8 rounded-[2rem] shadow-inner">
              <p className="text-[10px] font-black uppercase text-zinc-600 mb-2 italic">Active Law</p>
              <p className="text-[15px] font-black text-emerald-500 italic tracking-tighter leading-tight">
                "React reveals, but it never decides."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
