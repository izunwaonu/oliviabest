"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

interface Payment {
  id: string;
  amount: number;
  paidAt: string;
  debtor: { id: string; name: string; invoiceNo: string };
  user: { name: string };
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [successModal, setSuccessModal] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch("/api/payments/history");
        if (!res.ok) throw new Error("Failed to fetch payment history");
        const data = await res.json();
        setPayments(data);
        setSuccessModal(true);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <Navbar />
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">Payment History</h2>
      <p className="text-gray-600 mb-4 text-center">View all recorded payments. Click on a debtor's name to see details.</p>

      {loading && <p className="text-center text-lg text-gray-500 animate-pulse">Please wait, we are fetching payments...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      <div className="overflow-x-auto mt-4">
        <table className="w-full border border-gray-300 shadow-lg rounded-md">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border p-3">Debtor Name</th>
              <th className="border p-3">Invoice No</th>
              <th className="border p-3">Amount Paid</th>
              <th className="border p-3">Paid On</th>
              <th className="border p-3">Recorded By</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border hover:bg-gray-100">
                <td className="border p-3 text-blue-500 underline">
                  <Link href={`/payments/history/${payment.debtor.id}`}>
                    {payment.debtor.name}
                  </Link>
                </td>
                <td className="border p-3">{payment.debtor.invoiceNo}</td>
                <td className="border p-3 font-semibold">₦{payment.amount.toFixed(2)}</td>
                <td className="border p-3">{new Date(payment.paidAt).toLocaleDateString()}</td>
                <td className="border p-3">{payment.user.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {successModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <h2 className="text-lg font-bold text-green-600">Payments Loaded Successfully!</h2>
            <button 
              onClick={() => setSuccessModal(false)} 
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
