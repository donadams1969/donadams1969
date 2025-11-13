import {
  ValoraiplusParityPanel,
  Ledger,
} from "@/components/valoraiplus_ParityPanel";
import { Suspense } from "react";

/**
 * Simulates fetching live data from the ledger.
 * In a real app, this would be an API call or chain query.
 * We add a 1-second delay to simulate network latency.
 */
async function getLedgerData(): Promise<Ledger> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate a random success or failure state
  const isOk = Math.random() > 0.5;

  if (isOk) {
    return {
      parityOk: true,
      section1Text: "VALORCHAIN-G / Mainnet Parity",
      section2Text: "Last Block: 0x...c7e1 (LIVE)",
      section3Text: "Liveness: 0.21s",
    };
  } else {
    return {
      parityOk: false,
      section1Text: "PARITY FAILED: DESYNC",
      section2Text: "Sync Error: -144 blocks (LIVE)",
      section3Text: "Liveness: N/A - Stalled",
    };
  }
}

// A simple loading skeleton component
function PanelSkeleton() {
  return (
    <div className="flex h-[116px] animate-pulse flex-col space-y-3 rounded-lg border border-zinc-700 bg-zinc-900 p-4">
      <div className="flex items-center justify-between">
        <div className="h-4 w-1/2 rounded bg-zinc-700"></div>
        <div className="h-5 w-5 rounded-full bg-zinc-700"></div>
      </div>
      <div className="h-3 w-3/4 rounded bg-zinc-700"></div>
      <div className="h-3 w-1/3 rounded bg-zinc-700"></div>
    </div>
  );
}

/**
 * This is the async component that fetches and renders the live panel.
 */
async function LiveParityPanel() {
  // 1. Fetch the dynamic data
  const liveLedgerData = await getLedgerData();

  // 2. Pass the data as a prop
  return <ValoraiplusParityPanel ledger={liveLedgerData} />;
}

/**
 * The Explorer page, now dynamically feeding live data
 * to the refactored panel component.
 */
export default function ExplorerPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-6 text-3xl font-bold">Explorer Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <h3 className="mb-2 text-sm text-zinc-500">Live Parity Status</h3>
          {/* THE FIX:
            We wrap the async component in a Suspense boundary
            to handle the data fetching, showing a skeleton while
            it loads. This completes the PR.
          */}
          <Suspense fallback={<PanelSkeleton />}>
            <LiveParityPanel />
          </Suspense>
        </div>

        <div className="md:col-span-2">
          {/* Other dashboard content */}
          <div className="h-48 rounded-lg border border-zinc-700 bg-zinc-900 p-4">
            <h2 className="text-lg text-white">Main Chart</h2>
            <p className="text-zinc-400">Other content lives here...</p>
          </div>
        </div>

        <div className="md:col-span-1">
          <h3 className="mb-2 text-sm text-zinc-500">Static Default Panel</h3>
          {/* We can still render the original, static version
            by passing no prop, thanks to the default values.
          */}
          <ValoraiplusParityPanel />
        </div>
      </div>
    </div>
  );
}
