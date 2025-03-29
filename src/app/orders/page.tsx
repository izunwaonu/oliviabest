// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import axios from "axios";
// import dayjs from "dayjs";

// interface Order {
//   id: number;
//   customer: string;
//   date: string;
//   status: string;
//   total: string;
// }

// export default function OrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [search, setSearch] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     fetchOrders();
//   }, [page, search]);

//   const fetchOrders = async () => {
//     try {
//       const response = await axios.get(`/api/orders?page=${page}&search=${search}`);
//       setOrders(response.data.orders);
//       setTotalPages(response.data.totalPages);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4 sm:p-6">
//       <button
//         onClick={() => router.push("/")}
//         className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
//       >
//         ← Back to Home
//       </button>
//       <h1 className="text-xl sm:text-2xl font-bold mb-4">Orders</h1>
      
//       <input
//         type="text"
//         placeholder="Search by Customer Name or Order Number"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="border p-2 rounded w-full mb-4"
//       />

//       {/* Responsive Table Container */}
//       <div className="overflow-x-auto">
//         <table className="w-full min-w-max border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-100 text-sm sm:text-base">
//               <th className="border p-1 sm:p-2">#</th>
//               <th className="border p-1 sm:p-2">Order ID</th>
//               <th className="border p-1 sm:p-2">Customer Name</th>
//               <th className="border p-1 sm:p-2">Date</th>
//               <th className="border p-1 sm:p-2">Status</th>
//               <th className="border p-1 sm:p-2">Total (₦)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order, index) => (
//               <tr key={order.id} className="hover:bg-gray-50 text-sm sm:text-base">
//                 <td className="border p-1 sm:p-2">{(page - 1) * 50 + index + 1}</td>
//                 <td className="border p-1 sm:p-2 text-blue-600 font-semibold">
//                   <Link href={`/orders/${order.id}`}>{order.id}</Link>
//                 </td>
//                 <td className="border p-1 sm:p-2 text-blue-600">
//                   <Link href={`/orders/${order.id}`}>{order.customer}</Link>
//                 </td>
//                 <td className="border p-1 sm:p-2">{dayjs(order.date).format("MMM DD, YYYY")}</td>
//                 <td className="border p-1 sm:p-2">{order.status}</td>
//                 <td className="border p-1 sm:p-2">₦{order.total}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Buttons */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           disabled={page === 1}
//           onClick={() => setPage(page - 1)}
//           className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span className="text-sm sm:text-base">Page {page} of {totalPages}</span>
//         <button
//           disabled={page === totalPages}
//           onClick={() => setPage(page + 1)}
//           className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import dayjs from "dayjs"
import { motion } from "framer-motion"
import { Search, ChevronLeft, ChevronRight, Sun, Moon, ArrowLeft, Loader2, Filter } from "lucide-react"

