"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

interface Order {
  id: number;
  customer: string;
  items: string;
  total: string;
  currency: string;
  date: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/orders");
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter((order) =>
      (order.customer?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm)
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-500 p-6">
      <h1 className="text-4xl font-bold text-white text-center mb-6">Today's Orders</h1>

      {/* Search Input */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by customer name or order ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Items</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Currency</th>
              <th className="p-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hover:bg-gray-100 transition"
                >
                  <td className="p-4">{order.id}</td>
                  <td className="p-4">{order.customer}</td>
                  <td className="p-4">{order.items}</td>
                  <td className="p-4">{order.total}</td>
                  <td className="p-4">{order.currency}</td>
                  <td className="p-4">{order.date}</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
