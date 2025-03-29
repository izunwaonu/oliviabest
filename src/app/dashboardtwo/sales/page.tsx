"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

interface SalesData {
  total_sales: number;
  net_sales: number;
  total_orders: number;
}

export default function SalesPage() {
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [period, setPeriod] = useState("month");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`/api/sales?period=${period}`);
        setSalesData(response.data);
      } catch (err) {
        console.error("Failed to fetch sales data:", err);
        setError("Failed to fetch sales data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [period]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-500 p-6">
      <h1 className="text-4xl font-bold text-white text-center mb-6">Sales Overview</h1>

      {/* Period Selector */}
      <div className="flex justify-center mb-6">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && <p className="text-center text-white">Loading sales data...</p>}

      {/* Error State */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Sales Data */}
      {salesData && !loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold text-gray-700">Total Sales</h2>
            <p className="text-3xl font-bold text-green-600">
              {salesData.total_sales.toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold text-gray-700">Net Sales</h2>
            <p className="text-3xl font-bold text-blue-600">
              ${salesData.net_sales.toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold text-gray-700">Total Orders</h2>
            <p className="text-3xl font-bold text-purple-600">
              {salesData.total_orders}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
