"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";

export default function AddDebtorPage() {
  const router = useRouter();
  const [debtor, setDebtor] = useState({
    name: "",
    invoiceNo: "",
    phoneNumber: "",
    amountOwed: "",
    balance: "",
    dueDate: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDebtor({ ...debtor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/debtors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(debtor),
      });

      if (!res.ok) {
        if (res.status === 400) {
          setError("Invoice number already exists.");
        } else {
          throw new Error("Failed to add debtor.");
        }
        return;
      }

      setShowSuccessModal(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className=" h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <Navbar/>
      <div className="p-6 max-w-md mx-auto ">
      <h1 className="text-2xl font-bold mb-4">Add New Debtor</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded-md">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={debtor.name}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          type="text"
          name="invoiceNo"
          placeholder="Invoice Number"
          value={debtor.invoiceNo}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={debtor.phoneNumber}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          type="number"
          name="amountOwed"
          placeholder="Amount Owed"
          value={debtor.amountOwed}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
        <p className="font-semibold text-red-600 flex items-center">
          <svg className="w-5 h-5 text-red-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M9.172 16.172a4 4 0 005.656 0m3.172-4.172a4 4 0 00-5.656 0m-3.172-4.172a4 4 0 015.656 0M12 2a10 10 0 110 20 10 10 0 010-20z" />
          </svg>
          The due date should be noted.
        </p>
        <input
          type="date"
          name="dueDate"
          placeholder="Due Date"
          value={debtor.dueDate}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md">
          Add Debtor
        </button>
      </form>

      {showSuccessModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <h2 className="text-xl font-bold mb-4">Success!</h2>
            <p className="text-gray-600">Debtor added successfully.</p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/debtors");
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
