// "use client";

// import { useEffect, useState } from "react";
// import Button from "@/components/ui/button";
// import Input from "@/components/ui/input";
// import { CardContent, CardHeader, CardTitle, Card } from "@/components/ui/card";
// import { toast } from "react-hot-toast";
// import { Pencil, Trash2, Check, X } from "lucide-react";

// type Category = {
//   id: string;
//   name: string;
// };

// export default function ExpenseCategoryPage() {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [newCategory, setNewCategory] = useState("");
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editName, setEditName] = useState("");

//   useEffect(() => {
//     console.log("Fetching categories...");
//     fetchCategories();
//   }, []);

//   async function fetchCategories() {
//     try {
//       console.log("Fetching categories from API...");
//       const res = await fetch("/api/expense-category");
//       if (!res.ok) throw new Error("Failed to fetch categories");
      
//       const data = await res.json();
//       console.log("Fetched categories:", data);
//       setCategories(data);
//     } catch (error) {
//       console.error("Fetch categories error:", error);
//       toast.error("Failed to fetch categories");
//     }
//   }

//   async function createCategory() {
//     console.log("Adding category:", newCategory);
//     if (!newCategory.trim()) {
//       toast.error("Category name is required");
//       return;
//     }

//     try {
//       const res = await fetch("/api/expense-category", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name: newCategory }),
//       });

//       const result = await res.json();
//       console.log("API response:", result);

//       if (res.ok) {
//         toast.success("Category added successfully!");
//         setNewCategory("");
//         fetchCategories();
//       } else {
//         toast.error(result.error || "Failed to add category");
//       }
//     } catch (error) {
//       console.error("Create category error:", error);
//       toast.error("Error adding category");
//     }
//   }

//   async function updateCategory(id: string) {
//     console.log("Updating category:", id, "New name:", editName);
//     if (!editName.trim()) {
//       toast.error("Category name is required");
//       return;
//     }

//     try {
//       const res = await fetch(`/api/expense-category/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name: editName }),
//       });

//       const result = await res.json();
//       console.log("Update response:", result);

//       if (res.ok) {
//         toast.success("Category updated successfully!");
//         setEditingId(null);
//         fetchCategories();
//       } else {
//         toast.error(result.error || "Failed to update category");
//       }
//     } catch (error) {
//       console.error("Update category error:", error);
//       toast.error("Error updating category");
//     }
//   }

//   async function deleteCategory(id: string) {
//     if (!confirm("Are you sure you want to delete this category?")) return;

//     console.log("Deleting category:", id);
//     try {
//       const res = await fetch(`/api/expense-category/${id}`, {
//         method: "DELETE",
//       });

//       const result = await res.json();
//       console.log("Delete response:", result);

//       if (res.ok) {
//         toast.success("Category deleted!");
//         fetchCategories();
//       } else {
//         toast.error(result.error || "Failed to delete category");
//       }
//     } catch (error) {
//       console.error("Delete category error:", error);
//       toast.error("Error deleting category");
//     }
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Manage Expense Categories</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex gap-2">
//             <Input
//               value={newCategory}
//               onChange={(e) => setNewCategory(e.target.value)}
//               placeholder="Enter category name"
//             />
//             <Button onClick={createCategory}>Add</Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Category List */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Categories</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {categories.length === 0 ? (
//             <p className="text-gray-500">No categories found</p>
//           ) : (
//             <ul className="space-y-2">
//               {categories.map((cat) => (
//                 <li key={cat.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
//                   {editingId === cat.id ? (
//                     <div className="flex w-full gap-2">
//                       <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
//                       <Button size="sm" onClick={() => updateCategory(cat.id)}>
//                         <Check size={16} />
//                       </Button>
//                       <Button size="sm" variant="destructive" onClick={() => setEditingId(null)}>
//                         <X size={16} />
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="flex justify-between w-full">
//                       <span>{cat.name}</span>
//                       <div className="flex gap-2">
//                         <Button size="sm" variant="outline" onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}>
//                           <Pencil size={16} />
//                         </Button>
//                         <Button size="sm" variant="destructive" onClick={() => deleteCategory(cat.id)}>
//                           <Trash2 size={16} />
//                         </Button>
//                       </div>
//                     </div>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Pencil, Trash2, Check, X, Plus, Sun, Moon, Tag, ArrowLeft } from "lucide-react"
import  Button  from "@/components/ui/button"
import  Input  from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

type Category = {
  id: string
  name: string
}

