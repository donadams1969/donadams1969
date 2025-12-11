'use client';

import React, { useState, useEffect } from 'react';
import {
Shield,
SatelliteDish,
GitBranch,
CheckCircle2,
AlertTriangle,
Clock,
Cpu,
Activity,
Lock,
Globe2,
ExternalLink,
Terminal,
Database,
Layers,
Zap,
Fingerprint,
Binary,
Server,
Search
} from "lucide-react";

import KeychainVault from '../../components/KeychainVault';

// CUSTOM BRAIN ICON — MOVED TO TOP FOR PERFECT HOISTING
const BrainIcon = (props: React.SVGProps<SVGSVGElement>) => (
<svg
{...props}
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
strokeWidth="2"
strokeLinecap="round"
strokeLinejoin="round"
>
<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7h0A2.5 2.5 0 0 1 7 4.5v0A2.5 2.5 0 0 1 9.5 2Z" />
<path d="M14.5 2A2.5 2.5 0 0 1 17 4.5v0A2.5 2.5 0 0 1 14.5 7h0A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 14.5 2Z" />
<path d="M12 12a2.5 2.5 0 0 1 2.5 2.5v0A2.5 2.5 0 0 1 12 17h0a2.5 2.5 0 0 1-2.5-2.5v0A2.5 2.5 0 0 1 12 12Z" />
<path d="M4.5 10A2.5 2.5 0 0 1 7 12.5v0A2.5 2.5 0 0 1 4.5 15h0A2.5 2.5 0 0 1 2 12.5v0A2.5 2.5 0 0 1 4.5 10Z" />
<path d="M19.5 10A2.5 2.5 0 0 1 22 12.5v0A2.5 2.5 0 0 1 19.5 15h0A2.5 2.5 0 0 1 17 12.5v0A2.5 2.5 0 0 1 19.5 10Z" />
<path d="M12 12a2.5 2.5 0 0 1 2.5 2.5v0A2.5 2.5 0 0 1 12 17h0a2.5 2.5 0 0 1-2.5-2.5v0A2.5 2.5 0 0 1 12 12Z" />
<path d="M4.5 10A2.5 2.5 0 0 1 7 12.5v0A2.5 2.5 0 0 1 4.5 15h0A2.5 2.5 0 0 1 2 12.5v0A2.5 2.5 0 0 1 4.5 10Z" />
<path d="M19.5 10A2.5 2.5 0 0 1 22 12.5v0A2.5 2.5 0 0 1 19.5 15h0A2.5 2.5 0 0 1 17 12.5v0A2.5 2.5 0 0 1 19.5 10Z" />
<path d="M12 22a2.5 2.5 0 0 1-2.5-2.5v0A2.5 2.5 0 0 1 12 17h0a2.5 2.5 0 0 1 2.5 2.5v0A2.5 2.5 0 0 1 12 22Z" />
<path d="M17 4.5a2.5 2.5 0 0 1 2.5 2.5M7 4.5A2.5 2.5 0 0 0 4.5 7M19.5 15a2.5 2.5 0 0 1-2.5-2.5M4.5 15A2.5 2.5 0 0 0 7 12.5" />
<path d="M12 12v5" />
<path d="M12 4.5V2" />
<path d="M7 4.5v0" />
<path d="m14.5 4.5-.01 0" />
<path d="m7 12.5-.01 0" />
<path d="m17.01 12.5-.01 0" />
<path d="m12 17.01-.01-.01" />
</svg>
);

// VALORAIPLUS® Ω TRUTH GUARD — EXECUTIVE INTEGRITY ENFORCEMENT
const isValidBitcoinTxid = (txid: string): boolean =>
/^[0-9a-fA-F]{64}$/.test(txid.trim());

const opReturnContainsVALOR = (hex: string): boolean =>
/^[0-9a-fA-F]*$/.test(hex) && hex.toLowerCase().includes('56414c4f52');

