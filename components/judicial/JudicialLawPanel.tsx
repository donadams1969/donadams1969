import React from 'react';
import { JudicialAdmission } from '@/contracts/judicial';
import { Scale, CheckCircle2, AlertTriangle } from 'lucide-react';

export const JudicialLawPanel = ({ admission }: { admission: JudicialAdmission }) => {
  return (
    <div className="bg-zinc-950/80 border-l-8 border-emerald-600 p-10 rounded-[2.5rem] shadow-inner my-12">
      <div className="flex items-center justify-between mb-8">
         <p className="text-[12px] font-black uppercase text-emerald-500 tracking-[0.3em] italic flex items-center gap-3">
           <Scale className="w-5 h-5" /> Judicial Runtime Law
         </p>
         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
            admission.admitted ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-500/50' : 'bg-red-900/50 text-red-400 border border-red-500/50'
         }`}>
            {admission.admitted ? 'ADMITTED' : 'REJECTED'}
         </span>
      </div>

      <div className="space-y-4">
        {admission.evaluations.map((evaluation) => (
          <div key={evaluation.lawId} className={`flex items-start gap-4 p-4 rounded-2xl border ${
             evaluation.passed ? 'bg-black/40 border-zinc-800' : 'bg-red-950/20 border-red-900/30'
          }`}>
            {evaluation.passed ? (
               <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
            ) : (
               <AlertTriangle className="w-5 h-5 text-red-500 mt-1 shrink-0" />
            )}
            <div>
               <p className="text-[13px] font-black text-zinc-300 uppercase tracking-widest mb-1">{evaluation.lawId}</p>
               <p className="text-[11px] font-bold text-zinc-500 italic leading-relaxed">{evaluation.reason}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-zinc-800">
         <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest leading-loose">
           Runtime computes.<br/>
           Evidence proves.<br/>
           Snapshots persist.<br/>
           Replay reconstructs.<br/>
           Projection reveals.<br/>
           React never decides.
         </p>
      </div>
    </div>
  );
};
