"use client";

import { useEffect, useState } from "react";

export default function TransactionHistory({ debtorId }: { debtorId: string }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch(`/api/transactions?debtorId=${debtorId}`);

        if (!res.ok) throw new Error("Failed to fetch transactions");

        const data = await res.json();
        console.log("Fetched transactions:", data); // Debugging log

        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          setTransactions([]); // Fallback if data is not an array
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [debtorId]);

  if (loading) return <p className="text-center text-gray-500">Loading transactions...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>

      {transactions.length === 0 ? (
        <p className="text-center text-gray-500">No transactions found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Date</th>
              <th className="border p-2">User</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Balance After</th>
              <th className="border p-2">Note</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="text-center">
                <td className="border p-2">{new Date(tx.createdAt).toLocaleDateString()}</td>
                <td className="border p-2">{tx.user?.name || "Unknown"}</td>
                <td className={`border p-2 ${tx.type === "DEBT" ? "text-red-500" : "text-green-500"}`}>
                  {tx.type}
                </td>
                <td className="border p-2">${tx.amount.toFixed(2)}</td>
                <td className="border p-2">${tx.balanceAfter.toFixed(2)}</td>
                <td className="border p-2">{tx.note || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => window.print()}
      >
        Print Transactions
      </button>
    </div>
  );
}