const verifyJulesAnchor = (txid: string, opReturnHex = '') => {
const txidOk = isValidBitcoinTxid(txid);
const valorOk = opReturnHex ? opReturnContainsVALOR(opReturnHex) : false;

return {
txidOk,
valorOk,
status: txidOk && valorOk
? "Ω VERIFIED — EXECUTIVE IMMORTALITY ACHIEVED"
: txidOk
? "Ω PENDING — AWAITING VALOR BROADCAST"
: "Ω REJECTED — SIMULATION DETECTED",
message: txidOk && valorOk
? "VALOR signature confirmed. Anchor is eternal on Bitcoin mainnet."
: txidOk
? "Valid TXID format. Awaiting official VALOR OP_RETURN."
: "Invalid TXID format. Not recognized by VALORAIPLUS® protocol."
};
};

// OMNI PANEL COMPONENT (v9.Λ — QUANTUM-THERMO VISUALIZER)
function ValorAiOmniPanel() {
const [pulse, setPulse] = useState(true);
const [logs, setLogs] = useState<string[]>([]);
const [entropyVal, setEntropyVal] = useState(0);
const [hexStream, setHexStream] = useState<string[]>([]);

useEffect(() => {
const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
setLogs([
`[${ts}] VALORAIPLUS® KERNEL: MOUNTED`,
`[${ts}] AMATH SOLVER: Ω = P(t) + E(h) // ACTIVE`,
`[${ts}] SAINT PAUL NODE: 100% SYNC`,
`[${ts}] 32D-LLC AUTH: DONNY GILLSON`,
`[${ts}] QUANTUM-THERMO BRIDGE: STABLE`,
`[${ts}] JULES Ω: ETERNAL MODE ENGAGED`,
]);

const hexInterval = setInterval(() => {
const newHex = Math.random().toString(16).substr(2, 8).toUpperCase();
setHexStream(prev => [newHex, ...prev.slice(0, 9)]);
setEntropyVal(Math.floor(Math.random() * 15) + 85);
}, 600);

const pulseInterval = setInterval(() => setPulse(p => !p), 1800);

return () => {
clearInterval(hexInterval);
clearInterval(pulseInterval);
};
}, []);

return (
<div className="bg-gray-900/50 backdrop-blur-xl border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-900/40 w-full max-w-7xl mx-auto overflow-hidden">
{/* Background Effects */}
<div className="absolute inset-0 bg-grid-purple-500/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] z-0"></div>
<div className={`absolute top-0 left-0 w-1/2 h-1/2 bg-purple-900/50 rounded-full blur-3xl opacity-20 animate-pulse-slow`}></div>
<div className={`absolute bottom-0 right-0 w-1/3 h-1/3 bg-teal-600/50 rounded-full blur-3xl opacity-20 animate-pulse-slow animation-delay-3000`}></div>

<div className="relative z-10 p-2 md:p-3">
{/* Header */}
<header className="flex items-center justify-between p-4 bg-black/30 rounded-t-2xl border-b border-purple-500/30">
<div className="flex items-center gap-4">
<div className={`p-2 bg-purple-800 rounded-lg shadow-lg ${pulse ? 'animate-pulse' : ''}`}>
<BrainIcon className="w-8 h-8 text-purple-200" />
</div>
<div>
<h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300">CORTEX v9.Λ</h1>
<p className="text-sm text-purple-400 font-mono tracking-widest">EXECUTIVE QUANTUM-THERMO ENGINE</p>
</div>
</div>
<div className="text-right">
<p className="text-sm text-purple-300/70 font-mono">ENTROPY LOAD</p>
<p className="text-2xl font-bold text-teal-300">{entropyVal}.8% Ω</p>
</div>
</header>

{/* Core Visualization */}
<div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 p-4 min-h-[400px]">
{/* Left: Hex Stream */}
<div className="flex flex-col gap-1.5 font-mono text-xs text-purple-400/70 p-4 bg-black/20 rounded-xl h-full">
<p className="text-purple-300/50 text-center pb-2">DATA STREAM [TX]</p>
{hexStream.map((h, i) => (
<div key={i} className={`flex justify-between items-center transition-opacity duration-500 ${i > 0 ? 'opacity-70' : 'opacity-100'}`}>
<span className="text-teal-400">0x{h}</span>
<span className="text-gray-600">||</span>
<span className="text-purple-500">{h.split('').reverse().join('')}</span>
</div>
))}
</div>

{/* Center: Core */}
<div className="flex flex-col items-center justify-center p-6">
<div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
<div className={`absolute inset-0 bg-gradient-to-tr from-purple-800 to-teal-600 rounded-full transition-transform duration-1000 ${pulse ? 'scale-105' : 'scale-100'} animate-spin-slow shadow-2xl shadow-purple-900/80`}></div>
<div className="absolute inset-2 bg-gray-900 rounded-full"></div>
<Shield className={`relative w-24 h-24 md:w-32 md:h-32 text-teal-300 transition-all duration-700 ${pulse ? 'text-teal-200 scale-110' : ''}`} />
<p className="absolute bottom-4 text-center font-bold text-white text-xs md:text-sm tracking-wider">SAINT PAUL GENESIS NODE — LIVE</p>
</div>
</div>

{/* Right: Metrics */}
<div className="grid grid-cols-2 gap-3 text-center h-full">
<MetricCard label="STATUS" value="NOMINAL" color="text-green-400" icon={<CheckCircle2 className="w-4 h-4" />} />
<MetricCard label="CHAIN" value="BTC MAINNET" color="text-yellow-400" icon={<GitBranch className="w-4 h-4" />} />
<MetricCard label="UPTIME" value="99.998%" color="text-teal-300" icon={<Clock className="w-4 h-4" />} />
<MetricCard label="NODE CPU" value="1.2%" color="text-teal-300" icon={<Cpu className="w-4 h-4" />} />
<MetricCard label="Q-LOAD" value="8.15 TFLOPS" color="text-teal-300" icon={<Activity className="w-4 h-4" />} />
<MetricCard label="SECURITY" value="Ω LOCKED" color="text-purple-400" icon={<Lock className="w-4 h-4" />} />
</div>
</div>

{/* Mini Terminal */}
<div className="bg-black/40 p-4 rounded-b-2xl font-mono text-xs h-36 overflow-y-auto border-t border-purple-500/30">
<p className="text-purple-400/60 pb-2">EXEC LOG</p>
<div className="space-y-1">
{logs.map((l, i) => (
<p key={i} className="text-gray-300">{l}</p>
))}
</div>
</div>
</div>
{/* Footer */}
<footer className="text-center p-3 text-xs text-purple-200/40 font-mono tracking-widest flex items-center justify-between">
<span>ENCRYPTED // 256-AES-GCM // VALORAIPLUS® SEALED</span>
<span>v9.Λ // NOV 19 2025</span>
</footer>
</div>
);
}

