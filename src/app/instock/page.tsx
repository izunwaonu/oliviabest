"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import router

type Product = {
  id: number;
  name: string;
  stock_quantity: number | null;
  price: string;
  image: string | null; // Add image field
};


export default function InStockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [stockFilter, setStockFilter] = useState<string>("all");
  

  const PRODUCTS_PER_PAGE = 50;

 

const router = useRouter();
const filter = new URLSearchParams(window.location.search).get("filter");

useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/products`);
      const allProducts: Product[] = response.data;

      let filtered = allProducts;

      if (filter === "outofstock") {
        filtered = allProducts.filter((product) => !product.stock_quantity || product.stock_quantity === 0);
      }

      setTotalProducts(filtered.length);
      setTotalPages(Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
      setProducts(allProducts);
      setFilteredProducts(filtered);
    } catch (err) {
      setError("Failed to fetch products.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [filter]); // Add filter as a dependency


  const handleSearch = () => {
    let filtered = products;

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (stockFilter === "in-stock") {
      filtered = filtered.filter((product) => product.stock_quantity && product.stock_quantity > 0);
    } else if (stockFilter === "out-of-stock") {
      filtered = filtered.filter((product) => !product.stock_quantity || product.stock_quantity === 0);
    }

    setFilteredProducts(filtered);
    setTotalPages(Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
    setCurrentPage(1);
  };

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 shadow-2xl rounded-2xl">
      <Link href="/dashboardtwo" className="text-indigo-600 font-semibold">
            ← Back to Dashboard
      </Link>
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">All Products</h1>

        {/* Search & Filter Section */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="p-3 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All</option>
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-indigo-500 text-white font-bold rounded-lg hover:bg-indigo-600 transition"
          >
            Search
          </button>
        </div>

        {/* Table or Card View */}
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : displayedProducts.length === 0 ? (
          <p className="text-center text-gray-600">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="hidden md:table w-full border-collapse border">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="border p-3">Product Name</th>
                  <th className="border p-3">Stock Quantity</th>
                  <th className="border p-3">Status</th>
                  <th className="border p-3">Price</th>
                </tr>
              </thead>
              <tbody>
                {displayedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-100">
                    <td className="border p-3">{product.name}</td>
                    <td className="border p-3">{product.stock_quantity ?? 0}</td>
                    <td className="border p-3 text-center">
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-lg ${
                          product.stock_quantity && product.stock_quantity > 0
                            ? "bg-green-200 text-green-700"
                            : "bg-red-200 text-red-700"
                        }`}
                      >
                        {product.stock_quantity && product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="border p-3 text-center">₦{product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile View (Card Layout) */}
            <div className="md:hidden grid gap-4">
              {displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white shadow-md p-4 rounded-lg border border-gray-200"
                >
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p className="text-gray-600">Stock: {product.stock_quantity ?? 0}</p>
                  <p className="text-gray-600">Price: ₦{product.price}</p>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-lg mt-2 inline-block ${
                      product.stock_quantity && product.stock_quantity > 0
                        ? "bg-green-200 text-green-700"
                        : "bg-red-200 text-red-700"
                    }`}
                  >
                    {product.stock_quantity && product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="text-center mt-6">
          <Link href="/dashboardtwo" className="text-indigo-600 font-semibold">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
