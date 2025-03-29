import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ✅ Fetch all debtors
export async function GET(req: Request) {
  try {
    const debtors = await prisma.debtor.findMany();
    
    if (!debtors) {
      return NextResponse.json({ message: "No debtors found" }, { status: 404 });
    }

    return NextResponse.json(debtors, { status: 200 });
  } catch (error) {
    console.error("GET /api/debtors error:", error);

    return NextResponse.json(
      { message: "Error fetching debtors", error: (error as Error).message || "Unknown error" },
      { status: 500 }
    );
  }
}


// ✅ Add a new debtor
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, invoiceNo, phoneNumber, amountOwed, dueDate } = await req.json();

    // ✅ Validate required fields
    if (!name || !invoiceNo || !phoneNumber || Number.isNaN(parseFloat(amountOwed)) || amountOwed <= 0 || !dueDate) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    // ✅ Check if an invoice number already exists
    const existingDebtor = await prisma.debtor.findFirst({ where: { invoiceNo } });
    
    if (existingDebtor) {
      if (existingDebtor.name !== name) {
        return NextResponse.json({ error: "This invoice already exists for another debtor." }, { status: 400 });
      }
      return NextResponse.json({
        error: "This invoice exists for the same debtor. Consider appending the new invoice number to the existing one."
      }, { status: 400 });
    }

    // ✅ Create new debtor
    const newDebtor = await prisma.debtor.create({
      data: {
        name,
        invoiceNo,
        phoneNumber,
        amountOwed: parseFloat(amountOwed), // Ensure it's a valid number
        dueDate: new Date(dueDate), // Convert to Date format
        balance: 0, // Default balance is 0
        userId: session.user.id, // Link debtor to the logged-in user
      },
    });

    return NextResponse.json(newDebtor, { status: 201 });
  } catch (error) {
    console.error("POST /api/debtors error:", error);
    return NextResponse.json({ message: "Error adding debtor", details: (error as Error).message }, { status: 500 });
  }
}
