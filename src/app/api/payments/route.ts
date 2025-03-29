
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const { debtorId, amount } = await req.json();

//     if (!debtorId || isNaN(amount) || amount <= 0) {
//       return NextResponse.json({ message: "Invalid payment amount" }, { status: 400 });
//     }

//     await prisma.$transaction(async (tx) => {
//       const debtor = await tx.debtor.findUnique({ where: { id: debtorId } });
//       if (!debtor) throw new Error("Debtor not found");

//       // ✅ Record the payment in the Payment table
//       await tx.payment.create({
//         data: {
//           debtorId,
//           userId: session.user.id,
//           amount,
//         },
//       });

//       const newAmountOwed = debtor.amountOwed - amount;

//       // ✅ Update debtor balance
//       await tx.debtor.update({
//         where: { id: debtorId },
//         data: { amountOwed: newAmountOwed < 0 ? 0 : newAmountOwed },
//       });

//       // ✅ Record this transaction in the Transaction table
//       await tx.transaction.create({
//         data: {
//           debtorId,
//           userId: session.user.id,
//           type: "PAYMENT",  // ✅ Marks this as a payment transaction
//           amount,
//           balanceAfter: newAmountOwed < 0 ? 0 : newAmountOwed, // ✅ Ensures no negative balances
//           note: "Payment recorded",  // ✅ Additional note for reference
//         },
//       });
//     });

//     return NextResponse.json({ message: "Payment recorded successfully" }, { status: 200 });
//   } catch (error) {
//     console.error("Payment Processing Error:", error);
//     return NextResponse.json(
//       { message: "Failed to process payment", error: (error as Error).message },
//       { status: 500 }
//     );
//   }
// }

//D


// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";  // ✅ Import session handler
// import { authOptions } from "@/lib/auth"; // ✅ Import auth config (if using NextAuth)

// export async function POST(req: Request) {
//   try {
//     // ✅ Get session (Check if user is logged in)
//     const session = await getServerSession(authOptions);

//     if (!session || !session.user || !session.user.id) {
//       console.error("❌ Unauthorized access. No session found.");
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const userId = session.user.id; // ✅ Extract user ID from session
   

//     // ✅ Parse request body
//     const { debtorId, amount, paymentMethod } = await req.json();
   

//     // ✅ Validate Inputs
//     if (!debtorId || !amount || amount <= 0) {
//       console.error("❌ Invalid payment data:", { debtorId, userId, amount });
//       return NextResponse.json({ error: "Invalid payment data" }, { status: 400 });
//     }

    

//     // ✅ Fetch Debtor
//     const debtor = await prisma.debtor.findUnique({ where: { id: debtorId } });

    

//     if (!debtor) {
//       console.error("❌ Debtor not found:", debtorId);
//       return NextResponse.json({ error: "Debtor not found" }, { status: 404 });
//     }

   
//     // ✅ Calculate New Balance
//     let newBalance = debtor.amountOwed - amount;
//     let overpayment = 0;

//     if (newBalance < 0) {
//       overpayment = Math.abs(newBalance);
//       newBalance = 0; // ✅ Debtor no longer owes anything
//     }

   

//     // ✅ Insert Payment Record
    

//     const payment = await prisma.payment.create({
//       data: {
//         debtorId,
//         userId,
//         amount,
//         paidAt: new Date(), // ✅ Ensure it's explicitly set
//       },
//     });

    

//     // ✅ Insert Transaction Record
//     console.log("📝 Creating transaction record:", {
//       debtorId,
//       userId,
//       type: "PAYMENT",
//       amount,
//       balanceAfter: newBalance,
//       paymentMethod: paymentMethod ?? "UNKNOWN",
//       overpayment,
//     });

//     const transaction = await prisma.transaction.create({
//       data: {
//         debtorId,
//         userId,
//         type: "PAYMENT",
//         amount,
//         balanceAfter: newBalance,
//         paymentMethod: paymentMethod ?? "UNKNOWN", // Default to UNKNOWN if missing
//         overpayment: overpayment ?? 0, // Default to 0 if missing
//       },
//     });

 

//     // ✅ Update Debtor Balance
    

//     await prisma.debtor.update({
//       where: { id: debtorId },
//       data: {
//         amountOwed: newBalance,
//         balance: debtor.balance + overpayment, // ✅ Update Overpayment Balance
//       },
//     });

//     console.log("✅ Debtor updated successfully");

//     return NextResponse.json({
//       message: "Payment recorded successfully",
//       transaction,
//     });

//   } catch (error) {
//     console.error("❌ Error processing payment:", error);

//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { debtorId, amount, paymentMethod } = await req.json();

    if (!debtorId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid payment data" }, { status: 400 });
    }

    const debtor = await prisma.debtor.findUnique({ where: { id: debtorId } });

    if (!debtor) {
      return NextResponse.json({ error: "Debtor not found" }, { status: 404 });
    }

    // ✅ Updated Payment Logic:
    let totalPayment = amount + debtor.balance;
    let newAmountOwed = debtor.amountOwed;
    let newBalance = 0;
    let overpayment = 0;

    if (debtor.amountOwed > 0) {
      if (totalPayment >= debtor.amountOwed) {
        overpayment = totalPayment - debtor.amountOwed;
        newAmountOwed = 0;
        newBalance = overpayment;
      } else {
        newAmountOwed = debtor.amountOwed - totalPayment;
        newBalance = 0;
      }
    } else {
      newBalance = debtor.balance + amount; // If no debt, entire amount goes to overpayment
    }

    await prisma.payment.create({
      data: {
        debtorId,
        userId,
        amount,
        paidAt: new Date(),
      },
    });

    await prisma.transaction.create({
      data: {
        debtorId,
        userId,
        type: "PAYMENT",
        amount,
        balanceAfter: newAmountOwed,
        paymentMethod: paymentMethod ?? "UNKNOWN",
        overpayment: overpayment ?? 0,
      },
    });

    await prisma.debtor.update({
      where: { id: debtorId },
      data: {
        amountOwed: newAmountOwed,
        balance: newBalance,
      },
    });

    return NextResponse.json({
      message: "Payment recorded successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 500 }
    );
  }
}

