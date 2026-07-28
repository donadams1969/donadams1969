import React from 'react';
import { Activity } from 'lucide-react';
import { RuntimeMetrics } from '@/contracts/runtime';

interface Props {
  metrics: RuntimeMetrics;
  signalAvg: number;
}

export function HealthSubstrate({ metrics, signalAvg }: Props) {
  return (
    <div className="bg-zinc-900/90 border border-zinc-800 p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
      <div className="absolute -top-32 -right-32 bg-emerald-500/10 w-80 h-80 rounded-full blur-3xl"></div>

      <h2 className="text-xs font-black uppercase text-zinc-500 tracking-[0.3em] mb-10 flex items-center gap-3 italic">
        <Activity className="w-6 h-6 text-emerald-500" /> Health Substrate
      </h2>

      <div className="space-y-12 relative z-10">
        <div>
          <div className="flex justify-between text-[13px] mb-4">
            <span className="font-black uppercase tracking-tight text-zinc-400 italic">Core Signal Strength</span>
            <span className="font-mono text-emerald-400 font-black text-xl drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]">
              {signalAvg.toFixed(1)}%
            </span>
          </div>
          <div className="h-6 bg-black rounded-full overflow-hidden border border-zinc-800 p-1 shadow-inner">
            <div
              className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] transition-all duration-[2000ms] rounded-full relative"
              style={{ width: `${signalAvg}%` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="bg-black/70 border border-zinc-800 p-6 rounded-3xl text-center shadow-lg hover:border-emerald-500/20 transition-all">
            <p className="text-[11px] text-zinc-500 font-black uppercase mb-1 italic">Fragments</p>
            <p className="text-3xl font-black text-white italic leading-none">{metrics.errorResolution.toLocaleString()}</p>
          </div>
          <div className="bg-black/70 border border-zinc-800 p-6 rounded-3xl text-center shadow-lg hover:border-emerald-500/20 transition-all">
            <p className="text-[11px] text-zinc-500 font-black uppercase mb-1 italic">Saturation</p>
            <p className="text-3xl font-black text-white italic leading-none">{metrics.logicSaturation}%</p>
          </div>
        </div>

        <div className="p-8 bg-zinc-950/50 border border-zinc-800 rounded-[2rem] shadow-inner">
           <h3 className="text-[10px] font-black uppercase text-zinc-600 mb-6 tracking-[0.3em]">Health Domains</h3>
           <div className="space-y-6">
              {['Forensic', 'Protocol', 'Infrastructure', 'Legal'].map(domain => (
                <div key={domain} className="flex items-center justify-between">
                  <span className="text-[12px] font-bold uppercase text-zinc-400 italic">{domain}</span>
                  <div className="flex items-center gap-3">
                     <span className="text-[11px] font-black text-emerald-500 italic">100% NOMINAL</span>
                     <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]"></div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
