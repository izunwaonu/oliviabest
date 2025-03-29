"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

interface Customer {
  id: number;
  name: string;
  email: string;
  billing: {
    phone: string;
    city: string;
    country: string;
  };
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("/api/customers");
        setCustomers(response.data);
        setFilteredCustomers(response.data);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const filtered = customers.filter((customer) =>
      (customer.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (customer.billing?.phone || "").includes(searchTerm)
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 p-6">
      <h1 className="text-4xl font-bold text-white text-center mb-6">Customers</h1>

      {/* Search Input */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Customers Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-purple-600 text-white">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">City</th>
              <th className="p-4 text-left">Country</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hover:bg-gray-100 transition"
                >
                  <td className="p-4">{customer.name}</td>
                  <td className="p-4">{customer.email}</td>
                  <td className="p-4">{customer.billing.phone || "N/A"}</td>
                  <td className="p-4">{customer.billing.city || "N/A"}</td>
                  <td className="p-4">{customer.billing.country || "N/A"}</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
