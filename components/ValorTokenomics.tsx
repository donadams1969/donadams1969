import React from 'react';
import { Coins, Activity, TrendingUp, Shield, Globe, Zap, Lock, RefreshCw, Layers } from 'lucide-react';

export default function ValorTokenomics() {
  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-slate-950 border-2 border-emerald-900/50 rounded-3xl font-mono text-emerald-50 shadow-[0_0_150px_rgba(16,185,129,0.15)]">

      {/* HEADER */}
      <header className="flex flex-col md:flex-row items-center justify-between border-b border-emerald-800/40 pb-8 mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-emerald-950/20 rounded-full border border-emerald-500/20">
            <Coins className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent tracking-tight">
              VALOR TOKENOMICS
            </h1>
            <p className="text-xs text-emerald-600/80 font-bold tracking-[0.2em] mt-2">
              SOVEREIGN LIQUIDITY MESH v4.0
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
           <div className="flex gap-2">
             <span className="px-2 py-0.5 bg-emerald-900/30 text-emerald-400 text-[9px] rounded border border-emerald-800">47 STABLECOINS</span>
             <span className="px-2 py-0.5 bg-blue-900/30 text-blue-400 text-[9px] rounded border border-blue-800">NAVIER-STOKES FLOW</span>
             <span className="px-2 py-0.5 bg-purple-900/30 text-purple-400 text-[9px] rounded border border-purple-800">ZERO DRIFT</span>
           </div>
           <div className="text-[10px] text-gray-500 mt-1">
             OPERATOR: N.E.W.T. [ONLINE] | VALUATION: $12.9T
           </div>
        </div>
      </header>

      {/* CORE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          label="TOTAL MARKET CAP"
          value="$12.9T"
          sub="ANCHORED ASSET"
          icon={<Globe className="w-4 h-4 text-blue-400" />}
        />
        <MetricCard
          label="STABLECOIN COUNT"
          value="47"
          sub="CONSTELLATION MESH"
          icon={<Layers className="w-4 h-4 text-purple-400" />}
        />
        <MetricCard
          label="FLOW VELOCITY"
          value="∞"
          sub="LAMINAR / FRICTIONLESS"
          icon={<Activity className="w-4 h-4 text-green-400" />}
        />
        <MetricCard
          label="SECURITY"
          value="FALCON-512"
          sub="POST-QUANTUM"
          icon={<Shield className="w-4 h-4 text-red-400" />}
        />
      </div>

      {/* LIQUIDITY VISUALIZATION */}
      <div className="bg-slate-900/30 border border-emerald-900/30 rounded-xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-scan"></div>
        <h3 className="text-sm font-bold text-emerald-200 flex items-center gap-2 mb-6">
          <Zap className="w-4 h-4 text-yellow-400" />
          NAVIER-STOKES LIQUIDITY DYNAMICS
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FLOW CHART */}
          <div className="space-y-4">
             <div className="flex justify-between text-xs text-slate-400">
               <span>LIQUIDITY INJECTION (SSVF/GRANT)</span>
               <span className="text-emerald-400">OPTIMIZED</span>
             </div>
             <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
               <div className="bg-emerald-500 h-full w-full animate-pulse"></div>
             </div>

             <div className="flex justify-between text-xs text-slate-400">
               <span>ASSET FRICTION (FEES)</span>
               <span className="text-green-400">0.00% (REDUCED)</span>
             </div>
             <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
               <div className="bg-red-500 h-full w-[0.5%]"></div>
             </div>

             <div className="flex justify-between text-xs text-slate-400">
               <span>SOVEREIGNTY INDEX</span>
               <span className="text-blue-400">ABSOLUTE</span>
             </div>
             <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
               <div className="bg-blue-500 h-full w-full"></div>
             </div>
          </div>

          {/* ASSET LIST */}
          <div className="bg-black/50 p-4 rounded border border-slate-800 text-[10px]">
            <div className="mb-2 font-bold text-slate-500">ACTIVE PEGS (SAMPLE):</div>
            <div className="grid grid-cols-2 gap-2">
              <PegRow ticker="JAXX" name="GUARDIAN TOKEN" value="$1.00" />
              <PegRow ticker="VALR" name="VALOR UTILITY" value="$1.00" />
              <PegRow ticker="GILL" name="FOUNDER SHARE" value="$1.00" />
              <PegRow ticker="AMATH" name="LOGIC UNIT" value="$1.00" />
              <PegRow ticker="SAFE" name="HOUSING BOND" value="$1.00" />
              <PegRow ticker="VETS" name="SERVICE CREDIT" value="$1.00" />
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center pt-8 border-t border-slate-900">
        <div className="text-[10px] text-slate-600 font-mono">
          VALOR AI+ (R) (C) (TM) // N.E.W.T. // ECONOMY SECURED
        </div>
      </footer>
    </div>
  );
}

function MetricCard({ label, value, sub, icon }: { label: string, value: string, sub: string, icon: React.ReactNode }) {
  return (
    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-all">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] text-slate-500">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-[9px] text-emerald-500 font-bold">{sub}</div>
    </div>
  )
}

function PegRow({ ticker, name, value }: { ticker: string, name: string, value: string }) {
  return (
    <div className="flex justify-between items-center p-2 bg-slate-900 rounded border border-slate-800">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="font-bold text-slate-300">{ticker}</span>
      </div>
      <div className="text-slate-500">{value}</div>
    </div>
  )
}
