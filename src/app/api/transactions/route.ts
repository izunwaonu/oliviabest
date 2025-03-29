import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust this import based on your Prisma setup

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const debtorId = searchParams.get("debtorId");

    if (!debtorId) {
      return NextResponse.json(
        { message: "Missing debtorId parameter" },
        { status: 400 }
      );
    }

    const transactions = await prisma.transaction.findMany({
      where: { debtorId },
      orderBy: { createdAt: "desc" },
    });

    if (!transactions || transactions.length === 0) {
      return NextResponse.json(
        { message: "No transactions found", transactions: [] },
        { status: 200 }
      );
    }

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch transactions",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
