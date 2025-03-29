// import { useEffect, useState } from "react";

// interface ProductSale {
//   name: string;
//   quantity: number;
// }

// export default function ProductsSoldToday() {
//   const [sales, setSales] = useState<ProductSale[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchSales() {
//       try {
//         const response = await fetch("/api/products-sold");
//         const data = await response.json();
//         if (response.ok) {
//           setSales(data);
//         } else {
//           setError(data.error || "Failed to fetch data");
//         }
//       } catch (err) {
//         setError("Network error");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchSales();
//   }, []);

//   if (loading) return <p>Loading sales data...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="p-4 bg-white shadow-md rounded-lg">
//       <h2 className="text-xl font-semibold mb-4">Products Sold Today</h2>
//       <table className="w-full border-collapse border border-gray-300">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border p-2">Product Name</th>
//             <th className="border p-2">Quantity Sold</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sales.length > 0 ? (
//             sales.map((sale, index) => (
//               <tr key={index} className="text-center border-b">
//                 <td className="border p-2">{sale.name}</td>
//                 <td className="border p-2">{sale.quantity}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={2} className="border p-2 text-center">
//                 No sales today.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

"use client"

import { useEffect, useState } from "react"
import { Package2, AlertCircle, Loader2 } from "lucide-react"

interface ProductSale {
  name: string
  quantity: number
}

interface ProductsSoldTodayProps {
  isDarkTheme?: boolean
}

export default function ProductsSoldToday({ isDarkTheme = false }: ProductsSoldTodayProps) {
  const [sales, setSales] = useState<ProductSale[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Theme styles
  const styles = {
    card: isDarkTheme
      ? "bg-slate-800/80 text-white border border-slate-700"
      : "bg-white text-slate-800 border border-slate-200",
    heading: isDarkTheme ? "text-slate-300" : "text-slate-600",
    tableHeader: isDarkTheme ? "bg-slate-700/50" : "bg-slate-100",
    tableCell: isDarkTheme ? "border-slate-700" : "border-slate-200",
    tableRow: isDarkTheme ? "border-slate-700 hover:bg-slate-700/50" : "border-slate-200 hover:bg-slate-50",
    emptyText: isDarkTheme ? "text-slate-400" : "text-slate-500",
    errorText: isDarkTheme ? "text-red-300" : "text-red-500",
    shadow: isDarkTheme ? "shadow-lg shadow-slate-900/20" : "shadow-lg shadow-slate-200/50",
    icon: isDarkTheme ? "text-blue-400" : "text-blue-600",
  }

  useEffect(() => {
    async function fetchSales() {
      try {
        const response = await fetch("/api/products-sold")
        const data = await response.json()
        if (response.ok) {
          setSales(data)
        } else {
          setError(data.error || "Failed to fetch data")
        }
      } catch (err) {
        setError("Network error")
      } finally {
        setLoading(false)
      }
    }

    fetchSales()
  }, [])

  if (loading) {
    return (
      <div className={`p-6 rounded-lg ${styles.card} ${styles.shadow} flex items-center justify-center h-48`}>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className={`w-8 h-8 ${styles.icon} animate-spin`} />
          <p className={styles.emptyText}>Loading sales data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-6 rounded-lg ${styles.card} ${styles.shadow} flex items-center justify-center h-48`}>
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className={`w-8 h-8 ${styles.errorText}`} />
          <p className={styles.errorText}>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-6 rounded-lg ${styles.card} ${styles.shadow}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-semibold ${styles.heading}`}>Products Sold Today</h2>
        <Package2 className={`w-5 h-5 ${styles.icon}`} />
      </div>

      <div className="overflow-hidden rounded-lg border">
        <table className="w-full border-collapse">
          <thead>
            <tr className={styles.tableHeader}>
              <th className={`p-3 text-left font-medium ${styles.tableCell}`}>Product Name</th>
              <th className={`p-3 text-right font-medium ${styles.tableCell}`}>Quantity Sold</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((sale, index) => (
                <tr key={index} className={`${styles.tableRow} transition-colors duration-150`}>
                  <td className={`p-3 ${styles.tableCell}`}>{sale.name}</td>
                  <td className={`p-3 text-right ${styles.tableCell}`}>{sale.quantity}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className={`p-6 text-center ${styles.emptyText}`}>
                  No sales today.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

