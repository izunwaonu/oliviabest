
"use client";
import Navbar from "../components/Navbar";

import { useState, useEffect } from "react";
import axios from "axios";

interface Debtor {
  id: string;
  name: string;
  invoiceNo: string;
  phoneNumber: string;
  amountOwed: number;
  balance: number; // ✅ Overpayment balance
  dueDate: string;
}

export default function PaymentsPage() {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [filteredDebtors, setFilteredDebtors] = useState<Debtor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDebtors() {
      try {
        const response = await axios.get("/api/debtors");
        setDebtors(response.data);
        setFilteredDebtors(response.data);
      } catch (error) {
        console.error("Error fetching debtors:", error);
      }
    }
    fetchDebtors();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = debtors.filter(
      (debtor) =>
        debtor.name.toLowerCase().includes(query.toLowerCase()) ||
        debtor.invoiceNo.includes(query) ||
        debtor.phoneNumber.includes(query)
    );
    setFilteredDebtors(filtered);
  };

  const handlePaymentSubmit = async () => {
    if (!selectedDebtor || paymentAmount <= 0) return alert("Please enter a valid amount.");

    setLoading(true);
    try {
      await axios.post("/api/payments", {
        debtorId: selectedDebtor.id,
        userId: "USER_ID_HERE", // Replace with actual logged-in user ID
        amount: paymentAmount,
        paymentMethod,
      });

      alert("Payment recorded successfully!");

      // ✅ Refresh Debtors List After Payment
      const response = await axios.get("/api/debtors");
      setDebtors(response.data);
      setFilteredDebtors(response.data);

      setSelectedDebtor(null);
      setPaymentAmount(0);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to record payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <div className="max-w-4xl mx-auto p-6">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Payments</h1>

      <input
        type="text"
        placeholder="Search by name, invoice number, or phone number..."
        className="w-full p-2 border rounded mb-4"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <div className="bg-white shadow-md rounded-lg overflow-scroll">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Amount Owed</th>
              <th className="p-3">Overpayment</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDebtors.map((debtor) => (
              <tr key={debtor.id} className="border-b">
                <td className="p-3">{debtor.name}</td>
                <td className="p-3">₦{debtor.amountOwed.toFixed(2)}</td>
                <td className="p-3 text-green-600">₦{debtor.balance.toFixed(2)}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => setSelectedDebtor(debtor)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Add Payment
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Payment Modal */}
      {selectedDebtor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Add Payment for {selectedDebtor.name}</h2>
            <p>Amount Owed: ₦{selectedDebtor.amountOwed.toFixed(2)}</p>
            <p className="text-green-600">Overpayment Balance: ₦{selectedDebtor.balance.toFixed(2)}</p>

            {/* ✅ Payment Amount Input */}
            <label className="block mt-4 text-gray-700">Enter Payment Amount</label>
            <input
              type="number"
              className="w-full p-2 border rounded mt-1"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
            />

            {/* ✅ Payment Method Selection */}
            <label className="block mt-4 text-gray-700">Select Payment Method</label>
               <input
                type="text"
                className="w-full p-2 border rounded mt-1"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                placeholder="Enter payment method (Bank)"
              />

            {/* ✅ Submit & Cancel Buttons */}
            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setSelectedDebtor(null)}
              >
                Cancel
              </button>
              <button
                className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={handlePaymentSubmit}
                disabled={loading}
              >
                {loading ? "Processing..." : "Submit Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
