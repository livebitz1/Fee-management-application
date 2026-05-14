import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        payments: {
          where: { status: "completed" }
        }
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
        monthlyFee: body.monthlyFee,
        paymentStatus: body.paymentStatus || "pending",
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