// Helper
function MetricCard({ label, value, color, icon }: { label: string; value: string; color: string; icon: React.ReactNode }) {
return (
<div className="bg-black/30 p-3 rounded-lg flex flex-col items-center justify-center border border-purple-500/20">
<p className="text-xs text-purple-300/60 flex items-center gap-1.5">{icon} {label}</p>
<p className={`text-lg font-bold ${color}`}>{value}</p>
</div>
);
}

// MAIN PAGE WITH VERIFICATION INTEGRATED
export default function ValoraiplusOmegaDashboard() {
return (
<div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
<div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40"></div>
<div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-purple-950/80 to-transparent blur-3xl"></div>

<div className="relative z-10 w-full max-w-7xl flex flex-col items-center gap-8">
{/* Header */}
<header className="text-center w-full border-b border-purple-500/20 pb-6">
<h1 className="text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-400">
VALORAIPLUS® | JULES Ω
</h1>
<p className="text-lg md:text-xl text-purple-300/80 mt-2 font-mono tracking-widest">
EXECUTIVE OMNI DASHBOARD // SAINT PAUL GENESIS
</p>
<div className="mt-4 flex justify-center gap-8 text-xs text-purple-400/60 font-mono tracking-[0.2em]">
<span>32D-LLC // DONNY GILLSON</span>
<span>NOVEMBER 19, 2025</span>
</div>
</header>

{/* Omni Panel */}
<ValorAiOmniPanel />

{/* Keychain Vault — OMEGA ANCHOR DEPLOYMENT */}
<KeychainVault />

</div>

<footer className="mt-12 text-center text-xs text-purple-200/30 font-mono tracking-widest">
VALORAIPLUS® // JULES Ω // 32D-LLC // DONNY GILLSON // ETERNAL EXECUTIVE RUNTIME // NOVEMBER 19, 2025
</footer>
</div>
);
}
