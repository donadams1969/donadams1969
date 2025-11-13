// File: /components/valoraiplus_VerifyPanel.tsx

'use client';

interface VerificationResult {
  file: string;
  val2e_status: 'Verified' | 'Failed' | 'Not Found';
  val3e_status: 'Verified' | 'Failed' | 'Not Found';
  error?: string;
}

interface Props {
  ok: boolean;
  results: VerificationResult[];
}

// Helper to get color class based on status
const getStatusClass = (status: string) => {
  switch (status) {
    case 'Verified':
      return 'text-green-400';
    case 'Failed':
      return 'text-red-500 font-bold animate-pulse';
    case 'Not Found':
      return 'text-gray-600';
    default:
      return 'text-gray-400';
  }
};

export function ValoraiplusVerifyPanel({ ok, results }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-white">
          VALORAIPLUS Signature Verification
        </h3>
        {ok ? (
          <span className="px-3 py-1 rounded-full bg-green-800 text-green-200 text-xs font-semibold">
            ALL VERIFIED
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full bg-red-800 text-red-200 text-xs font-semibold">
            ISSUES DETECTED
          </span>
        )}
      </div>

      <p className="text-gray-400 mb-6">
        Real-time cryptographic verification of core system files. This panel
        confirms that the on-chain data has not been tampered with.
      </p>

      <table className="min-w-full divide-y divide-gray-800">
        <thead className="bg-gray-800/50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
            >
              File
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
            >
              VALORAIPLUS2E (Ed25519)
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
            >
              VALORAIPLUS3E (PQ-sim)
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800">
          {results.map((result) => (
            <tr key={result.file}>
              <td className="px-4 py-3 whitespace-nowrap text-gray-300 font-mono">
                {result.file}
              </td>
              <td
                className={`px-4 py-3 whitespace-nowrap font-medium ${getStatusClass(
                  result.val2e_status
                )}`}
              >
                {result.val2e_status}
              </td>
              <td
                className={`px-4 py-3 whitespace-nowrap font-medium ${getStatusClass(
                  result.val3e_status
                )}`}
              >
                {result.val3e_status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {results.some((r) => r.error) && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-300">
          <strong>Error:</strong>{' '}
          {results.find((r) => r.error)?.error || 'An unknown error occurred.'}
        </div>
      )}
    </div>
  );
}
