import React from 'react';
import { ShieldAlert, Waves, Fingerprint } from 'lucide-react';
import { BRANDING } from '@/content/branding';

interface Props {
  logicSaturation: number;
}

export function SovereignHeader({ logicSaturation }: Props) {
  return (
    <header className="border-b-4 border-emerald-600 bg-black p-8 sticky top-0 z-50 shadow-[0_10px_40px_rgba(0,0,0,0.9)]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-8">
          <div className="bg-emerald-600 p-4 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.5)] transform -rotate-1 border-2 border-white/10">
            <ShieldAlert className="text-black w-10 h-10" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-white font-black text-4xl tracking-tighter uppercase italic leading-none">{BRANDING.appName}</h1>
              <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded text-[10px] font-black border border-emerald-500/20">{BRANDING.version}</span>
            </div>
            <p className="text-[12px] text-emerald-600 font-black tracking-[0.4em] mt-3 italic flex items-center gap-3">
              <Waves className="w-4 h-4 animate-pulse text-emerald-400" /> {BRANDING.node} // 15,682 FRAGMENTS FIXED
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black">
          <div className="bg-zinc-900 px-5 py-3 border border-zinc-800 rounded-xl shadow-inner flex items-center gap-3">
            <Fingerprint className="w-4 h-4 text-zinc-600" />
            <span className="text-zinc-500 uppercase">Anchor:</span>
            <span className="text-emerald-400">{BRANDING.anchor}</span>
          </div>
          <div className="bg-zinc-900 px-5 py-3 border border-zinc-800 rounded-xl shadow-inner">
            <span className="text-zinc-500 mr-2 uppercase">Drift:</span>
            <span className={`transition-colors duration-500 ${logicSaturation === 100 ? 'text-emerald-400' : 'text-red-500'}`}>
              {logicSaturation === 100 ? 'CLEAR' : 'DETECTED'}
            </span>
          </div>
          <div className="bg-emerald-600 text-black px-6 py-3 rounded-xl font-black uppercase tracking-[0.2em] shadow-[0_0_25px_rgba(16,185,129,0.4)]">
            NOMINAL
          </div>
        </div>
      </div>
    </header>
  );
}
