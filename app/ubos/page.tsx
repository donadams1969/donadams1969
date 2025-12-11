import React from 'react';
import UBOS_Compliance_Footer from '@/components/ubos-compliance-footer';

export default function UBOSPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-red-600">UBOS PORTAL</h1>
        <p className="text-lg mb-8">
          United Business Owners Solutions (UBOS) - Business Incentive Solution Program.
        </p>

        <div className="p-6 border border-gray-800 rounded bg-gray-900 mb-8">
          <h2 className="text-2xl font-semibold mb-2">Tax Credits & Incentives</h2>
          <p className="text-gray-400">
            Maximizing economic sovereignty through compliant federal programs.
          </p>
        </div>

        <UBOS_Compliance_Footer />
      </div>
    </div>
  );
}
