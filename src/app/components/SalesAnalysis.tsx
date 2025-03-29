// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";

// interface SalesAnalysisProps {
//   filter: string; // Accept filter as a prop
// }

// export default function SalesAnalysis({ filter }: SalesAnalysisProps) {
//   const [salesData, setSalesData] = useState({
//     total_sales: 0,
//     net_sales: 0,
//     total_orders: 0,
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function fetchSalesData() {
//       setLoading(true);
//       setError("");

//       try {
       
//         const response = await axios.get(`/api/sales?period=${filter}`);

//         const salesInfo = response.data || {
//           total_sales: 0,
//           net_sales: 0,
//           total_orders: 0,
//         };

//         setSalesData({
//           total_sales: parseFloat(salesInfo.total_sales) || 0,
//           net_sales: parseFloat(salesInfo.net_sales) || 0,
//           total_orders: salesInfo.total_orders || 0,
//         });
//       } catch (err) {
//         console.error("❌ Error fetching sales data:", err);
//         setError("Failed to load sales data.");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchSalesData();
//   }, [filter]);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//       {[
//         { title: "Total Sales", value: salesData.total_sales, color: "bg-blue-500" },
//         { title: "Net Sales", value: salesData.net_sales, color: "bg-green-500" },
//         { title: "Total Orders", value: salesData.total_orders, color: "bg-yellow-500" },
//       ].map((card, index) => (
//         <div
//           key={index}
//           className={`${card.color} p-6 text-white rounded-lg shadow-md flex flex-col items-center`}
//         >
//           <h2 className="text-lg font-semibold">{card.title}</h2>
//           <p className="text-3xl font-bold">
//             {loading ? "Loading..." : card.value.toLocaleString()}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }

"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { DollarSign, TrendingUp, ShoppingBag } from "lucide-react"
import DashboardStats from "./DashboardStats"

interface SalesAnalysisProps {
  filter: string // Accept filter as a prop
  isDarkTheme?: boolean // Optional theme prop
}

export default function SalesAnalysis({ filter, isDarkTheme = false }: SalesAnalysisProps) {
  const [salesData, setSalesData] = useState({
    total_sales: 0,
    net_sales: 0,
    total_orders: 0,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Theme styles
  const styles = {
    card: isDarkTheme
      ? "bg-slate-800/80 hover:bg-slate-700/90 text-white border border-slate-700"
      : "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200",
    cardAccent1: isDarkTheme
      ? "from-blue-600/20 to-indigo-600/20 border-blue-500/30"
      : "from-blue-50 to-indigo-50 border-blue-200",
    cardAccent2: isDarkTheme
      ? "from-rose-600/20 to-orange-600/20 border-rose-500/30"
      : "from-rose-50 to-orange-50 border-rose-200",
    icon1: isDarkTheme ? "text-blue-400" : "text-blue-600",
    icon2: isDarkTheme ? "text-rose-400" : "text-rose-600",
    heading: isDarkTheme ? "text-slate-300" : "text-slate-600",
    value: isDarkTheme ? "text-white" : "text-slate-800",
    shadow: isDarkTheme ? "shadow-lg shadow-slate-900/20" : "shadow-lg shadow-slate-200/50",
  }

  useEffect(() => {
    async function fetchSalesData() {
      setLoading(true)
      setError("")

      try {
        const response = await axios.get(`/api/sales?period=${filter}`)

        const salesInfo = response.data || {
          total_sales: 0,
          net_sales: 0,
          total_orders: 0,
        }

        setSalesData({
          total_sales: Number.parseFloat(salesInfo.total_sales) || 0,
          net_sales: Number.parseFloat(salesInfo.net_sales) || 0,
          total_orders: salesInfo.total_orders || 0,
        })
      } catch (err) {
        console.error("❌ Error fetching sales data:", err)
        setError("Failed to load sales data.")
      } finally {
        setLoading(false)
      }
    }

    fetchSalesData()
  }, [filter])

  // Card configurations - keeping the same data structure but adding icons
  const cards = [
    {
      title: "Total Sales",
      value: salesData.total_sales,
      color: isDarkTheme ? "bg-blue-600/20" : "bg-blue-50",
      borderColor: isDarkTheme ? "border-blue-500/30" : "border-blue-200",
      textColor: isDarkTheme ? "text-white" : "text-blue-700",
      icon: <DollarSign className={isDarkTheme ? "text-blue-400" : "text-blue-600"} size={20} />,
    },
    {
      title: "Net Sales",
      value: salesData.net_sales,
      color: isDarkTheme ? "bg-green-600/20" : "bg-green-50",
      borderColor: isDarkTheme ? "border-green-500/30" : "border-green-200",
      textColor: isDarkTheme ? "text-white" : "text-green-700",
      icon: <TrendingUp className={isDarkTheme ? "text-green-400" : "text-green-600"} size={20} />,
    },
    {
      title: "Total Orders",
      value: salesData.total_orders,
      color: isDarkTheme ? "bg-yellow-600/20" : "bg-yellow-50",
      borderColor: isDarkTheme ? "border-yellow-500/30" : "border-yellow-200",
      textColor: isDarkTheme ? "text-white" : "text-yellow-700",
      icon: <ShoppingBag className={isDarkTheme ? "text-yellow-400" : "text-yellow-600"} size={20} />,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.color} p-6 rounded-lg shadow-md border ${card.borderColor} transition-all duration-200 hover:shadow-lg`}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className={`text-lg font-semibold ${card.textColor}`}>{card.title}</h2>
            <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">{card.icon}</div>
          </div>
          <p className={`text-3xl font-bold ${card.textColor}`}>
            {loading ? "Loading..." : card.value.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  )
}

