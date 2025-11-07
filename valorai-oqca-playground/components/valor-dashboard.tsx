'use client';

import { useState, useEffect } from 'react';

interface HealthStatus {
  status: string;
  node: string;
  constitutional_prime: number;
  uptime: number;
}

export default function ValorDashboard() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/dashboard-health');

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch health status');
        }

        const data = await response.json();
        setHealth(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (error) return 'bg-red-500';
    if (!health) return 'bg-yellow-500';
    return health.status === 'OPERATIONAL' ? 'bg-green-500' : 'bg-yellow-500';
  };

  return (
    <div className="w-full max-w-5xl p-4 border rounded-lg shadow-md bg-gray-800 border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-white">VALORAIPLUS Health Probe</h2>
      <div className={`status-indicator p-4 rounded-md flex justify-between items-center text-white ${getStatusColor()}`}>
        {error ? (
          <span>Error: {error}</span>
        ) : health ? (
          <>
            <span>Node: {health.node}</span>
            <span>Status: {health.status}</span>
            <span>Prime: {health.constitutional_prime}</span>
            <span>Uptime: {Math.floor(health.uptime / 60000)} minutes</span>
          </>
        ) : (
          <span>Loading status...</span>
        )}
      </div>
    </div>
  );
}
