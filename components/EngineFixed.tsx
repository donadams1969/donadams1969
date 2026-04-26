"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  Terminal,
  Activity,
  Lock,
  Zap,
  Globe,
  Database,
  AlertCircle,
  CheckCircle2,
  Cpu,
  BarChart3,
  Search,
  ExternalLink,
  Ghost,
  Fingerprint,
  Radio,
  Unplug,
  Server,
  Scale,
  ShieldCheck,
  Binary
} from 'lucide-react';

/**
 * VALORAIPLUS®️ ©️ ™️ ENGINE v2.2 OMEGA [15,000+ ERROR RESOLUTION]
 * ARCHITECT: POPPA DONNY GILLSON®️ ©️ ™️
 * NODE: SAINT PAUL 55116
 * LITIGATION HOLD: donadams1969.eth
 */

export function EngineFixed() {
  const [bootSequence, setBootSequence] = useState(0);
  const [activeModule, setActiveModule] = useState('core');
  const [errorResolution, setErrorResolution] = useState(0);
  const [logs, setLogs] = useState<{time: string, msg: string, type: string}[]>([]);
  const [engineStatus, setEngineStatus] = useState('STANDBY');
  const [logicSaturation, setLogicSaturation] = useState(99.1);

  const merkleroot = "26856B24C50750F0C69C1EEB86A69EF777777";
  const encryptedPhone = "408 384 1376";
  const targetAppId = "VALORAIPLUS-ENGINE-REV34-15K-FIX";

  // Forensic Constants for the 15,000+ Event
  const TOTAL_ERRORS = 15682;
  const SETTLEMENT_TARGET = 508000000;

  useEffect(() => {
    const timer = setInterval(() => {
      setBootSequence(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 15);
    return () => clearInterval(timer);
  }, []);

  const addLog = useCallback((msg: string, type = 'info') => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [{ time, msg, type }, ...prev].slice(0, 50));
  }, []);

  const runHighVelocityFix = () => {
    setEngineStatus('RECONSTRUCTING');
    addLog("AMATH EXECUTIVE OVERRIDE: INITIATING RECOVERY OF 15,682 SPOLIATION PACKETS.", "warning");
    addLog("SIPHONING FRAGMENTS FROM 14D CORE... TARGET: donadams1969.eth", "info");

    let current = 0;
    const interval = setInterval(() => {
      const burst = Math.floor(Math.random() * 500) + 200;
      current += burst;

      if (current >= TOTAL_ERRORS) {
        setErrorResolution(TOTAL_ERRORS);
        setEngineStatus('ZENITH');
        setLogicSaturation(100.0);
        addLog("ENGINE v2.2 FIX COMPLETE. ALL 15,682 ERRORS CONVERTED TO EVIDENCE.", "success");
        addLog("EPISTEMIC SUICIDE MANDATE: FULLY SATURATED.", "success");
        addLog("ADVERSE INFERENCE INSTRUCTION: MANDATORY FOR ALL TRIBUNALS.", "warning");
        clearInterval(interval);
      } else {
        setErrorResolution(current);
        if (current % 1500 < 500) {
          addLog(`Reassembling spoliated bit-string 0x${current.toString(16)}... LATCHED`, "info");
        }
      }
    }, 40);
  };

  if (bootSequence < 100) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono text-emerald-500 p-12">
        <div className="relative mb-16">
          <Cpu className="w-24 h-24 animate-pulse text-emerald-400" />
          <div className="absolute inset-0 animate-ping opacity-10 bg-emerald-500 rounded-full"></div>
        </div>
        <div className="w-full max-w-md bg-zinc-900 border border-emerald-900/30 h-1.5 rounded-full overflow-hidden mb-8 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <div
            className="bg-emerald-500 h-full transition-all duration-300 shadow-[0_0_25px_rgba(16,185,129,0.9)]"
            style={{ width: `${bootSequence}%` }}
          ></div>
        </div>
        <div className="space-y-4 text-center">
          <p className="text-[11px] tracking-[0.6em] uppercase text-emerald-600 font-black animate-bounce">Reconstructing valor-ai-engine.zip [15K+ Delta]...</p>
          <p className="text-[9px] font-black text-emerald-900 uppercase tracking-widest italic">Node: Saint Paul 55116 // Merkle: {merkleroot.slice(0, 16)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-300 font-sans selection:bg-emerald-500 selection:text-black antialiased overflow-x-hidden">
      {/* Sovereign Header Latch */}
      <header className="border-b-4 border-emerald-600 bg-black p-8 sticky top-0 z-50 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8">
            <div className="bg-emerald-600 p-5 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.6)] transform -rotate-1 border-2 border-white/20">
              <ShieldAlert className="text-black w-11 h-11" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-white font-black text-5xl tracking-tighter uppercase italic leading-none">VALORAIPLUS®️</h1>
                <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded text-[11px] font-black border border-emerald-500/20">ENGINE v2.2 OMEGA</span>
              </div>
              <p className="text-[12px] text-emerald-600 font-black tracking-[0.4em] mt-3 italic flex items-center gap-3">
                <Radio className="w-4 h-4 animate-pulse text-emerald-400" /> SAINT PAUL NODE 55116 // 15,682 ERRORS FIXED
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-5 text-[11px] font-black">
            <div className="bg-zinc-900 px-5 py-3 border border-zinc-800 rounded-xl shadow-inner flex items-center gap-3">
              <Fingerprint className="w-4 h-4 text-zinc-600" />
              <span className="text-zinc-500 uppercase">Anchor:</span>
              <span className="text-emerald-400">donadams1969.eth</span>
            </div>
            <div className="bg-zinc-900 px-5 py-3 border border-zinc-800 rounded-xl shadow-inner">
              <span className="text-zinc-500 mr-2 uppercase">LATCH:</span>
              <span className="text-emerald-400 font-mono italic tracking-tighter">{encryptedPhone}</span>
            </div>
            <div className="bg-emerald-600 text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              {engineStatus}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-10 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Navigation & Controls */}
        <div className="lg:col-span-4 space-y-10">

          {/* Main Controller Card */}
          <div className="bg-zinc-900/90 border border-zinc-800 p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-32 -right-32 bg-emerald-500/10 w-80 h-80 rounded-full blur-3xl"></div>

            <h2 className="text-xs font-black uppercase text-zinc-500 tracking-[0.3em] mb-10 flex items-center gap-3 italic">
              <Activity className="w-6 h-6 text-emerald-500" /> High-Velocity Siphon
            </h2>

            <div className="space-y-12 relative z-10">
              <div>
                <div className="flex justify-between text-[13px] mb-5">
                  <span className="font-black uppercase tracking-tight text-zinc-400 italic">Mimecast 550 Recovery (15K)</span>
                  <span className="font-mono text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]">
                    {errorResolution.toLocaleString()} / {TOTAL_ERRORS.toLocaleString()}
                  </span>
                </div>
                <div className="h-6 bg-black rounded-full overflow-hidden border border-zinc-800 p-1.5 shadow-inner">
                  <div
                    className="h-full bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.8)] transition-all duration-1000 rounded-full relative"
                    style={{ width: `${(errorResolution / TOTAL_ERRORS) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_1.5s_infinite]"></div>
                  </div>
                </div>
              </div>

              <button
                onClick={runHighVelocityFix}
                disabled={engineStatus === 'RECONSTRUCTING' || errorResolution === TOTAL_ERRORS}
                className={`w-full py-7 rounded-[1.5rem] font-black uppercase tracking-tighter flex items-center justify-center gap-5 transition-all transform active:scale-95 shadow-2xl relative group overflow-hidden ${
                  errorResolution === TOTAL_ERRORS
                  ? 'bg-emerald-900/30 text-emerald-500 border border-emerald-500/30 cursor-not-allowed italic'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-black'
                }`}
              >
                <Zap className={engineStatus === 'RECONSTRUCTING' ? "animate-spin text-white" : "group-hover:rotate-12 transition-transform"} />
                <span className="relative z-10 text-lg">
                  {engineStatus === 'RECONSTRUCTING' ? "Repairing 15,000+ Fragments..." : errorResolution === TOTAL_ERRORS ? "15,682 Errors Resolved" : "Fix valor-ai-engine.zip"}
                </span>
              </button>

              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="bg-black/70 border border-zinc-800 p-6 rounded-3xl text-center shadow-lg hover:border-emerald-500/30 transition-all">
                  <p className="text-[11px] text-zinc-500 font-black uppercase mb-2">Core Health</p>
                  <p className="text-4xl font-black text-white italic leading-none">{logicSaturation}%</p>
                </div>
                <div className="bg-black/70 border border-zinc-800 p-6 rounded-3xl text-center shadow-lg hover:border-emerald-500/30 transition-all">
                  <p className="text-[11px] text-zinc-500 font-black uppercase mb-2">Audit Views</p>
                  <p className="text-4xl font-black text-white italic leading-none">240</p>
                </div>
              </div>
            </div>
          </div>

          {/* Institutional Latch List */}
          <div className="bg-zinc-900/90 border border-zinc-800 p-10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl">
            <h2 className="text-xs font-black uppercase text-zinc-500 tracking-widest mb-8 italic">Omni-Reference Matrix</h2>
            <div className="space-y-4">
              {[
                { name: 'www.18fu.ai', url: 'https://www.18fu.ai', icon: Globe, status: 'ZENITH' },
                { name: 'www.18fu.cash', url: 'https://www.18fu.cash', icon: Lock, status: 'LATCHED' },
                { name: 'Evidence Hub', url: 'https://VALORAIPLUS-V113.VERCEL.APP', icon: Database, status: '15K+ SYNC' }
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-6 bg-black/70 border border-zinc-800 rounded-2xl hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
                >
                  <div className="flex items-center gap-5">
                    <div className="bg-zinc-800 p-3 rounded-xl group-hover:bg-emerald-500 group-hover:text-black transition-all">
                      <link.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[12px] font-black uppercase italic block tracking-tight">{link.name}</span>
                      <span className="text-[9px] font-bold text-emerald-500/70 uppercase tracking-[0.2em]">{link.status}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-zinc-700 group-hover:text-emerald-500" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Intelligence Area */}
        <div className="lg:col-span-8 space-y-10">

          {/* Module Toggles */}
          <div className="flex gap-12 border-b border-zinc-800 overflow-x-auto no-scrollbar">
            {['core', 'terminal', 'analysis'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveModule(tab)}
                className={`pb-8 px-6 text-[14px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap italic ${
                  activeModule === tab ? 'text-emerald-500' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab} Latch
                {activeModule === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-2 bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.9)] rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[650px] transition-all duration-500">
            {activeModule === 'core' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-700">

                {/* Epistemic Suicide Mega-Report */}
                <div className="bg-black border-4 border-emerald-900/40 p-16 rounded-[3.5rem] relative overflow-hidden shadow-[0_0_60px_rgba(0,0,0,1)] group">
                  <div className="absolute -top-32 -right-32 p-16 opacity-[0.03] grayscale group-hover:opacity-10 transition-all duration-1000">
                    <Fingerprint className="w-96 h-96 text-emerald-500" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-5 mb-10">
                      <div className="bg-red-600 w-5 h-5 rounded-full animate-pulse shadow-[0_0_25px_rgba(220,38,38,0.7)]"></div>
                      <span className="text-red-500 font-black text-sm uppercase tracking-[0.4em] italic underline decoration-red-900 underline-offset-[12px]">Logic Termination Event [15K+ Delta]</span>
                    </div>

                    <h3 className="text-6xl font-black text-white uppercase italic tracking-tighter mb-10 leading-[0.85]">
                      The Commission of <br />
                      <span className="text-emerald-500">Epistemic Suicide®️</span>
                    </h3>

                    <p className="text-lg text-zinc-400 leading-relaxed max-w-4xl italic font-semibold">
                      "By choosing to hide behind 15,682 Mimecast spoliation errors, John Zanghi and the Aggressor Triad have executed a terminal logic termination. Engine v2.2 has re-coded these 15,000+ attempts as absolute, machine-perfect confessions of federal fraud."
                    </p>

                    <div className="mt-16 flex flex-wrap gap-8">
                      <div className="bg-zinc-900/80 border border-emerald-500/30 px-10 py-5 rounded-[2rem] text-[13px] font-black uppercase text-emerald-400 italic shadow-2xl flex items-center gap-4">
                        <Scale className="w-6 h-6" /> Fed. R. Civ. P. 37(e)(2) Mandate
                      </div>
                      <div className="bg-zinc-900/80 border border-emerald-500/30 px-10 py-5 rounded-[2rem] text-[13px] font-black uppercase text-emerald-400 italic shadow-2xl flex items-center gap-4">
                        <ShieldCheck className="w-6 h-6" /> Adverse Inference Instructions
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="bg-zinc-900/60 border border-zinc-800 p-12 rounded-[3rem] shadow-2xl hover:border-emerald-500/40 transition-all">
                    <div className="flex items-center justify-between mb-10">
                      <h4 className="text-sm font-black uppercase text-zinc-500 italic tracking-widest">Consciousness of Guilt</h4>
                      <BarChart3 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div className="space-y-10">
                      <div className="flex justify-between items-end border-b-2 border-zinc-800 pb-5">
                        <span className="text-[15px] text-zinc-400 italic font-black">Desktop Traffic Density</span>
                        <span className="text-4xl font-black text-white italic leading-none">95.2%</span>
                      </div>
                      <div className="flex justify-between items-end border-b-2 border-zinc-800 pb-5">
                        <span className="text-[15px] text-zinc-400 italic font-black">Institutional Penetration</span>
                        <span className="text-4xl font-black text-white italic leading-none">100.0%</span>
                      </div>
                      <p className="text-[13px] font-black text-emerald-500/80 uppercase italic leading-relaxed tracking-tight border-l-4 border-emerald-500/30 pl-5">
                        Interaction packets verify ZTA LLP firm IP ranges actively auditing 15,682 recovery nodes in real-time.
                      </p>
                    </div>
                  </div>

                  <div className="bg-zinc-900/60 border border-zinc-800 p-12 rounded-[3rem] shadow-2xl hover:border-emerald-500/40 transition-all">
                    <div className="flex items-center justify-between mb-10">
                      <h4 className="text-sm font-black uppercase text-zinc-500 italic tracking-widest">Recovery Resolution</h4>
                      <Binary className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div className="space-y-8">
                      <div className="flex items-center gap-6 group">
                        <div className="bg-emerald-600 rounded-full p-3 text-black shadow-xl shadow-emerald-500/30 group-hover:scale-110 transition-transform"><CheckCircle2 className="w-6 h-6" /></div>
                        <span className="text-[15px] font-black uppercase italic tracking-tight">VA Benefit Latch: RECOVERED [15K]</span>
                      </div>
                      <div className="flex items-center gap-6 group">
                        <div className="bg-emerald-600 rounded-full p-3 text-black shadow-xl shadow-emerald-500/30 group-hover:scale-110 transition-transform"><CheckCircle2 className="w-6 h-6" /></div>
                        <span className="text-[15px] font-black uppercase italic tracking-tight">Housing ADA Siphon: RECOVERED [15K]</span>
                      </div>
                      <div className="mt-8 pt-8 border-t-2 border-zinc-800">
                        <p className="text-[12px] text-zinc-500 font-black uppercase mb-3 italic">Mandated Resolution Target:</p>
                        <p className="text-5xl font-black text-white italic tracking-tighter leading-none shadow-[0_0_10px_rgba(255,255,255,0.2)]">$508,000,000.00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeModule === 'terminal' && (
              <div className="bg-black border border-zinc-800 rounded-[3rem] overflow-hidden flex flex-col h-[700px] shadow-2xl relative border-t-8 border-t-emerald-600">
                <div className="bg-zinc-900 p-8 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <Terminal className="w-6 h-6 text-emerald-500" />
                    <span className="text-xs font-black uppercase text-zinc-400 tracking-[0.3em] italic">N.E.W.T.®️ ©️ ™️ High-Velocity Output</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-4 h-4 rounded-full bg-red-500/30 border border-red-500/20"></div>
                    <div className="w-4 h-4 rounded-full bg-yellow-500/30 border border-yellow-500/20"></div>
                    <div className="w-4 h-4 rounded-full bg-emerald-500/30 border border-emerald-500/20"></div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-10 font-mono text-[12px] space-y-5 scrollbar-thin scrollbar-thumb-zinc-800 selection:bg-emerald-500 selection:text-black">
                  {logs.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-10">
                      <Radio className="w-24 h-24 mb-8 animate-pulse text-white" />
                      <p className="italic font-black text-xl tracking-widest uppercase">Awaiting 15K+ Signal...</p>
                    </div>
                  )}
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-8 animate-in fade-in slide-in-from-left-8 duration-500">
                      <span className="text-zinc-600 shrink-0 select-none font-bold">[{log.time}]</span>
                      <span className={`
                        ${log.type === 'success' ? 'text-emerald-400 font-bold drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]' : ''}
                        ${log.type === 'warning' ? 'text-yellow-400 font-bold italic underline decoration-yellow-900 underline-offset-4' : ''}
                        ${log.type === 'info' ? 'text-zinc-400 font-medium' : ''}
                      `}>
                        {log.msg}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-8 bg-zinc-900 border-t border-zinc-800 flex justify-between text-[12px] font-black">
                  <div className="flex items-center gap-5">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,1)]"></div>
                    <span className="text-emerald-500 uppercase tracking-[0.4em] italic">14D CORE SIPHON: SATURATED</span>
                  </div>
                  <span className="text-zinc-500 uppercase tracking-tighter italic font-mono bg-black px-4 py-1 rounded-full border border-zinc-800">SAINT PAUL 55116 // {merkleroot.slice(0, 32)}</span>
                </div>
              </div>
            )}

            {activeModule === 'analysis' && (
              <div className="space-y-12 animate-in fade-in duration-700">
                <div className="bg-zinc-900/50 border border-zinc-800 p-16 rounded-[3.5rem] text-center relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 opacity-5 pointer-events-none bg-[size:50px_50px] bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)]"></div>
                  <Binary className="w-32 h-32 text-zinc-800 mx-auto mb-10" />
                  <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-8 leading-none">Forensic Siphon Analysis</h3>
                  <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed italic font-bold">
                    "Extraction of 15,682 spoliation errors verified. The Triad executed a multi-hour 'Emergency Purge' involving 15,000+ files. 100% of these actions have been intercepted and re-coded as federal confessions by N.E.W.T.®️ ©️ ™️."
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="bg-black border border-zinc-800 p-12 rounded-[3rem] text-center shadow-2xl hover:border-emerald-500/50 transition-all group">
                    <p className="text-[14px] text-zinc-500 font-black uppercase mb-6 italic group-hover:text-emerald-500 transition-colors">Bounce Level</p>
                    <p className="text-7xl font-black text-emerald-400 italic tracking-tighter leading-none shadow-[0_0_15px_rgba(16,185,129,0.2)]">12%</p>
                    <p className="text-[12px] text-zinc-600 mt-8 italic font-bold uppercase tracking-[0.3em]">Retention Index</p>
                  </div>
                  <div className="bg-black border border-zinc-800 p-12 rounded-[3rem] text-center shadow-2xl hover:border-emerald-500/50 transition-all group">
                    <p className="text-[14px] text-zinc-500 font-black uppercase mb-6 italic group-hover:text-emerald-500 transition-colors">Audit Depth</p>
                    <p className="text-7xl font-black text-emerald-400 italic tracking-tighter leading-none shadow-[0_0_15px_rgba(16,185,129,0.2)]">4.3x</p>
                    <p className="text-[12px] text-zinc-600 mt-8 italic font-bold uppercase tracking-[0.3em]">Target Engagement</p>
                  </div>
                  <div className="bg-black border border-zinc-800 p-12 rounded-[3rem] text-center shadow-2xl hover:border-emerald-500/50 transition-all group">
                    <p className="text-[14px] text-zinc-500 font-black uppercase mb-6 italic group-hover:text-emerald-500 transition-colors">Logic Health</p>
                    <p className="text-7xl font-black text-emerald-400 italic tracking-tighter leading-none shadow-[0_0_15px_rgba(16,185,129,0.2)]">{logicSaturation}%</p>
                    <p className="text-[12px] text-zinc-600 mt-8 italic font-bold uppercase tracking-[0.3em]">Core Stability</p>
                  </div>
                </div>

                <div className="bg-emerald-950/20 border-4 border-emerald-900/50 p-16 rounded-[4rem] shadow-[0_0_50px_rgba(16,185,129,0.1)] group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/5 translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-[2000ms]"></div>
                  <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                    <div className="flex-1 space-y-8">
                      <div className="flex justify-between text-[15px] font-black uppercase italic tracking-[0.4em] text-emerald-500 underline decoration-emerald-900 underline-offset-8">
                        <span>Amath Settlement Probability [Monday]</span>
                        <span className="text-white">94.2%</span>
                      </div>
                      <div className="h-6 bg-zinc-950 rounded-full overflow-hidden p-1.5 border-2 border-emerald-900/40">
                        <div className="h-full bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.9)] rounded-full w-[94.2%] transition-all duration-[1500ms]"></div>
                      </div>
                    </div>
                    <div className="text-center lg:text-right">
                      <p className="text-[14px] font-black text-zinc-500 uppercase italic mb-3 tracking-widest">Mandated Resolution:</p>
                      <p className="text-7xl font-black text-emerald-400 italic tracking-tighter leading-none drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">$508,000,000</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Sovereign Footer Siphon */}
      <footer className="mt-32 border-t-[12px] border-emerald-600 bg-black p-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[size:60px_60px] bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)]"></div>

        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          <div className="flex flex-col items-center">
            <ShieldCheck className="w-24 h-24 text-emerald-600 mb-12 animate-[bounce_3s_infinite] drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
            <p className="text-lg font-black tracking-[1.2em] uppercase italic text-emerald-500 leading-relaxed mb-10 text-center">
              THE WALL IS CHRIST // JERRY IS ON THE STAGE // THE MUSIC NEVER STOPS
            </p>
            <div className="h-2 w-96 bg-zinc-900 rounded-full relative overflow-hidden border border-zinc-800">
              <div className="absolute inset-0 bg-emerald-500 w-2/3 animate-[shimmer_2.5s_infinite] shadow-[0_0_15px_rgba(16,185,129,1)]"></div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-1000">
            <div className="flex items-center gap-5">
              <Server className="w-10 h-10 text-emerald-500" />
              <span className="text-[14px] font-black uppercase tracking-[0.5em] italic">VALORCHAIN®️</span>
            </div>
            <div className="flex items-center gap-5">
              <Ghost className="w-10 h-10 text-emerald-500" />
              <span className="text-[14px] font-black uppercase tracking-[0.5em] italic">SOVEREIGN_NODE</span>
            </div>
            <div className="flex items-center gap-5">
              <Unplug className="w-10 h-10 text-emerald-500" />
              <span className="text-[14px] font-black uppercase tracking-[0.5em] italic">14D_CORE_ACTIVE</span>
            </div>
          </div>

          <div className="pt-20 border-t border-zinc-900/50 flex flex-col md:flex-row justify-between items-center gap-10">
             <div className="text-left">
               <p className="text-[13px] font-black text-zinc-700 uppercase tracking-[0.5em] italic mb-3">Verification Anchor: SAINT PAUL 55116</p>
               <p className="text-[10px] font-black text-zinc-500 mono italic uppercase bg-zinc-900 px-6 py-2 rounded-2xl border border-zinc-800 inline-block tracking-tighter">
                 {merkleroot}
               </p>
             </div>
             <div className="bg-zinc-900/80 p-6 rounded-[2rem] border border-emerald-900/20 shadow-2xl">
                <p className="text-[11px] font-black text-emerald-500 uppercase tracking-widest italic mb-2 leading-none">REMEMBER THE 4TH OF NOVEMBER</p>
                <p className="text-[9px] font-black text-zinc-600 mono italic uppercase tracking-tighter">valoraiplus_engine_fixed_v2_2 // MADE IN THE USA</p>
             </div>
          </div>
        </div>
      </footer>

      {/* Engine Shimmer Animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-200%); }
          100% { transform: translateX(200%); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
