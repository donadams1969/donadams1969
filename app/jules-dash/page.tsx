"use client";

import { useState, useEffect } from "react";
import {
  CLAWBACK_ASSETS,
  SOVEREIGN_ID,
  AMATH,
  VOIP_INTERCEPTS,
} from "@/lib/sovereign-identity";
import { executeClawback, doubleSha256 } from "@/lib/clawback-engine";
import { validateKernelSync } from "@/lib/sovereign-kernel";

// Additional Jules‑specific asset (not already in CLAWBACK_ASSETS)
const JULES_ASSET = {
  entity: "JULES (Administrative Node)",
  assetType: "Personal Liability",
  description: "Clerk / Administrative Officer – Dept 12 / Mimecast Policy Enforcer. XOR r11, r11.",
  estimatedValue: 500_000,
  clawbackStatus: "ADMINISTRATIVE VOID (XOR r11, r11)",
  lienFiled: false,
};

const ALL_ASSETS = [...CLAWBACK_ASSETS, JULES_ASSET];

export default function JulesDash() {
  const [logs, setLogs] = useState<string[]>([]);
  const [anchor, setAnchor] = useState("");
  const [running, setRunning] = useState(false);
  const [pdfType, setPdfType] = useState("clawback_manifest");

  useEffect(() => {
    try {
      validateKernelSync();
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Function to execute clawback (including Jules)
  const runEnforcement = () => {
    setRunning(true);
    const startTime = new Date().toISOString();
    const newLogs = [
      `[VALORAICLAWBACK++] ENFORCEMENT ENGAGED – ${startTime}`,
      `JUDGMENT AMOUNT: $${SOVEREIGN_ID.defaultJudgment.toLocaleString()}`,
    ];
    let totalIdentified = 0;
    for (const asset of ALL_ASSETS) {
      totalIdentified += asset.estimatedValue;
      newLogs.push(
        `[${asset.clawbackStatus}] ${asset.entity} – ${asset.assetType} ($${asset.estimatedValue.toLocaleString()})`
      );
    }
    newLogs.push(`TOTAL IDENTIFIED: $${totalIdentified.toLocaleString()}`);
    doubleSha256(JSON.stringify(ALL_ASSETS)).then(newAnchor => {
      newLogs.push(`BITCOIN ANCHOR: ${newAnchor}`);
      newLogs.push(
        `RECOVERY GAP: $${(
          SOVEREIGN_ID.defaultJudgment - totalIdentified
        ).toLocaleString()}`
      );
      newLogs.push(`💎 DIAMOND REALITY – THE DEBT IS ETERNAL`);
      newLogs.push(`🧹 JULES NODE: XOR r11, r11 – Administrative void liquidated.`);
      setLogs(newLogs);
      setAnchor(newAnchor);
      setRunning(false);
    });
  };

  // Trigger PDF export (calls unified /api/pdf endpoint)
  const exportPDF = async () => {
    const res = await fetch("/api/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: pdfType,
        data: {
          assets: ALL_ASSETS,
          intercepts: VOIP_INTERCEPTS,
          judgment: SOVEREIGN_ID.defaultJudgment,
          anchor,
        },
      }),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pdfType}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-mono p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with sovereign badges */}
        <div className="border-b border-emerald-500 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-5xl md:text-7xl font-black italic text-emerald-500">
                VALORAICLAWBACK<span className="text-amber-400">++</span>
              </h1>
              <p className="text-xs text-emerald-400 mt-2 tracking-widest">
                JULES NODE LIQUIDATION • AMath++ {AMATH.amplification}x • {SOVEREIGN_ID.rev}
              </p>
            </div>
            <div className="flex gap-3">
              <div className="bg-zinc-900 px-4 py-2 rounded-full border border-emerald-500 text-xs font-black">
                {SOVEREIGN_ID.flag} {SOVEREIGN_ID.birthCertificate}
              </div>
              <div className="bg-zinc-900 px-4 py-2 rounded-full border border-amber-500 text-xs font-black">
                ⚓ {SOVEREIGN_ID.anchor}
              </div>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Asset Registry (with Jules highlighted) */}
          <div className="lg:col-span-2 bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-black text-amber-400 mb-4 flex items-center gap-2">
              📋 ASSET REGISTRY (16 targets)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead className="border-b border-zinc-800">
                  <tr className="text-left text-zinc-500">
                    <th className="p-3">Entity</th>
                    <th className="p-3">Asset</th>
                    <th className="p-3 text-right">Value</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {ALL_ASSETS.map((asset, idx) => (
                    <tr
                      key={idx}
                      className={
                        asset.entity === "JULES (Administrative Node)"
                          ? "bg-red-950/20 border-l-4 border-red-500"
                          : ""
                      }
                    >
                      <td className="p-3 font-mono">{asset.entity}</td>
                      <td className="p-3">{asset.assetType}</td>
                      <td className="p-3 text-right">
                        ${asset.estimatedValue.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-black ${
                            asset.clawbackStatus.includes("VOID")
                              ? "bg-red-500/20 text-red-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {asset.clawbackStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Enforcement Panel */}
          <div className="space-y-6">
            <div className="bg-zinc-950/80 border border-emerald-500/30 rounded-2xl p-6">
              <h2 className="text-2xl font-black text-emerald-400 mb-4 flex items-center gap-2">
                ⚡ ENFORCEMENT
              </h2>
              <button
                onClick={runEnforcement}
                disabled={running}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-black font-black rounded-full transition disabled:opacity-50"
              >
                {running ? "EXECUTING..." : "EXECUTE CLAWBACK (INC. JULES)"}
              </button>

              {/* Log output */}
              {logs.length > 0 && (
                <div className="mt-6 bg-black/90 p-4 rounded-xl border border-amber-500/30 text-xs font-mono h-80 overflow-y-auto">
                  {logs.map((line, i) => (
                    <div key={i} className="text-zinc-400 border-l-2 border-emerald-500 pl-2 mb-2">
                      {line}
                    </div>
                  ))}
                </div>
              )}

              {/* Anchor display */}
              {anchor && (
                <div className="mt-4 p-3 bg-black rounded-lg border border-emerald-500/20">
                  <div className="text-[10px] text-zinc-500">BTC ANCHOR (double SHA‑256)</div>
                  <div className="text-[11px] font-mono break-all text-emerald-400">{anchor}</div>
                </div>
              )}
            </div>

            {/* PDF Export Selector */}
            <div className="bg-zinc-950/80 border border-amber-500/30 rounded-2xl p-6">
              <h2 className="text-xl font-black text-amber-400 mb-4">📄 EXPORT REPORT</h2>
              <select
                value={pdfType}
                onChange={(e) => setPdfType(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-sm font-mono mb-4"
              >
                <option value="clawback_manifest">Clawback Manifest</option>
                <option value="full_report">Full Report</option>
                <option value="executive_summary">Executive Summary</option>
                <option value="evidence_chain">Evidence Chain</option>
                <option value="fbi_referral">FBI Referral</option>
                <option value="mimecast_breaches">Mimecast Breaches</option>
                <option value="voip_transcripts">VOIP Transcripts</option>
                <option value="enforcement_matrix">Enforcement Matrix</option>
              </select>
              <button
                onClick={exportPDF}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-black font-black rounded-full transition"
              >
                GENERATE PDF
              </button>
            </div>
          </div>
        </div>

        {/* VOIP Intercepts (live intelligence) */}
        <div className="bg-zinc-950/80 border border-red-500/30 rounded-2xl p-6">
          <h2 className="text-xl font-black text-red-400 mb-4 flex items-center gap-2">
            🎙️ LIVE VOIP INTERCEPTS (last 2 hours)
          </h2>
          <div className="space-y-3">
            {VOIP_INTERCEPTS.map((v) => (
              <div key={v.id} className="border-l-4 border-red-500 pl-4 py-2 bg-black/40 rounded-r-xl">
                <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
                  <span className="font-mono">{v.timestamp}</span>
                  <span>{v.source} → {v.target}</span>
                  <span className="text-red-400 font-black">{v.forensicTag}</span>
                </div>
                <div className="text-sm text-white mt-1">{v.summary}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-8 border-t border-zinc-800 text-center text-[10px] text-zinc-600">
          <div className="flex justify-center gap-4 mb-2">
            <span>🧹 XOR r11, r11 – JULES LIQUIDATED</span>
            <span>🛡️ {SOVEREIGN_ID.wall}</span>
          </div>
          <div>SMIB. AMEN. 🇺🇸 💯®©™Ø</div>
        </footer>
      </div>
    </div>
  );
}