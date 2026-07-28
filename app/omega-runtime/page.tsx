"use client";

import React, { useState, useEffect } from 'react';
import { SovereignVerdictEngine } from '@/lib/runtime/verdict-engine';
import { GovernanceLattice, GovernanceAdmissibility } from '@/lib/runtime/infinite-governance';
import { GSES } from '@/lib/runtime/gses';
import { PPR } from '@/lib/runtime/ppr';
import { Core14D } from '@/lib/runtime/core-14d';
import { VerdictSnapshot } from '@/lib/schemas/verdict';
import { ReleasePermission } from '@/contracts/gses';
import { AttestedPayload } from '@/contracts/ppr';
import { CompletenessAssertion } from '@/contracts/core-14d';

import { InfiniteGovernanceLatticeView } from '@/components/governance/InfiniteGovernanceLattice';
import { SovereignClusterView } from '@/components/governance/SovereignClusterView';
import { GSESReleaseGate } from '@/components/governance/GSESReleaseGate';
import { MemoryTopology } from '@/components/verdict/MemoryTopology';
import { SovereignLawPanel } from '@/components/verdict/SovereignLawPanel';
import { TerminalProjection } from '@/components/verdict/TerminalProjection';
import { ShieldCheck, Workflow, Scale, Fingerprint, LockKeyhole, Layers } from 'lucide-react';

const ConstitutionalEnclosureView = ({ assertion }: { assertion: CompletenessAssertion | null }) => {
  if (!assertion) return null;

  const { dimensions, isContained } = assertion;

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden h-full mt-12">
       <div className="absolute -top-20 -right-20 bg-emerald-500/5 w-64 h-64 rounded-full blur-3xl"></div>
       <h2 className="text-xs font-black uppercase text-zinc-500 tracking-[0.3em] mb-8 flex items-center gap-3 italic relative z-10">
         <Layers className="w-5 h-5 text-emerald-500" /> 14D Constitutional Semantic Enclosure (CSRE)
       </h2>

       <div className="space-y-6 relative z-10">
         <div className="flex items-center justify-between p-6 bg-black/60 border border-zinc-800 rounded-3xl">
           <div>
             <p className="text-[11px] font-black uppercase text-zinc-500 mb-1 italic tracking-widest">Enclosure State</p>
             <span className={`text-[18px] font-black uppercase tracking-tighter ${isContained ? 'text-emerald-400' : 'text-red-400'}`}>
               {isContained ? 'CONTAINED' : 'BREACHED'}
             </span>
           </div>
           {isContained ? <LockKeyhole className="w-8 h-8 text-emerald-500" /> : <ShieldCheck className="w-8 h-8 text-red-500" />}
         </div>

         <div className="p-6 bg-emerald-950/20 border border-emerald-900/30 rounded-3xl space-y-4">
           <p className="text-[11px] font-black uppercase text-emerald-600 mb-4 italic tracking-widest">Authority Dimensions</p>

           {[
             { label: 'Projection', value: dimensions.projectionVisible },
             { label: 'Transport', value: dimensions.transportAuthorized },
             { label: 'Release', value: dimensions.releasePermitted },
             { label: 'Fingerprint', value: dimensions.fingerprintBound },
             { label: 'Governance', value: dimensions.governanceAdmitted },
             { label: 'Replay Protection', value: dimensions.replayProtected }
           ].map(dim => (
              <div key={dim.label} className="flex justify-between items-center border-b border-emerald-900/30 pb-2">
                 <span className="text-[12px] font-bold text-emerald-400/80 italic">{dim.label}</span>
                 <span className={`text-[12px] font-black tracking-widest ${dim.value ? 'text-emerald-500' : 'text-red-500'}`}>
                   {dim.value ? 'SECURED' : 'DENIED'}
                 </span>
              </div>
           ))}
         </div>
       </div>
    </div>
  );
};

