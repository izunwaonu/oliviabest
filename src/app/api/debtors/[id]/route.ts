import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// ✅ Fetch a single debtor by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ✅ Fix: Ensure params is a Promise
) {
  try {
    const { id } = await params; // ✅ Fix: Await params before using it

    const debtor = await prisma.debtor.findUnique({ where: { id } });

    if (!debtor) {
      return NextResponse.json({ message: "Debtor not found" }, { status: 404 });
    }

    return NextResponse.json(debtor, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch debtor", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { name, phoneNumber, amountOwed, dueDate } = await req.json();

    const existingDebtor = await prisma.debtor.findUnique({ where: { id } });
    if (!existingDebtor) {
      return NextResponse.json({ message: "Debtor not found" }, { status: 404 });
    }

    let amountAdded = 0;
    let newAmountOwed = existingDebtor.amountOwed;
    let newBalance = existingDebtor.balance;
    let overpaymentUsed = 0;

    if (amountOwed !== undefined && !Number.isNaN(amountOwed)) {
      amountAdded = parseFloat(amountOwed);

      if (newBalance >= amountAdded) {
        // ✅ Overpayment fully covers new debt
        overpaymentUsed = amountAdded;
        newBalance -= amountAdded;
        amountAdded = 0;
      } else {
        // ✅ Overpayment partially covers new debt
        overpaymentUsed = newBalance;
        amountAdded -= newBalance;
        newBalance = 0;
        newAmountOwed += amountAdded; // Remaining debt after applying overpayment
      }
    }

    const updatedDebtor = await prisma.$transaction(async (tx) => {
      const debtorUpdate = await tx.debtor.update({
        where: { id },
        data: {
          name: name || existingDebtor.name,
          phoneNumber: phoneNumber || existingDebtor.phoneNumber,
          amountOwed: newAmountOwed,
          balance: newBalance,
          dueDate: dueDate || existingDebtor.dueDate,
        },
      });

      if (amountOwed !== undefined && amountOwed > 0) {
        await tx.transaction.create({
          data: {
            debtorId: id,
            userId: session.user.id,
            type: "DEBT",
            amount: amountAdded + overpaymentUsed,
            balanceAfter: newAmountOwed,
            note:
              overpaymentUsed > 0
                ? `Debt increased by ₦${amountAdded} after applying ₦${overpaymentUsed} overpayment.`
                : "Debt Increased",
          },
        });
      }

      return debtorUpdate;
    });

    return NextResponse.json(updatedDebtor, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/debtors/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to update debtor", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const { id } = await params;
//     const { name, phoneNumber, amountOwed, dueDate } = await req.json();

//     const existingDebtor = await prisma.debtor.findUnique({ where: { id } });
//     if (!existingDebtor) {
//       return NextResponse.json({ message: "Debtor not found" }, { status: 404 });
//     }

//     let amountAdded = 0;
//     let newAmountOwed = existingDebtor.amountOwed;
//     let newBalance = existingDebtor.balance;
//     let overpaymentUsed = 0;

//     if (amountOwed !== undefined && !Number.isNaN(amountOwed)) {
//       amountAdded = parseFloat(amountOwed);

//       if (newBalance >= amountAdded) {
//         // ✅ Overpayment fully covers new debt
//         newBalance -= amountAdded;
//         amountAdded = 0;
//       } else {
//         // ✅ Overpayment partially covers new debt
//         amountAdded -= newBalance;
//         overpaymentUsed = newBalance;
//         newBalance = 0;
//         newAmountOwed += amountAdded;
//       }
//     }

//     const updatedDebtor = await prisma.$transaction(async (tx) => {
//       const debtorUpdate = await tx.debtor.update({
//         where: { id },
//         data: {
//           name: name || existingDebtor.name,
//           phoneNumber: phoneNumber || existingDebtor.phoneNumber,
//           amountOwed: newAmountOwed,
//           balance: newBalance,
//           dueDate: dueDate || existingDebtor.dueDate,
//         },
//       });

//       if (amountOwed !== undefined && amountOwed > 0) {
//         await tx.transaction.create({
//           data: {
//             debtorId: id,
//             userId: session.user.id,
//             type: "DEBT",
//             amount: amountAdded,
//             balanceAfter: newAmountOwed,
//             note:
//               overpaymentUsed > 0
//                 ? `Debt increased with ₦${overpaymentUsed} overpayment applied.`
//                 : "Debt Increased",
//           },
//         });
//       }

//       return debtorUpdate;
//     });

//     return NextResponse.json(updatedDebtor, { status: 200 });
//   } catch (error) {
//     console.error("PATCH /api/debtors/[id] error:", error);
//     return NextResponse.json(
//       { message: "Failed to update debtor", error: error instanceof Error ? error.message : "Unknown error" },
//       { status: 500 }
//     );
//   }
// }

// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }  // ✅ Keeping as Promise<{ id: string }>
// ) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const { id } = await params; // ✅ Await params

//     const { name, phoneNumber, amountOwed, dueDate } = await req.json();

//     // Ensure debtor exists
//     const existingDebtor = await prisma.debtor.findUnique({ where: { id } });
//     if (!existingDebtor) {
//       return NextResponse.json({ message: "Debtor not found" }, { status: 404 });
//     }

//     let newAmountOwed = existingDebtor.amountOwed;
//     let amountAdded = 0;

//     if (amountOwed !== undefined && !Number.isNaN(amountOwed)) {
//       amountAdded = parseFloat(amountOwed);
//       newAmountOwed += amountAdded;
//     }

//     // ✅ Use transaction to update debtor & record transaction
//     const updatedDebtor = await prisma.$transaction(async (tx) => {
//       const debtorUpdate = await tx.debtor.update({
//         where: { id },
//         data: {
//           name: name || existingDebtor.name,
//           phoneNumber: phoneNumber || existingDebtor.phoneNumber,
//           amountOwed: newAmountOwed,
//           dueDate: dueDate || existingDebtor.dueDate,
//         },
//       });

//       if (amountAdded > 0) {
//         await tx.transaction.create({
//           data: {
//             debtorId: id,
//             userId: session.user.id,
//             type: "DEBT", // ✅ Marks this as a debt increase
//             amount: amountAdded,
//             balanceAfter: newAmountOwed,
//             note: "Debt Increased", // ✅ Keeps track of why it changed
//           },
//         });
//       }

//       return debtorUpdate;
//     });

//     return NextResponse.json(updatedDebtor, { status: 200 });
//   } catch (error) {
//     console.error("PATCH /api/debtors/[id] error:", error);
//     return NextResponse.json(
//       { message: "Failed to update debtor", error: error instanceof Error ? error.message : "Unknown error" },
//       { status: 500 }
//     );
//   }
// }




// ✅ Delete a debtor

// export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
//   console.log("🔵 PATCH request received for debtor:", params.id);

//   try {
//     // ✅ Authenticate user
//     const session = await getServerSession(authOptions);
//     if (!session?.user) {
//       console.log("🔴 Unauthorized request");
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const { id } = params;
//     console.log("🟢 Debtor ID:", id);

//     const { name, phoneNumber, amountOwed, dueDate } = await req.json();
//     console.log("🟡 Received data:", { name, phoneNumber, amountOwed, dueDate });

//     // ✅ Fetch existing debtor
//     const existingDebtor = await prisma.debtor.findUnique({ where: { id } });
//     if (!existingDebtor) {
//       console.log("🔴 Debtor not found");
//       return NextResponse.json({ message: "Debtor not found" }, { status: 404 });
//     }
//     console.log("🟢 Existing debtor data:", existingDebtor);

//     let newAmountOwed = existingDebtor.amountOwed ?? 0; // ✅ Ensure amountOwed is not null
//     let newBalance = existingDebtor.balance ?? 0; // ✅ Ensure balance is not null
//     let amountAdded = 0;

//     if (amountOwed !== undefined && !Number.isNaN(amountOwed)) {
//       amountAdded = parseFloat(amountOwed);
//       console.log("🟡 Amount to be added:", amountAdded);

//       if (newBalance >= amountAdded) {
//         // ✅ Deduct from balance if possible
//         console.log("🟢 Deducting from balance...");
//         newBalance -= amountAdded;
//       } else {
//         // ✅ Use balance first, then increase `amountOwed`
//         console.log("🟡 Insufficient balance, using partial balance...");
//         const remainingDebt = amountAdded - newBalance;
//         newBalance = 0;
//         newAmountOwed += remainingDebt;
//       }
//     }

//     console.log("🟢 Final calculations -> New Balance:", newBalance, " | New Amount Owed:", newAmountOwed);

//     // ✅ Use transaction to update debtor & record transaction
//     const updatedDebtor = await prisma.$transaction(async (tx) => {
//       console.log("🟢 Starting database transaction...");
      
//       const debtorUpdate = await tx.debtor.update({
//         where: { id },
//         data: {
//           name: name || existingDebtor.name,
//           phoneNumber: phoneNumber || existingDebtor.phoneNumber,
//           amountOwed: newAmountOwed,
//           balance: newBalance, // ✅ Updating balance
//           dueDate: dueDate || existingDebtor.dueDate,
//         },
//       });

//       console.log("🟢 Debtor updated successfully:", debtorUpdate);

//       if (amountAdded > 0) {
//         console.log("🟢 Logging transaction...");

//         try {
//           await tx.transaction.create({
//             data: {
//               debtorId: id,
//               userId: session.user.id,
//               type: "DEBT",
//               amount: amountAdded,
//               balanceAfter: newAmountOwed,
//               note: "Debt Increased",
//             },
//           });
//           console.log("✅ Transaction recorded successfully.");
//         } catch (error) {
//           console.error("🔴 Transaction logging failed:", error);
//           throw new Error("Transaction creation failed"); // ✅ Ensures rollback doesn't mess things up
//         }
//       }

//       return debtorUpdate;
//     });

//     console.log("✅ Successfully updated debtor:", updatedDebtor);
//     return NextResponse.json(updatedDebtor, { status: 200 });

//   } catch (error) {
//     console.error("🔴 PATCH Error:", error);
//     return NextResponse.json(
//       { message: "Failed to update debtor", error: error instanceof Error ? error.message : "Unknown error" },
//       { status: 500 }
//     );
//   }
// }


// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> } // ✅ Fix: Ensure params is a Promise
// ) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const { id } = await params; // ✅ Fix: Await params

//     // Check if debtor exists before deleting
//     const existingDebtor = await prisma.debtor.findUnique({ where: { id } });
//     if (!existingDebtor) {
//       return NextResponse.json({ message: "Debtor not found" }, { status: 404 });
//     }

//     await prisma.debtor.delete({ where: { id } });

//     return NextResponse.json({ message: "Debtor deleted successfully" }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Failed to delete debtor", error: error instanceof Error ? error.message : "Unknown error" },
//       { status: 500 }
//     );
//   }
// }
