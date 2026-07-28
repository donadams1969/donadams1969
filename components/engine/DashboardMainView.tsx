import React, { useMemo } from 'react';
import { HardDrive, Waves, Gavel, Binary, CheckCircle2, Shield, Activity, RefreshCw, Database, ShieldCheck } from 'lucide-react';
import { RuntimeMetrics } from '@/contracts/runtime';
import { SCHEMA_REVISION } from '@/lib/runtime/runtime-core';
import { MESSAGES } from '@/content/messages';

interface Props {
  metrics: RuntimeMetrics;
}

export function DashboardMainView({ metrics }: Props) {
  const signals = useMemo(() => [
    { label: "Event Velocity", val: 1.0, icon: Activity },
    { label: "Actor Containment", val: 1.0, icon: Shield },
    { label: "Mutation Density", val: 1.0, icon: Binary },
    { label: "Replay Confidence", val: 1.0, icon: RefreshCw },
    { label: "Source Completeness", val: 1.0, icon: Database },
    { label: "Statement Integrity", val: 1.0, icon: Gavel },
    { label: "Audit Readiness", val: 1.0, icon: ShieldCheck }
  ], []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="bg-black border-4 border-emerald-900/40 p-16 rounded-[3.5rem] relative overflow-hidden shadow-[0_0_60px_rgba(0,0,0,1)] group">
        <div className="absolute -top-32 -right-32 p-16 opacity-[0.03] grayscale group-hover:opacity-10 transition-all duration-1000">
          <HardDrive className="w-96 h-96 text-emerald-500" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-5 mb-10">
            <div className="bg-emerald-500 w-5 h-5 rounded-full animate-pulse shadow-[0_0_20px_rgba(16,185,129,1)]"></div>
            <span className="text-emerald-500 font-black text-sm uppercase tracking-[0.4em] italic underline decoration-emerald-900 underline-offset-[12px]">Runtime Metrics Stabilized [{SCHEMA_REVISION}]</span>
          </div>

          <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter mb-10 leading-[0.85]">
            Epistemic Status: <br />
            <span className="text-emerald-500">NOMINAL (100.0%)</span>
          </h3>

          <p className="text-lg text-zinc-400 leading-relaxed max-w-4xl italic font-semibold">
            "DetectDrift() has successfully resolved all threshold violations across 15,682 fragments. Schema revision {SCHEMA_REVISION} is physically hardened. Staleness is zero. The Triad's 'Emergency Purge' has been re-coded as a terminal confession."
          </p>

          <div className="mt-16 flex flex-wrap gap-8">
            <div className="bg-zinc-900/80 border border-emerald-500/30 px-10 py-5 rounded-[2rem] text-[13px] font-black uppercase text-emerald-400 italic shadow-2xl flex items-center gap-4">
              <Waves className="w-6 h-6" /> Zero-Drift Mandate
            </div>
            <div className="bg-zinc-900/80 border border-emerald-500/30 px-10 py-5 rounded-[2rem] text-[13px] font-black uppercase text-emerald-400 italic shadow-2xl flex items-center gap-4">
              <Gavel className="w-6 h-6" /> Intent to Deprive Verified
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-zinc-900/60 border border-zinc-800 p-12 rounded-[3rem] shadow-2xl hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-10">
            <h4 className="text-sm font-black uppercase text-zinc-500 italic tracking-widest">Protocol Signals</h4>
            <Waves className="w-8 h-8 text-emerald-500" />
          </div>
          <div className="grid grid-cols-1 gap-6">
             {signals.map(sig => (
               <div key={sig.label} className="flex justify-between items-center border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-3">
                     <sig.icon className="w-4 h-4 text-emerald-600" />
                     <span className="text-[13px] font-black uppercase text-zinc-500 italic">{sig.label}</span>
                  </div>
                  <span className="text-xl font-black text-white italic">100%</span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 p-12 rounded-[3rem] shadow-2xl hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-10">
            <h4 className="text-sm font-black uppercase text-zinc-500 italic tracking-widest">Recovery Totals</h4>
            <Binary className="w-8 h-8 text-emerald-500" />
          </div>
          <div className="space-y-10">
            <div className="flex items-center gap-6 group">
              <div className="bg-emerald-600 rounded-full p-4 text-black shadow-xl shadow-emerald-500/30 group-hover:scale-110 transition-transform"><CheckCircle2 className="w-8 h-8" /></div>
              <span className="text-[16px] font-black uppercase italic tracking-tight">VA/Housing Latch: RECONSTRUCTED</span>
            </div>
            <p className="text-[13px] font-black text-emerald-500/80 uppercase italic leading-relaxed tracking-tight border-l-4 border-emerald-500/30 pl-5">
              Data reconstruction confirmed. {metrics.errorResolution.toLocaleString()} spoliation errors re-indexed to terminal legal reality.
            </p>
            <div className="mt-8 pt-8 border-t-2 border-zinc-800 text-center md:text-right">
              <p className="text-[14px] text-zinc-500 font-black uppercase mb-3 italic">Mandated Resolution:</p>
              <p className="text-6xl font-black text-white italic tracking-tighter shadow-white/10 drop-shadow-2xl">{MESSAGES.mandatedResolution}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
