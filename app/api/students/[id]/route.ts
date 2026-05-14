import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        payments: true,
        receipts: true,
        pendingFees: true,
        yearlyFees: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Extract yearlyFees from body to handle separately
    const { yearlyFees, ...studentData } = body;

    const student = await prisma.$transaction(async (tx) => {
      // 1. Update basic student details
      const updated = await tx.student.update({
        where: { id },
        data: {
          ...studentData,
          monthlyFee: yearlyFees?.reduce((acc: number, yf: any) => acc + (parseFloat(yf.amount) || 0), 0) || studentData.monthlyFee
        },
      });

      // 2. If yearlyFees are provided, update them
      if (yearlyFees) {
        // Simple approach: delete existing and create new
        // Better for dynamic lists where admin might add/remove years
        await tx.yearlyFee.deleteMany({
          where: { studentId: id }
        });

        await tx.yearlyFee.createMany({
          data: yearlyFees.map((yf: any) => ({
            studentId: id,
            yearName: yf.yearName,
            amount: parseFloat(yf.amount) || 0,
            paidAmount: yf.paidAmount || 0,
            status: yf.status || "pending"
          }))
        });
      }

      return updated;
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.student.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}
