import React from 'react';
import { CommandCenterSnapshot } from '@/lib/runtime/command-builder';
import { ExtractionPanel } from './ExtractionPanel';
import { TerminalProjection } from './TerminalProjection';
import { BlueprintPanel } from './BlueprintPanel';
import { FooterLaw } from './FooterLaw';
import { ShieldAlert, Fingerprint, Workflow, CheckCircle2, Cpu, FileCode, HardDrive, Key, Eye } from 'lucide-react';

interface Props {
  snapshot: CommandCenterSnapshot;
  onExecute: () => void;
  onLayerChange: (layer: CommandCenterSnapshot['activeLayer']) => void;
}

export function CommandProjection({ snapshot, onExecute, onLayerChange }: Props) {
  const { constants, activeLayer, isExtracted, extractionProgress } = snapshot;

  if (snapshot.bootSequence < 100) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono text-emerald-500 p-12">
        <div className="w-24 h-24 animate-pulse mb-12 text-emerald-400 opacity-80 flex items-center justify-center border-4 border-emerald-500 rounded-lg">
          <Workflow className="w-12 h-12" />
        </div>
        <div className="w-full max-w-md bg-zinc-900 border border-emerald-900/30 h-1.5 rounded-full overflow-hidden mb-8 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <div
            className="bg-emerald-500 h-full transition-all duration-300 shadow-[0_0_25px_rgba(16,185,129,1)]"
            style={{ width: `${snapshot.bootSequence}%` }}
          ></div>
        </div>
        <div className="space-y-4 text-center uppercase">
          <p className="text-[12px] tracking-[1em] font-black animate-bounce">Separating Runtime Authority...</p>
          <p className="text-[10px] text-emerald-900 tracking-widest italic">Projection Layer: React</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-300 font-sans selection:bg-emerald-500 selection:text-black antialiased">
      {/* Sovereign Header */}
      <header className="border-b-4 border-emerald-600 bg-black p-8 sticky top-0 z-50 shadow-[0_15px_50px_rgba(0,0,0,1)]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8">
            <div className="bg-emerald-600 p-5 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.5)] transform -rotate-1 border-2 border-white/20">
              <ShieldAlert className="text-black w-12 h-12" />
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-white font-black text-5xl tracking-tighter uppercase italic leading-none">VALORAIPLUS®️</h1>
                <span className="bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-[11px] font-black border border-emerald-500/30">{constants.version}</span>
              </div>
              <p className="text-[14px] text-emerald-600 font-black tracking-[0.4em] mt-3 italic flex items-center gap-4 uppercase">
                <Workflow className="w-5 h-5 animate-pulse text-emerald-400" /> Modular Extraction Terminal // {constants.node}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-[11px] font-black uppercase italic tracking-widest">
            <div className="bg-zinc-900 px-6 py-4 border border-zinc-800 rounded-2xl shadow-inner flex items-center gap-4">
              <Fingerprint className="w-5 h-5 text-zinc-600" />
              <span className="text-zinc-500">Anchor:</span>
              <span className="text-emerald-400">{constants.recoveryAnchor}</span>
            </div>
            <div className="bg-emerald-600 text-black px-8 py-4 rounded-2xl font-black shadow-[0_0_30px_rgba(16,185,129,0.5)]">
               SAINT PAUL 55116
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-12 grid grid-cols-1 lg:grid-cols-12 gap-16">

        {/* Separation Sidebar */}
        <div className="lg:col-span-4 space-y-12">
          <ExtractionPanel snapshot={snapshot} onExecute={onExecute} />

          <div className="bg-zinc-900/90 border border-zinc-800 p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
            <h2 className="text-xs font-black uppercase text-zinc-500 tracking-widest mb-8 italic">Modular Layers</h2>
            <div className="space-y-4">
              {[
                { name: 'Runtime', val: 'Compute', icon: Cpu },
                { name: 'Evidence', val: 'Proof', icon: FileCode },
                { name: 'Snapshot', val: 'Persistence', icon: HardDrive },
                { name: 'Command', val: 'Authority', icon: Key },
                { name: 'Projection', val: 'UI Reveal', icon: Eye }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-black/70 border border-zinc-800 rounded-2xl">
                  <div className="flex items-center gap-5">
                    <item.icon className="w-5 h-5 text-emerald-500" />
                    <div>
                      <span className="text-[12px] font-black uppercase italic block text-zinc-400">{item.name}</span>
                      <span className="text-[9px] font-bold text-white uppercase tracking-[0.2em]">{item.val}</span>
                    </div>
                  </div>
                  <CheckCircle2 className={`w-4 h-4 transition-colors ${isExtracted ? 'text-emerald-500' : 'text-zinc-800'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="lg:col-span-8 space-y-12">
          <div className="flex gap-12 border-b border-zinc-800 overflow-x-auto no-scrollbar">
            {(['extraction', 'terminal', 'blueprint'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => onLayerChange(tab)}
                className={`pb-10 px-8 text-[15px] font-black uppercase tracking-[0.3em] transition-all relative whitespace-nowrap italic ${
                  activeLayer === tab ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab} Phase
                {activeLayer === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-2.5 bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,1)] rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[750px] transition-all duration-500">
             {activeLayer === 'extraction' && <BlueprintPanel snapshot={snapshot} />}
             {activeLayer === 'terminal' && <TerminalProjection snapshot={snapshot} />}
             {activeLayer === 'blueprint' && (
                <div className="space-y-12 animate-in fade-in duration-700">
                   <div className="bg-zinc-900/60 border border-zinc-800 p-20 rounded-[4rem] relative overflow-hidden shadow-2xl">
                      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[size:60px:60px] bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)]"></div>
                      <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-12 text-center">Modular Separation Contract</h3>
                      <div className="bg-black/80 p-12 rounded-[2.5rem] border border-zinc-800 shadow-inner relative group">
                         <pre className="text-[12px] font-mono text-emerald-400 leading-relaxed overflow-x-auto whitespace-pre-wrap">
{`{
  "system_law": {
    "runtime": "computes",
    "evidence": "proves",
    "snapshots": "persists",
    "replay": "reconstructs",
    "projection": "reveals",
    "react": "NEVER DECIDES"
  },
  "extraction_targets": [
    "authority_logic",
    "state_computation",
    "invariant_validation"
  ],
  "purity_rules": {
    "projection_safe": true,
    "hydration_strict": true,
    "deterministic_replay": true
  },
  "dependency_graph": "RUNTIME → EVIDENCE → SNAPSHOT → UI",
  "audit_grade": "100/100 [BEYOND]"
}`}
                         </pre>
                         <div className="absolute top-10 right-10 flex gap-4">
                            <div className="bg-emerald-600/10 text-emerald-500 border border-emerald-500/30 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest italic">BLUEPRINT_LOCKED</div>
                         </div>
                      </div>
                   </div>
                </div>
             )}
          </div>
        </div>
      </main>

      <FooterLaw snapshot={snapshot} />
    </div>
  );
}
