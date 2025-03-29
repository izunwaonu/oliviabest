import { NextResponse } from "next/server";
import {prisma }from "@/lib/prisma";

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
    return NextResponse.json({ error: "Error creating category" }, { status: 500 });
  }
}
