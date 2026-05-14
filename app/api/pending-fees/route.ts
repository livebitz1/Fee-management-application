import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pendingFees = await prisma.pendingFee.findMany({
      include: { student: true },
      orderBy: { daysOverdue: "desc" },
    });

    return NextResponse.json(pendingFees);
  } catch (error: any) {
    const errorMessage = error.message || String(error);
    const errorStack = error.stack;
    
    console.error("--- PENDING FEES API ERROR ---");
    console.error("Message:", errorMessage);
    console.error("Stack:", errorStack);
    
    return NextResponse.json(
      { 
        error: "Database Query Failed", 
        message: errorMessage,
        suggestion: "Please ensure 'npx prisma db push' has been run and the database is reachable."
      },
      { status: 500 }
    );
  }
}
