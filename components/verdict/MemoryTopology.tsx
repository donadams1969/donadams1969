import React from 'react';
import { Layers, LockKeyhole, RefreshCw, Lock } from 'lucide-react';
import { MemoryNode } from '@/lib/schemas/verdict';

export const MemoryTopology = ({ memoryChain }: { memoryChain: MemoryNode[] }) => (
  <div className="bg-zinc-900/90 border border-zinc-800 p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group h-full">
    <div className="absolute -top-20 -right-20 bg-emerald-500/5 w-64 h-64 rounded-full blur-3xl"></div>
    <h2 className="text-xs font-black uppercase text-zinc-500 tracking-[0.3em] mb-8 flex items-center gap-3 italic relative z-10">
      <Layers className="w-5 h-5 text-emerald-500" /> Three-Memory Topology
    </h2>
    <div className="space-y-6 relative z-10">
      {memoryChain.map((node, index) => (
        <div key={node.id} className="relative">
          <div className={`flex flex-col p-6 rounded-3xl border-2 transition-all duration-500 ${
            node.status === 'SEALED' ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]' :
            node.status === 'PROCESSING' ? 'bg-zinc-950 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' :
            'bg-black/60 border-zinc-800'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <span className={`text-[11px] font-black uppercase tracking-widest ${
                node.status === 'SEALED' ? 'text-emerald-400' : 'text-zinc-500'
              }`}>
                {node.memoryType} MEMORY
              </span>
              {node.status === 'SEALED' && <LockKeyhole className="w-5 h-5 text-emerald-500" />}
              {node.status === 'PROCESSING' && <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />}
              {node.status === 'LOCKED' && <Lock className="w-5 h-5 text-zinc-700" />}
            </div>
            <div className="flex justify-between items-end">
              <span className="text-[14px] font-black text-white italic tracking-tighter">{node.store}</span>
              <span className="text-[18px] font-mono text-emerald-500 font-bold">{node.value.toLocaleString()}</span>
            </div>

            <div className="h-1.5 w-full bg-black rounded-full mt-4 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${node.status === 'SEALED' ? 'bg-emerald-500' : 'bg-emerald-400 animate-pulse'}`}
                style={{ width: `${(node.value / 15682) * 100}%` }}
              ></div>
            </div>
          </div>

          {index < memoryChain.length - 1 && (
            <div className="flex justify-center my-2">
              <div className={`w-1 h-8 rounded-full ${memoryChain[index].status === 'SEALED' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-zinc-800'}`}></div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);
