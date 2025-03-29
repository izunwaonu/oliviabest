"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";

interface Debtor {
  id: string;
  name: string;
  phoneNumber: string;
  amountOwed: number;
  dueDate: string;
  invoiceNo: string;
}

export default function DebtorsPage() {
  const { data: session } = useSession();
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDebtors = async () => {
      try {
        const res = await fetch("/api/debtors"); // Fetch data from your API
        if (!res.ok) throw new Error("Failed to fetch debtors");
        const data: Debtor[] = await res.json();
        setDebtors(data);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchDebtors();
  }, []);

  const filteredDebtors = debtors.filter(
    (debtor) =>
      debtor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      debtor.phoneNumber.includes(searchQuery) ||
      debtor.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <Navbar />
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md mt-11">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">All Debtors</h1>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name, phone, or invoice number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Error Handling */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded-md">
            ⚠️ {error}
          </div>
        )}

        {/* Loading Indicator */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 overflow-scroll">
              <thead className="bg-gray-100">
                <tr className="text-left">
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Phone</th>
                  <th className="p-3 border">Amount Owed</th>
                  <th className="p-3 border">Due Date</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDebtors.length > 0 ? (
                  filteredDebtors.map((debtor) => (
                    <tr key={debtor.id} className="text-center bg-white hover:bg-gray-50 transition">
                      <td className="p-3 border">{debtor.name}</td>
                      <td className="p-3 border">{debtor.phoneNumber}</td>
                      <td
                        className={`p-3 border ${
                          debtor.amountOwed < 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        ₦{debtor.amountOwed.toFixed(2)}
                      </td>
                      <td className="p-3 border">{new Date(debtor.dueDate).toLocaleDateString()}</td>
                      <td className="p-3 border">
                        <Link
                          href={`/debtorlist/${debtor.id}`}
                          className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition"
                        >
                          View Transactions
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-3 border text-center text-gray-500">
                      No matching debtors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
