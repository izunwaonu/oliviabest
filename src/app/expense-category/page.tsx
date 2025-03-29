"use client";

import { useEffect, useState } from "react";
import  Button  from "@/components/ui/button";
import  Input  from "@/components/ui/input";
import  {CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import  {Card } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Pencil, Trash2, Check, X } from "lucide-react";

type Category = {
  id: string;
  name: string;
};

export default function ExpenseCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/expense-category");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  }

  async function createCategory() {
    if (!newCategory.trim()) return toast.error("Category name is required");

    try {
      const res = await fetch("/api/expense-category", {
        method: "POST",
        body: JSON.stringify({ name: newCategory }),
      });
      if (res.ok) {
        toast.success("Category added successfully!");
        setNewCategory("");
        fetchCategories();
      } else {
        toast.error("Failed to add category");
      }
    } catch (error) {
      toast.error("Error adding category");
    }
  }

  async function updateCategory(id: string) {
    if (!editName.trim()) return toast.error("Category name is required");

    try {
      const res = await fetch(`/api/expense-category/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name: editName }),
      });
      if (res.ok) {
        toast.success("Category updated successfully!");
        setEditingId(null);
        fetchCategories();
      } else {
        toast.error("Failed to update category");
      }
    } catch (error) {
      toast.error("Error updating category");
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/expense-category/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Category deleted!");
        fetchCategories();
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      toast.error("Error deleting category");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Manage Expense Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
            />
            <Button onClick={createCategory}>Add</Button>
          </div>
        </CardContent>
      </Card>

      {/* Category List */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-gray-500">No categories found</p>
          ) : (
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
                  {editingId === cat.id ? (
                    <div className="flex w-full gap-2">
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                      <Button size="sm" onClick={() => updateCategory(cat.id)}><Check size={16} /></Button>
                      <Button size="sm" variant="destructive" onClick={() => setEditingId(null)}><X size={16} /></Button>
                    </div>
                  ) : (
                    <div className="flex justify-between w-full">
                      <span>{cat.name}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}>
                          <Pencil size={16} />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteCategory(cat.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
