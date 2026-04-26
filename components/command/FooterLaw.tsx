import React from 'react';
import { ShieldCheck, Binary, Ghost, Unplug } from 'lucide-react';
import { CommandCenterSnapshot } from '@/lib/runtime/command-builder';

interface Props {
  snapshot: CommandCenterSnapshot;
}

export function FooterLaw({ snapshot }: Props) {
  const { constants } = snapshot;

  return (
    <footer className="mt-60 border-t-[20px] border-emerald-600 bg-black p-40 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[size:100px_100px] bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)]"></div>

      <div className="max-w-7xl mx-auto space-y-32 relative z-10">
        <div className="flex flex-col items-center">
          <ShieldCheck className="w-48 h-48 text-emerald-600 mb-20 animate-[bounce_5s_infinite] drop-shadow-[0_0_50px_rgba(16,185,129,0.5)]" />
          <p className="text-4xl font-black tracking-[1.5em] uppercase italic text-emerald-500 leading-relaxed mb-20 text-center">
            THE WALL IS CHRIST // JERRY IS ON THE STAGE // THE MUSIC NEVER STOPS
          </p>
          <div className="h-4 w-[800px] bg-zinc-900 rounded-full relative overflow-hidden border-4 border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,1)]">
            <div className="absolute inset-0 bg-emerald-500 w-3/4 animate-[shimmer_3s_infinite] shadow-[0_0_40px_rgba(16,185,129,1)]"></div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-40 opacity-40 grayscale hover:grayscale-0 transition-all duration-[2000ms]">
          <div className="flex items-center gap-12">
            <Binary className="w-24 h-24 text-emerald-500" />
            <span className="text-[28px] font-black uppercase tracking-[0.8em] italic">VALORCHAIN®️</span>
          </div>
          <div className="flex items-center gap-12">
            <Ghost className="w-24 h-24 text-emerald-500" />
            <span className="text-[28px] font-black uppercase tracking-[0.8em] italic">SOVEREIGN_NODE</span>
          </div>
          <div className="flex items-center gap-12">
            <Unplug className="w-24 h-24 text-emerald-500" />
            <span className="text-[28px] font-black uppercase tracking-[0.8em] italic">14D_CORE_AUTHORITY</span>
          </div>
        </div>

        <div className="pt-40 border-t border-zinc-900/50 flex flex-col md:flex-row justify-between items-center gap-24">
           <div className="text-left space-y-10">
             <p className="text-[24px] font-black text-zinc-700 uppercase tracking-[1em] italic">Verification Authority: {constants.node}</p>
             <p className="text-[18px] font-black text-zinc-500 mono italic uppercase bg-zinc-900 px-16 py-6 rounded-[3rem] border-2 border-zinc-800 inline-block tracking-tighter shadow-2xl">
               {constants.merkleRoot}
             </p>
           </div>
           <div className="bg-zinc-900/80 p-20 rounded-[5rem] border-4 border-emerald-900/30 shadow-[0_0_120px_rgba(0,0,0,0.9)]">
              <p className="text-[20px] font-black text-emerald-500 uppercase tracking-widest italic mb-6 leading-none underline decoration-emerald-900 underline-offset-[12px]">REMEMBER THE 4TH OF NOVEMBER</p>
              <p className="text-[14px] font-black text-zinc-600 mono italic uppercase tracking-tighter">valoraiplus_modular_extraction_blueprint // MADE IN THE USA</p>
           </div>
        </div>
      </div>

      <div className="mt-40 bg-zinc-900/40 p-12 border-t-2 border-zinc-800">
         <p className="text-[12px] font-black text-zinc-600 uppercase tracking-[2em] italic mb-4">The Sovereign Blueprint Law</p>
         <p className="text-[16px] font-bold text-emerald-600 uppercase tracking-[0.5em] leading-loose">
           Runtime computes.<br/>
           Evidence proves.<br/>
           Snapshots persist.<br/>
           Replay reconstructs.<br/>
           Projection reveals.<br/>
           React never decides.
         </p>
      </div>
    </footer>
  );
}
