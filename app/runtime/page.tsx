"use client";

import React from 'react';
import { ShieldCheck, Database, Binary, Scale } from 'lucide-react';
import { SovereignSolidityEngine } from '@/lib/runtime/solidity-engine';

export default function RuntimeManifestSurface() {
  const snapshot = SovereignSolidityEngine.getSnapshot();

  return (
    <div className="min-h-screen bg-black text-emerald-400 p-12 font-mono selection:bg-emerald-500 selection:text-black">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="border-b-4 border-emerald-600 pb-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <ShieldCheck className="w-12 h-12 text-emerald-500" />
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter italic">Runtime Manifest Surface</h1>
              <p className="text-sm font-bold tracking-widest text-emerald-600 mt-1 uppercase">Protected Constitutional State</p>
            </div>
          </div>
          <div className="bg-emerald-950/40 border border-emerald-900 px-6 py-2 rounded-xl">
             <span className="text-emerald-500 font-black tracking-widest text-xs uppercase">Node 55116</span>
          </div>
        </header>

        <section className="bg-zinc-950 border-l-8 border-emerald-600 p-10 rounded-2xl shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10"><Database className="w-32 h-32" /></div>
           <h2 className="text-xl font-black text-white uppercase tracking-widest mb-8 flex items-center gap-4">
             <Scale className="w-6 h-6 text-emerald-500" /> Current Authority Digest
           </h2>
           <div className="space-y-6 text-sm tracking-widest">
             <div className="flex justify-between border-b border-zinc-800 pb-4">
               <span className="text-zinc-500">Schema Version</span>
               <span className="text-emerald-400">{snapshot.schema}</span>
             </div>
             <div className="flex justify-between border-b border-zinc-800 pb-4">
               <span className="text-zinc-500">Identity Anchor</span>
               <span className="text-emerald-400">{snapshot.anchor}</span>
             </div>
             <div className="flex justify-between border-b border-zinc-800 pb-4">
               <span className="text-zinc-500">Merkle Root</span>
               <span className="text-emerald-400 break-all ml-8">{snapshot.merkleroot}</span>
             </div>
             <div className="flex justify-between border-b border-zinc-800 pb-4">
               <span className="text-zinc-500">Verdict Status</span>
               <span className="text-emerald-400">{snapshot.metrics.snapshotStatus}</span>
             </div>
           </div>
        </section>

        <section className="bg-black border border-emerald-900/50 p-10 rounded-2xl shadow-inner">
           <h2 className="text-sm font-black text-zinc-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
             <Binary className="w-5 h-5 text-emerald-500" /> Bounded Runtime Law
           </h2>
           <div className="space-y-4 font-bold italic text-emerald-600/80 leading-loose text-xs tracking-wider">
              <p>1. /runtime = protected manifest surface</p>
              <p>2. /dashboard = root projection alias</p>
              <p>3. unknown route = contained recovery</p>
           </div>
        </section>
      </div>
    </div>
  );
}
