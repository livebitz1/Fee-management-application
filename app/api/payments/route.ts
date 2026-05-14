import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: { student: true },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if UTR ID already exists before starting transaction
    // Using findFirst to bypass findUnique linter sync issues
    const existingPayment = await prisma.payment.findFirst({
      where: { utrId: body.utrId }
    });

    if (existingPayment) {
      return NextResponse.json(
        { 
          error: "Duplicate UTR ID", 
          code: "DUPLICATE_UTR",
          details: `A payment with UTR ID '${body.utrId}' already exists. Please check the UTR ID and try again.` 
        },
        { status: 409 }
      );
    }
    
    // Start a transaction to ensure all operations succeed together
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the payment
      const payment = await tx.payment.create({
        data: {
          studentId: body.studentId,
          studentName: body.studentName,
          amount: body.amount,
          method: body.method,
          utrId: body.utrId,
          month: body.month,
          year: body.year,
          date: new Date(body.date),
          status: body.status || "completed",
          notes: body.notes,
        },
      });

      // 2. Update student status if payment is completed
      if (payment.status === "completed") {
        const student = await tx.student.findUnique({ where: { id: body.studentId } });
        const isFullyPaid = student ? body.amount >= student.monthlyFee : true;

        await tx.student.update({
          where: { id: body.studentId },
          data: {
            paymentStatus: isFullyPaid ? "paid" : "pending",
            lastPaymentDate: new Date(),
          },
        });

        // 3. Automatically create a receipt
        const receiptNumber = `RCP-${body.year}-${Math.floor(1000 + Math.random() * 9000)}`;
        await tx.receipt.create({
          data: {
            paymentId: payment.id,
            studentId: body.studentId,
            receiptNumber: receiptNumber,
            studentName: body.studentName,
            amount: body.amount,
            paymentDate: new Date(body.date),
            paymentMethod: body.method,
            month: body.month,
            utrId: body.utrId,
          },
        });

        // 4. Update revenue data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const revenueModel = (tx as any).revenueData;
        if (revenueModel) {
          await revenueModel.upsert({
            where: {
              month_year: {
                month: body.month,
                year: body.year,
              },
            },
            update: {
              revenue: { increment: body.amount },
            },
            create: {
              month: body.month,
              year: body.year,
              revenue: body.amount,
            },
          });
        }

        // 5. Add to recent activities
        await tx.recentActivity.create({
          data: {
            student: body.studentName,
            action: "Fee collected",
            amount: body.amount,
            time: new Date(body.date).toLocaleDateString("en-IN", { 
              day: 'numeric', 
              month: 'short',
              year: 'numeric'
            }),
            status: "completed",
          },
        });
      }

      return payment;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error creating payment:", errorMessage);
    return NextResponse.json(
      { error: "Failed to create payment", details: errorMessage },
      { status: 500 }
    );
  }
}
