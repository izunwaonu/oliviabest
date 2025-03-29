import { NextResponse } from "next/server";
import {prisma }from "@/lib/prisma"; // Ensure Prisma is correctly configured

export async function GET() {
  try {
    // ✅ Get Total Debtors
    const totalDebtors = await prisma.debtor.count();

    // ✅ Get Overdue Debtors (Debtors whose due date has passed)
    const overdueDebtors = await prisma.debtor.findMany({
      where: {
        dueDate: { lt: new Date() },
      },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        dueDate: true,
        createdAt: true,
      },
    });

    // ✅ Get Total Payments (Sum of all payments made)
    const totalPaymentsResult = await prisma.payment.aggregate({
      _sum: { amount: true },
    });
    const totalPayments = totalPaymentsResult._sum.amount || 0;

    // ✅ Get Monthly Payments for Chart (Grouped by month)
    const monthlyPaymentsRaw = await prisma.payment.findMany({
      select: {
        amount: true,
        paidAt: true,
      },
    });

    // ✅ Format Monthly Payments for Chart.js
    const monthlyPayments: Record<string, number> = {};
    monthlyPaymentsRaw.forEach((payment) => {
      const month = new Date(payment.paidAt).toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyPayments[month]) {
        monthlyPayments[month] = 0;
      }
      monthlyPayments[month] += payment.amount;
    });

    // ✅ Get Last 5 Payments
    const recentPayments = await prisma.payment.findMany({
      take: 5,
      orderBy: { paidAt: "desc" },
      select: {
        id: true,
        amount: true,
        paidAt: true,
        debtor: { select: { name: true, phoneNumber: true, invoiceNo: true } },
        user: { select: { name: true } },
      },
    });

    return NextResponse.json({
      totalDebtors,
      overdueDebtors,
      totalPayments,
      monthlyPayments,
      recentPayments,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
