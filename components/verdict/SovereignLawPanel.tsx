import React from 'react';

export const SovereignLawPanel = () => (
  <div className="bg-zinc-950/80 border-l-8 border-emerald-600 p-10 rounded-3xl shadow-inner my-12">
    <p className="text-[12px] font-black uppercase text-emerald-500 tracking-[0.3em] mb-6 italic">The Governing Law</p>
    <div className="space-y-3">
      {[
        { l: "No Evidence", r: "No Receipt" },
        { l: "No Receipt", r: "No Continuity" },
        { l: "No Continuity", r: "No Governance" },
        { l: "No Governance", r: "No Verdict" },
        { l: "No Verdict", r: "No Snapshot" },
        { l: "No Snapshot", r: "No Projection" }
      ].map((law, idx) => (
        <div key={idx} className="flex items-center gap-4">
          <span className="text-[16px] font-black text-zinc-300 uppercase tracking-[0.2em] w-48 text-right">{law.l}</span>
          <span className="text-emerald-600 font-black">→</span>
          <span className="text-[16px] font-black text-emerald-400 uppercase tracking-[0.2em] italic">{law.r}</span>
        </div>
      ))}
    </div>
  </div>
);
