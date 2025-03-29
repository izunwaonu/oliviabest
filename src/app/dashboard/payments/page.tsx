"use client";

import { useState, useEffect } from "react";

// ✅ Define the type for Debtor
interface Debtor {
  id: string;
  name: string;
  amountOwed: number;
}

export default function PaymentForm() {
  const [debtors, setDebtors] = useState<Debtor[]>([]); // ✅ Correctly typed state
  const [form, setForm] = useState({ debtorId: "", amount: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDebtors = async () => {
      const res = await fetch("/api/debtors");
      const data: Debtor[] = await res.json(); // ✅ Explicitly tell TypeScript the response type
      setDebtors(data);
    };
    fetchDebtors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <select name="debtorId" value={form.debtorId} onChange={handleChange} className="w-full p-2 border rounded" required>
      <option value="">Select Debtor</option>
      {debtors.map((debtor) => (
        <option key={debtor.id} value={debtor.id}>
          {debtor.name} (Owes ${debtor.amountOwed})
        </option>
      ))}
    </select>
  );
}
