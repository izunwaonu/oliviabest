
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import SalesAnalysis from "@/app/components/SalesAnalysis"
import RecentOrders from "@/app/components/RecentOrder"
import ProductsSoldToday from "@/app/components/ProductsSoldToday"
import SalesChart from "@/app/components/SalesChart"
import ReturnHomeButton from "../components/ReturnHome"
import DashboardStats from "@/app/components/DashboardStats"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Sun, Moon, BarChart3, Calendar, ChevronDown } from "lucide-react"

import  Dialog,{ DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Button from "@/components/ui/button"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filter, setFilter] = useState("month")
  const [salesData, setSalesData] = useState<{ orders: any[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isDarkTheme, setIsDarkTheme] = useState(true)

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
  }

  // Theme-dependent styles
  const styles = {
    background: isDarkTheme
      ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      : "bg-gradient-to-br from-slate-100 via-white to-slate-100",
    text: isDarkTheme ? "text-white" : "text-slate-800",
    subtext: isDarkTheme ? "text-slate-300" : "text-slate-600",
    card: isDarkTheme ? "bg-slate-800/50 border-slate-700" : "bg-white/80 border-slate-200",
    cardHover: isDarkTheme ? "hover:bg-slate-700/50" : "hover:bg-slate-50/80",
    heading: isDarkTheme ? "text-rose-400" : "text-rose-600",
    subheading: isDarkTheme ? "text-blue-400" : "text-blue-600",
    button: isDarkTheme
      ? "bg-slate-700 hover:bg-slate-600 text-white"
      : "bg-white hover:bg-slate-100 text-slate-800 border border-slate-200",
    buttonAccent: isDarkTheme
      ? "bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 text-white"
      : "bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 text-white",
    input: isDarkTheme ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-800",
    shadow: isDarkTheme ? "shadow-lg shadow-slate-900/30" : "shadow-lg shadow-slate-200/50",
  }

  // ✅ Redirect unauthorized users immediately
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      setIsModalOpen(true)
    }
  }, [status, session])

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true)
      setError("")
      try {
        const response = await fetch(`/api/sales?period=${filter}`)
        if (!response.ok) throw new Error(`Failed to fetch sales data.`)
        const data = await response.json()
        if (!Array.isArray(data.orders)) throw new Error("Invalid response format")
        setSalesData(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchSalesData()
  }, [filter])

  const chartData =
    salesData?.orders.map((order) => ({
      date: new Date(order.date_created).toLocaleDateString(),
      total: Number.parseFloat(order.total),
    })) || []

  return (
    <>
      {/* ✅ Access Denied Modal (User can't close it) */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(true)}>
          <DialogContent>
            <div
              className={`${isDarkTheme ? "bg-slate-800 text-white border-slate-700" : "bg-white text-slate-800 border-slate-200"} border p-4 rounded-lg`}
            >
              <DialogTitle>
                <div className="text-red-500 text-xl font-bold">Access Denied</div>
              </DialogTitle>
              <DialogDescription>
                <div className={isDarkTheme ? "text-slate-300" : "text-slate-600"}>
                  Dear {session?.user?.name}, your role is <strong>{session?.user?.role}</strong>. You are not allowed
                  to visit this page. Kindly contact the admin to request access.
                </div>
              </DialogDescription>
              <Button onClick={() => router.push("/")} className="bg-red-600 text-white hover:bg-red-700 w-full mt-4">
                Okay
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ✅ Completely hide the dashboard if the user is unauthorized */}
      {!isModalOpen && (
        <div className={`${styles.background} min-h-screen transition-colors duration-300`}>
          {/* Header with theme toggle */}
          <div
            className="sticky top-0 z-10 backdrop-blur-md bg-opacity-80 border-b border-opacity-20 transition-colors duration-300"
            style={{
              borderColor: "inherit",
              backgroundColor: isDarkTheme ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.8)",
            }}
          >
            <div className="container mx-auto max-w-7xl px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BarChart3 className={`h-6 w-6 ${styles.heading}`} />
                <h1 className={`text-xl font-bold ${styles.text} hidden sm:block`}>Admin Dashboard</h1>
              </div>
              <div className="flex items-center gap-3">
                <ReturnHomeButton isDarkTheme={isDarkTheme} />
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-full ${styles.button} transition-colors`}
                  aria-label={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="container mx-auto max-w-7xl px-4 py-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`text-3xl md:text-4xl font-bold ${styles.text} mb-2`}
              >
                Sales Dashboard
              </motion.h1>
              <p className={`${styles.subtext} text-sm md:text-base`}>
                Welcome back! Here's an overview of your sales performance.
              </p>
            </motion.div>

            {/* Filter dropdown */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-6">
              <div className={`inline-flex items-center gap-2 ${styles.card} p-2 rounded-lg border ${styles.shadow}`}>
                <Calendar className={`h-4 w-4 ${styles.subtext}`} />
                <select
                  className={`${styles.input} rounded-md py-1.5 pl-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 appearance-none`}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{ backgroundColor: "transparent" }}
                >
                  <option value="day" className={isDarkTheme ? "bg-slate-700" : "bg-white"}>
                    Daily
                  </option>
                  <option value="week" className={isDarkTheme ? "bg-slate-700" : "bg-white"}>
                    Weekly
                  </option>
                  <option value="month" className={isDarkTheme ? "bg-slate-700" : "bg-white"}>
                    Monthly
                  </option>
                  <option value="year" className={isDarkTheme ? "bg-slate-700" : "bg-white"}>
                    Yearly
                  </option>
                </select>
                <ChevronDown className={`h-4 w-4 ${styles.subtext} -ml-6 pointer-events-none`} />
              </div>
            </motion.div>
            {/* Sales Analysis */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <div className={`${styles.card} p-4 gap-10  sm:p-6 rounded-xl border ${styles.shadow}`}>
                <h2 className={`text-xl font-bold ${styles.text} mb-4`}>Sales Analysis</h2>
                <SalesAnalysis isDarkTheme={isDarkTheme} filter={filter} />
               <div className="flex pt-4">
               <DashboardStats isDarkTheme={isDarkTheme} />
               </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            {/* <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <div className={`${styles.card} p-4 sm:p-6 rounded-xl border ${styles.shadow}`}>
                
              </div>
            </motion.div> */}

            

            {/* Sales Chart */}
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <div className={`${styles.card} p-4 sm:p-6 rounded-xl border ${styles.shadow}`}>
                <h2 className={`text-xl font-bold ${styles.text} mb-4`}>Sales Trend</h2>
                <SalesChart isDarkTheme={isDarkTheme} data={chartData} loading={loading} error={error} />
              </div>
            </motion.div>

            {/* Two column layout for larger screens */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Recent Products */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                <div className={`${styles.card} p-4 sm:p-6 rounded-xl border ${styles.shadow} h-full`}>
                  <h2 className={`text-xl font-bold ${styles.text} mb-4`}>Recent Products Sold</h2>
                  <div className="overflow-x-auto">
                    <ProductsSoldToday isDarkTheme={isDarkTheme}/>
                  </div>
                </div>
              </motion.div>

              {/* Recent Orders */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
                <div className={`${styles.card} p-4 sm:p-6 rounded-xl border ${styles.shadow} h-full`}>
                  <h2 className={`text-xl font-bold ${styles.text} mb-4`}>Recent Orders</h2>
                  <div className="overflow-x-auto">
                    <RecentOrders isDarkTheme={isDarkTheme} />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


