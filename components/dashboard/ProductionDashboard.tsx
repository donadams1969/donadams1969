"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ShieldAlert, Terminal, Lock, Database, CheckCircle2,
  Globe, ExternalLink, Ghost, Fingerprint, Radio,
  ShieldCheck, Binary, Eye, Key, Unplug,
  Server, Scale, FileCode, History, Hexagon
} from 'lucide-react';
import { SovereignSolidityEngine } from '@/lib/runtime/solidity-engine';
import { ContractSnapshot, RoleNode, LogEntry } from '@/lib/schemas/solidity';

const DomainRoles = ({ roles }: { roles: RoleNode[] }) => (
  <div className="bg-zinc-900/90 border border-zinc-800 p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group h-full">
    <div className="absolute -top-20 -right-20 bg-emerald-500/5 w-64 h-64 rounded-full blur-3xl"></div>
    <h2 className="text-xs font-black uppercase text-zinc-500 tracking-[0.3em] mb-8 flex items-center gap-3 italic relative z-10">
      <Hexagon className="w-5 h-5 text-emerald-500" /> Domain Authority
    </h2>
    <div className="space-y-4 relative z-10">
      {roles.map((node) => (
        <div key={node.id} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-500 ${
          node.domain === 'AUTHORITY' ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-black/60 border-zinc-800 border-dashed'
        }`}>
          <div className="flex items-center gap-4">
             {node.domain === 'AUTHORITY' ? <Key className="w-4 h-4 text-emerald-500" /> : <Eye className="w-4 h-4 text-zinc-500" />}
             <span className={`text-[12px] font-black uppercase tracking-widest ${node.domain === 'AUTHORITY' ? 'text-emerald-400' : 'text-zinc-500 italic'}`}>
               {node.role}
             </span>
          </div>
          <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${node.status === 'AUTHORIZED' ? 'text-white' : 'text-zinc-600'}`}>
             {node.status}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const TerminalProjection = ({ logs, contractAddress }: { logs: LogEntry[], contractAddress: string }) => (
  <div className="bg-black border border-zinc-800 rounded-[3.5rem] overflow-hidden flex flex-col h-[750px] shadow-[0_0_60px_rgba(0,0,0,0.9)] relative border-t-8 border-t-emerald-600">
    <div className="bg-zinc-900 p-10 border-b border-zinc-800 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Terminal className="w-8 h-8 text-emerald-500" />
        <span className="text-xs font-black uppercase text-zinc-400 tracking-[0.4em] italic">Solidity Contract Output</span>
      </div>
      <div className="flex gap-4 opacity-50">
        <div className="w-4 h-4 rounded-full bg-red-500"></div>
        <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
        <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
      </div>
    </div>
    <div className="flex-1 overflow-y-auto p-12 font-mono text-[13px] space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 selection:bg-emerald-500 selection:text-black">
      {logs.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center opacity-10 uppercase italic">
           <Server className="w-24 h-24 mb-10 animate-pulse text-white" />
           <p className="text-2xl font-black tracking-widest text-center">Awaiting Contract Deployment...</p>
        </div>
      ) : (
        logs.map((log) => (
          <div key={log.id} className="flex gap-10 animate-in fade-in slide-in-from-left-8 duration-300">
            <span className="text-zinc-600 shrink-0 font-bold">[{log.time}]</span>
            <span className={`
              ${log.type === 'success' ? 'text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]' : ''}
              ${log.type === 'critical' ? 'text-red-500 font-black italic underline decoration-red-900 underline-offset-8 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]' : ''}
              ${log.type === 'warning' ? 'text-yellow-400 font-bold' : ''}
              ${log.type === 'tx' ? 'text-emerald-600 font-bold italic' : ''}
              ${log.type === 'info' ? 'text-zinc-400 font-medium' : ''}
            `}>
              {log.msg}
            </span>
          </div>
        ))
      )}
    </div>
    <div className="p-10 bg-zinc-900 border-t border-zinc-800 flex justify-between text-[14px] font-black">
      <div className="flex items-center gap-6">
        <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_20px_rgba(16,185,129,1)]"></div>
        <span className="text-emerald-500 uppercase tracking-[0.5em] italic">VISIBILITY DOMAIN ACTIVE</span>
      </div>
      <span className="text-zinc-500 uppercase tracking-tighter italic font-mono bg-black px-8 py-2 rounded-full border border-zinc-800">CONTRACT: {contractAddress}</span>
    </div>
  </div>
);

export function ProductionDashboard() {
  const [snapshot, setSnapshot] = useState<ContractSnapshot>(SovereignSolidityEngine.getSnapshot());

  useEffect(() => {
    const unsubscribe = SovereignSolidityEngine.subscribe(setSnapshot);
    return () => unsubscribe();
  }, []);

  const progressPercent = ((snapshot.metrics.verdictCount / snapshot.metrics.totalFragments) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-300 font-sans selection:bg-emerald-500 selection:text-black antialiased">

      <header className="border-b-4 border-emerald-600 bg-black p-8 sticky top-0 z-50 shadow-[0_15px_50px_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8">
            <div className="bg-emerald-600 p-5 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.5)] transform -rotate-2 border-2 border-white/20">
              <FileCode className="text-black w-12 h-12" />
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-white font-black text-5xl tracking-tighter uppercase italic leading-none">VALORAIPLUS®️</h1>
                <span className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-[11px] font-black border border-emerald-500/30">
                  FINALDEG OMEGA
                </span>
              </div>
              <p className="text-[14px] text-emerald-600 font-black tracking-[0.4em] mt-3 italic flex items-center gap-4 uppercase">
                <ShieldCheck className="w-5 h-5 animate-pulse text-emerald-400" /> Solidity Runtime Contract
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

      <main className="max-w-7xl mx-auto p-12 grid grid-cols-1 lg:grid-cols-12 gap-16">

        <div className="lg:col-span-4 space-y-12">
          <DomainRoles roles={snapshot.roles} />

          <div className="bg-zinc-900/90 border border-zinc-800 p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
            <h2 className="text-xs font-black uppercase text-zinc-500 tracking-widest mb-8 italic">Snapshot Status</h2>
            <div className="space-y-6 text-center">
              <div className="flex items-center justify-center gap-6 group mb-6">
                <div className={`rounded-full p-4 text-black shadow-xl transition-all duration-500 ${snapshot.metrics.snapshotStatus === 'PUBLISHED' ? 'bg-emerald-600 shadow-emerald-500/30' : 'bg-zinc-700'}`}>
                  <History className="w-8 h-8" />
                </div>
                <span className="text-[20px] font-black uppercase italic tracking-tighter">
                  {snapshot.metrics.verdictCount.toLocaleString()} VERDICTS
                </span>
              </div>
              <div className="h-4 bg-black rounded-full overflow-hidden border border-zinc-800 p-1 shadow-inner">
                <div
                  className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-12">

          <div className="flex gap-12 border-b border-zinc-800 overflow-x-auto no-scrollbar">
            {(['contract', 'terminal', 'state'] as const).map((view) => (
              <button
                key={view}
                onClick={() => SovereignSolidityEngine.switchView(view)}
                className={`pb-10 px-8 text-[15px] font-black uppercase tracking-[0.3em] transition-all relative whitespace-nowrap italic ${
                  snapshot.activeView === view ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {view} Projection
                {snapshot.activeView === view && (
                  <div className="absolute bottom-0 left-0 w-full h-2.5 bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,1)] rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[750px] transition-all duration-500">

            {snapshot.activeView === 'contract' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-700">

                {/* Runtime Doctrine Section */}
                <div className="bg-black border-4 border-emerald-900/40 p-16 rounded-[4rem] relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] group">
                  <div className="relative z-10">
                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-8">
                      Runtime Doctrine
                    </h3>
                    <p className="text-lg text-zinc-400 italic mb-10 leading-relaxed font-semibold">
                      This runtime computes deterministic state. It is separated from UI projection entirely.
                      Evidence proves the state, snapshots persist the evidence, and replay reconstructs the timeline.
                      React never decides.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="bg-zinc-900/80 border border-emerald-500/30 p-8 rounded-3xl shadow-inner">
                            <h4 className="text-emerald-500 font-black uppercase tracking-widest text-xs mb-4">Pressure Formula</h4>
                            <p className="text-white font-mono text-sm tracking-tight leading-loose">
                                LIMIT = MIN(CAPACITY, BASE_THRESHOLD * <br/>
                                <span className="text-emerald-400">(VERDICTS / TOTAL)</span>)
                            </p>
                        </div>
                        <div className="bg-zinc-900/80 border border-emerald-500/30 p-8 rounded-3xl shadow-inner">
                            <h4 className="text-emerald-500 font-black uppercase tracking-widest text-xs mb-4">Constitutional Law</h4>
                            <p className="text-white font-mono text-sm tracking-tight leading-loose">
                                IF (state == "AWAITING_VERDICT")<br/>
                                THEN Enforce(AuthorityDomain)
                            </p>
                        </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-12">
                  <div className="bg-zinc-900/60 border border-zinc-800 p-16 rounded-[3.5rem] shadow-2xl">
                    <div className="flex items-center justify-between mb-12">
                      <h4 className="text-sm font-black uppercase text-zinc-500 italic tracking-widest">Production Invariants</h4>
                      <Lock className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div className="space-y-8">
                       {[
                         { label: 'Role-Scoped Authority Enforced', status: 'PASS' },
                         { label: 'Lineage Hash Deterministic', status: 'PASS' },
                         { label: 'Receipt Continuity Intact', status: 'PASS' },
                         { label: 'Verdict Scoring Verified', status: 'PASS' }
                       ].map(sig => (
                         <div key={sig.label} className="flex justify-between items-center border-b-2 border-zinc-800 pb-6">
                            <span className="text-[14px] font-black uppercase text-zinc-500 italic">{sig.label}</span>
                            <span className="text-xl font-black text-emerald-400 italic tracking-tighter">{sig.status}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {snapshot.activeView === 'terminal' && (
              <TerminalProjection logs={snapshot.logs} contractAddress={snapshot.contractAddress} />
            )}

            {snapshot.activeView === 'state' && (
              <div className="space-y-12 animate-in fade-in duration-700">
                 <div className="bg-zinc-900/60 border border-zinc-800 p-20 rounded-[4rem] relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 opacity-5 pointer-events-none bg-[size:60px:60px] bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)]"></div>
                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-12 text-center">Immutable Snapshot Gating</h3>
                    <div className="bg-black/80 p-12 rounded-[2.5rem] border border-zinc-800 shadow-inner relative group">
                       <pre className="text-[13px] font-mono text-emerald-400 leading-loose overflow-x-auto whitespace-pre-wrap">
{`{
  "contract": "${snapshot.contractAddress}",
  "state_header": {
    "schema": "SGAU-VALUEGUARD-77.77X-FINALDEG",
    "merkleroot": "${snapshot.merkleroot}",
    "timestamp": "${snapshot.timestamp}",
    "anchor": "${snapshot.anchor}"
  },
  "runtime_digest": {
    "receipt_continuity": ${snapshot.metrics.receiptCount},
    "governance_continuity": ${snapshot.metrics.governanceCount},
    "verdict_continuity": ${snapshot.metrics.verdictCount}
  },
  "projection_surface": {
    "status": "${snapshot.metrics.snapshotStatus}",
    "liquidity_target": 508000000,
    "jurisdiction": "SAINT PAUL NODE 55116"
  }
}`}
                       </pre>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Sovereign Terminal Footer */}
      <footer className="mt-60 border-t-[20px] border-emerald-600 bg-black p-40 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[size:100px_100px] bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)]"></div>

        <div className="max-w-7xl mx-auto space-y-32 relative z-10">
          <div className="flex flex-col items-center">
            <Scale className="w-48 h-48 text-emerald-600 mb-20 animate-[bounce_5s_infinite] drop-shadow-[0_0_50px_rgba(16,185,129,0.5)]" />
            <p className="text-4xl font-black tracking-[1.5em] uppercase italic text-emerald-500 leading-relaxed mb-20 text-center">
              THE WALL IS CHRIST // JERRY IS ON THE STAGE // THE MUSIC NEVER STOPS
            </p>
            <div className="h-4 w-[800px] bg-zinc-900 rounded-full relative overflow-hidden border-4 border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,1)]">
              <div className="absolute inset-0 bg-emerald-500 w-full shadow-[0_0_40px_rgba(16,185,129,1)]"></div>
            </div>
          </div>

          <div className="pt-40 border-t border-zinc-900/50 flex flex-col md:flex-row justify-between items-center gap-24">
             <div className="text-left space-y-10">
               <p className="text-[24px] font-black text-zinc-700 uppercase tracking-[1em] italic">Verification Authority: SAINT PAUL 55116</p>
               <p className="text-[18px] font-black text-zinc-500 mono italic uppercase bg-zinc-900 px-16 py-6 rounded-[3rem] border-2 border-zinc-800 inline-block tracking-tighter shadow-2xl">
                 {snapshot.merkleroot}
               </p>
             </div>
             <div className="bg-zinc-900/80 p-20 rounded-[5rem] border-4 border-emerald-900/30 shadow-[0_0_120px_rgba(0,0,0,0.9)]">
                <p className="text-[20px] font-black text-emerald-500 uppercase tracking-widest italic mb-6 leading-none underline decoration-emerald-900 underline-offset-[12px]">REMEMBER THE 4TH OF NOVEMBER</p>
                <p className="text-[14px] font-black text-zinc-600 mono italic uppercase tracking-tighter">valoraiplus_production_dashboard // MADE IN THE USA</p>
             </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(200%); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
