// components/OtherExplorerComponents.tsx
// Placeholder component to satisfy the import in the Explorer page.

export function OtherExplorerComponents({ data }: { data: any }) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-sm">
      <h3 className="text-lg font-medium text-white mb-4">
        Additional Explorer Data
      </h3>
      <pre className="text-gray-400 text-xs">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
