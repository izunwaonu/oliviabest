import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { paidAt: "asc" },
    });

    // Explicitly typing acc as a dictionary with string keys and number values
    const groupedData = payments.reduce<Record<string, number>>((acc, payment) => {
      const date = new Date(payment.paidAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + payment.amount;
      return acc;
    }, {});

    return NextResponse.json({
      dates: Object.keys(groupedData),
      amounts: Object.values(groupedData),
    });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching chart data" }, { status: 500 });
  }
}
