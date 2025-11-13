// File: /app/explorer/page.tsx

import { Suspense } from 'react';
import { ValoraiplusVerifyPanel } from '@/components/valoraiplus_VerifyPanel';
import { OtherExplorerComponents } from '@/components/OtherExplorerComponents'; // Placeholder

// --- Data Fetching ---

interface VerificationResult {
  file: string;
  val2e_status: 'Verified' | 'Failed' | 'Not Found';
  val3e_status: 'Verified' | 'Failed' | 'Not Found';
  error?: string;
}

interface VerifyApiResponse {
  ok: boolean;
  results: VerificationResult[];
}

// Fetches verification status from our new API endpoint
async function valoraiplusFetchVerify(): Promise<VerifyApiResponse> {
  try {
    // This fetch runs on the server (RSC)
    // We use an absolute URL or configure the base URL
    const res = await fetch(`${process.env.APP_URL}/api/audit/verify`, {
      cache: 'no-store', // Ensure we always get the latest status
    });

    if (!res.ok) {
      return {
        ok: false,
        results: [],
      };
    }
    return res.json();
  } catch (error) {
    console.error('Failed to fetch verification status:', error);
    return {
      ok: false,
      results: [],
    };
  }
}

// Placeholder for other data fetching functions
async function fetchOtherData() {
  // ... logic to fetch blocks, transactions, etc.
  return { someData: '...' };
}

// --- Server Component for Verification Panel ---
async function VerificationPanelLoader() {
  const { ok, results } = await valoraiplusFetchVerify();
  return <ValoraiplusVerifyPanel ok={ok} results={results} />;
}


// --- Main Page Component ---

export default async function ExplorerPage() {
  // Fetch data in parallel
  const [otherData] = await Promise.all([
    fetchOtherData(),
    // The verification data is fetched inside its own loader
  ]);

  return (
    <main className="container mx-auto p-8 space-y-8">
      <h1 className="text-4xl font-bold text-white">
        VALORAIPLUS Fort Explorer
      </h1>

      {/* The new VALORAIPLUS Verification Panel.
        We wrap it in a <Suspense> so the rest of the page
        can load while verification is performed.
      */}
      <Suspense fallback={<VerificationLoadingSkeleton />}>
        <VerificationPanelLoader />
      </Suspense>

      {/* Placeholder for other explorer components */}
      <OtherExplorerComponents data={otherData} />
    </main>
  );
}

// Loading Skeleton component
function VerificationLoadingSkeleton() {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-sm animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-gray-700 rounded w-1/3"></div>
        <div className="h-6 bg-gray-700 rounded w-1/4"></div>
      </div>
      <div className="h-4 bg-gray-700 rounded w-full mb-6"></div>
      <div className="space-y-3">
        <div className="h-8 bg-gray-800 rounded w-full"></div>
        <div className="h-8 bg-gray-800/50 rounded w-full"></div>
        <div className="h-8 bg-gray-800/50 rounded w-full"></div>
        <div className="h-8 bg-gray-800/50 rounded w-full"></div>
      </div>
    </div>
  );
}
