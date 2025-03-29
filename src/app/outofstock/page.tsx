"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  stock_status: string;
  stock_quantity: number | null;
  price: string;
}


export default function OutOfStockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async (page: number) => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products?page=${page}&per_page=50`);
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();

        // Ensure data.products is an array before filtering
        const outOfStockProducts = Array.isArray(data.products)
        ? data.products.filter((product: Product) => product.stock_status === "outofstock")
        : [];

        setProducts(outOfStockProducts);
        setTotalPages(data.totalPages || 1); // Default to 1 if undefined
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(currentPage);
  }, [currentPage]);

  // Handle Pagination
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
       <Link href="/dashboardtwo">
          <span className="text-blue-600 hover:underline text-lg">← Back to Dashboard</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">❌ Out of Stock Products</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Error Message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Loading Indicator */}
        {loading ? (
          <p className="text-gray-600">Loading products...</p>
        ) : (
          <>
            {/* Table */}
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-3 border border-gray-300">Product Name</th>
                  <th className="p-3 border border-gray-300">Stock Quantity</th>
                  <th className="p-3 border border-gray-300">Status</th>
                  <th className="p-3 border border-gray-300">Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="bg-white hover:bg-gray-50">
                      <td className="p-3 border border-gray-300">{product.name}</td>
                      <td className="p-3 border border-gray-300">{product.stock_quantity ?? "N/A"}</td>
                      <td className="p-3 border border-gray-300">
                        <span className="px-3 py-1 text-sm font-semibold rounded-md bg-red-200 text-red-700">
                          Out of Stock
                        </span>
                      </td>
                      <td className="p-3 border border-gray-300">${product.price}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-3 text-center text-gray-600">
                      No out-of-stock products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
              >
                ◀ Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage >= totalPages}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
              >
                Next ▶
              </button>
            </div>
          </>
        )}
      </div>

      {/* Back to Dashboard */}
      <div className="text-center mt-6">
        
      </div>
    </div>
  );
}
