"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Pencil, Trash2, Check, X, Plus, Sun, Moon, Building, ArrowLeft, Phone, MapPin, Search } from "lucide-react"
import  Button  from "@/components/ui/button"
import  Input  from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

type Vendor = {
  id: string
  name: string
  contact?: string
  address?: string
}

export default function VendorPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [newVendor, setNewVendor] = useState({ name: "", contact: "", address: "" })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState({ name: "", contact: "", address: "" })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
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
    destructiveButton: isDarkTheme
      ? "bg-red-900/50 text-red-400 hover:bg-red-900/80"
      : "bg-red-50 text-red-600 hover:bg-red-100",
    shadow: isDarkTheme ? "shadow-lg shadow-slate-900/30" : "shadow-lg shadow-slate-200/50",
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  async function fetchVendors() {
    setLoading(true)
    try {
      const res = await fetch("/api/vendor")
      if (!res.ok) throw new Error("Failed to fetch vendors")
      const data = await res.json()
      setVendors(data)
    } catch (error) {
      toast.error("Error fetching vendors")
    } finally {
      setLoading(false)
    }
  }

  async function createVendor() {
    if (!newVendor.name.trim()) return toast.error("Vendor name is required")

    try {
      const res = await fetch("/api/vendor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVendor),
      })

      if (res.ok) {
        toast.success("Vendor added successfully!")
        setNewVendor({ name: "", contact: "", address: "" })
        fetchVendors()
      } else {
        toast.error("Failed to add vendor")
      }
    } catch (error) {
      toast.error("Error adding vendor")
    }
  }

  async function updateVendor(id: string) {
    if (!editData.name.trim()) return toast.error("Vendor name is required")

    try {
      const res = await fetch(`/api/vendor/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      })

      if (res.ok) {
        toast.success("Vendor updated successfully!")
        setEditingId(null)
        fetchVendors()
      } else {
        toast.error("Failed to update vendor")
      }
    } catch (error) {
      toast.error("Error updating vendor")
    }
  }

  async function deleteVendor(id: string) {
    if (!confirm("Are you sure you want to delete this vendor?")) return

    try {
      const res = await fetch(`/api/vendor/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Vendor deleted!")
        fetchVendors()
      } else {
        toast.error("Failed to delete vendor")
      }
    } catch (error) {
      toast.error("Error deleting vendor")
    }
  }

  // Handle form submission with Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      createVendor()
    }
  }

  // Filter vendors based on search term
  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vendor.contact && vendor.contact.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vendor.address && vendor.address.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className={`min-h-screen ${styles.background} transition-colors duration-300`}>
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        {/* Header with back button and theme toggle */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/expense-dashboard">
            <button className={`${styles.button} p-2 rounded-lg flex items-center gap-2 transition-colors`}>
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Back to Dashboard</span>
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
          <Building className={isDarkTheme ? "text-rose-400" : "text-rose-600"} />
          Vendor Management
        </motion.h1>

        {/* Add Vendor Card */}
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
                  <span className={styles.text}>Add New Vendor</span>
                </CardTitle>
              </CardHeader>
            </div>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className={`text-sm font-medium ${styles.subtext}`}>Vendor Name*</label>
                  <Input
                    value={newVendor.name}
                    onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                    placeholder="Enter vendor name"
                    className={styles.input}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-sm font-medium ${styles.subtext}`}>Contact Number</label>
                  <Input
                    value={newVendor.contact}
                    onChange={(e) => setNewVendor({ ...newVendor, contact: e.target.value })}
                    placeholder="Phone number"
                    className={styles.input}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-sm font-medium ${styles.subtext}`}>Address</label>
                  <Input
                    value={newVendor.address}
                    onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                    placeholder="Physical address"
                    className={styles.input}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
              <Button
                onClick={createVendor}
                className={`${styles.buttonAccent} mt-4 transition-colors duration-300 flex items-center gap-1`}
              >
                <Plus size={16} className="mr-1" />
                Add Vendor
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Vendor List */}
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
                    <span className={styles.text}>Vendors</span>
                    <span className={`text-sm font-normal ${styles.subtext}`}>
                      {vendors.length} {vendors.length === 1 ? "vendor" : "vendors"}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
            </div>
            <CardContent>
              {/* Search Bar */}
              <div className="mb-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className={styles.subtext} />
                </div>
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search vendors..."
                  className={`${styles.input} pl-10`}
                />
              </div>

              {loading ? (
                <div className={`flex justify-center py-8 ${styles.subtext}`}>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                </div>
              ) : vendors.length === 0 ? (
                <div
                  className={`text-center py-8 ${styles.subtext} border border-dashed rounded-lg ${
                    isDarkTheme ? "border-slate-700" : "border-slate-300"
                  }`}
                >
                  <p>No vendors found</p>
                  <p className="text-sm mt-1">Add your first vendor above</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={styles.tableHeader}>
                      <tr className="border-b">
                        <th
                          className={`py-3 px-4 text-left text-xs font-medium ${styles.subtext} uppercase tracking-wider`}
                        >
                          Name
                        </th>
                        <th
                          className={`py-3 px-4 text-left text-xs font-medium ${styles.subtext} uppercase tracking-wider`}
                        >
                          Contact
                        </th>
                        <th
                          className={`py-3 px-4 text-left text-xs font-medium ${styles.subtext} uppercase tracking-wider`}
                        >
                          Address
                        </th>
                        <th
                          className={`py-3 px-4 text-right text-xs font-medium ${styles.subtext} uppercase tracking-wider`}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {filteredVendors.map((vendor) => (
                          <motion.tr
                            key={vendor.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`border-b ${styles.tableRow} transition-colors duration-300`}
                          >
                            {editingId === vendor.id ? (
                              <td colSpan={4} className="py-3 px-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                  <Input
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    placeholder="Vendor name"
                                    className={styles.input}
                                    autoFocus
                                  />
                                  <Input
                                    value={editData.contact}
                                    onChange={(e) => setEditData({ ...editData, contact: e.target.value })}
                                    placeholder="Contact number"
                                    className={styles.input}
                                  />
                                  <Input
                                    value={editData.address}
                                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                                    placeholder="Address"
                                    className={styles.input}
                                  />
                                  <div className="flex gap-2 md:col-span-3 mt-2">
                                    <Button
                                      size="sm"
                                      onClick={() => updateVendor(vendor.id)}
                                      className={styles.buttonAccent}
                                    >
                                      <Check size={16} className="mr-1" /> Save
                                    </Button>
                                    <Button size="sm" onClick={() => setEditingId(null)} className={styles.button}>
                                      <X size={16} className="mr-1" /> Cancel
                                    </Button>
                                  </div>
                                </div>
                              </td>
                            ) : (
                              <>
                                <td className={`py-3 px-4 ${styles.text} font-medium`}>{vendor.name}</td>
                                <td className={`py-3 px-4 ${styles.subtext}`}>
                                  {vendor.contact ? (
                                    <div className="flex items-center gap-1">
                                      <Phone size={14} className={isDarkTheme ? "text-blue-400" : "text-blue-600"} />
                                      {vendor.contact}
                                    </div>
                                  ) : (
                                    <span className="text-xs italic opacity-50">Not provided</span>
                                  )}
                                </td>
                                <td className={`py-3 px-4 ${styles.subtext}`}>
                                  {vendor.address ? (
                                    <div className="flex items-center gap-1">
                                      <MapPin size={14} className={isDarkTheme ? "text-green-400" : "text-green-600"} />
                                      {vendor.address}
                                    </div>
                                  ) : (
                                    <span className="text-xs italic opacity-50">Not provided</span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setEditingId(vendor.id)
                                        setEditData({
                                          name: vendor.name,
                                          contact: vendor.contact ?? "",
                                          address: vendor.address ?? "",
                                        })
                                      }}
                                      className={`p-1.5 rounded-md ${styles.iconButton} transition-colors`}
                                      aria-label="Edit vendor"
                                    >
                                      <Pencil size={16} className={styles.subtext} />
                                    </button>
                                    <button
                                      onClick={() => deleteVendor(vendor.id)}
                                      className={`p-1.5 rounded-md ${styles.destructiveButton} transition-colors`}
                                      aria-label="Delete vendor"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                      {filteredVendors.length === 0 && searchTerm && (
                        <tr>
                          <td colSpan={4} className={`py-8 text-center ${styles.subtext}`}>
                            No vendors match your search criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

