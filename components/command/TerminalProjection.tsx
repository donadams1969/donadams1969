import React from 'react';
import { Terminal, Radio } from 'lucide-react';
import { CommandCenterSnapshot } from '@/lib/runtime/command-builder';

interface Props {
  snapshot: CommandCenterSnapshot;
}

export function TerminalProjection({ snapshot }: Props) {
  const { logs, constants } = snapshot;

  return (
    <div className="bg-black border border-zinc-800 rounded-[4rem] overflow-hidden flex flex-col h-[800px] shadow-[0_0_100px_rgba(0,0,0,0.95)] relative border-t-[12px] border-t-emerald-600">
      <div className="bg-zinc-900 p-12 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Terminal className="w-10 h-10 text-emerald-500" />
          <span className="text-xs font-black uppercase text-zinc-400 tracking-[0.5em] italic">N.E.W.T.®️ ©️ ™️ Separation Output</span>
        </div>
        <div className="flex gap-6 opacity-40">
          <div className="w-5 h-5 rounded-full bg-red-500"></div>
          <div className="w-5 h-5 rounded-full bg-yellow-500"></div>
          <div className="w-5 h-5 rounded-full bg-emerald-500"></div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-16 font-mono text-[14px] space-y-8 scrollbar-thin scrollbar-thumb-zinc-800 selection:bg-emerald-500 selection:text-black">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-12 animate-in fade-in slide-in-from-left-12 duration-500">
            <span className="text-zinc-700 shrink-0 font-bold">[{log.time}]</span>
            <span className={`
              ${log.type === 'success' ? 'text-emerald-400 font-black drop-shadow-[0_0_10px_rgba(16,185,129,0.7)]' : ''}
              ${log.type === 'warning' ? 'text-yellow-400 font-black italic underline decoration-yellow-900 underline-offset-[12px]' : ''}
              ${log.type === 'info' ? 'text-zinc-400 font-bold' : ''}
            `}>
              {log.msg}
            </span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-10 uppercase italic">
             <Radio className="w-32 h-32 mb-12 animate-pulse text-white" />
             <p className="text-3xl font-black tracking-widest text-center">Awaiting Blueprint Execution...</p>
          </div>
        )}
      </div>
      <div className="p-12 bg-zinc-900 border-t border-zinc-800 flex justify-between text-[16px] font-black">
        <div className="flex items-center gap-8">
          <div className="w-6 h-6 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_30px_rgba(16,185,129,1)]"></div>
          <span className="text-emerald-500 uppercase tracking-[0.6em] italic">AUTHORITY EXTRACTED</span>
        </div>
        <span className="text-zinc-500 uppercase tracking-tighter italic font-mono bg-black px-10 py-2 rounded-full border border-zinc-800">SCHEMA: {constants.version}</span>
      </div>
    </div>
  );
}