export default function ExpenseCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [loading, setLoading] = useState(true)
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
    listItem: isDarkTheme ? "bg-slate-700/50 border-slate-600" : "bg-slate-50 border-slate-200",
    iconButton: isDarkTheme ? "hover:bg-slate-700" : "hover:bg-slate-200",
    destructiveButton: isDarkTheme
      ? "bg-red-900/50 text-red-400 hover:bg-red-900/80"
      : "bg-red-50 text-red-600 hover:bg-red-100",
    shadow: isDarkTheme ? "shadow-lg shadow-slate-900/30" : "shadow-lg shadow-slate-200/50",
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    setLoading(true)
    try {
      const res = await fetch("/api/expense-category")
      if (!res.ok) throw new Error("Failed to fetch categories")

      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error("Fetch categories error:", error)
      toast.error("Failed to fetch categories")
    } finally {
      setLoading(false)
    }
  }

  async function createCategory() {
    if (!newCategory.trim()) {
      toast.error("Category name is required")
      return
    }

    try {
      const res = await fetch("/api/expense-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      })

      const result = await res.json()

      if (res.ok) {
        toast.success("Category added successfully!")
        setNewCategory("")
        fetchCategories()
      } else {
        toast.error(result.error || "Failed to add category")
      }
    } catch (error) {
      console.error("Create category error:", error)
      toast.error("Error adding category")
    }
  }

  async function updateCategory(id: string) {
    if (!editName.trim()) {
      toast.error("Category name is required")
      return
    }

    try {
      const res = await fetch(`/api/expense-category/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      })

      const result = await res.json()

      if (res.ok) {
        toast.success("Category updated successfully!")
        setEditingId(null)
        fetchCategories()
      } else {
        toast.error(result.error || "Failed to update category")
      }
    } catch (error) {
      console.error("Update category error:", error)
      toast.error("Error updating category")
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      const res = await fetch(`/api/expense-category/${id}`, {
        method: "DELETE",
      })

      const result = await res.json()

      if (res.ok) {
        toast.success("Category deleted!")
        fetchCategories()
      } else {
        toast.error(result.error || "Failed to delete category")
      }
    } catch (error) {
      console.error("Delete category error:", error)
      toast.error("Error deleting category")
    }
  }

  // Handle form submission with Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      createCategory()
    }
  }

  // Handle edit form submission with Enter key
  const handleEditKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      updateCategory(id)
    }
  }

  return (
    <div className={`min-h-screen ${styles.background} transition-colors duration-300`}>
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
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
          <Tag className={isDarkTheme ? "text-rose-400" : "text-rose-600"} />
          Expense Categories
        </motion.h1>

        {/* Add Category Card */}
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
                  <span className={styles.text}>Add New Category</span>
                </CardTitle>
              </CardHeader>
            </div>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e: { target: { value: React.SetStateAction<string> } }) => setNewCategory(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter category name"
                  className={styles.input}
                />
                <Button onClick={createCategory} className={styles.buttonAccent}>
                  <Plus size={16} className="mr-1" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category List */}
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
                    <span className={styles.text}>Categories</span>
                    <span className={`text-sm font-normal ${styles.subtext}`}>
                      {categories.length} {categories.length === 1 ? "category" : "categories"}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
            </div>
            <CardContent>
              {loading ? (
                <div className={`flex justify-center py-8 ${styles.subtext}`}>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                </div>
              ) : categories.length === 0 ? (
                <div
                  className={`text-center py-8 ${styles.subtext} border border-dashed rounded-lg ${
                    isDarkTheme ? "border-slate-700" : "border-slate-300"
                  }`}
                >
                  <p>No categories found</p>
                  <p className="text-sm mt-1">Add your first category above</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence>
                    {categories.map((cat) => (
                      <motion.li
                        key={cat.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex justify-between items-center ${styles.listItem} p-3 rounded-lg border transition-colors duration-300`}
                      >
                        {editingId === cat.id ? (
                          <div className="flex w-full gap-2">
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyDown={(e) => handleEditKeyDown(e, cat.id)}
                              className={styles.input}
                              autoFocus
                            />
                            <Button size="sm" onClick={() => updateCategory(cat.id)} className={styles.buttonAccent}>
                              <Check size={16} />
                            </Button>
                            <Button size="sm" onClick={() => setEditingId(null)} className={styles.button}>
                              <X size={16} />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-between w-full items-center">
                            <span className={`${styles.text} font-medium`}>{cat.name}</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingId(cat.id)
                                  setEditName(cat.name)
                                }}
                                className={`p-1.5 rounded-md ${styles.iconButton} transition-colors`}
                                aria-label="Edit category"
                              >
                                <Pencil size={16} className={styles.subtext} />
                              </button>
                              <button
                                onClick={() => deleteCategory(cat.id)}
                                className={`p-1.5 rounded-md ${styles.destructiveButton} transition-colors`}
                                aria-label="Delete category"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

