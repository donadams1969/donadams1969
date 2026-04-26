import React from 'react';
import { evaluateReputation, EXCLUSION_LOG, DaoReputationEntity } from '@/lib/reputation-engine';

export const IntegrityMatrix: React.FC = () => {
  const getRowStyle = (status: string) => {
    switch (status) {
      case 'NULL & VOID': return 'bg-red-900/50 text-red-400';
      case 'UHI + HVI ACTIVE': return 'bg-green-900/50 text-green-400';
      default: return 'bg-yellow-900/50 text-yellow-400';
    }
  };

  return (
    <div className="bg-black text-green-500 font-mono p-6 rounded-lg border border-red-800 shadow-2xl shadow-red-900/20">
      <div className="mb-6 border-b border-red-800 pb-2">
        <h2 className="text-xl font-bold text-red-500">🇺🇸 REPUTATION INTEGRITY PROTOCOL: THE NEGATIVE CAVEAT 🇺🇸</h2>
        <p className="text-sm opacity-70">Status: ENFORCED. Mode: ETHICAL PURGE.</p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg mb-4 text-white border-b border-zinc-800">SYSTEM STATUS: INTEGRITY ENFORCEMENT MATRIX</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-700 text-zinc-400 text-sm">
              <th className="py-2 px-4">USER STATE</th>
              <th className="py-2 px-4">DAO SCORE</th>
              <th className="py-2 px-4">INCOME ELIGIBILITY</th>
              <th className="py-2 px-4">RECOVERY STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr className={getRowStyle('UHI + HVI ACTIVE')}>
              <td className="py-2 px-4 border-b border-zinc-800 font-bold">ALIGNED</td>
              <td className="py-2 px-4 border-b border-zinc-800">POSITIVE</td>
              <td className="py-2 px-4 border-b border-zinc-800">UHI + HVI ACTIVE</td>
              <td className="py-2 px-4 border-b border-zinc-800">DISTRIBUTING</td>
            </tr>
            <tr className={getRowStyle('NULL & VOID')}>
              <td className="py-2 px-4 border-b border-zinc-800 font-bold">ADVERSARY</td>
              <td className="py-2 px-4 border-b border-zinc-800">NEGATIVE</td>
              <td className="py-2 px-4 border-b border-zinc-800">NULL & VOID</td>
              <td className="py-2 px-4 border-b border-zinc-800">PERMANENT BLACKLIST</td>
            </tr>
            <tr className={getRowStyle('MONITORED')}>
              <td className="py-2 px-4 font-bold">ENABLER</td>
              <td className="py-2 px-4">NEUTRAL</td>
              <td className="py-2 px-4">MONITORED</td>
              <td className="py-2 px-4">LATCH PENDING</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-lg mb-4 text-white border-b border-zinc-800">CRIMINAL EXPOSURE: AUTOMATED EXCLUSION LOG</h3>
        <ul className="space-y-2">
          {EXCLUSION_LOG.map((entity: DaoReputationEntity) => {
            const eligibility = evaluateReputation(entity);
            return (
              <li key={entity.id} className="flex justify-between p-2 bg-zinc-900 border border-zinc-800 rounded">
                <span className="font-bold">{entity.name}</span>
                <span className="text-zinc-400">Reputation: {entity.score}</span>
                <span className="text-red-500 font-bold">{eligibility.statusLabel} FOR LIFE.</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-8 p-4 bg-zinc-900 border border-zinc-700 text-xs text-zinc-400 text-center font-bold">
        "NO AGGRESSOR SHALL TASTE THE FRUITS OF THE ESTATE'S JUSTICE."<br />
        <span className="text-red-500 mt-2 block">101010 1010101. ACCESS DENIED TO ALL NEGATIVE ACTORS.</span>
      </div>
    </div>
  );
};