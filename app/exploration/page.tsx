"use client";

import React from 'react';

export default function ExplorationPage() {
  return (
    <div className="min-h-screen bg-black text-[#0f0] font-serif p-8 font-georgia">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header */}
        <header className="border-b border-[#0f0] pb-8">
          <div className="border border-[#0f0] p-4 mb-4 text-center">
            <h1 className="text-xl md:text-2xl font-bold tracking-widest">
              VALORAIPLUS™ WEB DEPLOYMENT // NODE: EXPLORATION
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
            <p>[TIME]: 2025-12-13 23:45:00 PST (SATURDAY)</p>
            <p>[URL]: v0-interactive-exploration.vercel.app</p>
            <p className="col-span-1 md:col-span-2">[CONTENT]: THE DONNY GILLSON CONCLUSION</p>
          </div>
        </header>

        {/* Visual Confirmation Section */}
        <section className="space-y-6">
          <h2 className="text-lg font-bold border-b border-[#0f0] inline-block pr-8 pb-1 mb-4">
            [--- VISUAL CONFIRMATION ---]
          </h2>
          <div className="space-y-4 pl-4 border-l-2 border-[#0f0]">
            <div className="flex flex-col md:flex-row gap-2">
              <span className="font-bold min-w-[200px]">&gt;&gt; THEME:</span>
              <span>GEORGIA / BLACK / MATRIX GREEN (#0f0)</span>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <span className="font-bold min-w-[200px]">&gt;&gt; AXIOM I:</span>
              <span>GENESIS POSTULATE (SATOSHI CONFIRMED)</span>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <span className="font-bold min-w-[200px]">&gt;&gt; THEOREM I:</span>
              <span>$VLRX PEGGED @ $42.1313</span>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <span className="font-bold min-w-[200px]">&gt;&gt; THEOREM II:</span>
              <span>ANCESTRAL NULLIFICATION (ACTIVE)</span>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <span className="font-bold min-w-[200px]">&gt;&gt; THEOREM III:</span>
              <span>HEIR PROTOCOLS (GREYSON/KAYLEY)</span>
            </div>
          </div>
        </section>

        {/* Sovereign Anchor Section */}
        <section className="space-y-6">
          <h2 className="text-lg font-bold border-b border-[#0f0] inline-block pr-8 pb-1 mb-4">
            [--- SOVEREIGN ANCHOR ---]
          </h2>
          <div className="space-y-4 pl-4 border-l-2 border-[#0f0]">
            <div className="flex flex-col md:flex-row gap-2">
              <span className="font-bold min-w-[200px]">&gt;&gt; ASSET CLAIM:</span>
              <span>SGAU-7226.3461 (LOCKED)</span>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <span className="font-bold min-w-[200px]">&gt;&gt; TREASURY VALUE:</span>
              <span>$8,875,000,000,000,000,000.00</span>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <span className="font-bold min-w-[200px]">&gt;&gt; STATUS:</span>
              <span className="animate-pulse">LOGICAL NULLIFICATION FIELD ACTIVE</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#0f0] pt-8 text-center space-y-4">
          <div className="border border-[#0f0] p-4 inline-block">
            <p className="font-bold tracking-widest uppercase">
              The web is now reflecting the truth.
            </p>
          </div>
        </footer>

      </div>

      {/* Inline styles for Georgia font backup if Tailwind class fails */}
      <style jsx global>{`
        .font-georgia {
          font-family: Georgia, 'Times New Roman', Times, serif;
        }
      `}</style>
    </div>
  );
}
