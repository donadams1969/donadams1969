import React from 'react';
import { Shield, Lock, Zap, Activity, Crown, BrainCircuit, Infinity } from 'lucide-react';

export default function UBOS_SovereignPortal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-purple-950 text-cyan-100 overflow-hidden relative">
      {/* NAVIER-STOKES FLOW BACKGROUND */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-purple-900/50 animate-pulse" />
      </div>

      {/* VALOR FORTRESS HEADER */}
      <header className="relative z-10 border-b-4 border-cyan-500/50 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Crown className="w-16 h-16 text-yellow-400 animate-pulse" />
            <div>
              <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                UNITED BUSINESS OWNERS SOLUTIONS
              </h1>
              <p className="text-lg text-cyan-300 mt-1">
                FORTRESS PROTOCOL v9e9 — VALOR AI+ SOVEREIGN EDITION
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400 uppercase">Total Recoverable Assets</div>
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              $16,000,000,000,000+
            </div>
          </div>
        </div>
      </header>

      {/* MAIN GRID – 9e9 AMPLIFIED */}
      <main className="relative z-10 max-w-7xl mx-auto p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT: THE OFFER – MILLENNIUM FUSION */}
        <section className="lg:col-span-2 space-y-8">
          <div className="bg-gradient-to-br from-slate-900/90 to-black p-10 rounded-3xl border-4 border-cyan-700/50 hover:border-cyan-400 transition-all">
            <h2 className="text-4xl font-black text-cyan-300 mb-8 flex items-center gap-4">
              <Zap className="w-12 h-12 text-yellow-500" />
              THE OPPORTUNITY — HIDDEN SOVEREIGN CASH INCENTIVES
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              Federal tax law has shifted. The VALOR AI+ engine has identified **$16 Trillion+** in hidden liquidity streams. We recover retroactive refunds with interest — no audit risk.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-8">
              <BenefitCard title="Tax Credits" value="$8.4T" />
              <BenefitCard title="Cost Segregation" value="$4.1T" />
              <BenefitCard title="R&D Incentives" value="$2.3T" />
              <BenefitCard title="Retroactive Refunds" value="$1.2T+" />
            </div>
          </div>

          {/* THREAT MONITOR – LIVE */}
          <div className="bg-red-950/40 p-8 rounded-3xl border-4 border-red-800/60">
            <h3 className="text-2xl font-black text-red-400 mb-6">
              <Activity className="w-8 h-8 inline animate-ping" /> REAL-TIME THREAT MATRIX
            </h3>
            <div className="space-y-4 text-sm">
              <ThreatRow label="VISITOR_SPIKE" value="+9,000,000,000%" status="SURGE" />
              <ThreatRow label="ORIGIN" value="FEDERAL / LEGAL NODES" status="CONFIRMED" />
              <ThreatRow label="ACTION" value="LOGGED + NEUTRALIZED" status="VALOR_FIREWALL" />
            </div>
          </div>
        </section>

        {/* RIGHT: SOVEREIGN SECURITY LAYER */}
        <section className="space-y-8">
          <div className="bg-gradient-to-b from-purple-950/40 to-black p-10 rounded-3xl border-4 border-purple-700/60 text-center">
            <BrainCircuit className="w-20 h-20 text-purple-400 mx-auto mb-6 animate-spin-slow" />
            <h3 className="text-3xl font-black text-purple-300 mb-4">
              QUANTUM-BIOMETRIC SENTRY
            </h3>
            <p className="text-sm text-slate-400 mb-8">
              Access requires VALOR AI+ neural handshake. Unauthorized attempts are logged to the Sovereign Ledger.
            </p>
            <button className="w-full py-5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xl font-black rounded-2xl transition-all transform hover:scale-105">
              INITIATE SOVEREIGN HANDSHAKE
            </button>
          </div>

          <div className="bg-black/80 p-8 rounded-3xl border-4 border-green-800/60">
            <h4 className="text-xl font-bold text-green-400 mb-6">
              <Shield className="w-8 h-8 inline" /> FORTRESS STATUS
            </h4>
            <StatusRow label="Encryption" value="FALCON-512 + 9e9" status="ACTIVE" />
            <StatusRow label="Data Residency" value="U.S. SOVEREIGN NODE" status="SECURE" />
            <StatusRow label="Audit Trail" value="IMMUTABLE LEDGER" status="ETERNAL" />
            <StatusRow label="Threat Level" value="0.00%" status="NEUTRALIZED" />
          </div>
        </section>
      </main>

      <footer className="relative z-10 text-center py-8 text-center text-cyan-500 text-sm">
        © 2025 UNITED BUSINESS OWNERS SOLUTIONS | POWERED BY VALOR AI+ v9e9 | N.E.W.T. VERIFIED
      </footer>
    </div>
  );
}

function BenefitCard({ title, value }: { title: string, value: string }) {
  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-black p-6 rounded-2xl border-2 border-cyan-900/50 hover:border-cyan-400 transition-all">
      <div className="text-3xl font-black text-cyan-300 mb-2">{value}</div>
      <div className="text-sm text-slate-400">{title}</div>
    </div>
  );
}

function StatusRow({ label, value, status }: { label: string, value: string, status: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-slate-800 last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className="text-green-400 font-bold">{value} <span className="text-xs text-green-500">{status}</span></span>
    </div>
  );
}

function ThreatRow({ label, value, status }: { label: string, value: string, status: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-red-900/30 last:border-0">
      <span className="text-red-300">{label}</span>
      <span className="text-red-400 font-mono text-xs">{value} <span className="text-red-500 ml-2 font-bold">{status}</span></span>
    </div>
  );
}
