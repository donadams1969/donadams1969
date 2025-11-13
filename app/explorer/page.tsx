// app/explorer/page.tsx
import { ValoraiplusParityPanel } from "@/components/valoraiplus_ParityPanel";
import { ValoraiplusVerifyPanel } from "@/components/valoraiplus_VerifyPanel";

async function valoraiplusFetchAudit() {
  const res = await fetch("/api/audit/latest", {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

async function valoraiplusFetchHistory() {
  const res = await fetch("/api/explorer/history", {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

async function valoraiplusFetchVerify() {
  const res = await fetch("/api/audit/verify", {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function ValoraiplusExplorerPage() {
  const [audit, history, verify] = await Promise.all([
    valoraiplusFetchAudit(),
    valoraiplusFetchHistory(),
    valoraiplusFetchVerify(),
  ]);

  return (
    <main className="max-w-5xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">VALORAIPLUS Fort Explorer</h1>
      <p className="text-sm text-neutral-600">
        Real-time view of VALORAIPLUS L1/L2 parity, Merkle attestation, OP_RETURN anchors,
        and signature verification status.
      </p>

      <ValoraiplusParityPanel ledger={audit?.ledger} />

      <section className="space-y-2">
        <h2 className="font-semibold text-lg">VALORAIPLUS Attestation Runs</h2>
        {!history?.runs?.length && (
          <p className="text-sm text-neutral-600">No attestation history yet.</p>
        )}
        {history?.runs?.length > 0 && (
          <ul className="text-sm list-disc pl-5">
            {history.runs.map((r: any) => (
              <li key={r.id}>{r.file}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <ValoraiplusVerifyPanel
          ok={verify?.ok ?? false}
          results={verify?.results ?? []}
        />
      </section>
    </main>
  );
}
