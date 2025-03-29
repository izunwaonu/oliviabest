import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ Ensure params is a Promise
) {
  try {
    const { id } = await params; // ✅ Await params properly

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { amount, note } = await req.json();

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ message: "Invalid payment amount" }, { status: 400 });
    }

    const debtor = await prisma.debtor.findUnique({ where: { id } });
    if (!debtor) {
      return NextResponse.json({ message: "Debtor not found" }, { status: 404 });
    }

    // ✅ Update balance and handle overpayments
    const newAmountOwed = debtor.amountOwed - amount;
    const newBalance = newAmountOwed < 0 ? Math.abs(newAmountOwed) : debtor.balance;

    await prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: { debtorId: id, userId: session.user.id, amount},
      });

      await tx.debtor.update({
        where: { id },
        data: {
          amountOwed: newAmountOwed > 0 ? newAmountOwed : 0,
          balance: newBalance,
        },
      });
    });

    return NextResponse.json({ message: "Payment recorded successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to process payment", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
