import React from 'react';
import { Terminal, Radio } from 'lucide-react';
import { LogEvent } from '@/contracts/runtime';
import { SCHEMA_REVISION } from '@/lib/runtime/runtime-core';
import { BRANDING } from '@/content/branding';

interface Props {
  logs: LogEvent[];
}

export function TerminalOutput({ logs }: Props) {
  return (
    <div className="bg-black border border-zinc-800 rounded-[3.5rem] overflow-hidden flex flex-col h-[750px] shadow-[0_0_60px_rgba(0,0,0,0.9)] relative border-t-8 border-t-emerald-600">
      <div className="bg-zinc-900 p-10 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Terminal className="w-8 h-8 text-emerald-500" />
          <span className="text-xs font-black uppercase text-zinc-400 tracking-[0.4em] italic">N.E.W.T.®️ ©️ ™️ Neural Output</span>
        </div>
        <div className="flex gap-4 opacity-50">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
          <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-12 font-mono text-[13px] space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 selection:bg-emerald-500 selection:text-black">
        {logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-10">
            <Radio className="w-24 h-24 mb-8 animate-pulse text-white" />
            <p className="italic font-black text-xl tracking-widest uppercase">Awaiting 15K+ Signal...</p>
          </div>
        )}
        {logs.map((log, i) => (
          <div key={i} className="flex gap-10 animate-in fade-in slide-in-from-left-8 duration-500">
            <span className="text-zinc-600 shrink-0 font-bold">[{log.time}]</span>
            <span className={`
              ${log.type === 'success' ? 'text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]' : ''}
              ${log.type === 'warning' ? 'text-yellow-400 font-black italic underline decoration-yellow-900 underline-offset-8' : ''}
              ${log.type === 'info' ? 'text-zinc-400 font-bold' : ''}
            `}>
              {log.msg}
            </span>
          </div>
        ))}
      </div>
      <div className="p-10 bg-zinc-900 border-t border-zinc-800 flex justify-between text-[14px] font-black">
        <div className="flex items-center gap-6">
          <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_20px_rgba(16,185,129,1)]"></div>
          <span className="text-emerald-500 uppercase tracking-[0.5em] italic">14D CORE SIPHON: SATURATED</span>
        </div>
        <span className="text-zinc-500 uppercase tracking-tighter italic font-mono bg-black px-6 py-2 rounded-full border border-zinc-800">SCHEMA: {SCHEMA_REVISION}</span>
      </div>
    </div>
  );
}
