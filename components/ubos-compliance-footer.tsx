import React from 'react';
import { Shield, Lock, Globe, Eye } from 'lucide-react';

export default function UBOS_Compliance_Footer() {
  return (
    <div className="w-full max-w-6xl mx-auto mt-8 p-4 bg-black border-t-2 border-red-900/50 text-[10px] font-mono text-slate-500">

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

        <div className="flex items-center gap-3">
          <Shield className="w-4 h-4 text-red-500" />
          <span>
            <strong>SECURITY NOTICE:</strong> THIS SYSTEM IS PROTECTED BY VALOR AI+ SENTINEL.
            ALL ACCESS IS LOGGED ON THE IMMUTABLE LEDGER (BLOCKCHAIN ANCHORED).
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Eye className="w-4 h-4 text-blue-500" />
          <span>
            <strong>TRAFFIC MONITOR:</strong> GOVERNMENT/AGENCY IP DETECTED.
            STATUS: COMPLIANT WITH FEDERAL WHISTLEBLOWER ACT (5 U.S.C. § 2302).
          </span>
        </div>

      </div>

      <div className="mt-4 text-center text-slate-700">
        © 2025 THAT'S EDUTAINMENT LLC | UBOS | VALOR AI+ | 14D-CORE ENCRYPTION ACTIVE
      </div>

    </div>
  );
}
