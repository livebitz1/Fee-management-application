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
  } catch (error) {
    console.error("Error fetching pending fees:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending fees" },
      { status: 500 }
    );
  }
}
