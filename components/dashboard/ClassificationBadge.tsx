import React from 'react';

export function ClassificationBadge({ level }: { level: 'UNCLASSIFIED' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET' }) {
  const colors = {
    UNCLASSIFIED: 'bg-zinc-800 text-zinc-300',
    CONFIDENTIAL: 'bg-blue-900 text-blue-300',
    SECRET: 'bg-red-900 text-red-300',
    TOP_SECRET: 'bg-amber-900 text-amber-300 border border-amber-500'
  };

  return (
    <div className={`px-3 py-1 font-mono text-[10px] font-black tracking-widest uppercase rounded ${colors[level]}`}>
      {level}
    </div>
  );
}
