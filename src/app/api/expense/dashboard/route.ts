import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

// ✅ Ensure checkAuth always returns a User object or `null`
async function checkAuth(req: Request) {
  const session = await getServerSession();
  return session?.user || null;
}

// 🟢 GET: Fetch expense dashboard data (ALL expenses)
export async function GET(req: Request) {
  const user = await checkAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of the week (Sunday)

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Start of the month
    const startOfYear = new Date(today.getFullYear(), 0, 1); // Start of the year

    // Convert to ISO string for accurate database queries
    const todayISO = today.toISOString().split("T")[0];
    const startOfWeekISO = startOfWeek.toISOString().split("T")[0];
    const startOfMonthISO = startOfMonth.toISOString().split("T")[0];
    const startOfYearISO = startOfYear.toISOString().split("T")[0];

    // Fetch total expenses (ALL users)
    const [dailyTotal, weeklyTotal, monthlyTotal, yearlyTotal] = await Promise.all([
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: { date: { gte: new Date(todayISO) } },
      }),
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: { date: { gte: new Date(startOfWeekISO) } },
      }),
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: { date: { gte: new Date(startOfMonthISO) } },
      }),
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: { date: { gte: new Date(startOfYearISO) } },
      }),
    ]);

    // Fetch recent expenses (last 10, from ALL users)
    const recentExpenses = await prisma.expense.findMany({
      include: { category: true, vendor: true, user: true },
      orderBy: { date: "desc" },
      take: 10,
    });

    // Fetch expense data for charts (grouped by category)
    const categoryExpenses = await prisma.expense.groupBy({
      by: ["categoryId"],
      _sum: { amount: true },
    }).catch(() => []);

    return NextResponse.json({
      dailyTotal: dailyTotal._sum.amount || 0,
      weeklyTotal: weeklyTotal._sum.amount || 0,
      monthlyTotal: monthlyTotal._sum.amount || 0,
      yearlyTotal: yearlyTotal._sum.amount || 0,
      recentExpenses,
      categoryExpenses,
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
