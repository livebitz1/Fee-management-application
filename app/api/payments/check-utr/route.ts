import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const utrId = searchParams.get("utrId");

    if (!utrId) {
      return NextResponse.json({ error: "utrId is required" }, { status: 400 });
    }

    const existingPayment = await prisma.payment.findFirst({
      where: { utrId }
    });

    return NextResponse.json({ exists: !!existingPayment });
  } catch (error) {
    console.error("Error checking UTR ID:", error);
    return NextResponse.json(
      { error: "Failed to check UTR ID" },
      { status: 500 }
    );
  }
}
