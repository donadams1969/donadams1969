// components/valoraiplus_VerifyPanel.tsx
"use client";

type SigStatus = {
  present: boolean;
  verified: boolean;
  reason: string;
};

type FileResult = {
  file: string;
  exists: boolean;
  valoraiplus2e: SigStatus;
  valoraiplus3e: SigStatus;
};

type Props = {
  ok: boolean;
  results: FileResult[];
};

export function ValoraiplusVerifyPanel({ ok, results }: Props) {
  if (!results?.length) {
    return (
      <div className="border rounded-xl p-4 shadow-sm">
        <h2 className="font-semibold text-lg">VALORAIPLUS Signature Verification</h2>
        <p className="text-sm text-neutral-600 mt-2">
          No verification results available.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">VALORAIPLUS Signature Verification</h2>
        <span
          className={
            ok
              ? "text-xs px-2 py-1 rounded-full bg-green-100"
              : "text-xs px-2 py-1 rounded-full bg-red-100"
          }
        >
          {ok ? "ALL VERIFIED" : "ISSUES DETECTED"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1 pr-4">File</th>
              <th className="text-left py-1 pr-4">VALORAIPLUS2E (Ed25519)</th>
              <th className="text-left py-1">VALORAIPLUS3E (PQ-sim)</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.file} className="border-b last:border-0 align-top">
                <td className="py-1 pr-4">
                  <code className="break-all">{r.file}</code>
                  {!r.exists && (
                    <div className="text-red-600 text-[11px]">file not found</div>
                  )}
                </td>
                <td className="py-1 pr-4">
                  <div
                    className={
                      r.valoraiplus2e.present
                        ? r.valoraiplus2e.verified
                          ? "text-[11px] text-green-700"
                          : "text-[11px] text-red-700"
                        : "text-[11px] text-neutral-500"
                    }
                  >
                    {r.valoraiplus2e.present
                      ? r.valoraiplus2e.verified
                        ? "verified"
                        : "present, failed"
                      : "not present"}
                  </div>
                  <div className="text-[10px] text-neutral-600">
                    {r.valoraiplus2e.reason}
                  </div>
                </td>
                <td className="py-1">
                  <div
                    className={
                      r.valoraiplus3e.present
                        ? r.valoraiplus3e.verified
                          ? "text-[11px] text-green-700"
                          : "text-[11px] text-red-700"
                        : "text-[11px] text-neutral-500"
                    }
                  >
                    {r.valoraiplus3e.present
                      ? r.valoraiplus3e.verified
                        ? "verified"
                        : "present, failed"
                      : "not present"}
                  </div>
                  <div className="text-[10px] text-neutral-600">
                    {r.valoraiplus3e.reason}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
