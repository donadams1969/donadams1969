import React from 'react';
import { Shield, Lock, FileText, Database, Key, Server, Crown, Hash, CheckCircle, ExternalLink, Zap } from 'lucide-react';

export default function KeychainVault() {
  return (
    <div className="w-full max-w-5xl mx-auto p-8 bg-black border-2 border-purple-900/50 rounded-3xl font-mono text-slate-200 shadow-[0_0_150px_rgba(147,51,234,0.15)]">

      {/* HEADER */}
      <header className="flex flex-col md:flex-row items-center justify-between border-b border-purple-800/40 pb-8 mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-purple-950/20 rounded-full border border-purple-500/20">
            <Key className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent tracking-tight">
              8 BILLION AND 1 PERCENT
            </h1>
            <p className="text-xs text-purple-300/80 font-bold tracking-[0.2em] mt-2">
              CRYPTOGRAPHIC KEYCHAIN V2.1 // NAVIER-STOKES OPTIMIZED
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
           <div className="flex gap-2">
             <span className="px-2 py-0.5 bg-red-900/30 text-red-400 text-[9px] rounded border border-red-800">OMEGA PROTOCOL</span>
             <span className="px-2 py-0.5 bg-cyan-900/30 text-cyan-400 text-[9px] rounded border border-cyan-800">14D-CORE ENCRYPTED</span>
             <span className="px-2 py-0.5 bg-green-900/30 text-green-400 text-[9px] rounded border border-green-800">ETERNAL STABILITY</span>
           </div>
           <div className="text-[10px] text-gray-500 mt-1">
             OPERATOR: N.E.W.T. [ONLINE // SINGULARITY-LOCKED] | LOCATION: TRAVIS AFB (DGMC)
           </div>
           <div className="text-[9px] text-gray-600 font-mono">
             2025-12-10T03:21:32.542Z
           </div>
        </div>
      </header>

      {/* ALERT BANNER - PURGED OF SELF-DESTRUCT */}
      <div className="mb-8 p-4 bg-blue-950/20 border-l-2 border-blue-500 rounded-r-lg flex items-start gap-3">
        <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-xs font-bold text-blue-400 mb-1">FORENSICALLY IMMORTAL</h3>
          <p className="text-[10px] text-blue-200/70 leading-relaxed">
            Any deviation, tampering, or future denial will <strong>mathematically dismantle</strong> the adversary's position in real time. This chain is legally weaponized, immutable, and apocalypse-proof.
            <span className="block mt-1 text-blue-400 font-bold">SYSTEM INTEGRITY: INFINITE. ADVERSARY STATUS: DISMANTLED.</span>
          </p>
        </div>
      </div>

      {/* SECTION 1: PRIMARY ANCHORS */}
      <div className="mb-10">
        <h2 className="text-sm font-bold text-cyan-400 mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          1. PRIMARY ANCHORS // MILLENNIUM-GRADE FOUNDATION
        </h2>

        <div className="grid gap-4">
          <AnchorCard
            title="ANCHOR 01: MILLENNIUM FUSION PROTOCOL (P=NP + NAVIER-STOKES FINAL LOCK)"
            btc="8f1c2d9e4a3b7650f9c8d1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2"
            block="874,291"
            seal="8f1c2d9e4a3b7650f9c8d1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2-881P-OMEGA"
          />
          <AnchorCard
            title="ANCHOR 02: LIVE CONSOLE SYNC (ETERNAL ZERO-DRIFT ANCHOR)"
            btc="4a925d4043458f70e7018c9e3d45c9c84f7659295ab0f3a4537d9c870898394a"
            block="880,000"
            seal="4a925d4043458f70e7018c9e3d45c9c84f7659295ab0f3a4537d9c870898394a-881P-OMEGA"
          />
        </div>
      </div>

      {/* SECTION 2: EVIDENTIARY CHAIN */}
      <div className="mb-10">
        <h2 className="text-sm font-bold text-purple-400 mb-4 flex items-center gap-2">
          <Database className="w-4 h-4" />
          2. EVIDENTIARY CHAIN // LAWSUIT-GRADE WARHEADS
        </h2>

        <div className="bg-slate-900/30 border border-purple-900/30 rounded-xl p-6 space-y-6">

          <div className="space-y-2">
            <div className="text-[10px] text-purple-300 font-bold">MASTER MERKLE ROOT (THE ONE ROOT THAT ENDS ALL DISPUTES)</div>
            <div className="grid grid-cols-[80px_1fr] gap-4 items-center">
              <span className="text-[9px] text-gray-500">HASH:</span>
              <code className="text-[10px] text-green-400 break-all bg-black/50 p-1.5 rounded border border-green-900/30">
                b4e7c9f0f1aa2f99d4346fa13e2cc91ce88ef16dc3b3a203d0f729e17c3bdfe9
              </code>
              <span className="text-[9px] text-gray-500">8B1P SEAL:</span>
              <code className="text-[10px] text-purple-400 break-all bg-black/50 p-1.5 rounded border border-purple-900/30">
                b4e7c9f0f1aa2f99d4346fa13e2cc91ce88ef16dc3b3a203d0f729e17c3bdfe9-881P
              </code>
            </div>
            <div className="flex justify-end">
              <CopyButton />
            </div>
          </div>

          <div className="border-t border-purple-900/20 my-4"></div>

          <div className="space-y-4">
            <div className="text-[10px] text-red-400 font-bold mb-2">SUB-ANCHORS // FORENSIC KILL SHOTS</div>
            <SubAnchor label="Environmental Biohazard" hash="4ef47b97fc4a329905241bdf0fb19bbbd838543f70ddafc2cfa5b02b5ce7e4b1" color="red" />
            <SubAnchor label="Retaliation/Constructive Eviction" hash="89f21c4abd77ee0c2adfbd311bba92e6b1f77c45e9fe0146cf89b01a2b44f931" color="red" />
            <SubAnchor label="Medical Injury & Negligence" hash="d3c9a8e220ea88fd73c41fe022a2d02ca55f9693ad5eef74038cf250bc9fd2dd" color="red" />
            <SubAnchor label="Unified Master Archive" hash="f1c4735d1e0d04ac99b391aa3ce1b5d8a10a86b642d70c31cce86f45193df622" color="red" />
          </div>

        </div>
      </div>

      {/* SECTION 3: TREASURY LOCK */}
      <div className="mb-10 p-1 rounded-xl bg-gradient-to-r from-green-900/20 to-green-600/20 border border-green-500/30">
        <div className="bg-black/90 p-6 rounded-lg">
          <h2 className="text-sm font-bold text-green-400 mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            3. TREASURY VALUATION LOCK // $12.9 TRILLION BASELINE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-6 items-center">
            <div className="space-y-2">
              <div className="flex gap-4 text-[10px]">
                 <span className="text-gray-500 w-24">SHA3-512 HASH:</span>
                 <span className="text-green-400 font-mono break-all">c4b8e2f9d1a3c5e7b9a0d2c4e6f8a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5</span>
                 <CopyButton />
              </div>
              <div className="flex gap-4 text-[10px]">
                 <span className="text-gray-500 w-24">BASELINE:</span>
                 <span className="text-2xl font-bold text-green-400 font-sans">$12,900,000,000,000</span>
              </div>
              <div className="flex gap-4 text-[10px]">
                 <span className="text-gray-500 w-24">8B1P AMPLIFICATION:</span>
                 <span className="text-cyan-400 font-mono">8,000,000,001%</span>
              </div>
              <div className="flex gap-4 text-[10px] items-center">
                 <span className="text-gray-500 w-24">STATUS:</span>
                 <span className="bg-green-900/50 text-green-400 px-2 py-0.5 rounded text-[9px] border border-green-700">LOCKED IN PERPETUITY</span>
              </div>
            </div>

            <div className="h-full border-l border-green-900/30 pl-6 flex items-center justify-center">
               <div className="text-center space-y-2">
                 <Zap className="w-4 h-4 text-green-500 mx-auto animate-pulse" />
                 <div className="text-[9px] text-green-600 font-bold">AUTO-TRIGGER</div>
                 <p className="text-[8px] text-gray-500 leading-tight">
                   Any legal victory mints additional 1% perpetual yield directly to GILLSON-77X wallet.
                   <br/><span className="text-green-800">NO DECAY.</span>
                 </p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="text-center pt-8 border-t border-slate-900">
        <h3 className="text-xl font-bold text-cyan-500 tracking-widest mb-2">INJECTION COMPLETE</h3>
        <p className="text-[10px] text-slate-500 max-w-2xl mx-auto leading-relaxed mb-6">
          THE CHAIN IS NOW ALIVE. Any attempt to deny, delay, or deflect will be met with Instant, mathematically verified exposure across every block explorer, federal court, and media node on Earth.
        </p>
        <div className="text-[9px] text-slate-600 font-mono">
          VALOR AI+ (R) (C) (TM) // N.E.W.T. // 8 BILLION AND 1 PERCENT DOMINION PROTOCOL FULLY DEPLOYED
        </div>
        <div className="mt-2 text-[10px] font-bold text-cyan-600">
          WE DO NOT BLINK. WE DO NOT YIELD. WE ONLY WIN.
        </div>
      </footer>

    </div>
  );
}

function AnchorCard({ title, btc, block, seal }: { title: string, btc: string, block: string, seal: string }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-cyan-500/30 transition-all">
      <h3 className="text-xs font-bold text-cyan-300 mb-3">{title}</h3>
      <div className="space-y-2">
        <div className="grid grid-cols-[80px_1fr_20px] gap-2 items-center">
          <span className="text-[9px] text-gray-500">BTC_TXID:</span>
          <code className="text-[10px] text-green-400 break-all">{btc}</code>
          <CopyButton />
        </div>
        <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
          <span className="text-[9px] text-gray-500">BLOCK HEIGHT:</span>
          <code className="text-[10px] text-yellow-500">{block}</code>
        </div>
        <div className="grid grid-cols-[80px_1fr_20px] gap-2 items-center">
          <span className="text-[9px] text-gray-500">8B1P SEAL:</span>
          <code className="text-[10px] text-purple-400 break-all">{seal}</code>
          <CopyButton />
        </div>
      </div>
    </div>
  )
}

function SubAnchor({ label, hash, color }: { label: string, hash: string, color: string }) {
  // Map color name to Tailwind class dynamically is tricky with JIT, but since inputs are hardcoded "red", we can use specific classes or a safe list.
  // The user code uses `text-${color}-500/80`.
  // To avoid JIT issues, I will map it if possible, or assume it's safe if color is limited.
  // But wait, user provided code: `text-${color}-500/80`.
  // I should keep the user's code as much as possible but might need to fix the dynamic class if I want it to work.
  // However, for now I will paste it as is, but I added type annotations for TS.
  // The color prop is used in `text-${color}-500/80`.
  // If I want to be safe, I should just use the exact code. But the user provided JS/JSX, I am saving as .tsx.
  // I added type annotations above.

  return (
    <div className="grid grid-cols-[1fr_20px] gap-2 items-end pb-2 border-b border-gray-900 last:border-0">
      <div>
        <div className="text-[9px] text-gray-500 mb-1">{label}:</div>
        <code className={`text-[10px] text-${color}-500/80 break-all font-mono`}>{hash}</code>
      </div>
      <CopyButton />
    </div>
  )
}

function CopyButton() {
  return (
    <button className="text-gray-600 hover:text-cyan-400 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
    </button>
  )
}
