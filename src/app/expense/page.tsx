"use client"

import type React from "react"

import { useState, useEffect } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import {
  Sun,
  Moon,
  Plus,
  DollarSign,
  Calendar,
  CreditCard,
  FileText,
  Home,
  Tag,
  Building,
  ArrowUpDown,
  Search,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Define TypeScript types
interface Category {
  id: string
  name: string
}

interface Vendor {
  id: string
  name: string
}

interface Expense {
  id: string
  amount: number
  paymentMethod: string
  description?: string
  date: string
  category?: Category | null
  vendor?: Vendor | null
}

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [newExpense, setNewExpense] = useState({
    categoryId: "",
    vendorId: "",
    amount: "",
    paymentMethod: "Cash",
    description: "",
  })
  const [loading, setLoading] = useState(true)
  const [isDarkTheme, setIsDarkTheme] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Expense>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

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
    shadow: isDarkTheme ? "shadow-lg shadow-slate-900/30" : "shadow-lg shadow-slate-200/50",
    accent: isDarkTheme ? "text-rose-400" : "text-rose-600",
    secondary: isDarkTheme ? "text-blue-400" : "text-blue-600",
    tertiary: isDarkTheme ? "text-amber-400" : "text-amber-600",
    success: isDarkTheme ? "text-green-400" : "text-green-600",
  }

  // Fetch all expenses, categories, and vendors
  useEffect(() => {
    setLoading(true)
    console.log("🔄 Fetching expenses...")
    axios
      .get("/api/expense")
      .then((res) => {
        console.log("✅ Expenses fetched:", JSON.stringify(res.data, null, 2))
        setExpenses(res.data)
      })
      .catch((err) => console.error("❌ Error fetching expenses:", err))

    console.log("🔄 Fetching categories...")
    axios
      .get("/api/expense-category")
      .then((res) => {
        console.log("✅ Categories fetched:", res.data)
        setCategories(res.data)
      })
      .catch((err) => console.error("❌ Error fetching categories:", err))

    console.log("🔄 Fetching vendors...")
    axios
      .get("/api/vendor")
      .then((res) => {
        console.log("✅ Vendors fetched:", res.data)
        setVendors(res.data)
      })
      .catch((err) => console.error("❌ Error fetching vendors:", err))
      .finally(() => setLoading(false))
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log("📩 Submitting new expense:", newExpense)
      const res = await axios.post("/api/expense", newExpense)
      console.log("✅ Expense added successfully:", res.data)

      setExpenses([...expenses, res.data]) // Add new expense to list
      setNewExpense({ categoryId: "", vendorId: "", amount: "", paymentMethod: "Cash", description: "" })
    } catch (error) {
      console.error("❌ Failed to add expense:", error)
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

  // Handle sorting
  const handleSort = (field: keyof Expense) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filter and sort expenses
  const filteredAndSortedExpenses = expenses
    .filter((expense) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        (expense.category?.name || "").toLowerCase().includes(searchLower) ||
        (expense.vendor?.name || "").toLowerCase().includes(searchLower) ||
        (expense.description || "").toLowerCase().includes(searchLower) ||
        expense.paymentMethod.toLowerCase().includes(searchLower) ||
        expense.amount.toString().includes(searchLower)
      )
    })
    .sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      // Handle nested properties
      if (sortField === "category") {
        aValue = a.category?.name || ""
        bValue = b.category?.name || ""
      } else if (sortField === "vendor") {
        aValue = a.vendor?.name || ""
        bValue = b.vendor?.name || ""
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

  // Get payment method badge style
  const getPaymentMethodStyle = (method: string) => {
    switch (method.toLowerCase()) {
      case "cash":
        return isDarkTheme
          ? "bg-green-900/30 text-green-400 border-green-700"
          : "bg-green-100 text-green-800 border-green-200"
      case "bank transfer":
        return isDarkTheme
          ? "bg-blue-900/30 text-blue-400 border-blue-700"
          : "bg-blue-100 text-blue-800 border-blue-200"
      case "card":
        return isDarkTheme
          ? "bg-amber-900/30 text-amber-400 border-amber-700"
          : "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return isDarkTheme
          ? "bg-slate-800 text-slate-300 border-slate-700"
          : "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  return (
    <div className={`min-h-screen ${styles.background} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header with back button and theme toggle */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/expense-dashboard">
            <button className={`${styles.button} p-2 rounded-lg flex items-center gap-2 transition-colors`}>
              <Home size={18} />
              <span className="hidden sm:inline">Dashboard</span>
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
          className={`text-2xl sm:text-3xl font-bold ${styles.text} mb-6 flex items-center gap-2`}
        >
          <DollarSign className={styles.accent} />
          Expense Management
        </motion.h1>

        {/* Expense Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`mb-6 ${styles.card} border ${styles.shadow} rounded-lg overflow-hidden transition-colors duration-300`}
        >
          <Card>
            <div className="pb-2">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <Plus className={styles.accent} size={20} />
                    <span className={styles.text}>Add New Expense</span>
                  </div>
                </CardTitle>
              </CardHeader>
            </div>
            <CardContent>
              <div className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${styles.subtext}`}>Category*</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Tag className={styles.subtext} size={16} />
                        </div>
                        <select
                          value={newExpense.categoryId}
                          onChange={(e) => setNewExpense({ ...newExpense, categoryId: e.target.value })}
                          required
                          className={`${styles.input} pl-10 pr-4 py-2 rounded-lg w-full border focus:outline-none transition-colors`}
                        >
                          <option value="" className={isDarkTheme ? "bg-slate-700" : "bg-white"}>
                            Select Category
                          </option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id} className={isDarkTheme ? "bg-slate-700" : "bg-white"}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${styles.subtext}`}>Vendor (Optional)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building className={styles.subtext} size={16} />
                        </div>
                        <select
                          value={newExpense.vendorId}
                          onChange={(e) => setNewExpense({ ...newExpense, vendorId: e.target.value })}
                          className={`${styles.input} pl-10 pr-4 py-2 rounded-lg w-full border focus:outline-none transition-colors`}
                        >
                          <option value="" className={isDarkTheme ? "bg-slate-700" : "bg-white"}>
                            Select Vendor
                          </option>
                          {vendors.map((vendor) => (
                            <option
                              key={vendor.id}
                              value={vendor.id}
                              className={isDarkTheme ? "bg-slate-700" : "bg-white"}
                            >
                              {vendor.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${styles.subtext}`}>Amount*</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className={styles.subtext} size={16} />
                        </div>
                        <input
                          type="number"
                          value={newExpense.amount}
                          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                          required
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          className={`${styles.input} pl-10 pr-4 py-2 rounded-lg w-full border focus:outline-none transition-colors`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${styles.subtext}`}>Payment Method*</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CreditCard className={styles.subtext} size={16} />
                        </div>
                        <select
                          value={newExpense.paymentMethod}
                          onChange={(e) => setNewExpense({ ...newExpense, paymentMethod: e.target.value })}
                          required
                          className={`${styles.input} pl-10 pr-4 py-2 rounded-lg w-full border focus:outline-none transition-colors`}
                        >
                          <option value="Cash" className={isDarkTheme ? "bg-slate-700" : "bg-white"}>
                            Cash
                          </option>
                          <option value="Bank Transfer" className={isDarkTheme ? "bg-slate-700" : "bg-white"}>
                            Bank Transfer
                          </option>
                          <option value="Card" className={isDarkTheme ? "bg-slate-700" : "bg-white"}>
                            Card
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className={`block text-sm font-medium ${styles.subtext}`}>Description</label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <FileText className={styles.subtext} size={16} />
                        </div>
                        <textarea
                          value={newExpense.description}
                          onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                          placeholder="Enter expense details..."
                          rows={3}
                          className={`${styles.input} pl-10 pr-4 py-2 rounded-lg w-full border focus:outline-none transition-colors`}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className={`${styles.buttonAccent} px-4 py-2 rounded-lg flex items-center gap-2 transition-colors`}
                    >
                      <Plus size={16} />
                      Add Expense
                    </button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expense List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${styles.card} border ${styles.shadow} rounded-lg overflow-hidden transition-colors duration-300`}
        >
          <Card>
            <div className="pb-2">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className={styles.secondary} size={20} />
                      <span className={styles.text}>Expense List</span>
                    </div>
                    <span className={`text-sm font-normal ${styles.subtext}`}>
                      {filteredAndSortedExpenses.length}{" "}
                      {filteredAndSortedExpenses.length === 1 ? "expense" : "expenses"}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
            </div>
            <CardContent>
              <div className="p-4">
                {/* Search and Filter */}
                <div className="mb-4 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className={styles.subtext} />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search expenses..."
                    className={`${styles.input} pl-10 pr-4 py-2 rounded-lg w-full border focus:outline-none transition-colors`}
                  />
                </div>

                {/* Expense Table */}
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className={`flex justify-center py-8 ${styles.subtext}`}>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                    </div>
                  ) : filteredAndSortedExpenses.length === 0 ? (
                    <div
                      className={`text-center py-8 ${styles.subtext} border border-dashed rounded-lg ${
                        isDarkTheme ? "border-slate-700" : "border-slate-300"
                      }`}
                    >
                      {searchTerm ? (
                        <p>No expenses match your search criteria</p>
                      ) : (
                        <>
                          <p>No expenses found</p>
                          <p className="text-sm mt-1">Add your first expense using the form above</p>
                        </>
                      )}
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className={styles.tableHeader}>
                        <tr className="border-b">
                          <th
                            className={`py-3 px-4 text-left text-xs font-medium ${styles.subtext} uppercase tracking-wider cursor-pointer`}
                            onClick={() => handleSort("category" as keyof Expense)}
                          >
                            <div className="flex items-center gap-1">
                              Category
                              {sortField === "category" && (
                                <ArrowUpDown
                                  size={14}
                                  className={`transform ${sortDirection === "asc" ? "rotate-180" : ""}`}
                                />
                              )}
                            </div>
                          </th>
                          <th
                            className={`py-3 px-4 text-left text-xs font-medium ${styles.subtext} uppercase tracking-wider cursor-pointer`}
                            onClick={() => handleSort("vendor" as keyof Expense)}
                          >
                            <div className="flex items-center gap-1">
                              Vendor
                              {sortField === "vendor" && (
                                <ArrowUpDown
                                  size={14}
                                  className={`transform ${sortDirection === "asc" ? "rotate-180" : ""}`}
                                />
                              )}
                            </div>
                          </th>
                          <th
                            className={`py-3 px-4 text-left text-xs font-medium ${styles.subtext} uppercase tracking-wider cursor-pointer`}
                            onClick={() => handleSort("amount")}
                          >
                            <div className="flex items-center gap-1">
                              Amount
                              {sortField === "amount" && (
                                <ArrowUpDown
                                  size={14}
                                  className={`transform ${sortDirection === "asc" ? "rotate-180" : ""}`}
                                />
                              )}
                            </div>
                          </th>
                          <th
                            className={`py-3 px-4 text-left text-xs font-medium ${styles.subtext} uppercase tracking-wider cursor-pointer`}
                            onClick={() => handleSort("paymentMethod")}
                          >
                            <div className="flex items-center gap-1">
                              Payment Method
                              {sortField === "paymentMethod" && (
                                <ArrowUpDown
                                  size={14}
                                  className={`transform ${sortDirection === "asc" ? "rotate-180" : ""}`}
                                />
                              )}
                            </div>
                          </th>
                          <th
                            className={`py-3 px-4 text-left text-xs font-medium ${styles.subtext} uppercase tracking-wider cursor-pointer`}
                            onClick={() => handleSort("date")}
                          >
                            <div className="flex items-center gap-1">
                              Date
                              {sortField === "date" && (
                                <ArrowUpDown
                                  size={14}
                                  className={`transform ${sortDirection === "asc" ? "rotate-180" : ""}`}
                                />
                              )}
                            </div>
                          </th>
                          <th
                            className={`py-3 px-4 text-left text-xs font-medium ${styles.subtext} uppercase tracking-wider`}
                          >
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAndSortedExpenses.map((expense) => (
                          <tr key={expense.id} className={`border-b ${styles.tableRow} transition-colors duration-300`}>
                            <td className={`py-3 px-4 ${styles.text}`}>
                              {expense.category ? (
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    isDarkTheme ? "bg-slate-700" : "bg-slate-100"
                                  }`}
                                >
                                  {expense.category.name}
                                </span>
                              ) : (
                                <span className="text-xs italic opacity-50">N/A</span>
                              )}
                            </td>
                            <td className={`py-3 px-4 ${styles.subtext}`}>
                              {expense.vendor ? (
                                expense.vendor.name
                              ) : (
                                <span className="text-xs italic opacity-50">N/A</span>
                              )}
                            </td>
                            <td className={`py-3 px-4 font-medium ${styles.text}`}>{formatCurrency(expense.amount)}</td>
                            <td className={`py-3 px-4`}>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium border ${getPaymentMethodStyle(
                                  expense.paymentMethod,
                                )}`}
                              >
                                {expense.paymentMethod}
                              </span>
                            </td>
                            <td className={`py-3 px-4 ${styles.subtext}`}>
                              <div className="flex items-center gap-1">
                                <Calendar size={14} className={styles.subtext} />
                                {formatDate(expense.date)}
                              </div>
                            </td>
                            <td className={`py-3 px-4 ${styles.subtext}`}>
                              {expense.description || <span className="text-xs italic opacity-50">N/A</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

