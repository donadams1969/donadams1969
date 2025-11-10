"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Payment {
  id: string;
  provider: string;
  method: string;
  currency: string;
  amount: number;
  status: string;
  riskScore: number;
  userId?: string | null;
  createdAt: string;
}

const PAGE_SIZE = 10;

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const color =
    status === 'ok' ? 'green' : status === 'review' ? 'yellow' : 'red';
  return (
    <span className={`px-2 py-1 rounded text-white bg-${color}-500`}>{status}</span>
  );
};

const Dashboard: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  const fetchPayments = async (page: number) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/payments?page=${page}&limit=${PAGE_SIZE}`);
      setPayments(res.data.payments);
      setTotal(res.data.total);
    } catch (error) {
      console.error('Failed to fetch payments', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(page);
  }, [page]);

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl mb-4 font-bold">Payments Audit Dashboard</h1>
      {loading && <p>Loading...</p>}
      {!loading && (
        <table className="w-full table-auto border-collapse border border-gray-700">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Provider</th>
              <th className="px-4 py-2">Method</th>
              <th className="px-4 py-2">Currency</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Risk Score</th>
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-gray-700">
                <td className="px-4 py-2">{p.id}</td>
                <td className="px-4 py-2">{p.provider}</td>
                <td className="px-4 py-2">{p.method}</td>
                <td className="px-4 py-2">{p.currency}</td>
                <td className="px-4 py-2">{(p.amount / 100).toFixed(2)}</td>
                <td className="px-4 py-2"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-2">{p.riskScore.toFixed(2)}</td>
                <td className="px-4 py-2">{p.userId ?? '-'}</td>
                <td className="px-4 py-2">{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4 flex justify-between">
        <button
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <p>
          Page {page} / {Math.ceil(total / PAGE_SIZE)}
        </p>
        <button
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
          disabled={page >= Math.ceil(total / PAGE_SIZE)}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