interface Order {
  id: number
  customer: string
  date: string
  status: string
  total: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchOrders()
  }, [page, search])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/api/orders?page=${page}&search=${search}`)
      setOrders(response.data.orders)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return isDarkTheme
          ? "bg-green-900/30 text-green-400 border-green-700"
          : "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return isDarkTheme
          ? "bg-amber-900/30 text-amber-400 border-amber-700"
          : "bg-amber-100 text-amber-800 border-amber-200"
      case "processing":
        return isDarkTheme
          ? "bg-blue-900/30 text-blue-400 border-blue-700"
          : "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return isDarkTheme ? "bg-red-900/30 text-red-400 border-red-700" : "bg-red-100 text-red-800 border-red-200"
      default:
        return isDarkTheme
          ? "bg-slate-800 text-slate-300 border-slate-700"
          : "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  // Theme-dependent styles
  const styles = {
    background: isDarkTheme
      ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      : "bg-gradient-to-br from-slate-100 via-white to-slate-100",
    text: isDarkTheme ? "text-white" : "text-slate-800",
    subtext: isDarkTheme ? "text-slate-300" : "text-slate-600",
    card: isDarkTheme ? "bg-slate-800/50 border-slate-700" : "bg-white/80 border-slate-200",
    tableHeader: isDarkTheme
      ? "bg-slate-800 text-slate-200 border-slate-700"
      : "bg-slate-100 text-slate-700 border-slate-200",
    tableRow: isDarkTheme ? "border-slate-700 hover:bg-slate-700/50" : "border-slate-200 hover:bg-slate-50",
    tableCell: isDarkTheme ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-600",
    input: isDarkTheme
      ? "bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-rose-500"
      : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-rose-500",
    button: isDarkTheme
      ? "bg-slate-700 hover:bg-slate-600 text-white"
      : "bg-white hover:bg-slate-100 text-slate-800 border border-slate-200",
    buttonAccent: isDarkTheme
      ? "bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 text-white"
      : "bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 text-white",
    link: isDarkTheme ? "text-rose-400 hover:text-rose-300" : "text-rose-600 hover:text-rose-700",
    disabled: isDarkTheme ? "opacity-50 cursor-not-allowed bg-slate-800" : "opacity-50 cursor-not-allowed bg-slate-200",
    primary: isDarkTheme ? "text-rose-400" : "text-rose-600",
    primaryHover: isDarkTheme ? "hover:text-rose-300" : "hover:text-rose-700",
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <div className={`min-h-screen ${styles.background} transition-colors duration-300`}>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className={`p-2.5 rounded-full ${styles.button} transition-colors`}
              aria-label="Back to Home"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${styles.text}`}>Orders</h1>
          </div>

          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-full ${styles.button} transition-colors`}
            aria-label={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Search and Filters */}
        <div className={`${styles.card} rounded-xl p-4 sm:p-6 border shadow-sm`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkTheme ? "text-slate-500" : "text-slate-400"}`}
                size={18}
              />
              <input
                type="text"
                placeholder="Search by Customer Name or Order Number"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`${styles.input} pl-10 pr-4 py-2.5 rounded-lg w-full border focus:outline-none transition-colors`}
              />
            </div>
            <button
              className={`hidden sm:flex items-center justify-center p-2.5 rounded-lg ${styles.button} transition-colors`}
            >
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className={`${styles.card} rounded-xl border shadow-sm overflow-hidden`}>
          <div className="p-6 pb-3 border-b border-opacity-50" style={{ borderColor: "inherit" }}>
            <h2 className={`text-xl font-semibold ${styles.text}`}>Order List</h2>
          </div>
          <div className="overflow-x-auto">
            <motion.table className="w-full" variants={containerVariants} initial="hidden" animate="visible">
              <thead>
                <tr className={`${styles.tableHeader} border-b`}>
                  <th className="p-4 text-left font-medium">#</th>
                  <th className="p-4 text-left font-medium">Order ID</th>
                  <th className="p-4 text-left font-medium">Customer Name</th>
                  <th className="p-4 text-left font-medium">Date</th>
                  <th className="p-4 text-left font-medium">Status</th>
                  <th className="p-4 text-left font-medium">Total (₦)</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className={`animate-spin ${styles.primary}`} size={20} />
                        <span className={styles.subtext}>Loading orders...</span>
                      </div>
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={`text-center py-12 ${styles.subtext}`}>
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      className={`${styles.tableRow} transition-colors`}
                      variants={itemVariants}
                    >
                      <td className={`p-4 ${styles.subtext}`}>{(page - 1) * 50 + index + 1}</td>
                      <td className={`p-4 font-medium ${styles.primary}`}>
                        <Link href={`/orders/${order.id}`} className={styles.primaryHover}>
                          #{order.id}
                        </Link>
                      </td>
                      <td className={`p-4 ${styles.text}`}>
                        <Link
                          href={`/orders/${order.id}`}
                          className={`${styles.text} hover:opacity-80 transition-opacity`}
                        >
                          {order.customer}
                        </Link>
                      </td>
                      <td className={`p-4 ${styles.subtext}`}>{dayjs(order.date).format("MMM DD, YYYY")}</td>
                      <td className={`p-4 ${styles.tableCell}`}>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className={`p-4 font-medium ${styles.text}`}>₦{order.total}</td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </motion.table>
          </div>
        </div>

        {/* Pagination */}
        <div className={`flex justify-between items-center ${styles.card} rounded-xl p-4 border shadow-sm`}>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              page === 1 ? styles.disabled : styles.button
            }`}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <span className={`text-sm ${styles.text}`}>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              page === totalPages ? styles.disabled : styles.button
            }`}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}



