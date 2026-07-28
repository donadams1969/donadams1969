import React from 'react';
import { ReleasePermission } from '@/contracts/gses';
import { Lock, Unlock, Server } from 'lucide-react';

export const GSESReleaseGate = ({ permission }: { permission: ReleasePermission }) => (
  <div className="bg-zinc-900/90 border border-zinc-800 p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
    <h2 className="text-xs font-black uppercase text-zinc-500 tracking-[0.3em] mb-8 flex items-center gap-3 italic">
      <Server className="w-5 h-5 text-emerald-500" /> GSES Release Boundary
    </h2>
    <div className="grid grid-cols-3 gap-4 mb-8">
      {[
        { label: 'Serialize', granted: permission.canSerialize },
        { label: 'Transport', granted: permission.canTransport },
        { label: 'Release', granted: permission.canRelease }
      ].map(gate => (
        <div key={gate.label} className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 ${
          gate.granted ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-red-950/20 border-red-900/30'
        }`}>
          {gate.granted ? <Unlock className="w-5 h-5 text-emerald-500" /> : <Lock className="w-5 h-5 text-red-500" />}
          <span className={`text-[10px] font-black uppercase tracking-widest ${gate.granted ? 'text-emerald-400' : 'text-red-400'}`}>
            {gate.label}
          </span>
        </div>
      ))}
    </div>
    <div className="p-4 bg-black/50 rounded-xl border border-zinc-800 text-center">
       <span className="text-[11px] font-bold text-zinc-400 italic block">{permission.reason}</span>
    </div>
  </div>
);
