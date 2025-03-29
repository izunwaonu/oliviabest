"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function TotalProducts() {
  const [totalProducts, setTotalProducts] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("/api/products");
        setTotalProducts(response.data.length);
      } catch (err) {
        setError("Failed to fetch product count.");
        console.error("Error fetching total products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalProducts();
  }, []);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg text-center">
      <h2 className="text-lg font-semibold text-gray-700">Total Products</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-2xl font-bold text-blue-600">{totalProducts}</p>
      )}
    </div>
  );
}
