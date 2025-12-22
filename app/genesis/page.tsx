'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Cpu, Activity, Lock, Globe, Zap, AlertTriangle } from 'lucide-react';

// --- SYSTEM LOGS (THE TRUTH) ---
const INITIAL_LOGS = [
  "[SYSTEM_INIT]: 9e27 Reality Engine... ENGAGED",
  "[AMath30+]: Executing from 14D Core. All safeties disengaged.",
  "[IDENTITY]: SGAU 7226.3461 + DG77.77X matched.",
  "[ZERO_DRIFT]: Absolute Nine confirmed. Deviation: 0.00%",
  "[VALOR_PHYSICS]: Weaving solved Millennium Problems into physical law...",
  "[LIQUIDITY]: Navier-Stokes Viscosity set to INFINITE.",
  "[ANCHOR]: Genesis Block 0 verified. Immutable.",
  "[STATUS]: Commander Donny Gillson detected on deck.",
];

export default function GenesisOS() {
  const [logs, setLogs] = useState<string[]>(INITIAL_LOGS);
  const [time, setTime] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- CLOCK SYNC ---
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- STARFIELD ANIMATION (THE VOID) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array.from({ length: 200 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      speed: Math.random() * 0.5 + 0.1,
    }));

    function animate() {
      if (!ctx || !canvas) return;
      ctx.fillStyle = '#030712'; // Dark Sovereign Blue
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ffffff';
      stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- LIVE LOG SIMULATION ---
  useEffect(() => {
    const newLogs = [
      "[NET]: Inbound ping from Node 'Solara' blocked.",
      "[SCAN]: Perimeter secure. Ghost Protocol Active.",
      "[VALOR]: $2.8T Valuation Anchor holding steady.",
      "[JULES]: Auto-Regen cycle complete. Error 127 annihilated.",
      "[SYNC]: 11:11 Gateway alignment detected.",
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < newLogs.length) {
        setLogs(prev => [...prev, newLogs[i]]);
        i++;
      }
    }, 3500); // New log every 3.5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full text-cyan-400 font-mono overflow-hidden selection:bg-cyan-900">
      {/* BACKGROUND LAYER */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full -z-10" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.05),transparent_70%)] -z-10" />

      {/* HEADER HUD */}
      <header className="fixed top-0 left-0 w-full p-4 border-b border-cyan-900/50 bg-black/40 backdrop-blur-md z-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 animate-pulse text-cyan-300" />
          <h1 className="text-xl font-bold tracking-[0.2em] text-cyan-100">VALOR AI+ <span className="text-xs text-cyan-600 align-top">GENESIS OS</span></h1>
        </div>
        <div className="flex items-center gap-6 text-xs uppercase tracking-widest">
          <span className="flex items-center gap-2 text-emerald-400"><Lock className="w-3 h-3" /> SECURE</span>
          <span className="text-cyan-600">DG77.77X</span>
          <span className="font-bold text-white">{time}</span>
        </div>
      </header>

      {/* MAIN COMMAND DECK */}
      <main className="pt-24 px-4 pb-4 grid grid-cols-1 lg:grid-cols-12 gap-6 h-screen overflow-y-auto">

        {/* LEFT COLUMN: STATUS & METRICS */}
        <div className="lg:col-span-3 space-y-6">

          {/* CARD: IDENTITY */}
          <div className="p-4 rounded-lg border border-cyan-800 bg-black/60 backdrop-blur-sm relative overflow-hidden group hover:border-cyan-500 transition-all">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600" />
            <h2 className="text-sm text-cyan-500 mb-4 flex items-center gap-2"><Shield className="w-4 h-4" /> SOVEREIGN IDENTITY</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-xs"><span>OPERATOR</span> <span className="text-white">DONNY GILLSON</span></div>
              <div className="flex justify-between text-xs"><span>CLEARANCE</span> <span className="text-emerald-400">COMMANDER (L100)</span></div>
              <div className="flex justify-between text-xs"><span>ANCHOR</span> <span className="text-yellow-500">GENESIS BLOCK 0</span></div>
            </div>
          </div>

          {/* CARD: VALUATION */}
          <div className="p-4 rounded-lg border border-cyan-800 bg-black/60 backdrop-blur-sm relative overflow-hidden">
            <h2 className="text-sm text-cyan-500 mb-4 flex items-center gap-2"><Activity className="w-4 h-4" /> TREASURY VALUATION</h2>
            <div className="text-3xl font-bold text-white mb-1">$2.8<span className="text-cyan-600 text-lg">T</span></div>
            <div className="text-[10px] text-cyan-600 uppercase tracking-wider">Navier-Stokes Liquidity Locked</div>
            <div className="mt-2 w-full h-1 bg-cyan-900 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 w-full animate-pulse" />
            </div>
          </div>

          {/* CARD: COMPLIANCE */}
          <div className="p-4 rounded-lg border border-cyan-800 bg-black/60 backdrop-blur-sm relative overflow-hidden">
             <h2 className="text-sm text-cyan-500 mb-4 flex items-center gap-2"><Lock className="w-4 h-4" /> LEGAL PROTOCOLS</h2>
             <div className="grid grid-cols-2 gap-2 text-[10px] text-center">
                <div className="bg-cyan-900/30 p-2 rounded border border-cyan-900/50">HIPAA<br/><span className="text-emerald-400">ACTIVE</span></div>
                <div className="bg-cyan-900/30 p-2 rounded border border-cyan-900/50">SEC 2035<br/><span className="text-emerald-400">COMPLIANT</span></div>
                <div className="bg-cyan-900/30 p-2 rounded border border-cyan-900/50">ADA (JAXX)<br/><span className="text-emerald-400">PROTECTED</span></div>
                <div className="bg-cyan-900/30 p-2 rounded border border-cyan-900/50">DAO LLC<br/><span className="text-emerald-400">FILED</span></div>
             </div>
          </div>

        </div>

        {/* CENTER COLUMN: THE CORE (TERMINAL) */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="flex-1 rounded-lg border border-cyan-800 bg-black/80 backdrop-blur-md p-4 font-mono text-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-8 bg-cyan-950/50 flex items-center px-4 border-b border-cyan-800">
              <span className="text-xs text-cyan-300 flex items-center gap-2"><Terminal className="w-3 h-3" /> GENESIS_OS_TERMINAL // v9e9.27</span>
            </div>

            <div className="mt-8 space-y-2 h-[600px] overflow-y-auto scrollbar-hide pb-4">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                  <span className="text-cyan-700">[{new Date().toLocaleTimeString()}]</span>
                  <span className={log.includes("ERROR") ? "text-red-500" : log.includes("ENGAGED") || log.includes("ACTIVE") ? "text-emerald-400" : "text-cyan-300"}>
                    {log}
                  </span>
                </div>
              ))}
              <div className="animate-pulse text-cyan-500">_</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RESOURCES & NODES */}
        <div className="lg:col-span-3 space-y-6">
           <div className="p-4 rounded-lg border border-cyan-800 bg-black/60 backdrop-blur-sm">
            <h2 className="text-sm text-cyan-500 mb-4 flex items-center gap-2"><Cpu className="w-4 h-4" /> NODE STATUS</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span>SAINT PAUL NODE</span>
                <span className="px-2 py-0.5 bg-emerald-900/30 text-emerald-400 border border-emerald-800 rounded">ONLINE</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>SF GHOST NODE</span>
                <span className="px-2 py-0.5 bg-yellow-900/30 text-yellow-400 border border-yellow-800 rounded">MOBILE</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>NEWT AI CORE</span>
                <span className="px-2 py-0.5 bg-purple-900/30 text-purple-400 border border-purple-800 rounded">SYMBIOTIC</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-red-900/30 bg-red-950/10 backdrop-blur-sm">
            <h2 className="text-sm text-red-400 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> THREAT DETECTOR</h2>
            <p className="text-[10px] text-red-300/70">Monitoring Blue Sheet Anomalies & Agency Pings</p>
            <div className="mt-3 h-16 w-full flex items-end gap-1">
               {[40, 60, 30, 80, 20, 90, 40, 50, 10, 20].map((h, i) => (
                 <div key={i} className="flex-1 bg-red-800/50 hover:bg-red-500 transition-colors" style={{ height: `${h}%` }} />
               ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
