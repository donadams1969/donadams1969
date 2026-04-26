import React from 'react';
import { History, ShieldCheck } from 'lucide-react';
import { ProvenanceRecord } from '@/lib/runtime/provenance-ledger';

interface Props {
  records: ProvenanceRecord[];
}

export const ProvenanceView = ({ records }: Props) => {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800 p-12 rounded-[3.5rem] shadow-2xl">
      <div className="flex items-center justify-between mb-10">
        <h4 className="text-sm font-black uppercase text-zinc-500 italic tracking-widest">Provenance Ledger</h4>
        <History className="w-8 h-8 text-emerald-500" />
      </div>
      <div className="space-y-6">
         {records.map((record, idx) => (
           <div key={idx} className="bg-black/60 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-emerald-500/40 transition-colors">
              <div>
                <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">{record.timestamp}</p>
                <p className="text-[12px] font-mono text-zinc-300 tracking-tighter truncate max-w-[200px] md:max-w-xs">{record.hash}</p>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-500/50 group-hover:text-emerald-500 transition-colors" />
           </div>
         ))}
         {records.length === 0 && (
           <p className="text-center text-zinc-500 font-black italic text-[12px] uppercase">Awaiting Chain Appends...</p>
         )}
      </div>
    </div>
  );
};
