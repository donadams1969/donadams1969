import React from 'react';
import { Cpu } from 'lucide-react';
import { KernelPhase } from '@/lib/runtime/kernel';

interface Props {
  phase: KernelPhase;
}

export const LifecycleStatus = ({ phase }: Props) => {
  return (
    <div className="bg-zinc-950/80 border border-emerald-900/30 p-6 rounded-3xl flex items-center justify-between shadow-inner w-full max-w-md mx-auto">
       <div className="flex items-center gap-4">
         <Cpu className={`w-8 h-8 ${phase === 'RUNNING' ? 'text-emerald-500' : phase === 'HALTED' ? 'text-red-500' : 'text-emerald-500 animate-pulse'}`} />
         <div>
           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Kernel Phase</p>
           <p className={`text-[16px] font-black uppercase tracking-widest ${phase === 'RUNNING' ? 'text-white' : phase === 'HALTED' ? 'text-red-400' : 'text-emerald-400'}`}>
             {phase}
           </p>
         </div>
       </div>
       <div className="flex gap-2">
         {['BOOT', 'HYDRATING', 'RUNNING'].map(p => (
           <div key={p} className={`w-2 h-8 rounded-full ${
             phase === p ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' :
             (p === 'BOOT' && (phase === 'HYDRATING' || phase === 'RUNNING')) || (p === 'HYDRATING' && phase === 'RUNNING') ? 'bg-emerald-900' : 'bg-zinc-800'
           }`}></div>
         ))}
       </div>
    </div>
  );
};
