import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Total Students - with fallback
    let totalStudents = 0;
    try {
      totalStudents = await prisma.student.count();
    } catch (e) {
      console.error("Stats API: Error counting students:", e);
    }

    // 2. Total Revenue (sum of completed payments)
    let totalRevenue = 0;
    try {
      const totalRevenueAggregate = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "completed" },
      });
      totalRevenue = totalRevenueAggregate._sum.amount || 0;
    } catch (e) {
      console.error("Stats API: Error aggregating revenue:", e);
    }

    // 3. Pending Fees (sum of amount from PendingFee model)
    let pendingFees = 0;
    try {
      const pendingFeesData = await prisma.pendingFee.aggregate({
        _sum: { amount: true },
      });
      pendingFees = pendingFeesData._sum.amount || 0;
    } catch (e) {
      console.error("Stats API: Error aggregating pending fees:", e);
    }

    // 4. Overdue Payments Count
    let overduePayments = 0;
    try {
      overduePayments = await prisma.student.count({
        where: { paymentStatus: "overdue" },
      });
    } catch (e) {
      console.error("Stats API: Error counting overdue payments:", e);
    }

    // 5. Collection Rate
    const totalExpected = totalRevenue + pendingFees;
    const collectionRate = totalExpected > 0 
      ? Math.round((totalRevenue / totalExpected) * 100) 
      : 0;

    const stats = {
      totalStudents,
      totalRevenue,
      pendingFees,
      overduePayments,
      collectionRate,
    };

    return NextResponse.json(stats);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Stats API: CRITICAL ERROR:", errorMessage);
    return NextResponse.json(
      { 
        error: "Failed to fetch dashboard stats",
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
