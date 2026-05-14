import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        payments: {
          where: { status: "completed" }
        },
        yearlyFees: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const student = await prisma.student.create({
      data: {
        name: body.name,
        course: body.course,
        academicYear: body.academicYear,
        semester: body.semester,
        admissionNumber: body.admissionNumber,
        studentPhone: body.studentPhone,
        monthlyFee: parseFloat(body.monthlyFee),
        paymentStatus: body.paymentStatus || "pending",
        yearlyFees: {
          create: body.yearlyFees?.map((yf: any) => ({
            yearName: yf.yearName,
            amount: parseFloat(yf.amount),
            paidAmount: 0,
            status: "pending"
          })) || []
        }
      },
    });
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}
