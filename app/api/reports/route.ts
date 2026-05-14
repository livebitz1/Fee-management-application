import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Calculate collectionData (Percentages of Paid, Pending, Overdue)
    const totalStudentsCount = await prisma.student.count();
    const paidCount = await prisma.student.count({ where: { paymentStatus: "paid" } });
    const pendingCount = await prisma.student.count({ where: { paymentStatus: "pending" } });
    const overdueCount = await prisma.student.count({ where: { paymentStatus: "overdue" } });

    const collectionData = [
      { name: "Paid", value: totalStudentsCount > 0 ? Math.round((paidCount / totalStudentsCount) * 100) : 0, fill: "#000" },
      { name: "Pending", value: totalStudentsCount > 0 ? Math.round((pendingCount / totalStudentsCount) * 100) : 0, fill: "#94a3b8" },
      { name: "Overdue", value: totalStudentsCount > 0 ? Math.round((overdueCount / totalStudentsCount) * 100) : 0, fill: "#ef4444" },
    ];

    // 2. Calculate classWiseData (Collected vs Target per course)
    const students = await prisma.student.findMany({
      include: {
        yearlyFees: true,
        payments: {
          where: { status: "completed" }
        }
      }
    });

    const classStats: Record<string, { collected: number; target: number; studentCount: number }> = {};
    students.forEach((student: any) => {
      const courseName = student.course || "General";
      if (!classStats[courseName]) {
        classStats[courseName] = { collected: 0, target: 0, studentCount: 0 };
      }
      classStats[courseName].studentCount += 1;
      
      // Calculate target and collected from YearlyFees for better accuracy
      const totalTarget = student.yearlyFees?.reduce((acc: number, yf: any) => acc + (yf.amount || 0), 0) || student.monthlyFee;
      const totalCollected = student.yearlyFees?.reduce((acc: number, yf: any) => acc + (yf.paidAmount || 0), 0) || 
                            student.payments?.reduce((acc: number, p: any) => acc + (p.amount || 0), 0) || 0;

      classStats[courseName].target += totalTarget;
      classStats[courseName].collected += totalCollected;
    });

    const classWiseData = Object.entries(classStats).map(([courseName, stats]) => ({
      course: courseName,
      collected: stats.collected,
      target: stats.target,
      studentCount: stats.studentCount,
      rate: stats.target > 0 ? Math.round((stats.collected / stats.target) * 100) : 0
    })).sort((a, b) => a.course.localeCompare(b.course));

    // 3. Payment Method Distribution
    const payments = await prisma.payment.findMany({
      where: { status: "completed" }
    });

    const methodStats: Record<string, number> = {};
    payments.forEach((p: any) => {
      const method = p.method || "Other";
      methodStats[method] = (methodStats[method] || 0) + p.amount;
    });

    const methodData = Object.entries(methodStats).map(([name, value]) => ({
      name: name.toUpperCase(),
      value
    }));

    // 4. Monthly Revenue Trend (Last 6 months)
    const revenueData = await prisma.revenueData.findMany({
      orderBy: { createdAt: "desc" },
      take: 6
    });
    const monthlyTrend = revenueData.reverse().map((r: any) => ({
      month: r.month,
      revenue: r.revenue
    }));

    // 5. Detailed Summary Stats
    const totalRevenueAggregate = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "completed" },
    });
    
    const pendingFeesData = await prisma.pendingFee.aggregate({
      _sum: { amount: true },
    });

    const summary = {
      totalCollected: totalRevenueAggregate._sum.amount || 0,
      totalPending: pendingFeesData._sum.amount || 0,
      totalStudents: totalStudentsCount,
      overallCollectionRate: totalRevenueAggregate._sum.amount && pendingFeesData._sum.amount 
        ? Math.round((totalRevenueAggregate._sum.amount / (totalRevenueAggregate._sum.amount + pendingFeesData._sum.amount)) * 100) 
        : 0
    };

    // 6. Performance Summary
    let bestClass = "N/A";
    let maxRate = -1;
    Object.entries(classStats).forEach(([className, stats]) => {
      const rate = stats.target > 0 ? stats.collected / stats.target : 0;
      if (rate > maxRate) {
        maxRate = rate;
        bestClass = className;
      }
    });

    return NextResponse.json({
      collectionData,
      classWiseData,
      methodData,
      monthlyTrend,
      summary,
      performanceSummary: {
        bestPerformingCourse: bestClass,
        onTimeCollectionRate: maxRate > 0 ? (maxRate * 100).toFixed(1) + "%" : "0%",
      }
    });
  } catch (error) {
    console.error("Error generating report data:", error);
    return NextResponse.json(
      { error: "Failed to generate report data" },
      { status: 500 }
    );
  }
}