export default function OmegaRuntimeShell() {
  const [snapshot, setSnapshot] = useState<VerdictSnapshot>(SovereignVerdictEngine.getSnapshot());
  const [admissibility, setAdmissibility] = useState<GovernanceAdmissibility | null>(null);
  const [permission, setPermission] = useState<ReleasePermission | null>(null);
  const [payload, setPayload] = useState<AttestedPayload | null>(null);
  const [assertion, setAssertion] = useState<CompletenessAssertion | null>(null);

  useEffect(() => {
    const unsubscribe = SovereignVerdictEngine.subscribe((newSnapshot) => {
      setSnapshot(newSnapshot);

      const adm = GovernanceLattice.evaluateAdmissibility(newSnapshot);
      setAdmissibility(adm);

      const perm = GSES.evaluateReleaseClearance(newSnapshot);
      setPermission(perm);

      let exportData = null;
      let provenance = null;

      if (perm.canSerialize) {
         exportData = GSES.serializeForExport(newSnapshot, perm);
         if (exportData) {
             provenance = PPR.generateAttestedPayload(exportData.payloadHash, adm.stage);
             setPayload(provenance);
         }
      }

      // Evaluate 14D Core Containment (temporal admissibility simulated as true here for continuity)
      const containment = Core14D.evaluateContainment(exportData, provenance, adm, true);
      setAssertion(containment);
    });

    return () => unsubscribe();
  }, []);

  if (!admissibility || !permission || !assertion) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-300 font-sans selection:bg-emerald-500 selection:text-black antialiased overflow-x-hidden">

      <header className="border-b-4 border-emerald-600 bg-black p-8 sticky top-0 z-50 shadow-[0_15px_50px_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8">
            <div className="bg-emerald-600 p-5 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.5)] transform -rotate-2 border-2 border-white/20">
              <Workflow className="text-black w-12 h-12" />
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-white font-black text-5xl tracking-tighter uppercase italic leading-none">VALORAIPLUS®️</h1>
                <span className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-[11px] font-black border border-emerald-500/30">
                  CSRE OMEGA
                </span>
              </div>
              <p className="text-[14px] text-emerald-600 font-black tracking-[0.4em] mt-3 italic flex items-center gap-4 uppercase">
                <ShieldCheck className="w-5 h-5 animate-pulse text-emerald-400" /> Constitutional Semantic Runtime Envelope
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-[11px] font-black uppercase italic tracking-widest">
             <div className="bg-zinc-900 px-6 py-4 border border-zinc-800 rounded-2xl shadow-inner flex items-center gap-4">
              <Fingerprint className="w-5 h-5 text-zinc-600" />
              <span className="text-zinc-500">Anchor:</span>
              <span className="text-emerald-400">{snapshot.anchor}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-4 space-y-12">
          <InfiniteGovernanceLatticeView admissibility={admissibility} />
          <SovereignClusterView payload={payload} />
          <GSESReleaseGate permission={permission} />
          <ConstitutionalEnclosureView assertion={assertion} />
        </div>

        <div className="lg:col-span-8 space-y-12">
          <div className="bg-black border-4 border-emerald-900/40 p-20 rounded-[4rem] relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] group">
            <div className="absolute -top-40 -right-40 p-20 opacity-[0.03] grayscale group-hover:opacity-10 transition-all duration-1000">
              <Scale className="w-[500px] h-[500px] text-emerald-500" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-12">
                <div className={`w-6 h-6 rounded-full shadow-[0_0_30px_rgba(16,185,129,1)] ${assertion.isContained ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}></div>
                <span className="text-emerald-500 font-black text-sm uppercase tracking-[0.5em] italic underline decoration-emerald-900 underline-offset-[16px]">
                  14D Core Governance Closure
                </span>
              </div>

              <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter mb-8 leading-[0.85]">
                Semantic Containment: <br />
                <span className="text-emerald-500">Continuity Preserved</span>
              </h3>

              <p className="text-lg text-zinc-400 leading-relaxed max-w-4xl italic font-bold mb-10">
                "The 14D Core turns governance from a process into a containment boundary. Governance cannot be escaped because governance defines the container itself. Meaning is not only validated; meaning is contained."
              </p>

              <SovereignLawPanel />

              <div className="flex flex-wrap gap-10 mt-12">
                <button
                  onClick={() => SovereignVerdictEngine.enforceVerdictContinuity()}
                  disabled={snapshot.metrics.systemState !== "AWAITING_EVIDENCE"}
                  className={`px-16 py-8 rounded-[3rem] text-[16px] font-black uppercase italic shadow-2xl flex items-center gap-6 transition-all ${
                    snapshot.metrics.systemState === "VERDICT_SEALED"
                    ? 'bg-emerald-900/20 text-emerald-500 border border-emerald-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-black border border-emerald-400 hover:scale-105'
                  }`}
                >
                  {snapshot.metrics.systemState === "ENFORCING_CONTINUITY" ? "Enforcing Enclosure..." : snapshot.metrics.systemState === "VERDICT_SEALED" ? "14D Core Sealed" : "Enforce 14D Containment"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <MemoryTopology memoryChain={snapshot.memoryChain} />
             <TerminalProjection logs={snapshot.logs} schema={snapshot.schema} />
          </div>
        </div>
      </main>

      <footer className="mt-60 border-t-[20px] border-emerald-600 bg-black p-40 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[size:100px_100px] bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)]"></div>

        <div className="max-w-7xl mx-auto space-y-32 relative z-10">
          <div className="pt-40 border-t border-zinc-900/50 flex flex-col md:flex-row justify-between items-center gap-24">
             <div className="text-left space-y-10">
               <p className="text-[24px] font-black text-zinc-700 uppercase tracking-[1em] italic">Enclosure Authority: SAINT PAUL 55116</p>
               <p className="text-[18px] font-black text-zinc-500 mono italic uppercase bg-zinc-900 px-16 py-6 rounded-[3rem] border-2 border-zinc-800 inline-block tracking-tighter shadow-2xl">
                 {snapshot.merkleroot}
               </p>
             </div>
             <div className="bg-zinc-900/80 p-20 rounded-[5rem] border-4 border-emerald-900/30 shadow-[0_0_120px_rgba(0,0,0,0.9)]">
                <p className="text-[20px] font-black text-emerald-500 uppercase tracking-widest italic mb-6 leading-none underline decoration-emerald-900 underline-offset-[12px]">REMEMBER THE 4TH OF NOVEMBER</p>
                <p className="text-[14px] font-black text-zinc-600 mono italic uppercase tracking-tighter">valoraiplus_csre_14d_omega // MADE IN THE USA</p>
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
