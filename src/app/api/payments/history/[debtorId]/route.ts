
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ debtorId: string }> } // ✅ Ensuring params is a Promise
) {
  try {
    const { debtorId } = await params; // ✅ Await params properly

    if (!debtorId) {
      return NextResponse.json(
        { message: "Debtor ID is required" },
        { status: 400 }
      );
    }

    // ✅ Fetch debtor from Prisma and include user inside payments
    const debtor = await prisma.debtor.findUnique({
      where: { id: debtorId },
      include: {
        payments: {
          include: {
            user: true, // ✅ This ensures user data is included
          },
        },
      },
    });

    if (!debtor) {
      return NextResponse.json(
        { message: "Debtor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(debtor, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { 
        message: "Internal Server Error", 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
