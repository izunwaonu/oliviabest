import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// Fetch all categories
export async function GET() {
  try {
    const categories = await prisma.expenseCategory.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET Error:", error); // Log the error
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// Create a new category
export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const newCategory = await prisma.expenseCategory.create({
      data: { name },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error); // Log the error
    return NextResponse.json({ error: "Error creating category" }, { status: 500 });
  }
}
