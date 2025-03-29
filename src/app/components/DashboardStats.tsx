// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { FaBoxOpen, FaClipboardList } from "react-icons/fa";

// const DashboardStats = () => {
//   const [totalProducts, setTotalProducts] = useState<number | null>(null);
//   const [outOfStockCount, setOutOfStockCount] = useState<number | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchCounts = async () => {
//       try {
//         const res = await fetch("/api/products");
//         if (!res.ok) throw new Error("Failed to fetch product data");

//         const data = await res.json();

//         setTotalProducts(data.length);

//         const outOfStock = data.filter((product: any) => product.stock_quantity === 0);
//         setOutOfStockCount(outOfStock.length);
//       } catch (err) {
//         setError((err as Error).message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCounts();
//   }, []);

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
//       {/* Total Products */}
//       <div
//         className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center transition duration-300 ease-in-out transform hover:scale-105"
//         onClick={() => router.push("/instock?filter=all")}
//       >
//         <FaClipboardList className="text-5xl mb-3" />
//         <h2 className="text-lg font-semibold">Total Products</h2>
//         {loading ? (
//           <p className="text-sm animate-pulse">Loading...</p>
//         ) : error ? (
//           <p className="text-sm text-gray-200">Error</p>
//         ) : (
//           <p className="text-3xl font-bold">{totalProducts}</p>
//         )}
//       </div>

//       {/* Out-of-Stock Products */}
//       <div
//         className="cursor-pointer bg-red-500 hover:bg-red-600 text-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center transition duration-300 ease-in-out transform hover:scale-105"
//         onClick={() => router.push("/instock?filter=outofstock")}
//       >
//         <FaBoxOpen className="text-5xl mb-3" />
//         <h2 className="text-lg font-semibold">Out-of-Stock</h2>
//         {loading ? (
//           <p className="text-sm animate-pulse">Loading...</p>
//         ) : error ? (
//           <p className="text-sm text-gray-200">Error</p>
//         ) : (
//           <p className="text-3xl font-bold">{outOfStockCount}</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DashboardStats;

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Package, PackageX, TrendingUp, ShoppingCart, DollarSign } from "lucide-react"

interface DashboardStatsProps {
  isDarkTheme?: boolean
}

const DashboardStats = ({ isDarkTheme = true }: DashboardStatsProps) => {
  const [totalProducts, setTotalProducts] = useState<number | null>(null)
  const [outOfStockCount, setOutOfStockCount] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Theme-dependent styles
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
    const fetchCounts = async () => {
      try {
        const res = await fetch("/api/products")
        if (!res.ok) throw new Error("Failed to fetch product data")

        const data = await res.json()

        setTotalProducts(data.length)

        const outOfStock = data.filter((product: any) => product.stock_quantity === 0)
        setOutOfStockCount(outOfStock.length)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchCounts()
  }, [])

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  // Placeholder data for additional stats
  const additionalStats = [
    {
      title: "Revenue",
      value: "$12,543",
      icon: DollarSign,
      color: isDarkTheme ? "text-emerald-400" : "text-emerald-600",
      bgGradient: isDarkTheme
        ? "from-emerald-600/20 to-teal-600/20 border-emerald-500/30"
        : "from-emerald-50 to-teal-50 border-emerald-200",
      path: "/revenue",
    },
    {
      title: "Orders",
      value: "156",
      icon: ShoppingCart,
      color: isDarkTheme ? "text-amber-400" : "text-amber-600",
      bgGradient: isDarkTheme
        ? "from-amber-600/20 to-yellow-600/20 border-amber-500/30"
        : "from-amber-50 to-yellow-50 border-amber-200",
      path: "/orders",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Total Products */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        onClick={() => router.push("/instock?filter=all")}
        className={`${styles.card} ${styles.shadow} cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ease-in-out hover:translate-y-[-4px]`}
      >
        <div className={`h-full bg-gradient-to-br ${styles.cardAccent1} p-5 md:p-6`}>
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-sm font-medium ${styles.heading} mb-1`}>Total Products</p>
              {loading ? (
                <div className="h-8 w-16 bg-slate-600/30 animate-pulse rounded"></div>
              ) : error ? (
                <p className="text-sm text-red-400">Error loading</p>
              ) : (
                <h3 className={`text-2xl md:text-3xl font-bold ${styles.value}`}>{totalProducts}</h3>
              )}
            </div>
            <div className={`p-2 rounded-lg bg-white/10 backdrop-blur-sm ${styles.icon1}`}>
              <Package className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-medium">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span className={isDarkTheme ? "text-blue-300" : "text-blue-700"}>View all products</span>
          </div>
        </div>
      </motion.div>

      {/* Out-of-Stock Products */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        onClick={() => router.push("/instock?filter=outofstock")}
        className={`${styles.card} ${styles.shadow} cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ease-in-out hover:translate-y-[-4px]`}
      >
        <div className={`h-full bg-gradient-to-br ${styles.cardAccent2} p-5 md:p-6`}>
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-sm font-medium ${styles.heading} mb-1`}>Out of Stock</p>
              {loading ? (
                <div className="h-8 w-16 bg-slate-600/30 animate-pulse rounded"></div>
              ) : error ? (
                <p className="text-sm text-red-400">Error loading</p>
              ) : (
                <h3 className={`text-2xl md:text-3xl font-bold ${styles.value}`}>{outOfStockCount}</h3>
              )}
            </div>
            <div className={`p-2 rounded-lg bg-white/10 backdrop-blur-sm ${styles.icon2}`}>
              <PackageX className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-medium">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span className={isDarkTheme ? "text-rose-300" : "text-rose-700"}>View out of stock</span>
          </div>
        </div>
      </motion.div>

      
    </div>
  )
}

export default DashboardStats

