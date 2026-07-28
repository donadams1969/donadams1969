import React from 'react';
import { Terminal, Radio } from 'lucide-react';
import { LogEntry } from '@/lib/schemas/verdict';

export const TerminalProjection = ({ logs, schema }: { logs: LogEntry[], schema: string }) => (
  <div className="bg-black border border-zinc-800 rounded-[3.5rem] overflow-hidden flex flex-col h-[800px] shadow-[0_0_60px_rgba(0,0,0,0.9)] relative border-t-8 border-t-emerald-600">
    <div className="bg-zinc-900 p-10 border-b border-zinc-800 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Terminal className="w-8 h-8 text-emerald-500" />
        <span className="text-xs font-black uppercase text-zinc-400 tracking-[0.4em] italic">Verdict Lineage Contract Output</span>
      </div>
      <div className="flex gap-4 opacity-50">
        <div className="w-4 h-4 rounded-full bg-red-500"></div>
        <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
        <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
      </div>
    </div>
    <div className="flex-1 overflow-y-auto p-12 font-mono text-[12px] space-y-5 scrollbar-thin scrollbar-thumb-zinc-800 selection:bg-emerald-500 selection:text-black">
      {logs.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center opacity-10 uppercase italic">
           <Radio className="w-24 h-24 mb-10 animate-pulse text-white" />
           <p className="text-2xl font-black tracking-widest text-center">Awaiting Continuity Engine...</p>
        </div>
      ) : (
        logs.map((log) => (
          <div key={log.id} className="flex gap-8 animate-in fade-in slide-in-from-left-8 duration-300">
            <span className="text-zinc-600 shrink-0 font-bold">[{log.time}]</span>
            <span className={`
              ${log.type === 'success' ? 'text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]' : ''}
              ${log.type === 'critical' ? 'text-red-500 font-black italic underline decoration-red-900 underline-offset-8 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]' : ''}
              ${log.type === 'warning' ? 'text-yellow-400 font-bold' : ''}
              ${log.type === 'info' ? 'text-zinc-400 font-medium' : ''}
              ${log.type === 'hash' ? 'text-emerald-600 font-bold italic' : ''}
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
        <span className="text-emerald-500 uppercase tracking-[0.5em] italic">SHA-256 HASHING KERNEL ACTIVE</span>
      </div>
      <span className="text-zinc-500 uppercase tracking-tighter italic font-mono bg-black px-8 py-2 rounded-full border border-zinc-800">SCHEMA: {schema}</span>
    </div>
  </div>
);
