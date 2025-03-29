import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// Update a category
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const updatedCategory = await prisma.expenseCategory.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("PUT Error:", error); // Log the error
    return NextResponse.json({ error: "Error updating category" }, { status: 500 });
  }
}

// Delete a category
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    await prisma.expenseCategory.delete({ where: { id } });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("DELETE Error:", error); // Log the error
    return NextResponse.json({ error: "Error deleting category" }, { status: 500 });
  }
}
