import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const receipts = await prisma.receipt.findMany({
      include: { payment: true, student: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(receipts);
  } catch (error) {
    console.error("Error fetching receipts:", error);
    return NextResponse.json(
      { error: "Failed to fetch receipts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const receipt = await prisma.receipt.create({
      data: {
        paymentId: body.paymentId,
        studentId: body.studentId,
        receiptNumber: body.receiptNumber,
        studentName: body.studentName,
        amount: body.amount,
        paymentDate: new Date(body.paymentDate),
        paymentMethod: body.paymentMethod,
        month: body.month,
        utrId: body.utrId,
      },
      include: { payment: true, student: true },
    });
    return NextResponse.json(receipt, { status: 201 });
  } catch (error) {
    console.error("Error creating receipt:", error);
    return NextResponse.json(
      { error: "Failed to create receipt" },
      { status: 500 }
    );
  }
}
