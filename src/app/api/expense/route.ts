// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { prisma } from "@/lib/prisma";
// import { authOptions } from "@/lib/auth";

// // Middleware to check authentication
// async function checkAuth(req: Request) {
//   try {
//     const session = await getServerSession(authOptions); // Ensure authOptions is passed
//     console.log("🔍 Session Data:", session); // Debugging

//     if (!session || !session.user || !session.user.id) {
//       console.error("❌ Unauthorized: No valid session found");
//       return null;
//     }

//     return session.user;
//   } catch (error) {
//     console.error("❌ Error checking session:", error);
//     return null;
//   }
// }

// // 🟢 GET: Fetch all expenses (for dashboard)
// export async function GET(req: Request) {
//   const user = await checkAuth(req);
//   if (!user) {
//     console.error("❌ GET /api/expense - Unauthorized request");
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const expenses = await prisma.expense.findMany({
//       include: { category: true, vendor: true, user: true }, // Fetch category, vendor, and user details
//       orderBy: { date: "desc" },
//     });

//     console.log("✅ GET /api/expense - Retrieved expenses successfully");
//     return NextResponse.json(expenses, { status: 200 });
//   } catch (error) {
//     console.error("❌ GET /api/expense - Failed to fetch expenses:", error);
//     return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
//   }
// }

// // 🟢 POST: Create a new expense
// export async function POST(req: Request) {
//   const user = await checkAuth(req);
//   console.log("👤 Authenticated User:", user); // Debugging

//   if (!user || !user.id) {
//     console.error("❌ POST /api/expense - Unauthorized request");
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const body = await req.json();
//     console.log("📩 Received Data:", body);

//     let { categoryId, vendorId, amount, paymentMethod, description } = body;

//     // ✅ Ensure `amount` is converted to a number
//     amount = parseFloat(amount);
//     if (isNaN(amount)) {
//       console.error("❌ POST /api/expense - Invalid amount format");
//       return NextResponse.json({ error: "Invalid amount format" }, { status: 400 });
//     }

//     // ✅ Ensure required fields are present
//     if (!categoryId || !amount || !paymentMethod) {
//       console.error("❌ POST /api/expense - Missing required fields");
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     const expense = await prisma.expense.create({
//       data: {
//         userId: user.id, // ✅ Ensured `user.id` exists
//         categoryId,
//         vendorId,
//         amount,
//         paymentMethod,
//         description: description || "", // ✅ Ensure description is not null
//       },
//     });

//     console.log("✅ POST /api/expense - Expense created:", expense);

//     // ✅ Check if `expense.id` exists before logging activity
//     if (!expense.id) {
//       console.error("❌ Activity Log Skipped: Expense ID is missing");
//     } else {
//       await prisma.activityLog.create({
//         data: {
//           userId: user.id,
//           expenseId: expense.id,
//           action: "Created",
//           details: `User ${user.name ?? "Unknown"} created an expense of $${amount.toFixed(2)}.`,
//         },
//       });
//     }

//     return NextResponse.json(expense, { status: 201 });
//   } catch (error) {
//     console.error("❌ POST /api/expense - Failed to create expense:", error);
//     return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// 🛡️ Middleware to check authentication
async function checkAuth() {
  try {
    const session = await getServerSession(authOptions);
    console.log("🔍 Session Data:", session); // Debugging

    if (!session?.user?.id) {
      console.error("❌ Unauthorized: No valid session found");
      return null;
    }

    return session.user;
  } catch (error) {
    console.error("❌ Error checking session:", error);
    return null;
  }
}

// 🟢 GET: Fetch all expenses (for dashboard)
export async function GET() {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const expenses = await prisma.expense.findMany({
      include: { category: true, vendor: true, user: true },
      orderBy: { date: "desc" },
    });

    console.log("✅ GET /api/expense - Retrieved expenses successfully");
    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error("❌ GET /api/expense - Failed to fetch expenses:", error);
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
  }
}

// 🟢 POST: Create a new expense
export async function POST(req: Request) {
  const user = await checkAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log("📩 Received Data:", body);

    const { categoryId, vendorId, amount, paymentMethod, description } = body;

    // ✅ Ensure `amount` is a valid number
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      console.error("❌ Invalid amount format:", amount);
      return NextResponse.json({ error: "Invalid amount format" }, { status: 400 });
    }

    // ✅ Ensure required fields are present
    if (!categoryId || !paymentMethod) {
      console.error("❌ Missing required fields:", { categoryId, paymentMethod });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const expense = await prisma.expense.create({
      data: {
        userId: user.id,
        categoryId,
        vendorId: vendorId || null, // Handle cases where vendorId is optional
        amount: parsedAmount,
        paymentMethod,
        description: description || "",
      },
    });

    console.log("✅ POST /api/expense - Expense created:", expense);

    // ✅ Log user activity
    if (expense.id) {
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          expenseId: expense.id,
          action: "Created",
          details: `User ${user.name ?? "Unknown"} created an expense of $${parsedAmount.toFixed(2)}.`,
        },
      });
    }

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("❌ POST /api/expense - Failed to create expense:", error);
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
  }
}
