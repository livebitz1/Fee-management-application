import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("Revenue API: Starting request");
    
    // Check if prisma is initialized
    if (!prisma || typeof prisma.student === 'undefined') {
       // If prisma.student is undefined, the client might not have generated correctly
       console.error("Revenue API: Prisma client models are missing");
       return NextResponse.json({ error: "Database client models not loaded" }, { status: 500 });
    }

    const currentYear = new Date().getFullYear();
    
    // Attempt to fetch revenue data using model if available
    const revenueModel = prisma.revenueData;
    
    if (!revenueModel) {
      console.error("Revenue API: revenueData model not found on prisma instance");
      // Fallback to raw query if model is missing
      const rawData = await prisma.$queryRawUnsafe(`SELECT * FROM "revenue_data" ORDER BY "createdAt" ASC LIMIT 12`);
      return NextResponse.json(rawData);
    }

    console.log("Revenue API: Fetching for year:", currentYear);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let revenueData = await (revenueModel as any).findMany({
      where: { year: currentYear },
      orderBy: { createdAt: "asc" },
    });

    if (revenueData.length === 0) {
      console.log("Revenue API: No data for current year, fetching all available");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      revenueData = await (revenueModel as any).findMany({
        orderBy: { createdAt: "desc" },
        take: 12
      });
      revenueData.reverse();
    }

    return NextResponse.json(revenueData);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Revenue API Error:", errorMessage);
    
    // Final fallback: just return empty array instead of 500 if possible
    // to prevent Dashboard from crashing
    try {
      if (prisma.revenueData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const allData = await (prisma.revenueData as any).findMany({ take: 10 });
        return NextResponse.json(allData);
      }
      return NextResponse.json([], { status: 200 });
    } catch {
      return NextResponse.json(
        { 
          error: "Failed to fetch revenue data", 
          details: errorMessage
        },
        { status: 500 }
      );
    }
  }
}
