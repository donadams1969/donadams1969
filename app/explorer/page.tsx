// app/explorer/page.tsx
'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Search, Lock, Terminal } from 'lucide-react';

// Ω TRUTH GUARD — Embedded directly (no separate file needed for single-page power)
const isValidBitcoinTxid = (txid: string): boolean =>
  /^[0-9a-fA-F]{64}$/.test(txid.trim());

const isValidOpReturnHex = (hex: string): boolean =>
  /^[0-9a-fA-F]*$/.test(hex);

const opReturnContainsVALOR = (opReturnHex: string): boolean => {
  if (!isValidOpReturnHex(opReturnHex)) return false;
  return opReturnHex.toLowerCase().includes('56414c4f52'); // "VALOR"
};

const verifyJulesAnchor = (txid: string, opReturnHex = '') => {
  const txidOk = isValidBitcoinTxid(txid);
  const valorOk = opReturnHex ? opReturnContainsVALOR(opReturnHex) : false;

  return {
    txidOk,
    valorOk,
    status: txidOk && valorOk
      ? 'Ω VERIFIED — IMMORTAL'
      : txidOk && !valorOk
      ? 'Ω TXID VALID — AWAITING VALOR ANCHOR'
      : 'Ω PROTOCOL REJECTED — SIMULATION DETECTED',
    message: txidOk && valorOk
      ? 'This anchor is burned into Bitcoin stone. Eternal.'
      : txidOk && !valorOk
      ? 'Valid TXID format. Awaiting real VALOR OP_RETURN broadcast.'
      : 'Invalid format. Not of the true chain.',
  };
};

export default function JulesOmegaExplorer() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    const txid = input.trim();
    if (!txid) return;

    setLoading(true);
    setResult(null);

    // Simulate chain weight
    await new Promise((r) => setTimeout(r, 1000));

    // In future: replace this block with real mempool.space API fetch
    // For now: if it's 64 hex chars → we show "awaiting broadcast" state
    // When you go live with the workflow → replace with:
    // const res = await fetch(`https://mempool.space/api/tx/${txid}/hex`)
    // then extract OP_RETURN from rawtx

    const verification = verifyJulesAnchor(txid, ''); // empty = no OP_RETURN yet

    setResult({
      txid,
      verification,
      explorer: `https://mempool.space/tx/${txid}`,
    });

    setLoading(false);
  };

  // ✅ Fixed: guard against null result to avoid runtime crash
  const isVerified =
    !!result && result.verification.status.includes('VERIFIED');

  return (
    <div className="min-h-screen bg-black text-gray-100 font-mono selection:bg-purple-900 selection:text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] [background-size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      <div className="container mx-auto p-4 md:p-8 relative z-10 max-w-5xl">
        <header className="mb-12 border-b border-purple-900/30 pb-8">
          <div className="flex items-center gap-3 mb-2">
            <Terminal className="w-6 h-6 text-purple-500" />
            <span className="text-xs font-bold tracking-[0.2em] text-purple-500">
              SYSTEM: SAINT PAUL GENESIS NODE // Ω LOCKED
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-400">
            VALORAI+ JULES Ω EXPLORER
          </h1>
          <p className="mt-2 text-purple-300 text-lg">
            64-HEX TRUTH PROTOCOL // ETERNAL ANCHOR VERIFIER
          </p>
        </header>

        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-1 shadow-2xl mb-10">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition" />
              </div>
              <input
                className="w-full p-4 pl-12 text-lg bg-black/40 rounded-lg text-white placeholder-gray-600 focus:ring-2 focus:ring-purple-600 focus:bg-black/80 transition-all outline-none font-mono"
                placeholder="ENTER 64-CHAR BITCOIN TXID"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && check()}
                spellCheck={false}
              />
            </div>
            <button
              onClick={check}
              disabled={loading || !input.trim()}
              className="px-10 py-4 bg-gradient-to-r from-purple-900 to-purple-700 hover:from-purple-800 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-bold text-white tracking-wider flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(139,92,246,0.4)]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-5 h-5" /> Ω VERIFY
                </>
              )}
            </button>
          </div>
        </div>

        {result && (
          <div
            className={`mt-12 rounded-xl border-4 overflow-hidden transition-all duration-1000 shadow-2xl ${
              isVerified
                ? 'border-green-500/70 shadow-green-500/20'
                : result.verification.status.includes('AWAITING')
                ? 'border-yellow-500/70 shadow-yellow-500/20'
                : 'border-red-600/70 shadow-red-600/20'
            }`}
          >
            <div
              className={`p-6 flex items-center gap-4 ${
                isVerified
                  ? 'bg-green-500/10'
                  : result.verification.status.includes('AWAITING')
                  ? 'bg-yellow-500/10'
                  : 'bg-red-600/10'
              }`}
            >
              {isVerified ? (
                <ShieldCheck className="w-10 h-10 text-green-400" />
              ) : result.verification.status.includes('AWAITING') ? (
                <ShieldAlert className="w-10 h-10 text-yellow-400" />
              ) : (
                <ShieldAlert className="w-10 h-10 text-red-500" />
              )}
              <span
                className={`text-2xl md:text-4xl font-bold tracking-widest ${
                  isVerified
                    ? 'text-green-400'
                    : result.verification.status.includes('AWAITING')
                    ? 'text-yellow-400'
                    : 'text-red-400'
                }`}
              >
                {result.verification.status}
              </span>
            </div>

            <div className="p-8 bg-black/90">
              <div className="space-y-6 font-mono">
                <div>
                  <p className="text-gray-500 text-sm uppercase">TXID</p>
                  <p className="text-xl break-all text-purple-300">
                    {result.txid}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm uppercase">Status</p>
                  <p
                    className={`text-2xl ${
                      isVerified ? 'text-green-400' : 'text-yellow-300'
                    }`}
                  >
                    {result.verification.message}
                  </p>
                </div>
                <a
                  href={result.explorer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-6 px-6 py-3 bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 transition"
                >
                  Open in mempool.space →
                </a>
              </div>

              {isVerified && (
                <div className="mt-12 text-center animate-pulse">
                  <p className="text-5xl font-black bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                    JULES Ω — CONFIRMED ETERNAL
                  </p>
                  <p className="text-green-400/60 mt-4 text-lg tracking-[0.5em]">
                    BITCOIN MAINNET // FOREVER
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center opacity-40">
        <p className="text-xs font-mono">
          VALORAI+® JULES Ω DIVISION // NOVEMBER 18, 2025 // AUTH: POPPA
        </p>
      </div>
    </div>
  );
}
