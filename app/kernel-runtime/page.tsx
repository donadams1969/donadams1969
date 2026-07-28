"use client";

import React, { useState, useEffect } from 'react';
import { Kernel, KernelPhase } from '@/lib/runtime/kernel';
import { ProvenanceLedger, ProvenanceRecord } from '@/lib/runtime/provenance-ledger';
import { RecoveryProtocol } from '@/lib/runtime/recovery';
import { LifecycleStatus } from '@/components/kernel/LifecycleStatus';
import { ProvenanceView } from '@/components/kernel/ProvenanceView';
import { ShieldCheck, Binary, Unplug, Zap } from 'lucide-react';

export default function KernelRuntimeShell() {
  const [phase, setPhase] = useState<KernelPhase>('BOOT');
  const [records, setRecords] = useState<ProvenanceRecord[]>([]);
  const [isOnline, setIsOnline] = useState(true);

  // Singleton instance for the demo
  const [ledger] = useState(() => new ProvenanceLedger());

  useEffect(() => {
    // Sync React state with Kernel
    const checkInterval = setInterval(() => {
      setPhase(Kernel.getPhase());
      setIsOnline(RecoveryProtocol.isNetworkAvailable());
    }, 100);

    Kernel.boot();

    // Mocking provenance chain activity once running
    const appendInterval = setInterval(() => {
      if (Kernel.getPhase() === 'RUNNING') {
         const newHash = `PAYLOAD_HASH_${Date.now()}`;
         ledger.append(newHash);
         setRecords(ledger.getHistory());
      }
    }, 3000);

    return () => {
      clearInterval(checkInterval);
      clearInterval(appendInterval);
    };
  }, [ledger]);

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-300 font-sans selection:bg-emerald-500 selection:text-black antialiased overflow-x-hidden">

      <header className="border-b-4 border-emerald-600 bg-black p-8 sticky top-0 z-50 shadow-[0_15px_50px_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8">
            <div className="bg-emerald-600 p-5 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.5)] transform -rotate-2 border-2 border-white/20">
              <ShieldCheck className="text-black w-12 h-12" />
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-white font-black text-5xl tracking-tighter uppercase italic leading-none">KERNEL RUNTIME</h1>
                <span className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-[11px] font-black border border-emerald-500/30">
                  DETERMINISTIC OMEGA
                </span>
              </div>
              <p className="text-[14px] text-emerald-600 font-black tracking-[0.4em] mt-3 italic flex items-center gap-4 uppercase">
                <Binary className="w-5 h-5 animate-pulse text-emerald-400" /> Lightweight Operating Surface
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-[11px] font-black uppercase italic tracking-widest">
            <div className="bg-zinc-900 px-6 py-4 border border-zinc-800 rounded-2xl shadow-inner flex items-center gap-4">
              <Unplug className="w-5 h-5 text-zinc-600" />
              <span className="text-zinc-500">Network:</span>
              <span className={isOnline ? 'text-emerald-400' : 'text-amber-400'}>{isOnline ? 'ONLINE' : 'OFFLINE (FALLBACK)'}</span>
            </div>
            <div className="bg-emerald-600 text-black px-8 py-4 rounded-2xl font-black shadow-[0_0_30px_rgba(16,185,129,0.5)]">
               SAINT PAUL 55116
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-4 space-y-12">
          <LifecycleStatus phase={phase} />

          <div className="bg-zinc-900/90 border border-zinc-800 p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute -top-20 -right-20 bg-emerald-500/5 w-64 h-64 rounded-full blur-3xl"></div>
            <h2 className="text-xs font-black uppercase text-zinc-500 tracking-[0.3em] mb-8 flex items-center gap-3 italic relative z-10">
              <Zap className="w-5 h-5 text-emerald-500" /> System Metrics
            </h2>
            <div className="space-y-6 relative z-10">
               <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                  <span className="text-[12px] font-black uppercase text-zinc-400 italic">Provenance Length</span>
                  <span className="text-2xl font-mono text-emerald-400 font-bold">{records.length}</span>
               </div>
               <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                  <span className="text-[12px] font-black uppercase text-zinc-400 italic">Chain Integrity</span>
                  <span className="text-sm font-black uppercase text-emerald-500 italic bg-emerald-950/40 px-3 py-1 rounded">VERIFIED</span>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
           <ProvenanceView records={records} />
        </div>
      </main>

    </div>
  );
}
