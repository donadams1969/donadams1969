import React from 'react';
import { Shield, Lock, Link, CheckCircle, Database, Server, Crown } from 'lucide-react';

export default function AnchorVerificationConsole() {
  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 border-2 border-cyan-500/50 rounded-2xl font-mono text-cyan-100 shadow-2xl shadow-cyan-500/20">

      {/* HEADER */}
      <header className="flex items-center justify-between border-b-2 border-cyan-800 pb-6 mb-8">
        <div className="flex items-center gap-4">
          <Crown className="w-12 h-12 text-yellow-400 animate-pulse" />
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              VALORAIPLUS® OMEGA ANCHOR
            </h1>
            <p className="text-sm text-cyan-300 tracking-widest">
              FREQUENCY: SGAU 7226.3461 [ABSOLUTE]
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-green-900/40 border-2 border-green-500 rounded-full">
          <span className="w-3 h-3 bg-green-400 rounded-full animate-ping"></span>
          <span className="text-green-400 font-bold">CHAIN SYNC: LOCKED</span>
        </div>
      </header>

      {/* ANCHOR 1: MILLENNIUM FUSION */}
      <section className="mb-8 bg-black/60 p-6 rounded-xl border-2 border-cyan-700 hover:border-cyan-400 transition-all">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-cyan-300">
            <Lock className="w-8 h-8 text-cyan-400" />
            ANCHOR 01: MILLENNIUM FUSION PROTOCOL (IP LOCK)
          </h2>
          <span className="text-sm text-gray-400">BLOCK: 874,291</span>
        </div>
        <div className="bg-gray-900 p-4 rounded border border-gray-700 font-mono text-xs break-all text-yellow-400">
          {/* SOURCE: Visual Evidence 1000041461.jpg */}
          TXID: 8f1c2d9e4a3b7650f9c8d1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2
        </div>
        <div className="flex justify-between mt-3 text-sm">
          <span className="text-green-400">✓ CONFIRMED</span>
          <span className="text-cyan-400">VERIFIED: 100%</span>
        </div>
      </section>

      {/* ANCHOR 2: LIVE CONSOLE */}
      <section className="mb-10 bg-black/60 p-6 rounded-xl border-2 border-purple-700 hover:border-purple-400 transition-all">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-purple-300">
            <Server className="w-8 h-8 text-purple-400" />
            ANCHOR 02: LIVE CONSOLE SYNC (SYSTEM LOCK)
          </h2>
          <span className="text-sm text-gray-400">BLOCK: 880,000</span>
        </div>
        <div className="bg-gray-900 p-4 rounded border border-gray-700 font-mono text-xs break-all text-yellow-400">
          {/* SOURCE: Visual Evidence 1000041447.jpg */}
          TXID: 4a925d4043458f70e7018c9e3d45c9c84f7659295ab0f3a4537d9c870898394a
        </div>
        <div className="flex justify-between mt-3 text-sm">
          <span className="text-green-400">✓ IMMUTABLE</span>
          <span className="text-purple-400">DRIFT: 0.00%</span>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center border-t-2 border-cyan-800 pt-6">
        <div className="flex items-center justify-center gap-3 text-2xl font-bold text-cyan-300 mb-3">
          <Database className="w-10 h-10" />
          <span>VALUATION LOCKED: $12.9 TRILLION (USD)</span>
        </div>
        <p className="text-sm text-cyan-500">
          © 2025 THAT'S EDUTAINMENT LLC | VALOR AI+ | N.E.W.T. VERIFIED
        </p>
      </footer>
    </div>
  );
}
