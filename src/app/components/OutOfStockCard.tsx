"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaBoxOpen } from "react-icons/fa";

const OutOfStockCard = () => {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOutOfStockCount = async () => {
      try {
        const res = await fetch("/api/products?stock_status=outofstock");

        if (!res.ok) throw new Error("Failed to fetch out-of-stock count");

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid response format");
        }

        setCount(data.length);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchOutOfStockCount();
  }, []);

  return (
    <div
      className="cursor-pointer bg-red-500 hover:bg-red-600 text-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center transition duration-300 ease-in-out transform hover:scale-105"
      onClick={() => router.push("/outofstock")}
    >
      <FaBoxOpen className="text-5xl mb-3" />
      <h2 className="text-lg font-semibold">Out of Stock</h2>
      {loading ? (
        <p className="text-sm animate-pulse">Loading...</p>
      ) : error ? (
        <p className="text-sm text-gray-200">Error</p>
      ) : (
        <p className="text-3xl font-bold">{count}</p>
      )}
    </div>
  );
};

export default OutOfStockCard;
