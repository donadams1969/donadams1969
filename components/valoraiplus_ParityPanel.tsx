import { CheckCircle, XCircle } from "lucide-react";

/**
 * Type definition for the ledger prop.
 * This defines the dynamic content for the panel.
 */
export interface Ledger {
  parityOk: boolean;
  section1Text: string;
  section2Text: string;
  section3Text: string;
}

interface ValoraiplusParityPanelProps {
  ledger?: Ledger; // The prop is optional
}

// Define the default, static content for backward compatibility
const defaultLedger: Ledger = {
  parityOk: true,
  section1Text: "VALORCHAIN-G / Mainnet Parity",
  section2Text: "Last Block: 0x...a4b8 (Default)",
  section3Text: "Liveness: 0.19s (Default)",
};

/**
 * A dynamic panel showing ledger parity status.
 * It renders default content if no `ledger` prop is provided.
 */
export function ValoraiplusParityPanel({ ledger }: ValoraiplusParityPanelProps) {
  // Use the provided ledger prop, or fall back to the default static content
  const displayData = ledger ?? defaultLedger;
  const { parityOk, section1Text, section2Text, section3Text } = displayData;

  // Conditionally set styles based on parity status
  const statusClass = parityOk
    ? "text-green-400 border-green-800"
    : "text-red-400 border-red-800";

  const Icon = parityOk ? CheckCircle : XCircle;

  return (
    <div
      className={`flex flex-col space-y-3 rounded-lg border bg-zinc-950 p-4 shadow-lg ${statusClass}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm">{section1Text}</span>
        <Icon className="h-5 w-5 flex-shrink-0" />
      </div>
      <div className="font-mono text-xs text-zinc-400">{section2Text}</div>
      <div className="font-mono text-xs text-zinc-400">{section3Text}</div>
    </div>
  );
}
