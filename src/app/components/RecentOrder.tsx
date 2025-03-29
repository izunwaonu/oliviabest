// import { useEffect, useState } from "react";
// import axios from "axios";

// interface Order {
//   id: number;
//   customer: string;
//   total: string;
//   currency: string;
//   status?: string;
//   items: string; // Now includes "Product (Quantity)"
//   date: string;
// }

// export default function RecentOrders() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>("");

//   useEffect(() => {
//     async function fetchOrders() {
//       try {
//         const response = await axios.get("/api/recentOrders");
//         setOrders(response.data);
//       } catch (err) {
//         console.error("Error fetching orders:", err);
//         setError("Failed to load orders.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchOrders();
//   }, []);

//   return (
//     <div className="bg-white p-4 shadow rounded-lg mt-4">
//       <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Orders (Today)</h2>
//       {loading ? (
//         <p className="text-gray-500">Loading orders...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse mt-2 text-sm md:text-base">
//             <thead>
//               <tr className="bg-indigo-600 text-white">
//                 <th className="p-3 text-left">ID</th>
//                 <th className="p-3 text-left">Customer</th>
//                 <th className="p-3 text-left">Items</th>
//                 <th className="p-3 text-left">Total</th>
//                 <th className="p-3 text-left">Currency</th>
//                 <th className="p-3 text-left">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {orders.map((order, idx) => (
//                 <tr
//                   key={order.id}
//                   className={
//                     idx % 2 === 0
//                       ? "bg-white hover:bg-gray-50"
//                       : "bg-gray-50 hover:bg-gray-100"
//                   }
//                 >
//                   <td className="p-3 font-medium text-gray-800">{order.id}</td>
//                   <td className="p-3">{order.customer}</td>
//                   <td className="p-3">{order.items}</td> {/* Now displays with quantity */}
//                   <td className="p-3 text-green-600 font-semibold">{order.total}</td>
//                   <td className="p-3">{order.currency}</td>
//                   <td className="p-3 text-gray-600">{order.date}</td>
//                 </tr>
//               ))}
//               {orders.length === 0 && (
//                 <tr>
//                   <td colSpan={6} className="p-3 text-center text-gray-500">
//                     No orders found for today.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { ShoppingCart, AlertCircle, Loader2 } from "lucide-react"

interface Order {
  id: number
  customer: string
  total: string
  currency: string
  status?: string
  items: string // Now includes "Product (Quantity)"
  date: string
}

interface RecentOrdersProps {
  isDarkTheme?: boolean
}

export default function RecentOrders({ isDarkTheme = false }: RecentOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  // Theme styles
  const styles = {
    card: isDarkTheme
      ? "bg-slate-800/80 text-white border border-slate-700"
      : "bg-white text-slate-800 border border-slate-200",
    heading: isDarkTheme ? "text-slate-300" : "text-slate-600",
    tableHeader: isDarkTheme ? "bg-slate-700 text-slate-200" : "bg-slate-100 text-slate-700",
    tableCell: isDarkTheme ? "border-slate-700" : "border-slate-200",
    tableRowEven: isDarkTheme ? "bg-slate-800/80 hover:bg-slate-700/70" : "bg-white hover:bg-slate-50",
    tableRowOdd: isDarkTheme ? "bg-slate-800/50 hover:bg-slate-700/70" : "bg-slate-50 hover:bg-slate-100",
    emptyText: isDarkTheme ? "text-slate-400" : "text-slate-500",
    errorText: isDarkTheme ? "text-red-300" : "text-red-500",
    shadow: isDarkTheme ? "shadow-lg shadow-slate-900/20" : "shadow-lg shadow-slate-200/50",
    icon: isDarkTheme ? "text-blue-400" : "text-blue-600",
    totalText: isDarkTheme ? "text-green-400 font-semibold" : "text-green-600 font-semibold",
    idText: isDarkTheme ? "font-medium text-slate-300" : "font-medium text-slate-800",
    dateText: isDarkTheme ? "text-slate-400" : "text-slate-600",
  }

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await axios.get("/api/recentOrders")
        setOrders(response.data)
      } catch (err) {
        console.error("Error fetching orders:", err)
        setError("Failed to load orders.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className={`p-6 rounded-lg ${styles.card} ${styles.shadow} mt-4`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-semibold ${styles.heading}`}>Recent Orders (Today)</h2>
        <ShoppingCart className={`w-5 h-5 ${styles.icon}`} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className={`w-8 h-8 ${styles.icon} animate-spin`} />
            <p className={styles.emptyText}>Loading orders...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-48">
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className={`w-8 h-8 ${styles.errorText}`} />
            <p className={styles.errorText}>{error}</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="overflow-scroll rounded-lg border">
            <table className="w-full border-collapse text-sm md:text-base">
              <thead>
                <tr className={styles.tableHeader}>
                  <th className="p-3 text-left font-medium">ID</th>
                  <th className="p-3 text-left font-medium">Customer</th>
                  <th className="p-3 text-left font-medium">Items</th>
                  <th className="p-3 text-left font-medium">Total</th>
                  <th className="p-3 text-left font-medium">Currency</th>
                  <th className="p-3 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr
                    key={order.id}
                    className={`transition-colors duration-150 ${
                      idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                    }`}
                  >
                    <td className={`p-3 ${styles.idText}`}>{order.id}</td>
                    <td className="p-3">{order.customer}</td>
                    <td className="p-3">{order.items}</td>
                    <td className={`p-3 ${styles.totalText}`}>{order.total}</td>
                    <td className="p-3">{order.currency}</td>
                    <td className={`p-3 ${styles.dateText}`}>{order.date}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className={`p-6 text-center ${styles.emptyText}`}>
                      No orders found for today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

