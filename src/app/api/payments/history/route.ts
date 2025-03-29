import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        debtor: true, // ✅ Get debtor details
        user: true, // ✅ Get user who recorded the payment
      },
      orderBy: { paidAt: "desc" },
    });

    return NextResponse.json(payments, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch payment history", error: (error as Error).message },
      { status: 500 }
    );
  }
}
