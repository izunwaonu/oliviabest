"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Sun, Moon, DollarSign, Calendar, PieChartIcon, BarChart3, Clock, Plus, Tag, Building, Receipt, Wallet, TrendingUp, TrendingDown, FileText, Home, Users } from 'lucide-react'
import  Button  from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"

// Types
type User = {
  id: string
  name: string
  email: string
  image?: string
}

type ExpenseWithDetails = {
  id: string
  amount: number
  description: string
  date: string
  category: { id: string; name: string }
  vendor: { id: string; name: string } | null
  user: User
}

type CategoryExpense = {
  categoryId: string
  _sum: { amount: number }
}

type DashboardData = {
  dailyTotal: number
  weeklyTotal: number
  monthlyTotal: number
  yearlyTotal: number
  recentExpenses: ExpenseWithDetails[]
  categoryExpenses: CategoryExpense[]
}

export default function ExpenseDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
    input: isDarkTheme
      ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
      : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-400",
    button: isDarkTheme
      ? "bg-slate-700 hover:bg-slate-600 text-white"
      : "bg-white hover:bg-slate-100 text-slate-800 border border-slate-200",
    buttonAccent: isDarkTheme
      ? "bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 text-white"
      : "bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 text-white",
    tableHeader: isDarkTheme ? "bg-slate-700/50 border-slate-600" : "bg-slate-50 border-slate-200",
    tableRow: isDarkTheme ? "border-slate-700 hover:bg-slate-700/50" : "border-slate-200 hover:bg-slate-50",
    iconButton: isDarkTheme ? "hover:bg-slate-700" : "hover:bg-slate-200",
    shadow: isDarkTheme ? "shadow-lg shadow-slate-900/30" : "shadow-lg shadow-slate-200/50",
    positive: isDarkTheme ? "text-green-400" : "text-green-600",
    negative: isDarkTheme ? "text-red-400" : "text-red-600",
    accent: isDarkTheme ? "text-rose-400" : "text-rose-600",
    secondary: isDarkTheme ? "text-blue-400" : "text-blue-600",
    tertiary: isDarkTheme ? "text-amber-400" : "text-amber-600",
    purple: isDarkTheme ? "text-purple-400" : "text-purple-600",
  }

  // Chart colors
  const CHART_COLORS = [
    isDarkTheme ? "#F43F5E" : "#E11D48", // Rose
    isDarkTheme ? "#38BDF8" : "#0EA5E9", // Sky
    isDarkTheme ? "#34D399" : "#10B981", // Emerald
    isDarkTheme ? "#FBBF24" : "#F59E0B", // Amber
    isDarkTheme ? "#A78BFA" : "#8B5CF6", // Violet
    isDarkTheme ? "#FB7185" : "#F43F5E", // Rose (lighter)
    isDarkTheme ? "#60A5FA" : "#3B82F6", // Blue
    isDarkTheme ? "#4ADE80" : "#22C55E", // Green
  ]

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    setLoading(true)
    try {
      const res = await fetch("/api/expense/dashboard")
      if (!res.ok) {
        throw new Error("Failed to fetch dashboard data")
      }
      const data = await res.json()
      setDashboardData(data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setError("Failed to load dashboard data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Prepare chart data
  const prepareCategoryChartData = () => {
    if (!dashboardData?.categoryExpenses || !dashboardData.categoryExpenses.length) {
      return []
    }

    // Find category names by ID
    return dashboardData.categoryExpenses.map((item) => {
      // Find the category name from recent expenses
      const categoryName =
        dashboardData.recentExpenses.find((expense) => expense.category.id === item.categoryId)?.category.name ||
        "Unknown"

      return {
        name: categoryName,
        value: item._sum.amount,
      }
    })
  }

  // Prepare monthly data (mock data since we don't have monthly breakdown in the API)
  const prepareMonthlyData = () => {
    // This is mock data - in a real app, you'd get this from the API
    return [
      { name: "Jan", amount: 1200 },
      { name: "Feb", amount: 1900 },
      { name: "Mar", amount: 1500 },
      { name: "Apr", amount: 1800 },
      { name: "May", amount: 1200 },
      { name: "Jun", amount: 2100 },
      { name: "Jul", amount: 1700 },
      { name: "Aug", amount: 1400 },
      { name: "Sep", amount: 1600 },
      { name: "Oct", amount: 1800 },
      { name: "Nov", amount: 2200 },
      { name: "Dec", amount: 2500 },
    ]
  }

  // Loading state
  if (loading) {
    return (
      <div
        className={`min-h-screen ${styles.background} transition-colors duration-300 flex items-center justify-center`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
          <p className={`${styles.text} text-lg`}>Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div
        className={`min-h-screen ${styles.background} transition-colors duration-300 flex items-center justify-center p-4`}
      >
        <div className={`${styles.card} p-6 rounded-lg border ${styles.shadow} max-w-md text-center`}>
          <div className={styles.negative}>
            <FileText size={48} className="mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
          </div>
          <p className={`${styles.subtext} mb-4`}>{error}</p>
          <Button onClick={fetchDashboardData} className={styles.buttonAccent}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const categoryChartData = prepareCategoryChartData()
  const monthlyData = prepareMonthlyData()

  return (
    <div className={`min-h-screen ${styles.background} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header with back button and theme toggle */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <button className={`${styles.button} p-2 rounded-lg flex items-center gap-2 transition-colors`}>
              <Home size={18} />
              <span className="hidden sm:inline">Home</span>
            </button>
          </Link>

          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-full ${styles.button} transition-colors`}
            aria-label={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-2xl sm:text-3xl font-bold ${styles.text} mb-2 flex items-center gap-2`}
        >
          <Wallet className={styles.accent} />
          Admin Expense Dashboard
        </motion.h1>
        <p className={`${styles.subtext} mb-6 flex items-center gap-2`}>
          <Users size={16} className={styles.purple} />
          <span>Showing expenses from all users</span>
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Daily Total */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${styles.card} border ${styles.shadow} rounded-lg overflow-hidden transition-colors duration-300`}
          >
            <Card>
              <CardContent>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-sm font-medium ${styles.subtext}`}>Today's Expenses</p>
                      <h3 className={`text-2xl font-bold mt-1 ${styles.text}`}>
                        {formatCurrency(dashboardData?.dailyTotal || 0)}
                      </h3>
                      <div className={`flex items-center text-xs mt-2 ${styles.positive}`}>
                        <Calendar size={14} className="mr-1" />
                        <span>Daily</span>
                      </div>
                    </div>
                    <div className={`p-2 rounded-full ${isDarkTheme ? "bg-rose-500/20" : "bg-rose-100"}`}>
                      <DollarSign className={styles.accent} size={20} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Weekly Total */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${styles.card} border ${styles.shadow} rounded-lg overflow-hidden transition-colors duration-300`}
          >
            <Card>
              <CardContent>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-sm font-medium ${styles.subtext}`}>This Week</p>
                      <h3 className={`text-2xl font-bold mt-1 ${styles.text}`}>
                        {formatCurrency(dashboardData?.weeklyTotal || 0)}
                      </h3>
                      <div className={`flex items-center text-xs mt-2 ${styles.secondary}`}>
                        <Calendar size={14} className="mr-1" />
                        <span>Weekly</span>
                      </div>
                    </div>
                    <div className={`p-2 rounded-full ${isDarkTheme ? "bg-blue-500/20" : "bg-blue-100"}`}>
                      <BarChart3 className={styles.secondary} size={20} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Monthly Total */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${styles.card} border ${styles.shadow} rounded-lg overflow-hidden transition-colors duration-300`}
          >
            <Card>
              <CardContent>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-sm font-medium ${styles.subtext}`}>This Month</p>
                      <h3 className={`text-2xl font-bold mt-1 ${styles.text}`}>
                        {formatCurrency(dashboardData?.monthlyTotal || 0)}
                      </h3>
                      <div className={`flex items-center text-xs mt-2 ${styles.tertiary}`}>
                        <Calendar size={14} className="mr-1" />
                        <span>Monthly</span>
                      </div>
                    </div>
                    <div className={`p-2 rounded-full ${isDarkTheme ? "bg-amber-500/20" : "bg-amber-100"}`}>
                      <PieChartIcon className={styles.tertiary} size={20} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Yearly Total */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`${styles.card} border ${styles.shadow} rounded-lg overflow-hidden transition-colors duration-300`}
          >
            <Card>
              <CardContent>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-sm font-medium ${styles.subtext}`}>This Year</p>
                      <h3 className={`text-2xl font-bold mt-1 ${styles.text}`}>
                        {formatCurrency(dashboardData?.yearlyTotal || 0)}
                      </h3>
                      <div
                        className={`flex items-center text-xs mt-2 ${
                          dashboardData?.yearlyTotal && dashboardData.yearlyTotal > 10000
                            ? styles.negative
                            : styles.positive
                        }`}
                      >
                        {dashboardData?.yearlyTotal && dashboardData.yearlyTotal > 10000 ? (
                          <TrendingUp size={14} className="mr-1" />
                        ) : (
                          <TrendingDown size={14} className="mr-1" />
                        )}
                        <span>Yearly</span>
                      </div>
                    </div>
                    <div
                      className={`p-2 rounded-full ${
                        dashboardData?.yearlyTotal && dashboardData.yearlyTotal > 10000
                          ? isDarkTheme
                            ? "bg-red-500/20"
                            : "bg-red-100"
                          : isDarkTheme
                            ? "bg-green-500/20"
                            : "bg-green-100"
                      }`}
                    >
                      <DollarSign
                        className={
                          dashboardData?.yearlyTotal && dashboardData.yearlyTotal > 10000
                            ? styles.negative
                            : styles.positive
                        }
                        size={20}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-2">
            <Link href="/expense">
              <Button className={`${styles.buttonAccent} transition-colors duration-300`}>
                <Plus size={16} className="mr-1" /> New Expense
              </Button>
            </Link>
            <Link href="/expense-category">
              <Button className={`${styles.button} transition-colors duration-300`}>
                <Tag size={16} className="mr-1" /> Manage Categories
              </Button>
            </Link>
            <Link href="/vendor">
              <Button className={`${styles.button} transition-colors duration-300`}>
                <Building size={16} className="mr-1" /> Manage Vendors
              </Button>
            </Link>
            <Link href="/expense">
              <Button className={`${styles.button} transition-colors duration-300`}>
                <Receipt size={16} className="mr-1" /> View All Expenses
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`${styles.card} border ${styles.shadow} rounded-lg overflow-hidden transition-colors duration-300`}
          >
            <Card>
              <div className="pb-2">
                <CardHeader>
                  <CardTitle>
                    <span className={styles.text}>Expense by Category</span>
                  </CardTitle>
                </CardHeader>
              </div>
              <CardContent>
                <div className="p-6">
                  <div className="h-64">
                    {categoryChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => formatCurrency(Number(value))}
                            contentStyle={{
                              backgroundColor: isDarkTheme ? "#1E293B" : "#FFFFFF",
                              borderColor: isDarkTheme ? "#334155" : "#E2E8F0",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className={`flex items-center justify-center h-full ${styles.subtext}`}>
                        <p>No category data available</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Monthly Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`${styles.card} border ${styles.shadow} rounded-lg overflow-hidden transition-colors duration-300`}
          >
            <Card>
              <div className="pb-2">
                <CardHeader>
                  <CardTitle>
                    <span className={styles.text}>Monthly Expense Trend</span>
                  </CardTitle>
                </CardHeader>
              </div>
              <CardContent>
                <div className="p-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <XAxis dataKey="name" tick={{ fill: isDarkTheme ? "#CBD5E1" : "#475569" }} />
                        <YAxis dataKey="amount" tick={{ fill: isDarkTheme ? "#CBD5E1" : "#475569" }} />
                        <Tooltip
                          formatter={(value) => formatCurrency(Number(value))}
                          contentStyle={{
                            backgroundColor: isDarkTheme ? "#1E293B" : "#FFFFFF",
                            borderColor: isDarkTheme ? "#334155" : "#E2E8F0",
                          }}
                        />
                        <Bar dataKey="amount" fill={isDarkTheme ? "#38BDF8" : "#0EA5E9"} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`${styles.card} border ${styles.shadow} rounded-lg overflow-hidden transition-colors duration-300`}
        >
          <Card>
            <div className="pb-2">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-between">
                    <span className={styles.text}>Recent Expenses (All Users)</span>
                    <Link href="/expenses">
                      <span className={`text-sm font-normal ${styles.accent} hover:underline`}>View All</span>
                    </Link>
                  </div>
                </CardTitle>
              </CardHeader>
            </div>
            <CardContent>
              <div className="p-6">
                {dashboardData?.recentExpenses && dashboardData.recentExpenses.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={styles.tableHeader}>
                        <tr className="border-b">
                          <th
                            className={`py-3 px-4 text-left text-xs font-medium ${styles.subtext} uppercase tracking-wider`}
                          >
                            Date
                          </th>
                          <th
                            className={`py-3 px-4 text-left text-xs font-medium ${styles.subtext} uppercase tracking-wider`}
                          >
                            User
                          </th>
                          <th
                            className={`py-3 px-4 text-left text-xs font-medium ${styles.subtext} uppercase tracking-wider`}
                          >
                            Description
                          </th>
                          <th
                            className={`py-3 px-4 text-left text-xs font-medium ${styles.subtext} uppercase tracking-wider`}
                          >
                            Category
                          </th>
                          <th
                            className={`py-3 px-4 text-left text-xs font-medium ${styles.subtext} uppercase tracking-wider`}
                          >
                            Vendor
                          </th>
                          <th
                            className={`py-3 px-4 text-right text-xs font-medium ${styles.subtext} uppercase tracking-wider`}
                          >
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.recentExpenses.map((expense) => (
                          <tr key={expense.id} className={`border-b ${styles.tableRow} transition-colors duration-300`}>
                            <td className={`py-3 px-4 ${styles.subtext}`}>
                              <div className="flex items-center gap-1">
                                <Clock size={14} className={styles.subtext} />
                                {formatDate(expense.date)}
                              </div>
                            </td>
                            <td className={`py-3 px-4 ${styles.purple}`}>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{expense.user.name}</span>
                              </div>
                            </td>
                            <td className={`py-3 px-4 ${styles.text} font-medium`}>{expense.description}</td>
                            <td className={`py-3 px-4 ${styles.subtext}`}>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${isDarkTheme ? "bg-slate-700" : "bg-slate-100"}`}
                              >
                                {expense.category.name}
                              </span>
                            </td>
                            <td className={`py-3 px-4 ${styles.subtext}`}>
                              {expense.vendor ? expense.vendor.name : "N/A"}
                            </td>
                            <td className={`py-3 px-4 text-right font-medium ${styles.text}`}>
                              {formatCurrency(expense.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div
                    className={`text-center py-8 ${styles.subtext} border border-dashed rounded-lg ${
                      isDarkTheme ? "border-slate-700" : "border-slate-300"
                    }`}
                  >
                    <p>No recent expenses found</p>
                    <p className="text-sm mt-1">Start tracking your expenses today</p>
                    <Link href="/expenses/new">
                      <Button className={`${styles.buttonAccent} mt-4`}>
                        <Plus size={16} className="mr-1" /> Add Your First Expense
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}