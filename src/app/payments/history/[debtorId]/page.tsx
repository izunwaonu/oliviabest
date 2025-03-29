"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { exportPaymentHistoryToPDF, printPaymentHistory } from "@/utils/export";
import Navbar from "@/app/components/Navbar";

interface Payment {
  id: string;
  amount: number;
  paidAt: string;
  user: { name: string };
}

interface Debtor {
  id: string;
  name: string;
  invoiceNo: string;
  amountOwed: number;
  payments: Payment[];
}

export default function DebtorHistoryPage() {
  const params = useParams();
  const debtorId = params?.debtorId as string | undefined;

  const [debtor, setDebtor] = useState<Debtor | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!debtorId) return;

    const fetchDebtorPayments = async () => {
      try {
        const res = await fetch(`/api/payments/history/${debtorId}`);
        if (!res.ok) throw new Error("Failed to fetch payments");

        const data = await res.json();
        setDebtor(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchDebtorPayments();
  }, [debtorId]);

  if (!debtorId) return <p className="text-red-500 text-center">Invalid Debtor ID</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!debtor) return <p className="text-gray-500 text-center">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <Navbar />
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Payment History for {debtor.name}</h2>
      <p className="text-gray-600 text-center">Invoice No: {debtor.invoiceNo}</p>
      <p className="text-gray-700 text-center font-semibold mb-4">Remaining Balance: ₦{debtor.amountOwed.toFixed(2)}</p>

      <div className="flex justify-center gap-4 mb-4">
        <button onClick={() => exportPaymentHistoryToPDF(debtor)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
          Export as PDF
        </button>
        <button onClick={() => printPaymentHistory(debtor)} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">
          Print
        </button>
      </div>
    </div>
  );
}
