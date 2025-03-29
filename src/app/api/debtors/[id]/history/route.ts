import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ✅ Ensure params is a Promise
) {
  try {
    const { id } = await params; // ✅ Await params properly

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch transactions related to this debtor
    const transactions = await prisma.transaction.findMany({
      where: { debtorId: id },
      include: {
        user: { select: { name: true } }, // Include user data
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return NextResponse.json(
      { message: "Error fetching transaction history" },
      { status: 500 }
    );
  }
}
